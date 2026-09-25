const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  class_id: { type: String, required: true },
  class_name: { type: String, required: true },
  room_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', default: null },
  faculty_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  time_start: { type: Date },
  time_end: { type: Date },
  qr_code: { type: String, default: '' },
  qr_expires_at: { type: Date, default: null },
  records: [{
    student_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: ['present', 'absent', 'late'], default: 'absent' },
    checked_in_at: { type: Date, default: null },
    method: { type: String, enum: ['qr', 'manual', 'geofence'], default: 'qr' },
  }],
  threshold_percentage: { type: Number, default: 75 },
  notified_low_attendance: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
