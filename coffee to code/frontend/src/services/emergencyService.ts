import api from '../utils/api';
import { EmergencySOS } from '../types';

export const emergencyService = {
  async triggerSos(sosData: {
    lat: number;
    lng: number;
    description: string;
    block?: string;
    type?: string;
    room_id?: string;
  }): Promise<{ emergency: EmergencySOS }> {
    const { data } = await api.post('/emergency/sos', sosData);
    return data;
  },

  async getActiveAlerts(): Promise<{ alerts: EmergencySOS[] }> {
    const { data } = await api.get('/emergency/active');
    return data;
  },

  async getHistory(): Promise<{ history: EmergencySOS[] }> {
    const { data } = await api.get('/emergency/history');
    return data;
  },

  async resolveEmergency(id: string, resolution_notes: string = ''): Promise<{ emergency: EmergencySOS }> {
    const { data } = await api.put(`/emergency/resolve/${id}`, { resolution_notes });
    return data;
  },
};

export default emergencyService;
