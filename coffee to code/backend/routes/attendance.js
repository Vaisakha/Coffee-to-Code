const express = require('express');
const router = express.Router();
const { protect, requireRole } = require('../middleware/auth');
const NotificationEngine = require('../services/NotificationEngine');
const Attendance = require('../models/Attendance');
const crypto = require('crypto');

let demoSessions = [];
let sessionCounter = 1;

// GET all sessions (faculty sees own, students see their records)
router.get('/', protect, async (req, res) => {
  try {
    let sessions;
    try {
      if (req.user.role === 'faculty') {
        sessions = await Attendance.find({ faculty_id: req.user._id }).populate('room_id', 'name block').sort({ date: -1 });
      } else {
        sessions = await Attendance.find({ 'records.student_id': req.user._id }).populate('room_id', 'name block').sort({ date: -1 });
      }
    } catch {
      sessions = demoSessions;
    }
    res.json({ sessions });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching attendance' });
  }
});

// POST create attendance session (faculty only)
router.post('/session', protect, requireRole('faculty', 'admin'), async (req, res) => {
  try {
    const { class_id, class_name, room_id, date, time_start, time_end, studentIds } = req.body;
    const io = req.app.get('io');

    // Generate QR code token
    const qr_code = crypto.randomBytes(16).toString('hex');
    const qr_expires_at = new Date(Date.now() + 15 * 60 * 1000); // 15 min

    const records = (studentIds || []).map(sid => ({
      student_id: sid, status: 'absent', checked_in_at: null, method: 'qr'
    }));

    let session;
    try {
      session = await Attendance.create({
        class_id, class_name, room_id, faculty_id: req.user._id || req.user.id,
        date: new Date(date), time_start: new Date(time_start), time_end: new Date(time_end),
        qr_code, qr_expires_at, records
      });
    } catch {
      session = {
        _id: `sess_${sessionCounter++}`, class_id, class_name, room_id,
        faculty_id: req.user._id || req.user.id,
        date: new Date(date), time_start: new Date(time_start), time_end: new Date(time_end),
        qr_code, qr_expires_at, records, threshold_percentage: 75,
        notified_low_attendance: false, createdAt: new Date()
      };
      demoSessions.push(session);
    }

    // Notify students that attendance is open
    await NotificationEngine.publish(io, {
      source_module: 'attendance',
      type: 'info',
      title: '📋 Attendance Open',
      message: `Attendance for ${class_name} is now open. Scan QR to mark present.`,
      target_role: 'student',
      data: { session_id: session._id, class_name, qr_code },
    });

    // Broadcast session start
    if (io) io.emit('attendance_session_started', { session });

    res.status(201).json({ session, qr_code, qr_expires_at });
  } catch (err) {
    console.error('Attendance session error:', err);
    res.status(500).json({ message: 'Error creating session' });
  }
});

// POST check-in via QR
router.post('/checkin', protect, async (req, res) => {
  try {
    const { qr_code } = req.body;
    const io = req.app.get('io');
    const studentId = req.user._id || req.user.id;

    let session;
    try {
      session = await Attendance.findOne({ qr_code, qr_expires_at: { $gt: new Date() } });
    } catch {
      session = demoSessions.find(s => s.qr_code === qr_code && new Date(s.qr_expires_at) > new Date());
    }

    if (!session) return res.status(400).json({ message: 'Invalid or expired QR code' });

    // Update record
    let record = (session.records || []).find(r => String(r.student_id) === String(studentId));
    if (record) {
      record.status = 'present';
      record.checked_in_at = new Date();
      record.method = 'qr';
    } else {
      session.records = session.records || [];
      session.records.push({ student_id: studentId, status: 'present', checked_in_at: new Date(), method: 'qr' });
    }

    try {
      await session.save();
    } catch {
      // demo mode — already updated in-memory
    }

    // Calculate attendance percentage
    const total = session.records.length;
    const present = session.records.filter(r => r.status === 'present').length;
    const percentage = total > 0 ? (present / total) * 100 : 0;

    // Real-time broadcast to faculty
    if (io) {
      io.emit('attendance_update', { session_id: session._id, studentId, status: 'present', percentage });
    }

    // Low attendance warning
    if (percentage < (session.threshold_percentage || 75) && !session.notified_low_attendance && total >= 5) {
      session.notified_low_attendance = true;
      await NotificationEngine.publish(io, {
        source_module: 'attendance',
        type: 'warning',
        title: '⚠️ Low Attendance Alert',
        message: `${session.class_name} has only ${percentage.toFixed(0)}% attendance (${present}/${total} students)`,
        target_role: 'faculty',
        data: { session_id: session._id, percentage, present, total },
      });
    }

    res.json({ message: 'Checked in successfully', percentage, present, total });
  } catch (err) {
    console.error('Check-in error:', err);
    res.status(500).json({ message: 'Error during check-in' });
  }
});

// GET session details
router.get('/session/:id', protect, async (req, res) => {
  try {
    let session;
    try {
      session = await Attendance.findById(req.params.id).populate('records.student_id', 'name rollNumber');
    } catch {
      session = demoSessions.find(s => s._id === req.params.id);
    }
    if (!session) return res.status(404).json({ message: 'Session not found' });
    res.json({ session });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching session' });
  }
});

module.exports = router;
