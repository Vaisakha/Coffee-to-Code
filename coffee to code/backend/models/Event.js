const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  room_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', default: null },
  booking_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', default: null },
  organizer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  time_start: { type: Date, required: true },
  time_end: { type: Date, required: true },
  capacity: { type: Number, default: 50 },
  attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  category: {
    type: String,
    enum: ['academic', 'cultural', 'sports', 'workshop', 'seminar', 'other'],
    default: 'other'
  },
  status: { type: String, enum: ['upcoming', 'ongoing', 'completed', 'cancelled'], default: 'upcoming' },
  banner_url: { type: String, default: '' },
  tags: [{ type: String }],
  department: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);
