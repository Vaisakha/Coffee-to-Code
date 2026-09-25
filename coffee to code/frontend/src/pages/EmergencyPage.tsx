import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getSocket } from '../utils/socket';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';
import {
  ShieldAlert,
  Radio,
  MapPin,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Phone,
  Activity,
  ShieldCheck,
  Flame,
  HeartPulse,
  Lock,
  HelpCircle,
} from 'lucide-react';
import { EmergencySOS } from '../types';

const PROTOCOLS: Record<string, { title: string; icon: React.ElementType; steps: string[] }> = {
  medical: {
    title: 'Medical Crisis Protocol',
    icon: HeartPulse,
    steps: [
      'Dispatch on-duty paramedic squad from Central Health Clinic',
      'Deploy portable AED defibrillator to caller coordinate',
      'Override elevator priority for medical stretcher access',
    ],
  },
  fire: {
    title: 'Fire Hazard & Smoke Protocol',
    icon: Flame,
    steps: [
      'Trigger localized floor acoustic fire alarms',
      'Seal HVAC damper valves to restrict oxygen circulation',
      'Dispatch campus fire marshal and ping City Emergency Services',
    ],
  },
  security: {
    title: 'Security Threat Protocol',
    icon: Lock,
    steps: [
      'Dispatch rapid-response campus security patrol unit',
      'Isolate block magnetic access doors if lockdown required',
      'Focus high-resolution corridor CCTV cameras on target block',
    ],
  },
  other: {
    title: 'General Urgent Response',
    icon: HelpCircle,
    steps: [
      'Establish audio contact with caller phone',
      'Dispatch nearest roving floor warden',
      'Maintain continuous channel log with dispatch console',
    ],
  },
};

