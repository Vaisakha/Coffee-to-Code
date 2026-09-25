import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { ShieldAlert, AlertTriangle, X, Radio } from 'lucide-react';
import { EmergencyType } from '../types';

const SosButton: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState<boolean>(false);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [sosType, setSosType] = useState<EmergencyType>('other');

  const triggerSOS = async () => {
    setLoading(true);
    try {
      let lat = 12.9716;
      let lng = 77.5946;

      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) =>
          navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 3000 })
        );
        lat = position.coords.latitude;
        lng = position.coords.longitude;
      } catch {
        // Fallback coordinates
      }

      await api.post('/emergency/sos', {
        lat,
        lng,
        description: `SOS triggered by ${user?.name || 'Campus Resident'}`,
        block: user?.block || 'Main Campus',
        type: sosType,
      });

      toast.error('Emergency Beacon Transmitted! Campus Security dispatched.', {
        duration: 7000,
        style: {
          background: '#dc2626',
          color: 'white',
          fontWeight: 700,
          borderRadius: '12px',
        },
      });
      setShowConfirm(false);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Emergency trigger failed. Please contact campus emergency line directly.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating SOS Beacon Button */}
      <button
        className="sos-float-btn"
        onClick={() => setShowConfirm(true)}
        title="Broadcast Emergency SOS Beacon"
        id="sos-button"
        aria-label="Emergency SOS"
      >
        <Radio size={24} />
        <span style={{ fontSize: '0.65rem', fontWeight: 800, letterSpacing: '0.05em' }}>SOS</span>
      </button>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '1.5rem',
            animation: 'fadeIn 0.2s ease',
          }}
        >
          <div
            className="card"
            style={{
              maxWidth: '420px',
              width: '100%',
              textAlign: 'center',
              padding: '2.2rem',
              boxShadow: 'var(--shadow-hover)',
              borderRadius: 'var(--radius-lg)',
              border: '2px solid rgba(239, 68, 68, 0.3)',
            }}
          >
            <div
              style={{
                width: '68px',
                height: '68px',
                background: 'var(--error-light)',
                color: 'var(--emergency)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.2rem',
                border: '2px solid var(--emergency)',
              }}
            >
              <AlertTriangle size={32} />
            </div>

            <h2 style={{ color: 'var(--emergency)', marginBottom: '0.5rem', fontSize: '1.4rem' }}>
              Broadcast SOS Beacon?
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '1.5rem' }}>
              This broadcasts an immediate priority emergency alert to Campus Security, Health Services, and nearby wardens.
            </p>

            <div className="form-group" style={{ textAlign: 'left' }}>
              <label className="form-label">Nature of Emergency</label>
              <select
                className="form-select"
                value={sosType}
                onChange={(e) => setSosType(e.target.value as EmergencyType)}
                id="sos-type-select"
              >
                <option value="medical">Medical Emergency</option>
                <option value="fire">Fire / Smoke Detected</option>
                <option value="security">Security Threat</option>
                <option value="accident">Accident / Injury</option>
                <option value="other">General Urgent Assistance</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: '0.8rem', marginTop: '1.5rem' }}>
              <button
                type="button"
                className="btn btn-secondary"
                style={{ flex: 1 }}
                onClick={() => setShowConfirm(false)}
                id="sos-cancel-btn"
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-danger"
                style={{ flex: 1 }}
                onClick={triggerSOS}
                disabled={loading}
                id="sos-confirm-btn"
              >
                {loading ? 'Transmitting...' : 'Dispatch SOS'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SosButton;
