const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const NotificationEngine = require('../services/NotificationEngine');
const Notification = require('../models/Notification');

// In-memory store for demo mode
let demoNotifications = [
  { _id: 'n1', source_module: 'system', type: 'info', title: '👋 Welcome to Smart Campus', message: 'Your unified campus platform is ready. Explore modules from the sidebar.', target_role: 'all', createdAt: new Date(Date.now() - 3600000), read_by: [] },
  { _id: 'n2', source_module: 'rooms', type: 'booking', title: '🏫 Room Available', message: 'Lab 3A is now available for booking this afternoon.', target_role: 'all', createdAt: new Date(Date.now() - 7200000), read_by: [] },
];

// GET notifications for the current user
router.get('/', protect, async (req, res) => {
  try {
    const { limit = 50, unread_only } = req.query;
    const userId = req.user._id || req.user.id;
    const userRole = req.user.role;
    const userBlock = req.user.block;

    let notifications;
    try {
      notifications = await NotificationEngine.getForUser(userId, userRole, userBlock, parseInt(limit));
    } catch {
      notifications = demoNotifications.filter(n =>
        n.target_role === 'all' || n.target_role === userRole
      );
    }

    if (unread_only === 'true') {
      notifications = notifications.filter(n => !(n.read_by || []).includes(String(userId)));
    }

    const unreadCount = notifications.filter(n => !(n.read_by || []).includes(String(userId))).length;

    res.json({ notifications, unreadCount });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching notifications' });
  }
});

// PUT mark notifications as read
router.put('/read', protect, async (req, res) => {
  try {
    const { notification_ids } = req.body;
    const userId = req.user._id || req.user.id;
    try {
      await NotificationEngine.markRead(userId, notification_ids);
    } catch {
      notification_ids.forEach(id => {
        const n = demoNotifications.find(n => n._id === id);
        if (n && !n.read_by.includes(String(userId))) n.read_by.push(String(userId));
      });
    }
    res.json({ message: 'Marked as read' });
  } catch (err) {
    res.status(500).json({ message: 'Error marking as read' });
  }
});

// PUT mark all as read
router.put('/read-all', protect, async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    try {
      await Notification.updateMany(
        { $or: [{ target_role: req.user.role }, { target_role: 'all' }, { target_user: userId }] },
        { $addToSet: { read_by: userId } }
      );
    } catch {
      demoNotifications.forEach(n => {
        if (!n.read_by.includes(String(userId))) n.read_by.push(String(userId));
      });
    }
    res.json({ message: 'All marked as read' });
  } catch (err) {
    res.status(500).json({ message: 'Error marking all as read' });
  }
});

// POST publish a notification (admin only)
router.post('/publish', protect, async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'faculty') {
      return res.status(403).json({ message: 'Only admins and faculty can publish notifications' });
    }
    const io = req.app.get('io');
    const notification = await NotificationEngine.publish(io, {
      ...req.body,
      source_module: req.body.source_module || 'system',
    });

    // Also add to demo store for display
    if (notification) demoNotifications.unshift(notification);

    res.status(201).json({ notification });
  } catch (err) {
    res.status(500).json({ message: 'Error publishing notification' });
  }
});

module.exports = router;
