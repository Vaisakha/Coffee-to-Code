import { useState, useEffect, useCallback } from 'react';
import emergencyService from '../services/emergencyService';
import { getSocket } from '../utils/socket';
import toast from 'react-hot-toast';

/**
 * Custom hook to interact with campus Emergency SOS and real-time distress beacons
 */
export const useEmergency = () => {
  const [activeAlerts, setActiveAlerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch active alerts on mount
  const fetchActiveAlerts = useCallback(async () => {
    try {
      setLoading(true);
      const data = await emergencyService.getActiveAlerts();
      setActiveAlerts(data.emergencies || []);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch emergency alerts');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchActiveAlerts();

    const socket = getSocket();
    const handleNewAlert = (alert) => {
      setActiveAlerts((prev) => [alert, ...prev]);
    };

    const handleResolved = ({ emergency_id }) => {
      setActiveAlerts((prev) => prev.filter((a) => a._id !== emergency_id));
    };

    socket.on('emergency_alert', handleNewAlert);
    socket.on('emergency_resolved', handleResolved);

    return () => {
      socket.off('emergency_alert', handleNewAlert);
      socket.off('emergency_resolved', handleResolved);
    };
  }, [fetchActiveAlerts]);

  /**
   * Trigger SOS with optional automatic browser geolocation lookup
   */
  const triggerSos = useCallback(async ({ block = '', description = '', type = 'medical', room_id = null }) => {
    return new Promise((resolve, reject) => {
      const sendSos = async (coords = { lat: 0, lng: 0 }) => {
        try {
          setLoading(true);
          const result = await emergencyService.triggerSos({
            lat: coords.lat,
            lng: coords.lng,
            description,
            block,
            type,
            room_id,
          });
          toast.error('🚨 EMERGENCY SOS BEACON BROADCASTED!', { duration: 6000 });
          resolve(result);
        } catch (err) {
          const msg = err.response?.data?.message || 'Failed to trigger SOS';
          toast.error(msg);
          reject(err);
        } finally {
          setLoading(false);
        }
      };

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => sendSos({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
          () => sendSos({ lat: 0, lng: 0 }),
          { timeout: 5000 }
        );
      } else {
        sendSos({ lat: 0, lng: 0 });
      }
    });
  }, []);

  /**
   * Resolve an active emergency incident (Admin / Security)
   */
  const resolveAlert = useCallback(async (emergencyId, resolutionNotes = '') => {
    try {
      setLoading(true);
      const result = await emergencyService.resolveEmergency(emergencyId, resolutionNotes);
      setActiveAlerts((prev) => prev.filter((a) => a._id !== emergencyId));
      toast.success('Emergency resolved successfully');
      return result;
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to resolve emergency';
      toast.error(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    activeAlerts,
    isEmergencyActive: activeAlerts.length > 0,
    loading,
    error,
    triggerSos,
    resolveAlert,
    refreshAlerts: fetchActiveAlerts,
  };
};

export default useEmergency;
