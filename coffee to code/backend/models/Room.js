const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  name: { type: String, required: true },
  block: { type: String, required: true },
  floor: { type: Number, default: 0 },
  capacity: { type: Number, required: true },
  current_status: {
    type: String,
    enum: ['available', 'occupied', 'booked', 'maintenance'],
    default: 'available'
  },
  type: {
    type: String,
    enum: ['classroom', 'lab', 'conference', 'auditorium', 'library', 'cafeteria'],
    default: 'classroom'
  },
  amenities: [{ type: String }],
  coordinates: {
    x: { type: Number, default: 0 },
    y: { type: Number, default: 0 }
  },
  currentOccupancy: { type: Number, default: 0 },
  description: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Room', roomSchema);
