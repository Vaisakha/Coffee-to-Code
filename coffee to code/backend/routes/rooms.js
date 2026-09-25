const express = require('express');
const router = express.Router();
const { protect, requireRole } = require('../middleware/auth');
const NotificationEngine = require('../services/NotificationEngine');
const Room = require('../models/Room');
const Booking = require('../models/Booking');

// In-memory fallback for demo
let demoRooms = [
  { _id: 'r1', name: 'Lab 3A', block: 'A', floor: 3, capacity: 40, current_status: 'available', type: 'lab', amenities: ['Projector', 'AC', 'Computers'], currentOccupancy: 0, coordinates: { x: 120, y: 200 } },
  { _id: 'r2', name: 'Classroom B2', block: 'B', floor: 2, capacity: 60, current_status: 'available', type: 'classroom', amenities: ['Projector', 'AC'], currentOccupancy: 0, coordinates: { x: 300, y: 150 } },
  { _id: 'r3', name: 'Conference Hall', block: 'C', floor: 1, capacity: 30, current_status: 'available', type: 'conference', amenities: ['Video Conf', 'AC', 'Whiteboard'], currentOccupancy: 0, coordinates: { x: 500, y: 300 } },
  { _id: 'r4', name: 'Auditorium', block: 'D', floor: 0, capacity: 300, current_status: 'available', type: 'auditorium', amenities: ['Stage', 'Sound System', 'AC'], currentOccupancy: 0, coordinates: { x: 250, y: 400 } },
  { _id: 'r5', name: 'CS Lab 1', block: 'A', floor: 1, capacity: 50, current_status: 'booked', type: 'lab', amenities: ['Computers', 'AC'], currentOccupancy: 0, coordinates: { x: 100, y: 100 } },
  { _id: 'r6', name: 'Seminar Hall B', block: 'B', floor: 1, capacity: 80, current_status: 'available', type: 'conference', amenities: ['Projector', 'AC', 'Mic'], currentOccupancy: 0, coordinates: { x: 350, y: 200 } },
];
let demoBookings = [];

// GET all rooms
router.get('/', protect, async (req, res) => {
  try {
    const { block, status, type } = req.query;
    let rooms;
    try {
      const filter = {};
      if (block) filter.block = block;
      if (status) filter.current_status = status;
      if (type) filter.type = type;
      rooms = await Room.find(filter);
    } catch {
      rooms = demoRooms.filter(r => {
        if (block && r.block !== block) return false;
        if (status && r.current_status !== status) return false;
        if (type && r.type !== type) return false;
        return true;
      });
    }
    res.json({ rooms });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching rooms' });
  }
});

// GET single room
router.get('/:id', protect, async (req, res) => {
  try {
    let room;
    try {
      room = await Room.findById(req.params.id);
    } catch {
      room = demoRooms.find(r => r._id === req.params.id);
    }
    if (!room) return res.status(404).json({ message: 'Room not found' });
    res.json({ room });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching room' });
  }
});

