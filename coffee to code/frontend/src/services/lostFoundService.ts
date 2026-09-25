import api from '../utils/api';
import { LostFoundItem } from '../types';

export const lostFoundService = {
  async getItems(params: Record<string, any> = {}): Promise<{ items: LostFoundItem[] }> {
    const { data } = await api.get('/lostfound', { params });
    return data;
  },

  async reportItem(itemData: Partial<LostFoundItem>): Promise<{ item: LostFoundItem }> {
    const { data } = await api.post('/lostfound', itemData);
    return data;
  },

  async updateStatus(id: string, status: string): Promise<{ item: LostFoundItem }> {
    const { data } = await api.patch(`/lostfound/${id}/status`, { status });
    return data;
  },

  async getMatches(id: string): Promise<{ matches: LostFoundItem[] }> {
    const { data } = await api.get(`/lostfound/matches/${id}`);
    return data;
  },
};

export default lostFoundService;
