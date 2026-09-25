import React from 'react';
import { useNotifications } from '../context/NotificationContext';
import { formatDistanceToNow } from 'date-fns';
import {
  Bell,
  X,
  CheckCheck,
  AlertTriangle,
  Building2,
  ClipboardCheck,
  CalendarDays,
  Search,
  MessageSquareWarning,
  Info,
} from 'lucide-react';
import { NotificationType } from '../types';

const getNotificationIcon = (type: NotificationType) => {
  switch (type) {
    case 'emergency_sos':
      return <AlertTriangle size={16} color="var(--emergency)" />;
    case 'booking_confirmed':
    case 'booking_conflict':
      return <Building2 size={16} color="var(--primary)" />;
    case 'attendance_alert':
      return <ClipboardCheck size={16} color="var(--accent-warm)" />;
    case 'event_invite':
      return <CalendarDays size={16} color="#db2777" />;
    case 'lost_found_match':
      return <Search size={16} color="var(--info)" />;
    case 'complaint_update':
      return <MessageSquareWarning size={16} color="var(--warning)" />;
    default:
      return <Info size={16} color="var(--primary)" />;
  }
};

const NotificationPanel: React.FC = () => {
  const { notifications, unreadCount, panelOpen, setPanelOpen, markRead, markAllRead } = useNotifications();

  return (
    <>
      {/* Backdrop */}
      {panelOpen && (
        <div
          onClick={() => setPanelOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.4)',
            backdropFilter: 'blur(4px)',
            zIndex: 1040,
            transition: 'opacity 0.2s ease',
          }}
        />
      )}

      {/* Slide-out Drawer */}
      <aside
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: '380px',
          maxWidth: '90vw',
          background: 'white',
          boxShadow: 'var(--shadow-hover)',
          borderLeft: '1px solid var(--surface-glass-border)',
          zIndex: 1050,
          transform: panelOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          display: 'flex',
          flexDirection: 'column',
        }}
        id="notification-panel"
      >
        {/* Drawer Header */}
        <div
          style={{
            padding: '1.2rem 1.4rem',
            borderBottom: '1px solid var(--surface-glass-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Bell size={20} color="var(--primary)" />
            <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700 }}>Notification Feed</h3>
            {unreadCount > 0 && (
              <span
                style={{
                  background: 'var(--primary-light)',
                  color: 'var(--primary)',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  padding: '0.15rem 0.5rem',
                  borderRadius: 'var(--radius-full)',
                }}
              >
                {unreadCount} new
              </span>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {unreadCount > 0 && (
              <button
                onClick={() => markAllRead()}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--primary)',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                }}
                title="Mark all as read"
              >
                <CheckCheck size={14} />
                <span>Read all</span>
              </button>
            )}
            <button
              onClick={() => setPanelOpen(false)}
              className="btn btn-secondary btn-sm"
              style={{ padding: '0.3rem', border: 'none', borderRadius: '50%' }}
              aria-label="Close notifications"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Notification List */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
          {notifications.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 1.5rem', color: 'var(--text-muted)' }}>
              <div
                style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '50%',
                  background: 'var(--bg-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem',
                  color: 'var(--text-light)',
                }}
              >
                <Bell size={24} />
              </div>
              <p style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>You're all caught up!</p>
              <p style={{ fontSize: '0.8rem', marginTop: '0.2rem' }}>No new notifications right now.</p>
            </div>
          ) : (
            notifications.map((n, i) => {
              const isUnread = !n.is_read;
              return (
                <div
                  key={n._id || i}
                  onClick={() => markRead([String(n._id)])}
                  style={{
                    padding: '0.9rem 1rem',
                    borderRadius: 'var(--radius-sm)',
                    marginBottom: '0.65rem',
                    cursor: 'pointer',
                    transition: 'var(--transition)',
                    border: '1px solid',
                    borderColor: isUnread ? 'var(--primary-glow)' : 'var(--surface-glass-border)',
                    background: isUnread ? 'rgba(238, 242, 255, 0.45)' : 'white',
                    boxShadow: isUnread ? 'var(--shadow-xs)' : 'none',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
                    <div style={{ marginTop: '2px' }}>{getNotificationIcon(n.type)}</div>
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          fontSize: '0.86rem',
                          fontWeight: isUnread ? 700 : 600,
                          color: 'var(--text-primary)',
                          lineHeight: 1.3,
                        }}
                      >
                        {n.title}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                        {n.message}
                      </div>
                      <div
                        style={{
                          fontSize: '0.72rem',
                          color: 'var(--text-light)',
                          marginTop: '0.45rem',
                        }}
                      >
                        {n.createdAt ? formatDistanceToNow(new Date(n.createdAt), { addSuffix: true }) : 'Just now'}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </aside>
    </>
  );
};

export default NotificationPanel;
