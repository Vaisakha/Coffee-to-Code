import React from 'react';
import { useNotifications } from '../context/NotificationContext';
import { AlertTriangle, X, ShieldAlert, MapPin } from 'lucide-react';

const EmergencyBanner: React.FC = () => {
  const { emergencyAlert } = useNotifications();

  if (!emergencyAlert) return null;

  return (
    <div className="emergency-banner" role="alert" id="emergency-banner">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
        <div className="emergency-beacon-pulse" />
        <ShieldAlert size={24} />
        <div>
          <div style={{ fontWeight: 800, fontSize: '0.98rem', letterSpacing: '0.01em' }}>
            CRITICAL CAMPUS ALERT: {emergencyAlert.type.toUpperCase()}
          </div>
          <div style={{ fontSize: '0.86rem', opacity: 0.95 }}>
            {emergencyAlert.description || 'Active campus security notice. Please follow emergency protocol.'}
          </div>
          {emergencyAlert.block && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.78rem', opacity: 0.9, marginTop: '2px' }}>
              <MapPin size={12} />
              <span>Location: Block {emergencyAlert.block}</span>
            </div>
          )}
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
        <a
          href="/emergency"
          style={{
            background: 'white',
            color: '#be123c',
            borderRadius: 'var(--radius-xs)',
            padding: '0.35rem 0.85rem',
            fontSize: '0.8rem',
            fontWeight: 700,
            textDecoration: 'none',
          }}
        >
          View Dispatch
        </a>
      </div>
    </div>
  );
};

export default EmergencyBanner;
