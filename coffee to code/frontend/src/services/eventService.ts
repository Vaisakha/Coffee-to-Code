import api from '../utils/api';
import { CampusEvent } from '../types';

export const eventService = {
  async getEvents(params: Record<string, any> = {}): Promise<{ events: CampusEvent[] }> {
    const { data } = await api.get('/events', { params });
    return data;
  },

  async createEvent(eventData: Partial<CampusEvent>): Promise<{ event: CampusEvent }> {
    const { data } = await api.post('/events', eventData);
    return data;
  },

  async rsvpEvent(eventId: string): Promise<{ event: CampusEvent; message: string }> {
    const { data } = await api.post(`/events/${eventId}/rsvp`);
    return data;
  },

  async cancelRsvp(eventId: string): Promise<{ event: CampusEvent; message: string }> {
    const { data } = await api.delete(`/events/${eventId}/rsvp`);
    return data;
  },

  async deleteEvent(eventId: string): Promise<{ message: string }> {
    const { data } = await api.delete(`/events/${eventId}`);
    return data;
  },
};

export default eventService;
