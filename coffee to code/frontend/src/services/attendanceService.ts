import api from '../utils/api';
import { AttendanceSession } from '../types';

export const attendanceService = {
  async getSessions(): Promise<{ sessions: AttendanceSession[] }> {
    const { data } = await api.get('/attendance');
    return data;
  },

  async createSession(sessionData: {
    course_code: string;
    course_name: string;
    room_id?: string;
    session_date?: string;
  }): Promise<{ session: AttendanceSession }> {
    const { data } = await api.post('/attendance/session', sessionData);
    return data;
  },

  async checkIn(qr_code: string): Promise<{ message: string; session: AttendanceSession }> {
    const { data } = await api.post('/attendance/checkin', { qr_code });
    return data;
  },

  async getSessionById(sessionId: string): Promise<{ session: AttendanceSession }> {
    const { data } = await api.get(`/attendance/session/${sessionId}`);
    return data;
  },

  async updateStudentStatus(
    sessionId: string,
    studentId: string,
    status: 'present' | 'absent' | 'excused'
  ): Promise<{ session: AttendanceSession }> {
    const { data } = await api.patch(`/attendance/session/${sessionId}/student`, {
      studentId,
      status,
    });
    return data;
  },
};

export default attendanceService;
