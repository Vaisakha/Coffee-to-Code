import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getSocket } from '../utils/socket';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { QRCodeSVG } from 'qrcode.react';
import {
  QrCode,
  ClipboardCheck,
  Users,
  Calendar,
  Clock,
  AlertTriangle,
  Plus,
  X,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { AttendanceSession } from '../types';

interface AttendanceUpdate {
  percentage: number;
  present: number;
  total: number;
}

const AttendancePage: React.FC = () => {
  const { user, isRole } = useAuth();
  const [sessions, setSessions] = useState<AttendanceSession[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeQR, setActiveQR] = useState<{
    session_id: string;
    qr_code: string;
    class_name: string;
    expires_at?: string;
  } | null>(null);
  const [qrInput, setQrInput] = useState<string>('');
  const [checkingIn, setCheckingIn] = useState<boolean>(false);
  const [showNewSession, setShowNewSession] = useState<boolean>(false);
  const [attendanceUpdates, setAttendanceUpdates] = useState<Record<string, AttendanceUpdate>>({});
  const [newSession, setNewSession] = useState({
    course_code: '',
    course_name: '',
    session_date: new Date().toISOString().split('T')[0],
    time_start: '',
    time_end: '',
    room_id: '',
  });

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const { data } = await api.get('/attendance');
        setSessions(data.sessions || []);
      } catch {
        setSessions([]);
      } finally {
        setLoading(false);
      }
    };
    fetchSessions();
  }, []);

  // Real-time attendance updates via WebSocket
  useEffect(() => {
    const socket = getSocket();
    const handleUpdate = ({
      session_id,
      percentage,
      present,
      total,
    }: {
      session_id: string;
      percentage: number;
      present: number;
      total: number;
    }) => {
      setAttendanceUpdates((prev) => ({
        ...prev,
        [session_id]: { percentage, present, total },
      }));
      toast.success(`Check-in recorded! Headcount: ${present}/${total} (${percentage.toFixed(0)}%)`);
    };
    socket.on('attendance_update', handleUpdate);
    return () => {
      socket.off('attendance_update', handleUpdate);
    };
  }, []);

  const createSession = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/attendance/session', newSession);
      setActiveQR({
        session_id: data.session._id,
        qr_code: data.qr_code,
        class_name: newSession.course_name,
        expires_at: data.qr_expires_at,
      });
      setSessions((prev) => [data.session, ...prev]);
      setShowNewSession(false);
      setNewSession({
        course_code: '',
        course_name: '',
        session_date: new Date().toISOString().split('T')[0],
        time_start: '',
        time_end: '',
        room_id: '',
      });
      toast.success('Live attendance session initialized! QR token broadcast ready.');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to start session');
    }
  };

  const handleCheckIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!qrInput.trim()) return;
    setCheckingIn(true);
    try {
      const { data } = await api.post('/attendance/checkin', { qr_code: qrInput.trim() });
      toast.success(`Attendance Verified! Status: Present.`);
      setQrInput('');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Invalid or expired QR session token.');
    } finally {
      setCheckingIn(false);
    }
  };

  const getAttendanceBadge = (pct: number) => {
    if (pct >= 75) return { bg: 'var(--success-light)', color: 'var(--success-dark)' };
    if (pct >= 50) return { bg: 'var(--warning-light)', color: 'var(--warning-dark)' };
    return { bg: 'var(--error-light)', color: 'var(--error-dark)' };
  };

  return (
    <div className="page-content animate-in">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ margin: 0 }}>QR Attendance & Live Headcount</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
            {isRole('faculty', 'admin')
              ? 'Launch cryptographic QR sessions with live WebSocket presence verification'
              : 'Scan or submit active classroom session token to record attendance'}
          </p>
        </div>

        {isRole('faculty', 'admin') && (
          <button
            className="btn btn-primary"
            onClick={() => setShowNewSession(true)}
            id="new-session-btn"
          >
            <Plus size={18} />
            <span>Launch New Session</span>
          </button>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: isRole('student') || activeQR ? '1fr 2fr' : '1fr', gap: '1.8rem', alignItems: 'flex-start' }}>
        {/* Left Column: Student Check-in OR Faculty Active QR */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.4rem' }}>
          {isRole('student') && (
            <div className="card">
              <div className="card-header">
                <div>
                  <div className="card-title">Token Check-In</div>
                  <div className="card-subtitle">Mark lecture presence</div>
                </div>
                <QrCode size={22} color="var(--primary)" />
              </div>

              <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', marginBottom: '1.2rem' }}>
                Enter the session token code displayed on your lecturer's presentation screen.
              </p>

              <form onSubmit={handleCheckIn} id="checkin-form">
                <div className="form-group">
                  <input
                    className="form-input"
                    type="text"
                    placeholder="Paste or type session token..."
                    value={qrInput}
                    onChange={(e) => setQrInput(e.target.value)}
                    required
                    id="qr-input"
                  />
                </div>
                <button
                  className="btn btn-primary"
                  style={{ width: '100%' }}
                  type="submit"
                  disabled={checkingIn}
                  id="checkin-btn"
                >
                  <CheckCircle2 size={18} />
                  <span>{checkingIn ? 'Verifying...' : 'Record My Attendance'}</span>
                </button>
              </form>
            </div>
          )}

          {activeQR && (
            <div className="card" style={{ textAlign: 'center' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div style={{ textAlign: 'left' }}>
                  <div className="card-title">{activeQR.class_name}</div>
                  <div className="card-subtitle">Active Session QR Code</div>
                </div>
                <button
                  className="btn btn-secondary btn-sm"
                  style={{ padding: '0.35rem', borderRadius: '50%', border: 'none' }}
                  onClick={() => setActiveQR(null)}
                >
                  <X size={16} />
                </button>
              </div>

              <div
                style={{
                  background: 'white',
                  padding: '1.2rem',
                  borderRadius: 'var(--radius-md)',
                  display: 'inline-block',
                  border: '1.5px solid var(--surface-glass-border)',
                  boxShadow: 'var(--shadow-sm)',
                  marginBottom: '1rem',
                }}
                id="qr-code-display"
              >
                <QRCodeSVG value={activeQR.qr_code} size={200} fgColor="#0f172a" />
              </div>

              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                Session Key Code:
              </div>
              <code
                style={{
                  background: 'var(--bg-subtle)',
                  padding: '0.4rem 0.8rem',
                  borderRadius: 'var(--radius-xs)',
                  color: 'var(--primary)',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  letterSpacing: '0.05em',
                }}
              >
                {activeQR.qr_code}
              </code>
            </div>
          )}
        </div>

        {/* Right Column: Sessions List */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">
                {isRole('faculty', 'admin') ? 'Managed Course Sessions' : 'Enrolled Course Records'}
              </div>
              <div className="card-subtitle">Live percentage calculation & threshold alerts</div>
            </div>
            <ClipboardCheck size={22} color="var(--primary)" />
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Retrieving records...</span>
            </div>
          ) : sessions.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
              <ClipboardCheck size={36} style={{ margin: '0 auto 0.5rem', opacity: 0.5 }} />
              <p style={{ fontWeight: 600 }}>No attendance sessions found</p>
              <p style={{ fontSize: '0.82rem' }}>
                {isRole('faculty', 'admin')
                  ? 'Click "Launch New Session" above to initialize a QR headcount.'
                  : 'Your course attendance check-ins will display here.'}
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
              {sessions.map((session) => {
                const update = attendanceUpdates[session._id];
                const records = session.records || [];
                const present = records.length;
                const total = Math.max(records.length, 1);
                const pct = update?.percentage ?? (records.length > 0 ? 100 : 0);
                const badge = getAttendanceBadge(pct);

                return (
                  <div
                    key={session._id}
                    style={{
                      padding: '1.2rem',
                      background: 'var(--bg-canvas)',
                      borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--surface-glass-border)',
                      transition: 'var(--transition)',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.6rem' }}>
                      <div>
                        <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '1rem' }}>
                          {session.course_name || (session as any).class_name}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.3rem' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                            <Calendar size={13} />
                            {session.session_date
                              ? new Date(session.session_date).toLocaleDateString('en-US', {
                                  weekday: 'short',
                                  month: 'short',
                                  day: 'numeric',
                                })
                              : 'Today'}
                          </span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                            <Users size={13} />
                            Code: {session.course_code || (session as any).class_id}
                          </span>
                        </div>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        <span
                          style={{
                            padding: '0.3rem 0.75rem',
                            borderRadius: 'var(--radius-full)',
                            background: badge.bg,
                            color: badge.color,
                            fontSize: '0.85rem',
                            fontWeight: 700,
                          }}
                        >
                          {pct.toFixed(0)}% Presence
                        </span>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
                          {update?.present ?? present} students checked in
                        </div>
                      </div>
                    </div>

                    {isRole('faculty', 'admin') && session.qr_token && (
                      <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() =>
                            setActiveQR({
                              session_id: session._id,
                              qr_code: session.qr_token,
                              class_name: session.course_name || (session as any).class_name,
                            })
                          }
                          id={`show-qr-${session._id}`}
                        >
                          <QrCode size={14} />
                          <span>Show QR Code</span>
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* New Session Modal */}
      {showNewSession && (
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
              maxWidth: '500px',
              width: '100%',
              padding: '2.2rem',
              borderRadius: 'var(--radius-lg)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div>
                <h2 style={{ fontSize: '1.35rem', margin: 0 }}>Start Attendance Session</h2>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                  A cryptographic QR code will be generated for student check-in
                </p>
              </div>
              <button
                className="btn btn-secondary btn-sm"
                style={{ padding: '0.35rem', borderRadius: '50%', border: 'none' }}
                onClick={() => setShowNewSession(false)}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={createSession} id="new-session-form">
              <div className="form-group">
                <label className="form-label">Course Title</label>
                <input
                  className="form-input"
                  type="text"
                  placeholder="e.g. Distributed Database Architecture"
                  value={newSession.course_name}
                  onChange={(e) => setNewSession((s) => ({ ...s, course_name: e.target.value }))}
                  required
                  id="session-class-name"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Course Code / Section</label>
                <input
                  className="form-input"
                  type="text"
                  placeholder="e.g. CS402-A"
                  value={newSession.course_code}
                  onChange={(e) => setNewSession((s) => ({ ...s, course_code: e.target.value }))}
                  required
                  id="session-class-id"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Session Date</label>
                <input
                  className="form-input"
                  type="date"
                  value={newSession.session_date}
                  onChange={(e) => setNewSession((s) => ({ ...s, session_date: e.target.value }))}
                  required
                  id="session-date"
                />
              </div>

              <div style={{ display: 'flex', gap: '0.8rem', marginTop: '1.5rem' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ flex: 1 }}
                  onClick={() => setShowNewSession(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                  id="create-session-btn"
                >
                  Generate QR & Launch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendancePage;
