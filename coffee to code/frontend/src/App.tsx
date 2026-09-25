import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';

import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import NotificationPanel from './components/NotificationPanel';
import EmergencyBanner from './components/EmergencyBanner';
import SosButton from './components/SosButton';
import ProtectedRoute from './components/ProtectedRoute';

import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import RoomsPage from './pages/RoomsPage';
import AttendancePage from './pages/AttendancePage';
import EventsPage from './pages/EventsPage';
import LostFoundPage from './pages/LostFoundPage';
import ComplaintsPage from './pages/ComplaintsPage';
import NavigationPage from './pages/NavigationPage';
import NotificationsPage from './pages/NotificationsPage';
import EmergencyPage from './pages/EmergencyPage';

const AppLayout: React.FC = () => {
  const { user } = useAuth();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState<boolean>(false);

  return (
    <div className="app-wrapper">
      {/* Toast feedback system */}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            fontFamily: 'var(--font-sans)',
            borderRadius: 'var(--radius-sm)',
            background: 'var(--navy-900)',
            color: 'white',
            fontSize: '0.88rem',
            boxShadow: 'var(--shadow-hover)',
            padding: '12px 18px',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          },
          success: {
            iconTheme: {
              primary: 'var(--success)',
              secondary: 'white',
            },
          },
          error: {
            iconTheme: {
              primary: 'var(--emergency)',
              secondary: 'white',
            },
          },
        }}
      />

      {/* Global Emergency Banner (visible when active SOS exists) */}
      <EmergencyBanner />

      {/* Top Navbar */}
      {user && <Navbar onMenuToggle={() => setMobileSidebarOpen(prev => !prev)} />}

      <div className="main-layout" style={{ paddingTop: user ? 'var(--nav-height)' : '0' }}>
        {/* Navigation Sidebar */}
        {user && (
          <Sidebar
            mobileOpen={mobileSidebarOpen}
            onClose={() => setMobileSidebarOpen(false)}
          />
        )}

        {/* Sliding Notification Drawer */}
        {user && <NotificationPanel />}

        {/* Application Page Routing */}
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/rooms"
            element={
              <ProtectedRoute>
                <RoomsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/attendance"
            element={
              <ProtectedRoute>
                <AttendancePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/events"
            element={
              <ProtectedRoute>
                <EventsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/lostfound"
            element={
              <ProtectedRoute>
                <LostFoundPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/complaints"
            element={
              <ProtectedRoute>
                <ComplaintsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/navigation"
            element={
              <ProtectedRoute>
                <NavigationPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <NotificationsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/emergency"
            element={
              <ProtectedRoute roles={['admin']}>
                <EmergencyPage />
              </ProtectedRoute>
            }
          />

          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>

        {/* Floating Emergency SOS Button */}
        {user && <SosButton />}
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <NotificationProvider>
          <AppLayout />
        </NotificationProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
