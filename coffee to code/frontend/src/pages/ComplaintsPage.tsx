import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';
import {
  MessageSquareWarning,
  Wrench,
  Shield,
  Laptop,
  Building,
  Plus,
  X,
  Clock,
  CheckCircle2,
  MapPin,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { Complaint } from '../types';

const CATEGORY_MAP: Record<string, { label: string; icon: React.ElementType }> = {
  maintenance: { label: 'Facilities & Maintenance', icon: Wrench },
  it: { label: 'IT & Network Systems', icon: Laptop },
  cleanliness: { label: 'Housekeeping & Hygiene', icon: Sparkles },
  security: { label: 'Campus Security', icon: Shield },
  hostel: { label: 'Hostel Accommodation', icon: Building },
  other: { label: 'General Administrative', icon: MessageSquareWarning },
};

const ComplaintsPage: React.FC = () => {
  const { user, isRole } = useAuth();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showNew, setShowNew] = useState<boolean>(false);
  const [newComplaint, setNewComplaint] = useState({
    category: 'maintenance',
    title: '',
    description: '',
    priority: 'medium',
    location: '',
    block: user?.block || 'A',
  });

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const { data } = await api.get('/complaints');
        setComplaints(data.complaints || []);
      } catch {
        setComplaints([]);
      } finally {
        setLoading(false);
      }
    };
    fetchComplaints();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/complaints', newComplaint);
      setComplaints((prev) => [data.complaint, ...prev]);
      setShowNew(false);
      toast.success('Support ticket submitted! Auto-routed to facility operations.');
      setNewComplaint({
        category: 'maintenance',
        title: '',
        description: '',
        priority: 'medium',
        location: '',
        block: user?.block || 'A',
      });
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to file ticket');
    }
  };

  const handleStatusUpdate = async (id: string, status: string) => {
    try {
      await api.put(`/complaints/${id}/status`, { status });
      setComplaints((prev) =>
        prev.map((c) => (String(c._id) === String(id) ? { ...c, status: status as any } : c))
      );
      toast.success(`Ticket status updated to ${status}`);
    } catch {
      toast.error('Failed to update ticket status');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'resolved':
        return { bg: 'var(--success-light)', color: 'var(--success-dark)', border: 'var(--success-border)' };
      case 'in_progress':
      case 'in-progress':
        return { bg: 'var(--warning-light)', color: 'var(--warning-dark)', border: 'var(--warning-border)' };
      default:
        return { bg: 'var(--error-light)', color: 'var(--error-dark)', border: 'var(--error-border)' };
    }
  };

  return (
    <div className="page-content animate-in">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ margin: 0 }}>Support Desk & Facilities Tickets</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
            Automated ticket routing, maintenance tracking, and incident escalation
          </p>
        </div>

        <button className="btn btn-primary" onClick={() => setShowNew(true)} id="new-complaint-btn">
          <Plus size={18} />
          <span>File Support Ticket</span>
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
          <div style={{ width: '40px', height: '40px', border: '3px solid #e2e8f0', borderTopColor: '#4f46e5', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem' }} />
          <p style={{ color: 'var(--text-muted)' }}>Retrieving support desk tickets...</p>
        </div>
      ) : complaints.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '4rem 1.5rem', color: 'var(--text-muted)' }}>
          <MessageSquareWarning size={42} style={{ margin: '0 auto 0.8rem', opacity: 0.5 }} />
          <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)' }}>No Support Tickets Active</h3>
          <p style={{ fontSize: '0.88rem' }}>Report facility faults, IT bugs, or campus issues anytime.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {complaints.map((c) => {
            const badge = getStatusBadge(c.status);
            const cat = CATEGORY_MAP[c.category] || CATEGORY_MAP.other;
            const Icon = cat.icon;

            return (
              <div key={c._id} className="card" id={`complaint-${c._id}`}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                    <div
                      style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: 'var(--radius-xs)',
                        background: 'var(--bg-canvas)',
                        color: 'var(--primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '1px solid var(--surface-glass-border)',
                        flexShrink: 0,
                      }}
                    >
                      <Icon size={20} />
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '0.35rem' }}>
                        <h3 style={{ fontSize: '1.05rem', margin: 0 }}>{c.title}</h3>
                        <span
                          style={{
                            padding: '0.2rem 0.65rem',
                            borderRadius: 'var(--radius-full)',
                            fontSize: '0.74rem',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            letterSpacing: '0.04em',
                            background: badge.bg,
                            color: badge.color,
                            border: `1px solid ${badge.border}`,
                          }}
                        >
                          {c.status}
                        </span>
                        <span
                          style={{
                            fontSize: '0.74rem',
                            fontWeight: 600,
                            color: 'var(--text-muted)',
                            background: 'var(--bg-subtle)',
                            padding: '0.15rem 0.5rem',
                            borderRadius: 'var(--radius-xs)',
                          }}
                        >
                          Priority: {c.priority}
                        </span>
                      </div>

                      <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                        {c.description}
                      </p>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <MapPin size={13} color="var(--primary)" />
                          Block {c.block || 'Campus'}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <Clock size={13} color="var(--primary)" />
                          {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : 'Recent'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {isRole('faculty', 'admin') && (
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <select
                        className="form-select"
                        style={{ padding: '0.4rem 0.8rem', fontSize: '0.82rem', width: 'auto' }}
                        value={c.status}
                        onChange={(e) => handleStatusUpdate(c._id, e.target.value)}
                      >
                        <option value="open">Open</option>
                        <option value="in_progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                      </select>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* New Complaint Modal */}
      {showNew && (
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
                <h2 style={{ fontSize: '1.35rem', margin: 0 }}>Submit Support Ticket</h2>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                  Auto-assigned to facility technicians & department administrators
                </p>
              </div>
              <button
                className="btn btn-secondary btn-sm"
                style={{ padding: '0.35rem', borderRadius: '50%', border: 'none' }}
                onClick={() => setShowNew(false)}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} id="new-complaint-form">
              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  className="form-select"
                  value={newComplaint.category}
                  onChange={(e) => setNewComplaint((c) => ({ ...c, category: e.target.value }))}
                >
                  <option value="maintenance">Facilities / Electric / Plumbing</option>
                  <option value="it">WiFi / Lab PCs / Audio-Visual</option>
                  <option value="cleanliness">Sanitation / Housekeeping</option>
                  <option value="security">Safety / Keycard Access</option>
                  <option value="hostel">Hostel Residence</option>
                  <option value="other">Other Campus Issue</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Issue Summary</label>
                <input
                  className="form-input"
                  type="text"
                  placeholder="e.g. Projector power fault in Hall B-201"
                  value={newComplaint.title}
                  onChange={(e) => setNewComplaint((c) => ({ ...c, title: e.target.value }))}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.9rem' }}>
                <div className="form-group">
                  <label className="form-label">Priority Level</label>
                  <select
                    className="form-select"
                    value={newComplaint.priority}
                    onChange={(e) => setNewComplaint((c) => ({ ...c, priority: e.target.value }))}
                  >
                    <option value="low">Low Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="high">High Priority</option>
                    <option value="urgent">Urgent Intervention</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Campus Block</label>
                  <select
                    className="form-select"
                    value={newComplaint.block}
                    onChange={(e) => setNewComplaint((c) => ({ ...c, block: e.target.value }))}
                  >
                    {['A', 'B', 'C', 'D', 'Admin'].map((b) => (
                      <option key={b} value={b}>
                        Block {b}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Detailed Notes</label>
                <textarea
                  className="form-textarea"
                  placeholder="Explain symptom, affected room, or equipment serial..."
                  value={newComplaint.description}
                  onChange={(e) => setNewComplaint((c) => ({ ...c, description: e.target.value }))}
                  style={{ minHeight: '80px' }}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '0.8rem', marginTop: '1.5rem' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ flex: 1 }}
                  onClick={() => setShowNew(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  Submit Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComplaintsPage;
