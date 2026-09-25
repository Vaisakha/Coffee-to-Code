const mongoose = require('mongoose');

const emergencySchema = new mongoose.Schema({
  triggered_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  location: {
    lat: { type: Number, default: 0 },
    lng: { type: Number, default: 0 },
    description: { type: String, default: '' },
  },
  block: { type: String, default: '' },
  room_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', default: null },
  type: {
    type: String,
    enum: ['medical', 'fire', 'security', 'accident', 'other'],
    default: 'other'
  },
  status: { type: String, enum: ['active', 'responding', 'resolved'], default: 'active' },
  description: { type: String, default: 'SOS Alert triggered' },
  responders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  resolved_at: { type: Date, default: null },
  notification_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Notification', default: null },
}, { timestamps: true });

module.exports = mongoose.model('Emergency', emergencySchema);
