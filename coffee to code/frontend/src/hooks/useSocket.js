import { useEffect, useCallback } from 'react';
import { getSocket } from '../utils/socket';

/**
 * Custom hook to subscribe to real-time WebSocket events with automatic cleanup
 * @param {string} eventName - Socket event name (e.g. 'notification', 'room_status_update')
 * @param {Function} handler - Callback when event fires
 */
export const useSocket = (eventName, handler) => {
  const socket = getSocket();

  useEffect(() => {
    if (!eventName || !handler) return;

    const s = getSocket();
    s.on(eventName, handler);

    return () => {
      s.off(eventName, handler);
    };
  }, [eventName, handler]);

  const emit = useCallback((event, data) => {
    const s = getSocket();
    s.emit(event, data);
  }, []);

  return { socket, emit };
};

export default useSocket;
