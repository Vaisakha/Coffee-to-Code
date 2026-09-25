const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  target_role: { type: String, enum: ['student', 'faculty', 'admin', 'all', 'security'], default: 'all' },
  target_user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  target_block: { type: String, default: null },
  source_module: {
    type: String,
    enum: ['auth', 'rooms', 'attendance', 'emergency', 'lostfound', 'complaints', 'events', 'system'],
    required: true
  },
  type: {
    type: String,
    enum: ['info', 'warning', 'error', 'success', 'emergency', 'booking', 'attendance'],
    default: 'info'
  },
  title: { type: String, required: true },
  message: { type: String, required: true },
  data: { type: mongoose.Schema.Types.Mixed, default: {} },
  read_by: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  isEmergency: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
