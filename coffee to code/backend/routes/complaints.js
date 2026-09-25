const express = require('express');
const router = express.Router();
const { protect, requireRole } = require('../middleware/auth');
const NotificationEngine = require('../services/NotificationEngine');
const Complaint = require('../models/Complaint');

const DEPT_MAP = {
  maintenance: 'Facilities Department',
  academic: 'Academic Affairs',
  hostel: 'Hostel Office',
  safety: 'Safety & Security',
  it: 'IT Department',
  other: 'Administration',
};

let demoComplaints = [
  { _id: 'c1', category: 'maintenance', title: 'Broken AC in Lab 3A', description: 'The air conditioning unit in Lab 3A has been malfunctioning for 3 days.', status: 'in-progress', priority: 'high', submitted_by: { name: 'Alice Johnson' }, assigned_dept: 'Facilities Department', block: 'A', createdAt: new Date(Date.now() - 172800000) },
  { _id: 'c2', category: 'it', title: 'Wi-Fi not working in Block B', description: 'Students in Block B are unable to connect to the campus Wi-Fi.', status: 'open', priority: 'medium', submitted_by: { name: 'Student Group' }, assigned_dept: 'IT Department', block: 'B', createdAt: new Date(Date.now() - 86400000) },
];

// GET all complaints
router.get('/', protect, async (req, res) => {
  try {
    const { status, category } = req.query;
    let complaints;
    try {
      const filter = {};
      if (req.user.role === 'student') filter.submitted_by = req.user._id;
      if (status) filter.status = status;
      if (category) filter.category = category;
      complaints = await Complaint.find(filter).populate('submitted_by', 'name').sort({ createdAt: -1 });
    } catch {
      complaints = demoComplaints;
    }
    res.json({ complaints });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching complaints' });
  }
});

// POST submit complaint
router.post('/', protect, async (req, res) => {
  try {
    const { category, title, description, priority, location, block } = req.body;
    const io = req.app.get('io');
    const assigned_dept = DEPT_MAP[category] || 'Administration';

    let complaint;
    try {
      complaint = await Complaint.create({
        category, title, description, priority: priority || 'medium',
        submitted_by: req.user._id || req.user.id,
        assigned_dept, location: location || '', block: block || req.user.block || '',
        status: 'open'
      });
    } catch {
      complaint = {
        _id: `c_${Date.now()}`, category, title, description, priority: priority || 'medium',
        submitted_by: { _id: req.user._id || req.user.id, name: req.user.name },
        assigned_dept, location: location || '', block: block || req.user.block || '',
        status: 'open', createdAt: new Date()
      };
      demoComplaints.unshift(complaint);
    }

    // Notify admin via engine
    await NotificationEngine.publish(io, {
      source_module: 'complaints',
      type: 'info',
      title: `📋 New ${category} Complaint`,
      message: `"${title}" submitted by ${req.user.name} → routed to ${assigned_dept}`,
      target_role: 'admin',
      data: { complaint_id: complaint._id, category, assigned_dept },
    });

    res.status(201).json({ complaint, message: `Complaint routed to ${assigned_dept}` });
  } catch (err) {
    console.error('Complaint error:', err);
    res.status(500).json({ message: 'Error submitting complaint' });
  }
});

// PUT update complaint status (admin/faculty)
router.put('/:id/status', protect, requireRole('admin', 'faculty'), async (req, res) => {
  try {
    const { status, comment } = req.body;
    const io = req.app.get('io');

    let complaint;
    try {
      const update = { status };
      if (status === 'resolved') update.resolved_at = new Date();
      complaint = await Complaint.findByIdAndUpdate(req.params.id, update, { new: true }).populate('submitted_by');
    } catch {
      complaint = demoComplaints.find(c => c._id === req.params.id);
      if (complaint) { complaint.status = status; if (status === 'resolved') complaint.resolved_at = new Date(); }
    }

    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });

    // Notify the submitter of status change
    const submitterId = complaint.submitted_by?._id || complaint.submitted_by;
    await NotificationEngine.publish(io, {
      source_module: 'complaints',
      type: status === 'resolved' ? 'success' : 'info',
      title: `📋 Complaint ${status.charAt(0).toUpperCase() + status.slice(1)}`,
      message: `Your complaint "${complaint.title}" is now ${status}. ${comment || ''}`,
      target_user: submitterId,
      data: { complaint_id: req.params.id, status },
    });

    res.json({ complaint });
  } catch (err) {
    res.status(500).json({ message: 'Error updating complaint' });
  }
});

module.exports = router;
