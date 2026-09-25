import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { GraduationCap, Bell, LogOut, Menu, User as UserIcon, ShieldAlert } from 'lucide-react';

interface NavbarProps {
  onMenuToggle: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onMenuToggle }) => {
  const { user, logout } = useAuth();
  const { unreadCount, setPanelOpen } = useNotifications();
  const navigate = useNavigate();
  const [userMenuOpen, setUserMenuOpen] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="navbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {/* Mobile menu toggle */}
        <button
          onClick={onMenuToggle}
          className="btn btn-secondary btn-sm"
          style={{ display: 'none', padding: '0.4rem', border: 'none' }}
          id="mobile-nav-toggle"
          aria-label="Toggle Navigation"
        >
          <Menu size={20} />
        </button>

        <Link to="/dashboard" className="navbar-brand">
          <div className="navbar-logo-badge">
            <GraduationCap size={22} />
          </div>
          <div className="navbar-title">
            Smart<span>Campus</span>
          </div>
        </Link>
      </div>

      <div className="navbar-right">
        {/* Live System Backbone Indicator */}
        <div className="live-indicator">
          <span className="pulse-dot" />
          <span>Campus Grid Live</span>
        </div>

        {/* User Role Badge */}
        {user && (
          <span className={`role-badge ${user.role}`}>
            {user.role}
          </span>
        )}

        {/* Notification Bell */}
        <button
          className="notif-bell"
          onClick={() => setPanelOpen(p => !p)}
          aria-label="Open Notifications"
          id="notif-bell-btn"
          title="Campus Notifications"
        >
          <Bell size={20} />
          {unreadCount > 0 && (
            <span className="notif-count">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </button>

        {/* User Avatar & Dropdown */}
        {user && (
          <div style={{ position: 'relative' }} ref={menuRef}>
            <div
              className="user-avatar-trigger"
              onClick={() => setUserMenuOpen(p => !p)}
              title={`${user.name} (${user.email})`}
              id="user-avatar-btn"
            >
              <div className="user-avatar-bubble">
                {user.name?.charAt(0).toUpperCase() || <UserIcon size={16} />}
              </div>
              <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)', paddingRight: '0.4rem' }}>
                {user.name?.split(' ')[0]}
              </span>
            </div>

            {userMenuOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: '115%',
                  right: 0,
                  background: 'white',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.6rem',
                  boxShadow: 'var(--shadow-hover)',
                  minWidth: '220px',
                  border: '1px solid var(--surface-glass-border)',
                  zIndex: 2000,
                  animation: 'fadeIn 0.2s ease',
                }}
              >
                <div style={{ padding: '0.75rem 0.85rem', borderBottom: '1px solid var(--surface-glass-border)', marginBottom: '0.4rem' }}>
                  <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.92rem' }}>{user.name}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', wordBreak: 'break-all' }}>{user.email}</div>
                  {user.department && (
                    <div style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 600, marginTop: '0.2rem' }}>
                      {user.department}
                    </div>
                  )}
                </div>

                {user.role === 'admin' && (
                  <Link
                    to="/emergency"
                    onClick={() => setUserMenuOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.6rem',
                      width: '100%',
                      padding: '0.6rem 0.85rem',
                      color: 'var(--emergency)',
                      borderRadius: 'var(--radius-xs)',
                      fontSize: '0.86rem',
                      fontWeight: 600,
                    }}
                  >
                    <ShieldAlert size={16} />
                    <span>Emergency Console</span>
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    width: '100%',
                    padding: '0.6rem 0.85rem',
                    border: 'none',
                    background: 'none',
                    textAlign: 'left',
                    cursor: 'pointer',
                    color: 'var(--error)',
                    borderRadius: 'var(--radius-xs)',
                    fontSize: '0.86rem',
                    fontWeight: 600,
                    fontFamily: 'var(--font-sans)',
                    transition: 'var(--transition)',
                  }}
                  id="logout-btn"
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--error-light)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
                >
                  <LogOut size={16} />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
