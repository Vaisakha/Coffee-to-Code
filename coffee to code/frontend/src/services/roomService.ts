import api from '../utils/api';
import { Room, Booking, RoomStatus, RoomType } from '../types';

export interface GetRoomsParams {
  block?: string;
  status?: RoomStatus;
  type?: RoomType;
}

export const roomService = {
  async getRooms(params: GetRoomsParams = {}): Promise<{ rooms: Room[]; total: number }> {
    const { data } = await api.get('/rooms', { params });
    return data;
  },

  async getRoomById(id: string): Promise<{ room: Room }> {
    const { data } = await api.get(`/rooms/${id}`);
    return data;
  },

  async bookRoom(bookingData: {
    room_id: string;
    title: string;
    time_start: string;
    time_end: string;
    notes?: string;
  }): Promise<{ booking: Booking }> {
    const { data } = await api.post('/rooms/book', bookingData);
    return data;
  },

  async getRoomBookings(roomId: string): Promise<{ bookings: Booking[] }> {
    const { data } = await api.get(`/rooms/${roomId}/bookings`);
    return data;
  },

  async cancelBooking(bookingId: string): Promise<{ message: string }> {
    const { data } = await api.delete(`/rooms/booking/${bookingId}`);
    return data;
  },

  async updateRoomStatus(roomId: string, status: RoomStatus): Promise<{ room: Room }> {
    const { data } = await api.patch(`/rooms/${roomId}/status`, { status });
    return data;
  },
};

export default roomService;
