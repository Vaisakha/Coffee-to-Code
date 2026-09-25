import api from '../utils/api';
import { User } from '../types';

export const authService = {
  async login(email: string, password?: string): Promise<{ token: string; user: User }> {
    const { data } = await api.post('/auth/login', { email, password });
    return data;
  },

  async register(userData: Partial<User> & { password?: string }): Promise<{ token: string; user: User }> {
    const { data } = await api.post('/auth/register', userData);
    return data;
  },

  async getCurrentUser(): Promise<{ user: User }> {
    const { data } = await api.get('/auth/me');
    return data;
  },

  logout(): void {
    localStorage.removeItem('campus_token');
    localStorage.removeItem('campus_user');
  },
};

export default authService;
