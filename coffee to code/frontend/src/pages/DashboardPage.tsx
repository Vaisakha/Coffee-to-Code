import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import api from '../utils/api';
import { formatDistanceToNow } from 'date-fns';
import {
  Building2,
  CalendarDays,
  Search,
  MessageSquareWarning,
  Compass,
  Bell,
  ClipboardCheck,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
} from 'lucide-react';
import { Room, CampusEvent, Complaint, LostFoundItem } from '../types';

interface StatItem {
  icon: React.ElementType;
  value: number;
  label: string;
  colorClass: 'primary' | 'success' | 'warning' | 'error' | 'info' | 'mauve' | 'latte';
  trend?: string;
}

const StatCard: React.FC<StatItem> = ({ icon: Icon, value, label, trend, colorClass }) => (
  <div className="stat-card animate-in">
    <div className={`stat-icon ${colorClass}`}>
      <Icon size={26} />
    </div>
    <div className="stat-info">
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
      {trend && (
        <div className="stat-trend">
          <TrendingUp size={12} />
          <span>{trend}</span>
        </div>
      )}
    </div>
  </div>
);

const DashboardPage: React.FC = () => {
  const { user, isRole } = useAuth();
  const { notifications } = useNotifications();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [events, setEvents] = useState<CampusEvent[]>([]);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [lostItems, setLostItems] = useState<LostFoundItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [roomsRes, eventsRes, complaintsRes, lostRes] = await Promise.allSettled([
          api.get('/rooms'),
          api.get('/events'),
          api.get('/complaints'),
          api.get('/lostfound'),
        ]);
        if (roomsRes.status === 'fulfilled') setRooms(roomsRes.value.data.rooms || []);
        if (eventsRes.status === 'fulfilled') setEvents(eventsRes.value.data.events || []);
        if (complaintsRes.status === 'fulfilled') setComplaints(complaintsRes.value.data.complaints || []);
        if (lostRes.status === 'fulfilled') setLostItems(lostRes.value.data.items || []);
      } catch (err) {
        // Fallback for demo
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const availableRooms = rooms.filter(r => r.current_status === 'available').length;
  const upcomingEvents = events.filter(e => e.status === 'upcoming').length;
  const openComplaints = complaints.filter(c => c.status === 'open').length;
  const activeLostItems = lostItems.filter(i => i.status === 'active').length;
  const recentNotifs = notifications.slice(0, 5);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const roleStats: StatItem[] = isRole('student')
    ? [
        { icon: Building2, value: availableRooms, label: 'Rooms Available', colorClass: 'success', trend: 'Live updates' },
        { icon: CalendarDays, value: upcomingEvents, label: 'Upcoming Events', colorClass: 'primary' },
        { icon: Search, value: activeLostItems, label: 'Active Lost Items', colorClass: 'warning' },
        { icon: MessageSquareWarning, value: openComplaints, label: 'Pending Complaints', colorClass: 'error' },
      ]
    : isRole('faculty')
    ? [
        { icon: Building2, value: availableRooms, label: 'Available Rooms', colorClass: 'success' },
        { icon: ClipboardCheck, value: 0, label: 'Sessions Today', colorClass: 'primary' },
        { icon: CalendarDays, value: upcomingEvents, label: 'Campus Events', colorClass: 'mauve' },
        { icon: MessageSquareWarning, value: openComplaints, label: 'Tickets Assigned', colorClass: 'warning' },
      ]
    : [
        { icon: Building2, value: rooms.length, label: 'Total Rooms', colorClass: 'primary' },
        { icon: CheckCircle2, value: availableRooms, label: 'Available Now', colorClass: 'success' },
        { icon: CalendarDays, value: upcomingEvents, label: 'Upcoming Events', colorClass: 'mauve' },
        { icon: MessageSquareWarning, value: openComplaints, label: 'Open Incidents', colorClass: 'error' },
      ];

  const quickModules = [
    { path: '/rooms', icon: Building2, label: 'Book a Room', desc: 'Real-time schedule & amenities', color: '#4f46e5' },
    { path: '/attendance', icon: ClipboardCheck, label: 'QR Attendance', desc: 'Instant code scanner & live records', color: '#10b981' },
    { path: '/events', icon: CalendarDays, label: 'Campus Events', desc: 'Browse cultural & academic activities', color: '#db2777' },
    { path: '/lostfound', icon: Search, label: 'Lost & Found', desc: 'AI cross-matching item engine', color: '#d97706' },
    { path: '/navigation', icon: Compass, label: 'Wayfinding Map', desc: 'Multi-block interactive navigation', color: '#0284c7' },
    { path: '/complaints', icon: MessageSquareWarning, label: 'Support & Tickets', desc: 'Auto-routed maintenance desk', color: '#ef4444' },
  ];

  return (
    <div className="page-content animate-in">
      {/* Welcome Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
            <span style={{ fontSize: '1.75rem' }}>👋</span>
            <h1 style={{ margin: 0 }}>
              {greeting()}, {user?.name?.split(' ')[0]}!
            </h1>
          </div>
          <p style={{ color: 'var(--text-secondary)' }}>
            Welcome to the Smart Campus Operations Grid. Everything is synchronized in real-time.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Link to="/navigation" className="btn btn-secondary">
            <Compass size={18} />
            <span>Campus Map</span>
          </Link>
          <Link to="/rooms" className="btn btn-primary">
            <Building2 size={18} />
            <span>Find Room</span>
          </Link>
        </div>
      </div>

      {/* Metric Stats Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
          gap: '1.2rem',
          marginBottom: '2rem',
        }}
      >
        {roleStats.map((stat, i) => (
          <StatCard key={i} {...stat} />
        ))}
      </div>

      {/* Main Grid: Modules & Activity */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '1.6rem',
        }}
      >
        {/* Quick Access Tiles */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Quick Access Services</div>
              <div className="card-subtitle">One-click jump into campus services</div>
            </div>
            <Sparkles size={20} color="var(--primary)" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.85rem' }}>
            {quickModules.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '1.1rem',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--bg-canvas)',
                    border: '1.5px solid var(--surface-glass-border)',
                    textDecoration: 'none',
                    transition: 'var(--transition)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.borderColor = item.color;
                    e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'none';
                    e.currentTarget.style.borderColor = 'var(--surface-glass-border)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: 'var(--radius-xs)',
                      background: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: item.color,
                      marginBottom: '0.75rem',
                      boxShadow: 'var(--shadow-xs)',
                    }}
                  >
                    <Icon size={20} />
                  </div>
                  <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.92rem' }}>
                    {item.label}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                    {item.desc}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Live Notifications Feed */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Campus Live Feed</div>
              <div className="card-subtitle">Real-time alerts & broadcasts</div>
            </div>
            <Link
              to="/notifications"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
                fontSize: '0.82rem',
                fontWeight: 600,
                color: 'var(--primary)',
              }}
            >
              <span>View all</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          {recentNotifs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: 'var(--text-muted)' }}>
              <Bell size={32} style={{ margin: '0 auto 0.5rem', opacity: 0.5 }} />
              <p style={{ fontSize: '0.9rem' }}>No recent notifications</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {recentNotifs.map((n, i) => (
                <div
                  key={n._id || i}
                  style={{
                    padding: '0.85rem 1rem',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--bg-canvas)',
                    borderLeft: `4px solid ${n.type === 'emergency_sos' ? 'var(--emergency)' : 'var(--primary)'}`,
                    border: '1px solid var(--surface-glass-border)',
                    borderLeftWidth: '4px',
                  }}
                >
                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {n.title}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                    {n.message}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.72rem', color: 'var(--text-light)', marginTop: '0.4rem' }}>
                    <Clock size={12} />
                    <span>{n.createdAt ? formatDistanceToNow(new Date(n.createdAt), { addSuffix: true }) : 'Just now'}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Room Availability Live Status */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Live Room Status</div>
              <div className="card-subtitle">Real-time occupancy across blocks</div>
            </div>
            <Link to="/rooms" className="btn btn-secondary btn-sm">
              <span>All Rooms</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Syncing rooms...</span>
            </div>
          ) : rooms.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: 'var(--text-muted)' }}>
              <Building2 size={32} style={{ margin: '0 auto 0.5rem', opacity: 0.5 }} />
              <p style={{ fontSize: '0.9rem' }}>No rooms data available</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
              {rooms.slice(0, 5).map((room) => (
                <div
                  key={room._id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem 0.9rem',
                    background: 'var(--bg-canvas)',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--surface-glass-border)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background:
                          room.current_status === 'available'
                            ? 'var(--success)'
                            : room.current_status === 'occupied'
                            ? 'var(--error)'
                            : room.current_status === 'booked'
                            ? 'var(--warning)'
                            : 'var(--text-light)',
                      }}
                    />
                    <div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {room.name}
                      </div>
                      <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                        Block {room.block} · Floor {room.floor} · Cap: {room.capacity}
                      </div>
                    </div>
                  </div>
                  <span className={`badge badge-${room.current_status}`}>{room.current_status}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming Campus Events */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Upcoming Events</div>
              <div className="card-subtitle">RSVP and join student activities</div>
            </div>
            <Link to="/events" className="btn btn-secondary btn-sm">
              <span>All Events</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          {events.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: 'var(--text-muted)' }}>
              <CalendarDays size={32} style={{ margin: '0 auto 0.5rem', opacity: 0.5 }} />
              <p style={{ fontSize: '0.9rem' }}>No upcoming events scheduled</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {events.slice(0, 3).map((event) => (
                <div
                  key={event._id}
                  style={{
                    padding: '0.85rem 1rem',
                    background: 'var(--bg-canvas)',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--surface-glass-border)',
                  }}
                >
                  <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.92rem' }}>
                    {event.title}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginTop: '0.35rem', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                    <span>
                      📅{' '}
                      {new Date(event.start_time).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                    <span>👥 {(event.rsvps || []).length} registered</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
