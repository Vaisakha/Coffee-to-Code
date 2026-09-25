/**
 * Central Notification Engine
 * All modules MUST route alerts through this service.
 * No module should send ad-hoc alerts directly.
 *
 * Usage:
 *   const NotificationEngine = require('./NotificationEngine');
 *   await NotificationEngine.publish(io, {
 *     source_module: 'rooms',
 *     type: 'booking',
 *     title: 'Room Booked',
 *     message: 'Lab 3A has been booked by John Doe until 4 PM',
 *     target_role: 'faculty',
 *     target_block: 'A',
 *     data: { room_id, booking_id }
 *   });
 */

const Notification = require('../models/Notification');

class NotificationEngine {
  /**
   * Publish a notification to the DB and broadcast via WebSocket.
   * @param {object} io - Socket.IO server instance
   * @param {object} payload - Notification payload
   */
  static async publish(io, payload) {
    try {
      const {
        source_module,
        type = 'info',
        title,
        message,
        target_role = 'all',
        target_user = null,
        target_block = null,
        isEmergency = false,
        data = {},
      } = payload;

      // Persist to DB (if connected)
      let notification = null;
      try {
        notification = await Notification.create({
          source_module,
          type,
          title,
          message,
          target_role,
          target_user,
          target_block,
          isEmergency,
          data,
        });
      } catch (dbErr) {
        // DB not connected — continue with in-memory broadcast only
        console.warn('Notification DB write failed (demo mode):', dbErr.message);
        notification = { _id: Date.now(), source_module, type, title, message, target_role, target_user, target_block, isEmergency, data, createdAt: new Date() };
      }

      // WebSocket fan-out
      if (io) {
        const event = isEmergency ? 'emergency_alert' : 'notification';
        const broadcastPayload = { ...notification, ...(notification.toObject ? notification.toObject() : {}) };

        if (isEmergency) {
          // Emergency: broadcast to everyone
          io.emit('emergency_alert', broadcastPayload);
        } else if (target_user) {
          // Targeted: emit to specific user room
          io.to(`user_${target_user}`).emit(event, broadcastPayload);
        } else if (target_block) {
          // Block-scoped: emit to block room
          io.to(`block_${target_block}`).emit(event, broadcastPayload);
          // Also notify the appropriate role
          if (target_role && target_role !== 'all') {
            io.to(`role_${target_role}`).emit(event, broadcastPayload);
          }
        } else if (target_role === 'all') {
          io.emit(event, broadcastPayload);
        } else {
          io.to(`role_${target_role}`).emit(event, broadcastPayload);
        }

        // Always broadcast to admins for awareness
        io.to('role_admin').emit('notification', broadcastPayload);
      }

      console.log(`[NotificationEngine] ${source_module} → ${type}: ${title}`);
      return notification;
    } catch (err) {
      console.error('[NotificationEngine] Error publishing notification:', err);
      return null;
    }
  }

  /**
   * Mark notifications as read for a user.
   */
  static async markRead(userId, notificationIds) {
    try {
      await Notification.updateMany(
        { _id: { $in: notificationIds } },
        { $addToSet: { read_by: userId } }
      );
    } catch (err) {
      console.error('[NotificationEngine] markRead error:', err);
    }
  }

  /**
   * Get notifications for a user based on their role, block, and personal alerts.
   */
  static async getForUser(userId, userRole, userBlock, limit = 50) {
    try {
      return await Notification.find({
        $or: [
          { target_user: userId },
          { target_role: userRole },
          { target_role: 'all' },
          { target_block: userBlock, target_role: 'all' },
        ]
      })
        .sort({ createdAt: -1 })
        .limit(limit)
        .lean();
    } catch (err) {
      console.error('[NotificationEngine] getForUser error:', err);
      return [];
    }
  }
}

module.exports = NotificationEngine;
