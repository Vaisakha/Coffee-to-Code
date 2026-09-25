import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { getSocket } from '../utils/socket';
import api from '../utils/api';
import toast from 'react-hot-toast';
import {
  Building2,
  Users,
  Layers,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  X,
  Search,
  Calendar,
  Clock,
} from 'lucide-react';
import { Room, RoomStatus, RoomType } from '../types';

const STATUS_CONFIG: Record<RoomStatus, { label: string; color: string; bg: string }> = {
  available: { label: 'Available', color: 'var(--success-dark)', bg: 'var(--success-light)' },
  booked: { label: 'Booked', color: 'var(--warning-dark)', bg: 'var(--warning-light)' },
  occupied: { label: 'In Use', color: 'var(--error-dark)', bg: 'var(--error-light)' },
  maintenance: { label: 'Maintenance', color: 'var(--text-muted)', bg: 'var(--bg-subtle)' },
};

const RoomsPage: React.FC = () => {
  const { user } = useAuth();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filter, setFilter] = useState<{ status: string; type: string; block: string }>({
    status: '',
    type: '',
    block: '',
  });
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [showBookingModal, setShowBookingModal] = useState<boolean>(false);
  const [booking, setBooking] = useState({
    title: '',
    time_start: '',
    time_end: '',
    notes: '',
  });
  const [bookingLoading, setBookingLoading] = useState<boolean>(false);

  const fetchRooms = useCallback(async () => {
    try {
      const params: Record<string, string> = {};
      if (filter.status) params.status = filter.status;
      if (filter.type) params.type = filter.type;
      if (filter.block) params.block = filter.block;
      const { data } = await api.get('/rooms', { params });
      setRooms(data.rooms || []);
    } catch {
      toast.error('Could not sync campus room directory');
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  // Real-time room status updates via Socket.IO
  useEffect(() => {
    const socket = getSocket();
    const handler = ({ room_id, status }: { room_id: string; status: RoomStatus }) => {
      setRooms((prev) =>
        prev.map((r) => (String(r._id) === String(room_id) ? { ...r, current_status: status } : r))
      );
    };
    socket.on('room_status_update', handler);
    return () => {
      socket.off('room_status_update', handler);
    };
  }, []);

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRoom) return;
    setBookingLoading(true);
    try {
      await api.post('/rooms/book', {
        room_id: selectedRoom._id,
        ...booking,
      });
      toast.success(`${selectedRoom.name} booked successfully!`);
      setShowBookingModal(false);
      setSelectedRoom(null);
      setBooking({ title: '', time_start: '', time_end: '', notes: '' });
      setRooms((prev) =>
        prev.map((r) =>
          String(r._id) === String(selectedRoom._id) ? { ...r, current_status: 'booked' } : r
        )
      );
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Room reservation conflict or booking failed');
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div className="page-content animate-in">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ margin: 0 }}>Campus Spaces & Hall Booking</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
            Live sensor tracking & automated reservation across all campus facilities
          </p>
        </div>

        {/* Status Legend Pills */}
        <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
          {(Object.entries(STATUS_CONFIG) as [RoomStatus, typeof STATUS_CONFIG[RoomStatus]][]).map(
            ([key, cfg]) => (
              <div
                key={key}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.25rem 0.65rem',
                  borderRadius: 'var(--radius-full)',
                  background: cfg.bg,
                  color: cfg.color,
                  fontSize: '0.76rem',
                  fontWeight: 600,
                  border: '1px solid rgba(0,0,0,0.04)',
                }}
              >
                <span
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: cfg.color,
                  }}
                />
                <span>{cfg.label}</span>
              </div>
            )
          )}
        </div>
      </div>

      {/* Filter Bar */}
      <div
        className="card"
        style={{
          padding: '1.2rem',
          marginBottom: '1.8rem',
          display: 'flex',
          gap: '1rem',
          flexWrap: 'wrap',
          alignItems: 'center',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>
          <Search size={16} />
          <span>Filters:</span>
        </div>

        <select
          className="form-select"
          style={{ width: 'auto', minWidth: '160px' }}
          value={filter.status}
          onChange={(e) => setFilter((f) => ({ ...f, status: e.target.value }))}
          id="room-status-filter"
        >
          <option value="">All Statuses</option>
          <option value="available">Available</option>
          <option value="booked">Booked</option>
          <option value="occupied">Occupied</option>
          <option value="maintenance">Maintenance</option>
        </select>

        <select
          className="form-select"
          style={{ width: 'auto', minWidth: '160px' }}
          value={filter.type}
          onChange={(e) => setFilter((f) => ({ ...f, type: e.target.value }))}
          id="room-type-filter"
        >
          <option value="">All Space Types</option>
          <option value="classroom">Classroom</option>
          <option value="lab">Computer / Science Lab</option>
          <option value="conference">Conference Room</option>
          <option value="auditorium">Auditorium</option>
          <option value="library">Library Hall</option>
        </select>

        <select
          className="form-select"
          style={{ width: 'auto', minWidth: '140px' }}
          value={filter.block}
          onChange={(e) => setFilter((f) => ({ ...f, block: e.target.value }))}
          id="room-block-filter"
        >
          <option value="">All Blocks</option>
          {['A', 'B', 'C', 'D', 'Admin'].map((b) => (
            <option key={b} value={b}>
              Block {b}
            </option>
          ))}
        </select>
      </div>

      {/* Rooms Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
          <div style={{ width: '40px', height: '40px', border: '3px solid #e2e8f0', borderTopColor: '#4f46e5', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem' }} />
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Querying campus facilities grid...</p>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
            gap: '1.4rem',
          }}
        >
          {rooms.map((room) => {
            const isAvailable = room.current_status === 'available';
            return (
              <div
                key={room._id}
                className="card"
                style={{
                  cursor: isAvailable ? 'pointer' : 'default',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  borderTop: `4px solid ${
                    isAvailable
                      ? 'var(--success)'
                      : room.current_status === 'occupied'
                      ? 'var(--error)'
                      : room.current_status === 'booked'
                      ? 'var(--warning)'
                      : 'var(--text-light)'
                  }`,
                }}
                onClick={() => {
                  if (isAvailable) {
                    setSelectedRoom(room);
                    setShowBookingModal(true);
                  }
                }}
                id={`room-card-${room._id}`}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.85rem' }}>
                    <div
                      style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: 'var(--radius-xs)',
                        background: 'var(--primary-light)',
                        color: 'var(--primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Building2 size={22} />
                    </div>
                    <span className={`badge badge-${room.current_status}`}>
                      {room.current_status}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.15rem', marginBottom: '0.35rem' }}>{room.name}</h3>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '0.65rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Layers size={14} />
                      Block {room.block} (Floor {room.floor})
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                      <Users size={14} />
                      Capacity: {room.capacity}
                    </span>
                  </div>

                  {room.amenities && room.amenities.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', margin: '0.85rem 0' }}>
                      {room.amenities.slice(0, 3).map((amenity, idx) => (
                        <span
                          key={idx}
                          style={{
                            fontSize: '0.72rem',
                            fontWeight: 600,
                            padding: '0.15rem 0.5rem',
                            background: 'var(--bg-canvas)',
                            border: '1px solid var(--surface-glass-border)',
                            borderRadius: 'var(--radius-xs)',
                            color: 'var(--text-secondary)',
                          }}
                        >
                          {amenity}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div style={{ marginTop: '1rem', paddingTop: '0.85rem', borderTop: '1px solid var(--surface-glass-border)' }}>
                  {isAvailable ? (
                    <button
                      className="btn btn-primary btn-sm"
                      style={{ width: '100%' }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedRoom(room);
                        setShowBookingModal(true);
                      }}
                    >
                      Book Room Now
                    </button>
                  ) : (
                    <div style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Currently Unavailable
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Booking Modal */}
      {showBookingModal && selectedRoom && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '1.5rem',
            animation: 'fadeIn 0.2s ease',
          }}
        >
          <div
            className="card"
            style={{
              maxWidth: '520px',
              width: '100%',
              padding: '2.2rem',
              boxShadow: 'var(--shadow-hover)',
              borderRadius: 'var(--radius-lg)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
              <div>
                <h2 style={{ fontSize: '1.35rem', marginBottom: '0.2rem' }}>Reserve {selectedRoom.name}</h2>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
                  Block {selectedRoom.block} · Capacity: {selectedRoom.capacity} students
                </p>
              </div>
              <button
                className="btn btn-secondary btn-sm"
                style={{ padding: '0.35rem', borderRadius: '50%', border: 'none' }}
                onClick={() => setShowBookingModal(false)}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleBook} id="booking-form">
              <div className="form-group">
                <label className="form-label">Event / Class Purpose</label>
                <input
                  className="form-input"
                  type="text"
                  placeholder="e.g. Distributed Systems Lab Practice"
                  value={booking.title}
                  onChange={(e) => setBooking((b) => ({ ...b, title: e.target.value }))}
                  required
                  id="booking-title"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.9rem' }}>
                <div className="form-group">
                  <label className="form-label">Start Time</label>
                  <input
                    className="form-input"
                    type="datetime-local"
                    value={booking.time_start}
                    onChange={(e) => setBooking((b) => ({ ...b, time_start: e.target.value }))}
                    required
                    id="booking-start"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">End Time</label>
                  <input
                    className="form-input"
                    type="datetime-local"
                    value={booking.time_end}
                    onChange={(e) => setBooking((b) => ({ ...b, time_end: e.target.value }))}
                    required
                    id="booking-end"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Special Requirements / Notes</label>
                <textarea
                  className="form-textarea"
                  placeholder="e.g. Projector required, extra audio mic needed..."
                  value={booking.notes}
                  onChange={(e) => setBooking((b) => ({ ...b, notes: e.target.value }))}
                  style={{ minHeight: '80px' }}
                  id="booking-notes"
                />
              </div>

              <div style={{ display: 'flex', gap: '0.8rem', marginTop: '1.5rem' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ flex: 1 }}
                  onClick={() => setShowBookingModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                  disabled={bookingLoading}
                  id="booking-submit-btn"
                >
                  {bookingLoading ? 'Reserving...' : 'Confirm Reservation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomsPage;
