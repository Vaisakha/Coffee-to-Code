import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { Order } from '../types';
import { 
  X, 
  Clock, 
  CheckCircle2, 
  ChefHat, 
  Receipt, 
  Sparkles,
  MapPin,
  Utensils
} from 'lucide-react';

interface ActiveOrderModalProps {
  order: Order | null;
  onClose: () => void;
  onOpenReceipt: (order: Order) => void;
  onOpenFeedback: (order: Order) => void;
}

export const ActiveOrderModal: React.FC<ActiveOrderModalProps> = ({
  order,
  onClose,
  onOpenReceipt,
  onOpenFeedback,
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  useEffect(() => {
    if (order) {
      QRCode.toDataURL(
        JSON.stringify({
          token: order.token_code,
          order_id: order.id,
          order_num: order.order_number,
          verification_key: order.qr_code_token,
          canteen: 'Central Campus Canteen'
        }),
        {
          width: 260,
          margin: 1.5,
          color: {
            dark: '#0A0E17',
            light: '#FFFFFF'
          }
        }
      )
        .then((url) => setQrDataUrl(url))
        .catch((err) => console.error(err));
    }
  }, [order]);

  if (!order) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.8)',
      backdropFilter: 'blur(12px)',
      zIndex: 1050,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        background: '#FFFFFF',
        border: '1px solid #E8E2D6',
        borderRadius: '28px',
        maxWidth: '460px',
        width: '100%',
        boxShadow: '0 25px 60px rgba(35, 40, 36, 0.18)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          padding: '24px',
          background: '#FAF7F2',
          borderBottom: '1px solid #E8E2D6',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <div style={{ fontSize: '0.78rem', color: '#EE4322', fontWeight: 800, letterSpacing: '0.05em' }}>
              OFFICIAL DIGITAL TOKEN
            </div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1C211D' }}>
              Pickup Verification Pass
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: '#FFFFFF',
              border: '1px solid #E8E2D6',
              color: '#58615A',
              borderRadius: '10px',
              padding: '6px 10px',
              cursor: 'pointer'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: '24px', textAlign: 'center' }}>
          {/* Big Token Emblem */}
          <div style={{
            display: 'inline-block',
            padding: '12px 36px',
            borderRadius: '20px',
            background: '#FAF7F2',
            border: '2px solid #EE4322',
            boxShadow: '0 6px 20px rgba(238, 67, 34, 0.18)',
            marginBottom: '16px'
          }}>
            <div style={{ fontSize: '0.75rem', color: '#58615A', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700 }}>
              TOKEN NUMBER
            </div>
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '3.4rem',
              fontWeight: 900,
              color: '#EE4322',
              letterSpacing: '0.04em',
              lineHeight: 1.1
            }}>
              {order.token_code}
            </div>
          </div>

          {/* QR Code Container */}
          <div style={{
            background: '#FAF7F2',
            borderRadius: '20px',
            padding: '14px',
            border: '1px solid #E8E2D6',
            display: 'inline-block',
            margin: '0 auto 16px',
            boxShadow: '0 8px 20px rgba(35, 40, 36, 0.06)'
          }}>
            {qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt={`QR code for token ${order.token_code}`}
                style={{ width: '200px', height: '200px', display: 'block' }}
              />
            ) : (
              <div style={{ width: '200px', height: '200px', background: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                Generating QR...
              </div>
            )}
          </div>

          <div style={{ fontSize: '0.84rem', color: '#58615A', marginBottom: '16px' }}>
            Present this QR code to the kitchen staff at <strong>Counter 1</strong> when ready.
          </div>

          {/* Status & Location Pill */}
          <div style={{
            background: '#FAF7F2',
            border: '1px solid #E8E2D6',
            padding: '14px',
            borderRadius: '16px',
            display: 'flex',
            justifyContent: 'space-around',
            marginBottom: '20px'
          }}>
            <div>
              <div style={{ fontSize: '0.74rem', color: '#8A948C' }}>STATUS</div>
              <div style={{ fontWeight: 800, fontSize: '0.9rem', color: order.status === 'READY' ? '#059669' : '#D97706' }}>
                {order.status}
              </div>
            </div>
            <div style={{ width: '1px', background: '#E8E2D6' }} />
            <div>
              <div style={{ fontSize: '0.74rem', color: '#8A948C' }}>READY BY</div>
              <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#1C211D' }}>
                {order.estimated_ready_time}
              </div>
            </div>
            <div style={{ width: '1px', background: '#E8E2D6' }} />
            <div>
              <div style={{ fontSize: '0.74rem', color: '#8A948C' }}>DINING</div>
              <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#0284C7' }}>
                {order.order_type === 'DINE_IN' ? `Table ${order.table_number || '4'}` : 'Takeaway'}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              className="btn btn-secondary"
              style={{ flex: 1, fontSize: '0.85rem', background: '#FAF7F2' }}
              onClick={() => onOpenReceipt(order)}
            >
              <Receipt size={16} /> Thermal Ticket
            </button>

            {order.status === 'PICKED_UP' ? (
              <button
                className="btn btn-primary"
                style={{ flex: 1, fontSize: '0.85rem', borderRadius: '999px' }}
                onClick={() => onOpenFeedback(order)}
              >
                <Sparkles size={16} /> Rate Meal
              </button>
            ) : (
              <button
                className="btn btn-primary"
                style={{ flex: 1, fontSize: '0.85rem', borderRadius: '999px' }}
                onClick={onClose}
              >
                Done
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