// POST book a room — conflict prevention + notification chain
router.post('/book', protect, async (req, res) => {
  try {
    const { room_id, title, time_start, time_end, notes } = req.body;
    const io = req.app.get('io');

    const startDate = new Date(time_start);
    const endDate = new Date(time_end);

    // Conflict check
    let hasConflict = false;
    try {
      const conflict = await Booking.findOne({
        room_id,
        status: 'confirmed',
        $or: [
          { time_start: { $lt: endDate }, time_end: { $gt: startDate } }
        ]
      });
      hasConflict = !!conflict;
    } catch {
      hasConflict = demoBookings.some(b =>
        b.room_id === room_id && b.status === 'confirmed' &&
        new Date(b.time_start) < endDate && new Date(b.time_end) > startDate
      );
    }

    if (hasConflict) {
      return res.status(409).json({ message: 'Room is already booked for this time slot' });
    }

    // Create booking
    let booking;
    try {
      booking = await Booking.create({
        room_id, user_id: req.user._id || req.user.id,
        title, time_start: startDate, time_end: endDate, notes, status: 'confirmed'
      });
    } catch {
      booking = {
        _id: `b_${Date.now()}`, room_id, user_id: req.user._id || req.user.id,
        title, time_start: startDate, time_end: endDate, notes, status: 'confirmed', createdAt: new Date()
      };
      demoBookings.push(booking);
    }

    // Update room status
    let roomName = room_id;
    try {
      const updated = await Room.findByIdAndUpdate(room_id, { current_status: 'booked' }, { new: true });
      if (updated) roomName = updated.name;
    } catch {
      const r = demoRooms.find(r => r._id === room_id);
      if (r) { r.current_status = 'booked'; roomName = r.name; }
    }

    // Broadcast live room status update via socket
    if (io) {
      io.emit('room_status_update', { room_id, status: 'booked', booking });
    }

    // Fire notification via Central Engine
    await NotificationEngine.publish(io, {
      source_module: 'rooms',
      type: 'booking',
      title: '🏫 Room Booked',
      message: `${roomName} has been booked by ${req.user.name} for "${title}"`,
      target_role: 'all',
      data: { room_id, booking_id: booking._id, roomName },
    });

    res.status(201).json({ booking, message: 'Room booked successfully' });
  } catch (err) {
    console.error('Booking error:', err);
    res.status(500).json({ message: 'Error creating booking' });
  }
});

// GET bookings for a room
router.get('/:id/bookings', protect, async (req, res) => {
  try {
    let bookings;
    try {
      bookings = await Booking.find({ room_id: req.params.id }).populate('user_id', 'name email role');
    } catch {
      bookings = demoBookings.filter(b => b.room_id === req.params.id);
    }
    res.json({ bookings });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching bookings' });
  }
});

// PUT update room status (admin/faculty)
router.put('/:id/status', protect, requireRole('admin', 'faculty'), async (req, res) => {
  try {
    const { status, currentOccupancy } = req.body;
    const io = req.app.get('io');
    let room;
    try {
      room = await Room.findByIdAndUpdate(req.params.id, { current_status: status, currentOccupancy }, { new: true });
    } catch {
      room = demoRooms.find(r => r._id === req.params.id);
      if (room) { room.current_status = status; if (currentOccupancy !== undefined) room.currentOccupancy = currentOccupancy; }
    }
    if (!room) return res.status(404).json({ message: 'Room not found' });

    // Live update broadcast
    if (io) io.emit('room_status_update', { room_id: req.params.id, status, currentOccupancy });

    res.json({ room });
  } catch (err) {
    res.status(500).json({ message: 'Error updating room status' });
  }
});

// GET all bookings
router.get('/bookings/all', protect, async (req, res) => {
  try {
    let bookings;
    try {
      bookings = await Booking.find().populate('room_id', 'name block').populate('user_id', 'name email');
    } catch {
      bookings = demoBookings;
    }
    res.json({ bookings });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching bookings' });
  }
});

// DELETE cancel booking
router.delete('/bookings/:id', protect, async (req, res) => {
  try {
    const io = req.app.get('io');
    let booking;
    try {
      booking = await Booking.findByIdAndUpdate(req.params.id, { status: 'cancelled' }, { new: true });
      if (booking) {
        await Room.findByIdAndUpdate(booking.room_id, { current_status: 'available' });
        if (io) io.emit('room_status_update', { room_id: booking.room_id, status: 'available' });
      }
    } catch {
      booking = demoBookings.find(b => b._id === req.params.id);
      if (booking) {
        booking.status = 'cancelled';
        const r = demoRooms.find(r => r._id === booking.room_id);
        if (r) r.current_status = 'available';
        if (io) io.emit('room_status_update', { room_id: booking.room_id, status: 'available' });
      }
    }
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.json({ message: 'Booking cancelled' });
  } catch (err) {
    res.status(500).json({ message: 'Error cancelling booking' });
  }
});

module.exports = router;
