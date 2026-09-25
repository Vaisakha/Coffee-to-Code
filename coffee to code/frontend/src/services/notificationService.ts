import api from '../utils/api';
import { CampusNotification, UserRole } from '../types';

export const notificationService = {
  async getNotifications(params: { limit?: number; unread_only?: boolean } = {}): Promise<{
    notifications: CampusNotification[];
    unreadCount: number;
  }> {
    const { data } = await api.get('/notifications', { params });
    return data;
  },

  async markRead(notification_ids: string[]): Promise<{ message: string }> {
    const { data } = await api.put('/notifications/read', { notification_ids });
    return data;
  },

  async markAllRead(): Promise<{ message: string }> {
    const { data } = await api.put('/notifications/read-all');
    return data;
  },

  async broadcast(broadcastData: {
    title: string;
    message: string;
    target_role?: UserRole | 'all';
    target_block?: string;
    priority?: string;
  }): Promise<{ notification: CampusNotification }> {
    const { data } = await api.post('/notifications/broadcast', broadcastData);
    return data;
  },
};

export default notificationService;
