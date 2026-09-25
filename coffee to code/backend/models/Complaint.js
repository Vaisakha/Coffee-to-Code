const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  category: {
    type: String,
    enum: ['maintenance', 'academic', 'hostel', 'safety', 'it', 'other'],
    required: true
  },
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, enum: ['open', 'in-progress', 'resolved', 'closed'], default: 'open' },
  priority: { type: String, enum: ['low', 'medium', 'high', 'urgent'], default: 'medium' },
  submitted_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  assigned_dept: { type: String, default: '' },
  assigned_to: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  location: { type: String, default: '' },
  room_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', default: null },
  block: { type: String, default: '' },
  photo_url: { type: String, default: '' },
  comments: [{
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    message: { type: String },
    timestamp: { type: Date, default: Date.now }
  }],
  resolved_at: { type: Date, default: null },
}, { timestamps: true });

module.exports = mongoose.model('Complaint', complaintSchema);
