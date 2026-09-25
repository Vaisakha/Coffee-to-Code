import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import {
  LayoutDashboard,
  Building2,
  ClipboardCheck,
  CalendarDays,
  Search,
  MessageSquareWarning,
  Compass,
  Bell,
  ShieldAlert,
} from 'lucide-react';

interface NavItem {
  path: string;
  icon: React.ElementType;
  label: string;
  roles?: UserRole[];
}

const NAV_ITEMS: NavItem[] = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/rooms', icon: Building2, label: 'Rooms & Booking', roles: ['student', 'faculty', 'admin'] },
  { path: '/attendance', icon: ClipboardCheck, label: 'QR Attendance', roles: ['student', 'faculty', 'admin'] },
  { path: '/events', icon: CalendarDays, label: 'Campus Events', roles: ['student', 'faculty', 'admin'] },
  { path: '/lostfound', icon: Search, label: 'Lost & Found', roles: ['student', 'faculty', 'admin'] },
  { path: '/complaints', icon: MessageSquareWarning, label: 'Support & Tickets', roles: ['student', 'faculty', 'admin'] },
  { path: '/navigation', icon: Compass, label: 'Interactive Wayfinding', roles: ['student', 'faculty', 'admin'] },
  { path: '/notifications', icon: Bell, label: 'Notification Feed', roles: ['student', 'faculty', 'admin'] },
  { path: '/emergency', icon: ShieldAlert, label: 'Emergency Console', roles: ['admin'] },
];

interface SidebarProps {
  mobileOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, onClose }) => {
  const location = useLocation();
  const { user, isRole } = useAuth();

  const filtered = NAV_ITEMS.filter(item => !item.roles || isRole(...item.roles));

  return (
    <nav className={`sidebar ${mobileOpen ? 'mobile-open' : ''}`}>
      <div className="sidebar-section-title">Navigation Hub</div>
      <ul className="sidebar-nav">
        {filtered.map(item => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <li key={item.path} className="sidebar-nav-item">
              <Link
                to={item.path}
                className={`sidebar-nav-link ${isActive ? 'active' : ''}`}
                onClick={onClose}
              >
                <div className="sidebar-icon-wrap">
                  <Icon size={18} />
                </div>
                <span>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>

      {user && (
        <div className="sidebar-footer">
          <div style={{ fontSize: '0.74rem', color: 'var(--text-light)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Logged in as
          </div>
          <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
            {user.name}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            {user.department || user.email}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Sidebar;
