import React, { useState } from 'react';
import { useNotifications } from '../context/NotificationContext';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';
import {
  Bell,
  Megaphone,
  CheckCheck,
  Search,
  Building2,
  CalendarDays,
  ClipboardCheck,
  ShieldAlert,
  MessageSquareWarning,
  X,
  Plus,
  Clock,
  Radio,
} from 'lucide-react';
import { CampusNotification, NotificationType } from '../types';

const NotificationsPage: React.FC = () => {
  const { notifications, unreadCount, markRead, markAllRead } = useNotifications();
  const { user, isRole } = useAuth();

  const [activeTab, setActiveTab] = useState<string>('all');
  const [filterUnread, setFilterUnread] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [showBroadcastModal, setShowBroadcastModal] = useState<boolean>(false);
  const [broadcastForm, setBroadcastForm] = useState({
    title: '',
    message: '',
    type: 'general_announcement' as NotificationType,
    target_role: 'all',
    target_block: '',
    priority: 'normal',
  });
  const [broadcasting, setBroadcasting] = useState<boolean>(false);

  const filteredNotifications = notifications.filter((n) => {
    const isUnread = !n.is_read;
    const matchUnread = !filterUnread || isUnread;
    const matchSearch =
      !searchQuery ||
      n.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.message?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchUnread && matchSearch;
  });

  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastForm.title.trim() || !broadcastForm.message.trim()) {
      toast.error('Please complete title and broadcast content');
      return;
    }

    setBroadcasting(true);
    try {
      await api.post('/notifications/broadcast', broadcastForm);
      toast.success('Campus bulletin transmitted over WebSocket grid!');
      setShowBroadcastModal(false);
      setBroadcastForm({
        title: '',
        message: '',
        type: 'general_announcement',
        target_role: 'all',
        target_block: '',
        priority: 'normal',
      });
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to dispatch broadcast');
    } finally {
      setBroadcasting(false);
    }
  };

  return (
    <div className="page-content animate-in" style={{ maxWidth: '1050px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Bell size={28} color="var(--primary)" />
            <span>Campus Notification Center</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
            Central notification backbone for automated academic alerts and emergency bulletins
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
          {unreadCount > 0 && (
            <button
              onClick={() => markAllRead()}
              className="btn btn-secondary"
            >
              <CheckCheck size={16} />
              <span>Mark All Read ({unreadCount})</span>
            </button>
          )}

          {isRole('admin', 'faculty') && (
            <button
              onClick={() => setShowBroadcastModal(true)}
              className="btn btn-primary"
            >
              <Megaphone size={16} />
              <span>Broadcast Bulletin</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter / Search Toolbar */}
      <div
        className="card"
        style={{
          padding: '1rem 1.4rem',
          marginBottom: '1.8rem',
          display: 'flex',
          gap: '1rem',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, minWidth: '220px' }}>
          <Search size={16} color="var(--text-light)" />
          <input
            className="form-input"
            type="text"
            placeholder="Search notifications..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ padding: '0.45rem 0.8rem', fontSize: '0.85rem' }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <button
            onClick={() => setFilterUnread((p) => !p)}
            className={`btn btn-sm ${filterUnread ? 'btn-primary' : 'btn-secondary'}`}
          >
            {filterUnread ? 'Showing Unread Only' : 'Show All'}
          </button>
        </div>
      </div>

      {/* Notification Stream */}
      {filteredNotifications.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '4rem 1.5rem', color: 'var(--text-muted)' }}>
          <Bell size={42} style={{ margin: '0 auto 0.8rem', opacity: 0.5 }} />
          <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)' }}>No Notifications Found</h3>
          <p style={{ fontSize: '0.88rem' }}>You're completely up to date with campus activity.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {filteredNotifications.map((n) => {
            const isUnread = !n.is_read;
            const isEmergency = n.type === 'emergency_sos' || n.priority === 'critical';

            return (
              <div
                key={n._id}
                onClick={() => markRead([String(n._id)])}
                className="card"
                style={{
                  padding: '1.2rem',
                  cursor: 'pointer',
                  borderLeft: `4px solid ${
                    isEmergency
                      ? 'var(--emergency)'
                      : isUnread
                      ? 'var(--primary)'
                      : 'var(--surface-glass-border)'
                  }`,
                  background: isUnread ? 'rgba(238, 242, 255, 0.45)' : 'white',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.9rem' }}>
                    <div
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: 'var(--radius-xs)',
                        background: isEmergency ? 'var(--error-light)' : 'var(--primary-light)',
                        color: isEmergency ? 'var(--emergency)' : 'var(--primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      {isEmergency ? <ShieldAlert size={20} /> : <Bell size={20} />}
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', flexWrap: 'wrap', marginBottom: '0.25rem' }}>
                        <h3 style={{ fontSize: '1rem', margin: 0, fontWeight: isUnread ? 700 : 600 }}>
                          {n.title}
                        </h3>
                        {isUnread && (
                          <span
                            style={{
                              background: 'var(--primary)',
                              color: 'white',
                              fontSize: '0.68rem',
                              fontWeight: 700,
                              padding: '0.1rem 0.45rem',
                              borderRadius: 'var(--radius-full)',
                            }}
                          >
                            New
                          </span>
                        )}
                      </div>

                      <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                        {n.message}
                      </p>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', fontSize: '0.76rem', color: 'var(--text-light)' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <Clock size={12} />
                          {n.createdAt ? formatDistanceToNow(new Date(n.createdAt), { addSuffix: true }) : 'Recent'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Broadcast Modal */}
      {showBroadcastModal && (
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
              maxWidth: '520px',
              width: '100%',
              padding: '2.2rem',
              borderRadius: 'var(--radius-lg)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div>
                <h2 style={{ fontSize: '1.35rem', margin: 0 }}>Broadcast Campus Bulletin</h2>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                  Sends instant real-time alerts to targeted students and staff
                </p>
              </div>
              <button
                className="btn btn-secondary btn-sm"
                style={{ padding: '0.35rem', borderRadius: '50%', border: 'none' }}
                onClick={() => setShowBroadcastModal(false)}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleBroadcast} id="broadcast-form">
              <div className="form-group">
                <label className="form-label">Bulletin Headline</label>
                <input
                  className="form-input"
                  type="text"
                  placeholder="e.g. Campus Library Extended Hours Notice"
                  value={broadcastForm.title}
                  onChange={(e) => setBroadcastForm((b) => ({ ...b, title: e.target.value }))}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.9rem' }}>
                <div className="form-group">
                  <label className="form-label">Target Audience</label>
                  <select
                    className="form-select"
                    value={broadcastForm.target_role}
                    onChange={(e) => setBroadcastForm((b) => ({ ...b, target_role: e.target.value }))}
                  >
                    <option value="all">Everyone on Campus</option>
                    <option value="student">Students Only</option>
                    <option value="faculty">Faculty & Staff Only</option>
                    <option value="admin">Administrators</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Target Block (Optional)</label>
                  <select
                    className="form-select"
                    value={broadcastForm.target_block}
                    onChange={(e) => setBroadcastForm((b) => ({ ...b, target_block: e.target.value }))}
                  >
                    <option value="">All Blocks</option>
                    {['A', 'B', 'C', 'D', 'Admin'].map((b) => (
                      <option key={b} value={b}>
                        Block {b}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Message Details</label>
                <textarea
                  className="form-textarea"
                  placeholder="Type clear instructions, schedule adjustments, or news..."
                  value={broadcastForm.message}
                  onChange={(e) => setBroadcastForm((b) => ({ ...b, message: e.target.value }))}
                  style={{ minHeight: '90px' }}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '0.8rem', marginTop: '1.5rem' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ flex: 1 }}
                  onClick={() => setShowBroadcastModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                  disabled={broadcasting}
                >
                  <Radio size={16} />
                  <span>{broadcasting ? 'Broadcasting...' : 'Transmit Bulletin'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
