import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { getSocket } from '../utils/socket';
import { useAuth } from './AuthContext';
import api from '../utils/api';
import { CampusNotification, EmergencySOS } from '../types';

export interface NotificationContextType {
  notifications: CampusNotification[];
  unreadCount: number;
  emergencyAlert: EmergencySOS | null;
  panelOpen: boolean;
  setPanelOpen: React.Dispatch<React.SetStateAction<boolean>>;
  markRead: (ids: string[]) => Promise<void>;
  markAllRead: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<CampusNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [emergencyAlert, setEmergencyAlert] = useState<EmergencySOS | null>(null);
  const [panelOpen, setPanelOpen] = useState<boolean>(false);

  // Fetch existing notifications on mount
  useEffect(() => {
    if (!user) return;

    const fetchNotifications = async () => {
      try {
        const { data } = await api.get('/notifications?limit=30');
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
      } catch (err) {
        // Fallback for demo mode
      }
    };
    fetchNotifications();
  }, [user]);

  // Real-time socket listeners
  useEffect(() => {
    if (!user) return;
    const socket = getSocket();

    const handleNotification = (notif: CampusNotification) => {
      setNotifications(prev => [notif, ...prev.slice(0, 49)]);
      setUnreadCount(c => c + 1);
    };

    const handleEmergency = (alert: EmergencySOS) => {
      setEmergencyAlert(alert);
      setNotifications(prev => [
        {
          _id: alert._id || String(Date.now()),
          title: `EMERGENCY ALERT: ${alert.type.toUpperCase()}`,
          message: alert.description || 'Immediate campus assistance requested!',
          type: 'emergency_sos',
          is_read: false,
          priority: 'critical',
          createdAt: new Date().toISOString(),
        },
        ...prev.slice(0, 49),
      ]);
      setUnreadCount(c => c + 1);
      // Auto-clear banner after 30 seconds
      setTimeout(() => setEmergencyAlert(null), 30000);
    };

    const handleEmergencyResolved = () => {
      setEmergencyAlert(null);
    };

    socket.on('notification', handleNotification);
    socket.on('emergency_alert', handleEmergency);
    socket.on('emergency_resolved', handleEmergencyResolved);

    return () => {
      socket.off('notification', handleNotification);
      socket.off('emergency_alert', handleEmergency);
      socket.off('emergency_resolved', handleEmergencyResolved);
    };
  }, [user]);

  const markRead = useCallback(async (ids: string[]) => {
    try {
      await api.put('/notifications/read', { notification_ids: ids });
      setNotifications(prev =>
        prev.map(n => ids.includes(String(n._id)) ? { ...n, is_read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - ids.length));
    } catch (err) {
      // demo fallback
    }
  }, []);

  const markAllRead = useCallback(async () => {
    try {
      await api.put('/notifications/read-all');
      setUnreadCount(0);
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    } catch (err) {
      setUnreadCount(0);
    }
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        emergencyAlert,
        panelOpen,
        setPanelOpen,
        markRead,
        markAllRead,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = (): NotificationContextType => {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be used within NotificationProvider');
  return ctx;
};

export default NotificationContext;
