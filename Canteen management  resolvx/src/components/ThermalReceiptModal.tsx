import React from 'react';
import { Order } from '../types';
import { X, Printer, Download } from 'lucide-react';

interface ThermalReceiptModalProps {
  order: Order | null;
  onClose: () => void;
}

export const ThermalReceiptModal: React.FC<ThermalReceiptModalProps> = ({ order, onClose }) => {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.82)',
      backdropFilter: 'blur(10px)',
      zIndex: 1200,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '380px',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '16px'
      }}>
        {/* Thermal Receipt Paper Card */}
        <div className="thermal-receipt" style={{
          width: '100%',
          padding: '28px 24px 32px',
          borderRadius: '4px',
          color: '#111827',
          background: '#FFFDF9',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6)'
        }}>
          {/* Header */}
          <div style={{ textAlign: 'center', borderBottom: '1px dashed #9CA3AF', paddingBottom: '14px', marginBottom: '14px' }}>
            <div style={{ fontSize: '1.4rem', fontWeight: 900, letterSpacing: '0.08em' }}>* BITEQ *</div>
            <div style={{ fontSize: '0.78rem', color: '#4B5563', marginTop: '2px' }}>CENTRAL CAMPUS CANTEEN</div>
            <div style={{ fontSize: '0.72rem', color: '#6B7280' }}>Block A, Student Plaza</div>
            <div style={{ fontSize: '0.7rem', color: '#6B7280', marginTop: '4px' }}>
              {new Date(order.created_at).toLocaleDateString()} {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>

          {/* Token Box */}
          <div style={{
            border: '2px solid #111827',
            padding: '8px',
            textAlign: 'center',
            marginBottom: '16px'
          }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 700 }}>PICKUP TOKEN</div>
            <div style={{ fontSize: '2.4rem', fontWeight: 900, letterSpacing: '0.05em', lineHeight: 1.1 }}>
              {order.token_code}
            </div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, marginTop: '2px' }}>
              {order.order_type === 'DINE_IN' ? `DINE-IN • TABLE ${order.table_number || '4'}` : 'TAKEAWAY PARCEL'}
            </div>
          </div>

          {/* Items Table */}
          <div style={{ borderBottom: '1px dashed #9CA3AF', paddingBottom: '12px', marginBottom: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', fontWeight: 800, color: '#6B7280', marginBottom: '6px' }}>
              <span>ITEM</span>
              <span>QTY</span>
              <span>AMT</span>
            </div>

            {order.items?.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', padding: '3px 0' }}>
                <span style={{ flex: 1, paddingRight: '8px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {item.product_name}
                </span>
                <span style={{ minWidth: '24px', textAlign: 'center' }}>x{item.quantity}</span>
                <span style={{ minWidth: '45px', textAlign: 'right', fontWeight: 700 }}>₹{item.total_price}</span>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div style={{ borderBottom: '1px dashed #9CA3AF', paddingBottom: '12px', marginBottom: '14px', fontSize: '0.82rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span>Subtotal:</span>
              <span>₹{order.subtotal}</span>
            </div>
            {order.packaging_fee > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span>Packaging:</span>
                <span>₹{order.packaging_fee}</span>
              </div>
            )}
            {order.discount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span>Discount:</span>
                <span>-₹{order.discount}</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.05rem', fontWeight: 900, marginTop: '6px', borderTop: '1px solid #111827', paddingTop: '6px' }}>
              <span>TOTAL PAID:</span>
              <span>₹{order.total_amount}</span>
            </div>
          </div>

          {/* Footer & Barcode simulation */}
          <div style={{ textAlign: 'center', fontSize: '0.75rem' }}>
            <div style={{ fontWeight: 700 }}>ESTIMATED READY: {order.estimated_ready_time}</div>
            <div style={{ color: '#4B5563', margin: '6px 0 12px' }}>
              Order #{order.order_number} • PAID
            </div>

            {/* Barcode lines */}
            <div style={{
              height: '34px',
              background: 'repeating-linear-gradient(90deg, #111827 0, #111827 2px, transparent 2px, transparent 5px, #111827 5px, #111827 8px, transparent 8px, transparent 10px)',
              margin: '0 auto 8px',
              maxWidth: '220px'
            }} />
            <div style={{ fontSize: '0.65rem', color: '#6B7280', letterSpacing: '0.12em' }}>
              *{order.qr_code_token.slice(0, 16)}*
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
          <button
            className="btn btn-secondary"
            style={{ flex: 1 }}
            onClick={onClose}
          >
            Close
          </button>
          <button
            className="btn btn-primary"
            style={{ flex: 1 }}
            onClick={handlePrint}
          >
            <Printer size={16} /> Print Receipt
          </button>
        </div>
      </div>
    </div>
  );
};
