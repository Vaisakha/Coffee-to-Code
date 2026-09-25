import api from '../utils/api';
import { Complaint } from '../types';

export const complaintService = {
  async getComplaints(params: Record<string, any> = {}): Promise<{ complaints: Complaint[] }> {
    const { data } = await api.get('/complaints', { params });
    return data;
  },

  async createComplaint(complaintData: Partial<Complaint>): Promise<{ complaint: Complaint }> {
    const { data } = await api.post('/complaints', complaintData);
    return data;
  },

  async updateStatus(id: string, status: string, comment: string = ''): Promise<{ complaint: Complaint }> {
    const { data } = await api.put(`/complaints/${id}/status`, { status, comment });
    return data;
  },
};

export default complaintService;
