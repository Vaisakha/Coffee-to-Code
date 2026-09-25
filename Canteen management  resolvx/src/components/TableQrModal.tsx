import React, { useState } from 'react';
import { useCanteen } from '../context/CanteenContext';
import { QrCode, Utensils, Check, ArrowRight } from 'lucide-react';

interface TableQrModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TableQrModal: React.FC<TableQrModalProps> = ({ isOpen, onClose }) => {
  const { setOrderType, setTableNumber, setCurrentRole, setActiveView, addToast } = useCanteen();
  const [selectedTable, setSelectedTable] = useState('4');

  if (!isOpen) return null;

  const handleSimulateScan = (tbl: string) => {
    setOrderType('DINE_IN');
    setTableNumber(tbl);
    setCurrentRole('student');
    setActiveView('app');
    addToast('Table QR Connected! 🍽', `Placed at Table ${tbl}. Your orders will be delivered here.`, 'success');
    onClose();
  };

  const tables = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.8)',
      backdropFilter: 'blur(10px)',
      zIndex: 1150,
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <QrCode size={22} color="#FF5E36" />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Table QR Order Scanner</h3>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: '#94A3B8', cursor: 'pointer', fontSize: '1.2rem' }}
          >
            ✕
          </button>
        </div>

        <p style={{ fontSize: '0.86rem', color: '#94A3B8', marginBottom: '18px' }}>
          In the campus canteen, each dining table has an individual QR sticker. Scanning connects your session directly to that table for hot service.
        </p>

        <div style={{
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '16px',
          padding: '16px',
          marginBottom: '20px'
        }}>
          <div style={{ fontSize: '0.78rem', color: '#94A3B8', fontWeight: 700, marginBottom: '10px' }}>
            SELECT A CANTEEN TABLE TO SIMULATE:
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '8px'
          }}>
            {tables.map((tbl) => (
              <button
                key={tbl}
                onClick={() => setSelectedTable(tbl)}
                style={{
                  padding: '12px 8px',
                  borderRadius: '10px',
                  border: selectedTable === tbl ? '2px solid #FF5E36' : '1px solid rgba(255, 255, 255, 0.08)',
                  background: selectedTable === tbl ? 'rgba(255, 94, 54, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                  color: selectedTable === tbl ? '#FF7A50' : '#E2E8F0',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <Utensils size={14} />
                Table {tbl}
              </button>
            ))}
          </div>
        </div>

        <button
          className="btn btn-primary"
          style={{ width: '100%', padding: '14px', fontSize: '0.96rem' }}
          onClick={() => handleSimulateScan(selectedTable)}
        >
          Simulate Scan of Table {selectedTable} <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};
