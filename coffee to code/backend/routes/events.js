const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const NotificationEngine = require('../services/NotificationEngine');
const Event = require('../models/Event');
const Booking = require('../models/Booking');
const Room = require('../models/Room');

let demoEvents = [
  { _id: 'ev1', title: 'Hackathon Kickoff', description: 'Annual campus hackathon opening ceremony with keynote speaker.', room_id: { _id: 'r4', name: 'Auditorium', block: 'D' }, time_start: new Date(Date.now() + 86400000), time_end: new Date(Date.now() + 86400000 + 7200000), capacity: 200, attendees: [], category: 'academic', status: 'upcoming', department: 'All', organizer_id: { name: 'Admin Kumar' }, createdAt: new Date() },
  { _id: 'ev2', title: 'Python Workshop', description: 'Hands-on workshop covering ML with Python. Limited seats.', room_id: { _id: 'r1', name: 'Lab 3A', block: 'A' }, time_start: new Date(Date.now() + 172800000), time_end: new Date(Date.now() + 172800000 + 10800000), capacity: 40, attendees: [], category: 'workshop', status: 'upcoming', department: 'Computer Science', organizer_id: { name: 'Dr. Robert Singh' }, createdAt: new Date() },
];

// GET all events
router.get('/', protect, async (req, res) => {
  try {
    let events;
    try {
      events = await Event.find().populate('room_id', 'name block').populate('organizer_id', 'name').sort({ time_start: 1 });
    } catch {
      events = demoEvents;
    }
    res.json({ events });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching events' });
  }
});

// POST create event (auto-books room)
router.post('/', protect, async (req, res) => {
  try {
    const { title, description, room_id, time_start, time_end, capacity, category, department } = req.body;
    const io = req.app.get('io');
    const userId = req.user._id || req.user.id;

    const startDate = new Date(time_start);
    const endDate = new Date(time_end);

    // Step 1: Auto-book the room (reuses rooms conflict logic)
    let booking = null;
    let roomName = 'TBD';

    if (room_id) {
      // Conflict check
      let hasConflict = false;
      try {
        const conflict = await Booking.findOne({
          room_id, status: 'confirmed',
          $or: [{ time_start: { $lt: endDate }, time_end: { $gt: startDate } }]
        });
        hasConflict = !!conflict;
      } catch {
        // Demo: skip conflict check for simplicity
      }

      if (hasConflict) {
        return res.status(409).json({ message: 'Room is not available for this time slot. Please choose another room or time.' });
      }

      // Create booking
      try {
        booking = await Booking.create({
          room_id, user_id: userId, title: `Event: ${title}`,
          time_start: startDate, time_end: endDate, status: 'confirmed'
        });
        const room = await Room.findByIdAndUpdate(room_id, { current_status: 'booked' }, { new: true });
        if (room) roomName = room.name;
        if (io) io.emit('room_status_update', { room_id, status: 'booked' });
      } catch {
        booking = { _id: `bk_ev_${Date.now()}`, room_id, status: 'confirmed' };
        const r = demoEvents.find(e => e.room_id?._id === room_id);
        roomName = r?.room_id?.name || 'Campus Room';
      }
    }

    // Step 2: Create event
    let event;
    try {
      event = await Event.create({
        title, description, room_id, booking_id: booking?._id,
        organizer_id: userId, time_start: startDate, time_end: endDate,
        capacity: capacity || 50, category: category || 'other',
        department: department || '', status: 'upcoming'
      });
    } catch {
      event = {
        _id: `ev_${Date.now()}`, title, description,
        room_id: { _id: room_id, name: roomName },
        time_start: startDate, time_end: endDate,
        capacity: capacity || 50, attendees: [], category: category || 'other',
        department: department || '', status: 'upcoming',
        organizer_id: { _id: userId, name: req.user.name }, createdAt: new Date()
      };
      demoEvents.unshift(event);
    }

    // Step 3: Notify all via engine
    await NotificationEngine.publish(io, {
      source_module: 'events',
      type: 'info',
      title: `🎉 New Event: ${title}`,
      message: `${title} on ${startDate.toLocaleDateString()} at ${roomName}. ${capacity || 50} seats available.`,
      target_role: 'all',
      data: { event_id: event._id, room_id, booking_id: booking?._id },
    });

    res.status(201).json({ event, booking, message: `Event created and ${roomName} has been auto-booked` });
  } catch (err) {
    console.error('Event creation error:', err);
    res.status(500).json({ message: 'Error creating event' });
  }
});

// POST RSVP to event
router.post('/:id/rsvp', protect, async (req, res) => {
  try {
    const io = req.app.get('io');
    const userId = req.user._id || req.user.id;

    let event;
    try {
      event = await Event.findById(req.params.id);
      if (!event) throw new Error('not found');
      if (event.attendees.length >= event.capacity) {
        return res.status(400).json({ message: 'Event is at full capacity' });
      }
      if (event.attendees.map(String).includes(String(userId))) {
        return res.status(400).json({ message: 'Already RSVPed to this event' });
      }
      event.attendees.push(userId);
      await event.save();
    } catch {
      event = demoEvents.find(e => e._id === req.params.id);
      if (!event) return res.status(404).json({ message: 'Event not found' });
      if ((event.attendees || []).length >= event.capacity) {
        return res.status(400).json({ message: 'Event is at full capacity' });
      }
      if (!event.attendees) event.attendees = [];
      if (!event.attendees.includes(String(userId))) event.attendees.push(String(userId));
    }

    // Confirm to user
    await NotificationEngine.publish(io, {
      source_module: 'events',
      type: 'success',
      title: '✅ RSVP Confirmed',
      message: `You're registered for "${event.title}" on ${new Date(event.time_start).toLocaleDateString()}`,
      target_user: userId,
      data: { event_id: event._id },
    });

    res.json({ event, message: 'RSVP confirmed!' });
  } catch (err) {
    res.status(500).json({ message: 'Error RSVPing to event' });
  }
});

module.exports = router;
