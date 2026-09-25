const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  room_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', required: true },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  time_start: { type: Date, required: true },
  time_end: { type: Date, required: true },
  status: { type: String, enum: ['confirmed', 'cancelled', 'pending'], default: 'confirmed' },
  attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  notes: { type: String, default: '' },
  event_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', default: null },
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
