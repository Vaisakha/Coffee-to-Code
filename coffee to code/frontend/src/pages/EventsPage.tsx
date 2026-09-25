import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';
import {
  CalendarDays,
  Users,
  MapPin,
  Sparkles,
  Plus,
  X,
  CheckCircle2,
  Clock,
  Tag,
  Building2,
} from 'lucide-react';
import { CampusEvent, Room } from '../types';

const CATEGORY_COLORS: Record<string, { bg: string; color: string; border: string }> = {
  academic: { bg: '#eff6ff', color: '#1d4ed8', border: '#bfdbfe' },
  cultural: { bg: '#fdf2f8', color: '#be185d', border: '#fbcfe8' },
  sports: { bg: '#ecfdf5', color: '#047857', border: '#a7f3d0' },
  workshop: { bg: '#fffbeb', color: '#b45309', border: '#fde68a' },
  club: { bg: '#f5f3ff', color: '#6d28d9', border: '#ddd6fe' },
};

const EventsPage: React.FC = () => {
  const { user, isRole } = useAuth();
  const [events, setEvents] = useState<CampusEvent[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showCreate, setShowCreate] = useState<boolean>(false);
  const [rsvping, setRsvping] = useState<string | null>(null);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    room_id: '',
    start_time: '',
    end_time: '',
    max_capacity: 60,
    category: 'academic' as const,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [evRes, roomRes] = await Promise.allSettled([
          api.get('/events'),
          api.get('/rooms?status=available'),
        ]);
        if (evRes.status === 'fulfilled') setEvents(evRes.value.data.events || []);
        if (roomRes.status === 'fulfilled') setRooms(roomRes.value.data.rooms || []);
      } catch {
        // Fallback for demo
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/events', newEvent);
      setEvents((prev) => [data.event, ...prev]);
      setShowCreate(false);
      toast.success('Event registered & linked campus room auto-reserved!');
      setNewEvent({
        title: '',
        description: '',
        room_id: '',
        start_time: '',
        end_time: '',
        max_capacity: 60,
        category: 'academic',
      });
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create event');
    }
  };

  const handleRSVP = async (eventId: string) => {
    setRsvping(eventId);
    try {
      await api.post(`/events/${eventId}/rsvp`);
      setEvents((prev) =>
        prev.map((e) =>
          String(e._id) === String(eventId)
            ? { ...e, rsvps: [...(e.rsvps || []), user?._id || ''] }
            : e
        )
      );
      toast.success('RSVP confirmed! Added to your schedule.');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'RSVP failed');
    } finally {
      setRsvping(null);
    }
  };

  const isAttending = (event: CampusEvent) => {
    return (event.rsvps || []).some(
      (a) => String(a) === String(user?._id) || String((a as any)?._id) === String(user?._id)
    );
  };

  return (
    <div className="page-content animate-in">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ margin: 0 }}>Campus Events & Auto-Reservations</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
            Browse workshops, hackathons & cultural activities with guaranteed hall bookings
          </p>
        </div>

        {isRole('faculty', 'admin') && (
          <button
            className="btn btn-primary"
            onClick={() => setShowCreate(true)}
            id="create-event-btn"
          >
            <Plus size={18} />
            <span>Publish New Event</span>
          </button>
        )}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
          <div style={{ width: '40px', height: '40px', border: '3px solid #e2e8f0', borderTopColor: '#4f46e5', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem' }} />
          <p style={{ color: 'var(--text-muted)' }}>Retrieving campus calendar...</p>
        </div>
      ) : events.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '4rem 1.5rem', color: 'var(--text-muted)' }}>
          <CalendarDays size={42} style={{ margin: '0 auto 0.8rem', opacity: 0.5 }} />
          <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)' }}>No Scheduled Events</h3>
          <p style={{ fontSize: '0.88rem' }}>Check back soon or publish an event if you have faculty privileges.</p>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '1.6rem',
          }}
        >
          {events.map((event) => {
            const attending = isAttending(event);
            const totalRsvps = (event.rsvps || []).length;
            const cap = event.max_capacity || 60;
            const spotsRemaining = Math.max(0, cap - totalRsvps);
            const catStyle = CATEGORY_COLORS[event.category] || CATEGORY_COLORS.academic;

            return (
              <div
                key={event._id}
                className="card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
                    <span
                      style={{
                        padding: '0.25rem 0.65rem',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '0.74rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                        background: catStyle.bg,
                        color: catStyle.color,
                        border: `1px solid ${catStyle.border}`,
                      }}
                    >
                      {event.category}
                    </span>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                      {spotsRemaining} seats left
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.2rem', marginBottom: '0.45rem', lineHeight: 1.3 }}>
                    {event.title}
                  </h3>
                  <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', marginBottom: '1.1rem', lineClamp: 2 }}>
                    {event.description}
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                      <Clock size={14} color="var(--primary)" />
                      <span>
                        {new Date(event.start_time).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                      <Building2 size={14} color="var(--primary)" />
                      <span>
                        {event.room_id
                          ? typeof event.room_id === 'object'
                            ? (event.room_id as Room).name
                            : 'Linked Room Reserved'
                          : 'Campus Main Auditorium'}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                      <Users size={14} color="var(--primary)" />
                      <span>
                        {totalRsvps} attendees registered
                      </span>
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: '1.4rem', paddingTop: '1rem', borderTop: '1px solid var(--surface-glass-border)' }}>
                  {attending ? (
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.4rem',
                        padding: '0.6rem',
                        borderRadius: 'var(--radius-sm)',
                        background: 'var(--success-light)',
                        color: 'var(--success-dark)',
                        fontWeight: 700,
                        fontSize: '0.88rem',
                      }}
                    >
                      <CheckCircle2 size={16} />
                      <span>You're Attending!</span>
                    </div>
                  ) : spotsRemaining > 0 ? (
                    <button
                      className="btn btn-primary"
                      style={{ width: '100%' }}
                      onClick={() => handleRSVP(event._id)}
                      disabled={rsvping === event._id}
                    >
                      {rsvping === event._id ? 'Securing Spot...' : 'RSVP for Event'}
                    </button>
                  ) : (
                    <button className="btn btn-secondary" style={{ width: '100%' }} disabled>
                      Event Full
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Event Modal */}
      {showCreate && (
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
          }}
        >
          <div
            className="card"
            style={{
              maxWidth: '540px',
              width: '100%',
              padding: '2.2rem',
              borderRadius: 'var(--radius-lg)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div>
                <h2 style={{ fontSize: '1.35rem', margin: 0 }}>Publish Campus Event</h2>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                  Selecting a room will automatically block conflicts in Room Management
                </p>
              </div>
              <button
                className="btn btn-secondary btn-sm"
                style={{ padding: '0.35rem', borderRadius: '50%', border: 'none' }}
                onClick={() => setShowCreate(false)}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreate} id="create-event-form">
              <div className="form-group">
                <label className="form-label">Event Name</label>
                <input
                  className="form-input"
                  type="text"
                  placeholder="e.g. Annual AI & Robotics Summit"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent((v) => ({ ...v, title: e.target.value }))}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  className="form-select"
                  value={newEvent.category}
                  onChange={(e) => setNewEvent((v) => ({ ...v, category: e.target.value as any }))}
                >
                  <option value="academic">Academic & Tech</option>
                  <option value="workshop">Hands-On Workshop</option>
                  <option value="cultural">Cultural & Arts</option>
                  <option value="sports">Athletics & Sports</option>
                  <option value="club">Student Club Meetup</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Designated Campus Hall</label>
                <select
                  className="form-select"
                  value={newEvent.room_id}
                  onChange={(e) => setNewEvent((v) => ({ ...v, room_id: e.target.value }))}
                  required
                >
                  <option value="">Select Available Room</option>
                  {rooms.map((r) => (
                    <option key={r._id} value={r._id}>
                      {r.name} (Block {r.block}, Cap: {r.capacity})
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.9rem' }}>
                <div className="form-group">
                  <label className="form-label">Start Time</label>
                  <input
                    className="form-input"
                    type="datetime-local"
                    value={newEvent.start_time}
                    onChange={(e) => setNewEvent((v) => ({ ...v, start_time: e.target.value }))}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">End Time</label>
                  <input
                    className="form-input"
                    type="datetime-local"
                    value={newEvent.end_time}
                    onChange={(e) => setNewEvent((v) => ({ ...v, end_time: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  className="form-textarea"
                  placeholder="Outline speakers, requirements, or agenda..."
                  value={newEvent.description}
                  onChange={(e) => setNewEvent((v) => ({ ...v, description: e.target.value }))}
                  style={{ minHeight: '80px' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.8rem', marginTop: '1.5rem' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ flex: 1 }}
                  onClick={() => setShowCreate(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  Publish & Reserve Room
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventsPage;
