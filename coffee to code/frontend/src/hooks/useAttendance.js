import { useState, useEffect, useCallback } from 'react';
import attendanceService from '../services/attendanceService';
import { getSocket } from '../utils/socket';
import toast from 'react-hot-toast';

/**
 * Custom hook to manage real-time attendance sessions, QR codes, and student check-ins
 */
export const useAttendance = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [liveHeadcount, setLiveHeadcount] = useState({});

  const fetchSessions = useCallback(async () => {
    try {
      setLoading(true);
      const data = await attendanceService.getSessions();
      setSessions(data.sessions || []);
    } catch {
      setSessions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSessions();

    const socket = getSocket();

    const handleSessionStarted = ({ session }) => {
      setSessions((prev) => [session, ...prev]);
    };

    const handleAttendanceUpdate = ({ session_id, percentage, present, total }) => {
      setLiveHeadcount((prev) => ({
        ...prev,
        [session_id]: { percentage, present, total },
      }));
    };

    socket.on('attendance_session_started', handleSessionStarted);
    socket.on('attendance_update', handleAttendanceUpdate);

    return () => {
      socket.off('attendance_session_started', handleSessionStarted);
      socket.off('attendance_update', handleAttendanceUpdate);
    };
  }, [fetchSessions]);

  const createSession = useCallback(async (sessionData) => {
    try {
      const data = await attendanceService.createSession(sessionData);
      setSessions((prev) => [data.session, ...prev]);
      toast.success('Attendance session launched! QR code active.');
      return data;
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to create session';
      toast.error(msg);
      throw err;
    }
  }, []);

  const checkIn = useCallback(async (qr_code) => {
    try {
      const data = await attendanceService.checkIn(qr_code);
      toast.success('Checked in successfully!');
      return data;
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid or expired QR code';
      toast.error(msg);
      throw err;
    }
  }, []);

  return {
    sessions,
    loading,
    liveHeadcount,
    createSession,
    checkIn,
    refreshSessions: fetchSessions,
  };
};

export default useAttendance;
