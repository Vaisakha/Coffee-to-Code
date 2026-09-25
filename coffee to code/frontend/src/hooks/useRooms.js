import { useState, useEffect, useCallback, useMemo } from 'react';
import roomService from '../services/roomService';
import { getSocket } from '../utils/socket';
import toast from 'react-hot-toast';

/**
 * Custom hook for live room availability, status changes, and bookings
 */
export const useRooms = (initialFilters = {}) => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [filters, setFilters] = useState(initialFilters);

  const fetchRooms = useCallback(async () => {
    try {
      setLoading(true);
      const data = await roomService.getRooms(filters);
      setRooms(data.rooms || []);
    } catch {
      setRooms([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchRooms();

    const socket = getSocket();
    const handleStatusUpdate = ({ room_id, status }) => {
      setRooms((prev) =>
        prev.map((r) => (r._id === room_id ? { ...r, current_status: status } : r))
      );
      if (selectedRoom && selectedRoom._id === room_id) {
        setSelectedRoom((prev) => ({ ...prev, current_status: status }));
      }
    };

    socket.on('room_status_update', handleStatusUpdate);

    return () => {
      socket.off('room_status_update', handleStatusUpdate);
    };
  }, [fetchRooms, selectedRoom]);

  const bookRoom = useCallback(async (bookingData) => {
    try {
      const data = await roomService.bookRoom(bookingData);
      toast.success('Room booked successfully!');
      return data;
    } catch (err) {
      const msg = err.response?.data?.message || 'Error booking room';
      toast.error(msg);
      throw err;
    }
  }, []);

  const updateRoomStatus = useCallback(async (roomId, status) => {
    try {
      const data = await roomService.updateRoomStatus(roomId, status);
      toast.success(`Room status updated to ${status}`);
      return data;
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update status';
      toast.error(msg);
      throw err;
    }
  }, []);

  const availableCount = useMemo(() => {
    return rooms.filter((r) => r.current_status === 'available').length;
  }, [rooms]);

  return {
    rooms,
    loading,
    selectedRoom,
    setSelectedRoom,
    filters,
    setFilters,
    availableCount,
    bookRoom,
    updateRoomStatus,
    refreshRooms: fetchRooms,
  };
};

export default useRooms;
