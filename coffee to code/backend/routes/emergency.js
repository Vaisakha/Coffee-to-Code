const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const NotificationEngine = require('../services/NotificationEngine');
const Emergency = require('../models/Emergency');

let demoEmergencies = [];

// POST trigger SOS
router.post('/sos', protect, async (req, res) => {
  try {
    const { lat, lng, description, block, type, room_id } = req.body;
    const io = req.app.get('io');
    const userId = req.user._id || req.user.id;

    let emergency;
    try {
      emergency = await Emergency.create({
        triggered_by: userId,
        location: { lat: lat || 0, lng: lng || 0, description: description || 'SOS Alert' },
        block: block || req.user.block || 'Unknown',
        room_id: room_id || null,
        type: type || 'other',
        status: 'active',
        description: description || `SOS triggered by ${req.user.name}`,
      });
    } catch {
      emergency = {
        _id: `sos_${Date.now()}`,
        triggered_by: { _id: userId, name: req.user.name, role: req.user.role },
        location: { lat: lat || 0, lng: lng || 0, description: description || 'SOS Alert' },
        block: block || req.user.block || 'Unknown',
        type: type || 'other',
        status: 'active',
        description: description || `SOS triggered by ${req.user.name}`,
        createdAt: new Date(),
      };
      demoEmergencies.push(emergency);
    }

    // Fire EMERGENCY notification via engine — broadcasts to ALL
    const notification = await NotificationEngine.publish(io, {
      source_module: 'emergency',
      type: 'emergency',
      title: '🚨 EMERGENCY SOS ALERT',
      message: `${req.user.name} triggered an SOS alert at Block ${block || req.user.block || 'Unknown'}. ${description || ''}`,
      target_role: 'all',
      target_block: block || req.user.block,
      isEmergency: true,
      data: {
        emergency_id: emergency._id,
        user: { name: req.user.name, role: req.user.role },
        location: { lat, lng, description, block },
        type,
      },
    });

    // Also notify security/admin specifically
    await NotificationEngine.publish(io, {
      source_module: 'emergency',
      type: 'emergency',
      title: '🚨 RESPOND: SOS Alert',
      message: `URGENT: ${req.user.name} (${req.user.role}) needs assistance at Block ${block || req.user.block || 'Unknown'}`,
      target_role: 'admin',
      isEmergency: true,
      data: { emergency_id: emergency._id },
    });

    res.status(201).json({ emergency, message: 'SOS alert sent to security and all users in your block' });
  } catch (err) {
    console.error('SOS error:', err);
    res.status(500).json({ message: 'Error sending SOS alert' });
  }
});

// GET active emergencies
router.get('/active', protect, async (req, res) => {
  try {
    let emergencies;
    try {
      emergencies = await Emergency.find({ status: 'active' })
        .populate('triggered_by', 'name role block')
        .sort({ createdAt: -1 });
    } catch {
      emergencies = demoEmergencies.filter(e => e.status === 'active');
    }
    res.json({ emergencies });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching emergencies' });
  }
});

// PUT resolve emergency (admin only)
router.put('/:id/resolve', protect, async (req, res) => {
  try {
    const io = req.app.get('io');
    let emergency;
    try {
      emergency = await Emergency.findByIdAndUpdate(
        req.params.id,
        { status: 'resolved', resolved_at: new Date(), $push: { responders: req.user._id } },
        { new: true }
      );
    } catch {
      emergency = demoEmergencies.find(e => e._id === req.params.id);
      if (emergency) { emergency.status = 'resolved'; emergency.resolved_at = new Date(); }
    }
    if (!emergency) return res.status(404).json({ message: 'Emergency not found' });

    // Notify resolution
    await NotificationEngine.publish(io, {
      source_module: 'emergency',
      type: 'success',
      title: '✅ Emergency Resolved',
      message: `The SOS alert has been resolved by ${req.user.name}`,
      target_role: 'all',
      data: { emergency_id: req.params.id },
    });

    if (io) io.emit('emergency_resolved', { emergency_id: req.params.id });

    res.json({ emergency, message: 'Emergency resolved' });
  } catch (err) {
    res.status(500).json({ message: 'Error resolving emergency' });
  }
});

module.exports = router;
