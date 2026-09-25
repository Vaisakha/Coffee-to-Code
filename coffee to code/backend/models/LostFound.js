const mongoose = require('mongoose');

const lostFoundSchema = new mongoose.Schema({
  type: { type: String, enum: ['lost', 'found'], required: true },
  category: {
    type: String,
    enum: ['electronics', 'documents', 'clothing', 'accessories', 'bags', 'keys', 'other'],
    default: 'other'
  },
  title: { type: String, required: true },
  description: { type: String, required: true },
  photo_url: { type: String, default: '' },
  location: { type: String, default: '' },
  room_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Room', default: null },
  block: { type: String, default: '' },
  status: { type: String, enum: ['active', 'matched', 'claimed', 'closed'], default: 'active' },
  posted_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  matched_with: { type: mongoose.Schema.Types.ObjectId, ref: 'LostFound', default: null },
  contact_info: { type: String, default: '' },
  tags: [{ type: String }],
}, { timestamps: true });

module.exports = mongoose.model('LostFound', lostFoundSchema);
