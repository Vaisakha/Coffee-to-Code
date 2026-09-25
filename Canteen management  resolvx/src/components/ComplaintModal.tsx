import React, { useState } from 'react';
import { useCanteen } from '../context/CanteenContext';
import { MessageSquarePlus, X, AlertCircle } from 'lucide-react';

interface ComplaintModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ComplaintModal: React.FC<ComplaintModalProps> = ({ isOpen, onClose }) => {
  const { submitComplaint, activeOrder } = useCanteen();

  const [category, setCategory] = useState('Missing Item');
  const [description, setDescription] = useState('');
  const [orderId, setOrderId] = useState(activeOrder?.order_number || '');

  if (!isOpen) return null;

  const categories = [
    'Food Quality',
    'Payment / Double Charge',
    'Excessive Delay',
    'Missing Item',
    'Wrong Item',
    'Refund Request',
    'Staff Interaction',
    'Hygiene / Cleanliness',
    'Other Issue'
  ];

  const handleSubmit = () => {
    if (!description.trim()) return;
    submitComplaint({
      user_id: 'student-sherin-01',
      user_name: 'Sherin',
      order_id: orderId || undefined,
      category,
      description,
    });
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.8)',
      backdropFilter: 'blur(8px)',
      zIndex: 1250,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        background: '#0F172A',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        borderRadius: '24px',
        maxWidth: '460px',
        width: '100%',
        padding: '24px',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MessageSquarePlus size={20} color="#F43F5E" />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Report Canteen Issue</h3>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: '#94A3B8', cursor: 'pointer', fontSize: '1.2rem' }}
          >
            ✕
          </button>
        </div>

        <p style={{ fontSize: '0.84rem', color: '#94A3B8', marginBottom: '16px' }}>
          Issues are directly routed to the Canteen Manager and College Administration for resolution.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ fontSize: '0.78rem', color: '#94A3B8', display: 'block', marginBottom: '4px' }}>Issue Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', background: '#1E293B', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#FFF' }}
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.78rem', color: '#94A3B8', display: 'block', marginBottom: '4px' }}>Order Reference ID (Optional)</label>
            <input
              type="text"
              placeholder="e.g. ORD-8801 or Token B137"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#FFF' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.78rem', color: '#94A3B8', display: 'block', marginBottom: '4px' }}>Description of Issue</label>
            <textarea
              placeholder="Describe what went wrong so we can fix or refund promptly..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#FFF', fontFamily: 'var(--font-sans)', fontSize: '0.85rem' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
            <button className="btn btn-secondary" style={{ flex: 1 }} onClick={onClose}>
              Cancel
            </button>
            <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleSubmit}>
              Submit Grievance
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