const EmergencyPage: React.FC = () => {
  const { user } = useAuth();
  const [activeEmergencies, setActiveEmergencies] = useState<EmergencySOS[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [resolvingId, setResolvingId] = useState<string | null>(null);

  const fetchEmergencies = async () => {
    try {
      const res = await api.get('/emergency/active');
      setActiveEmergencies(res.data.emergencies || []);
    } catch (err) {
      console.error('Failed to query active emergencies:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmergencies();

    const socket = getSocket();
    if (socket) {
      const handleNewAlert = (data: any) => {
        toast.error(`PRIORITY SOS ALERT: Block ${data.block || 'Campus'}!`, { duration: 7000 });
        fetchEmergencies();
      };

      const handleResolved = () => {
        fetchEmergencies();
      };

      socket.on('emergency_alert', handleNewAlert);
      socket.on('emergency_resolved', handleResolved);

      return () => {
        socket.off('emergency_alert', handleNewAlert);
        socket.off('emergency_resolved', handleResolved);
      };
    }
  }, []);

  const handleResolve = async (id: string) => {
    setResolvingId(id);
    try {
      await api.put(`/emergency/${id}/resolve`);
      toast.success('Incident closed and marked resolved.');
      fetchEmergencies();
    } catch {
      toast.error('Failed to resolve emergency incident');
    } finally {
      setResolvingId(null);
    }
  };

  const handleTriggerDrill = async () => {
    if (!window.confirm('Broadcast simulated campus emergency drill to test WebSocket response?'))
      return;
    try {
      await api.post('/emergency/sos', {
        type: 'other',
        block: 'A',
        description: 'SIMULATED DRILL: Emergency Grid Readiness Verification',
        lat: 12.9716,
        lng: 77.5946,
      });
      toast.success('Simulation emergency broadcast deployed!');
      fetchEmergencies();
    } catch {
      toast.error('Simulation broadcast failed');
    }
  };

  return (
    <div className="page-content animate-in" style={{ maxWidth: '1250px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ margin: 0, color: 'var(--emergency-dark)', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <ShieldAlert size={30} />
            <span>Emergency & SOS Dispatch Console</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
            Real-time security response, geolocation tracking, and crisis protocols
          </p>
        </div>

        <button
          onClick={handleTriggerDrill}
          className="btn btn-secondary"
          style={{ border: '1.5px solid var(--emergency)', color: 'var(--emergency)' }}
        >
          <Radio size={16} />
          <span>Launch Simulation Drill</span>
        </button>
      </div>

      {/* Main Grid: Active Incidents vs. Response Protocols */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.8fr) minmax(320px, 1fr)', gap: '1.6rem', alignItems: 'start' }}>
        {/* Active Emergency Feed */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Live Dispatch Incidents</div>
              <div className="card-subtitle">Active distress beacons from campus residents</div>
            </div>
            <span
              style={{
                background: activeEmergencies.length > 0 ? 'var(--error-light)' : 'var(--success-light)',
                color: activeEmergencies.length > 0 ? 'var(--emergency)' : 'var(--success-dark)',
                padding: '0.25rem 0.75rem',
                borderRadius: 'var(--radius-full)',
                fontWeight: 700,
                fontSize: '0.78rem',
              }}
            >
              {activeEmergencies.length} Active Incident{activeEmergencies.length === 1 ? '' : 's'}
            </span>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
              <div style={{ width: '40px', height: '40px', border: '3px solid #e2e8f0', borderTopColor: '#e11d48', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem' }} />
              <p style={{ color: 'var(--text-muted)' }}>Connecting to crisis grid...</p>
            </div>
          ) : activeEmergencies.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 1.5rem', color: 'var(--text-muted)' }}>
              <ShieldCheck size={48} color="var(--success)" style={{ margin: '0 auto 1rem' }} />
              <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)' }}>All Campus Sectors Clear</h3>
              <p style={{ fontSize: '0.88rem' }}>No active distress alerts or open crisis beacons.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {activeEmergencies.map((em) => {
                const proto = PROTOCOLS[em.type] || PROTOCOLS.other;
                const Icon = proto.icon;

                return (
                  <div
                    key={em._id}
                    style={{
                      padding: '1.4rem',
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--error-light)',
                      border: '1.5px solid var(--emergency)',
                      boxShadow: 'var(--shadow-sm)',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.9rem' }}>
                        <div
                          style={{
                            width: '44px',
                            height: '44px',
                            borderRadius: '50%',
                            background: 'var(--emergency)',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}
                        >
                          <Icon size={22} />
                        </div>

                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.3rem' }}>
                            <h3 style={{ fontSize: '1.15rem', margin: 0, color: 'var(--emergency-dark)' }}>
                              Emergency: {em.type.toUpperCase()}
                            </h3>
                            <span
                              style={{
                                background: 'white',
                                color: 'var(--emergency-dark)',
                                fontSize: '0.72rem',
                                fontWeight: 800,
                                padding: '0.15rem 0.5rem',
                                borderRadius: 'var(--radius-full)',
                                border: '1px solid var(--emergency)',
                              }}
                            >
                              DISPATCH ACTIVE
                            </span>
                          </div>

                          <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 500, marginBottom: '0.6rem' }}>
                            {em.description}
                          </p>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: 600 }}>
                              <MapPin size={14} color="var(--emergency)" />
                              Block {em.block || 'Campus Grounds'}
                            </span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                              <Clock size={14} color="var(--emergency)" />
                              {em.createdAt ? formatDistanceToNow(new Date(em.createdAt), { addSuffix: true }) : 'Just now'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <button
                        className="btn btn-primary"
                        style={{ background: 'var(--success-dark)', border: 'none' }}
                        onClick={() => handleResolve(em._id)}
                        disabled={resolvingId === em._id}
                      >
                        <CheckCircle2 size={16} />
                        <span>{resolvingId === em._id ? 'Resolving...' : 'Mark Incident Resolved'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Crisis Standard Operating Protocols */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <div className="card">
            <div className="card-header">
              <div>
                <div className="card-title">Standard Operating Protocols</div>
                <div className="card-subtitle">Automated response steps</div>
              </div>
              <Activity size={20} color="var(--primary)" />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {Object.entries(PROTOCOLS).map(([key, item]) => {
                const Icon = item.icon;
                return (
                  <div
                    key={key}
                    style={{
                      padding: '1rem',
                      borderRadius: 'var(--radius-sm)',
                      background: 'var(--bg-canvas)',
                      border: '1px solid var(--surface-glass-border)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '0.92rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                      <Icon size={16} color="var(--primary)" />
                      <span>{item.title}</span>
                    </div>

                    <ul style={{ paddingLeft: '1.2rem', margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                      {item.steps.map((st, i) => (
                        <li key={i} style={{ marginBottom: '0.25rem' }}>
                          {st}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyPage;
