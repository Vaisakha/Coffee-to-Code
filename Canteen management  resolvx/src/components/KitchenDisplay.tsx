import React, { useState } from 'react';
import { useCanteen } from '../context/CanteenContext';
import { Order } from '../types';
import { 
  ChefHat, 
  Clock, 
  CheckCircle2, 
  Flame, 
  AlertCircle, 
  Receipt,
  Scan,
  RefreshCw,
  Bell,
  UtensilsCrossed,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface KitchenDisplayProps {
  onOpenReceipt: (order: Order) => void;
}

export const KitchenDisplay: React.FC<KitchenDisplayProps> = ({ onOpenReceipt }) => {
  const { orders, updateOrderStatus, verifyPickup, addToast, canteen } = useCanteen();

  const [activeFilter, setActiveFilter] = useState<'ALL' | 'DINE_IN' | 'TAKEAWAY'>('ALL');
  const [scanModalOpen, setScanModalOpen] = useState(false);
  const [scanInput, setScanInput] = useState('');
  const [scanResult, setScanResult] = useState<{ success: boolean; message: string } | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Group active orders by stage
  const filteredOrders = orders.filter((o) => {
    if (activeFilter === 'DINE_IN') return o.order_type === 'DINE_IN';
    if (activeFilter === 'TAKEAWAY') return o.order_type === 'TAKEAWAY';
    return true;
  });

  const waitingOrders = filteredOrders.filter((o) => o.status === 'PENDING' || o.status === 'ACCEPTED');
  const preparingOrders = filteredOrders.filter((o) => o.status === 'PREPARING');
  const readyOrders = filteredOrders.filter((o) => o.status === 'READY');

  const handleManualScan = () => {
    if (!scanInput.trim()) return;
    const res = verifyPickup(scanInput.trim());
    setScanResult(res);
    if (res.success) {
      setTimeout(() => {
        setScanModalOpen(false);
        setScanInput('');
        setScanResult(null);
      }, 1600);
    }
  };

  const handleQuickVerify = (tokenCode: string) => {
    const res = verifyPickup(tokenCode);
    if (!res.success) {
      addToast('Verification Notice', res.message, 'warning');
    }
  };

  const playChimeNotice = () => {
    addToast('Station Bell Chime', 'Kitchen audio prompt tested successfully.', 'info');
  };

  return (
    <div style={{ padding: '32px 0 90px' }}>
      <div className="container">
        {/* Top Header & Chef Command Center */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '20px',
          marginBottom: '28px',
          paddingBottom: '24px',
          borderBottom: '1px solid var(--border-subtle)'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span className="pulse-dot" style={{ backgroundColor: 'var(--brand-orange)' }} />
              <span style={{ 
                fontSize: '0.78rem', 
                color: 'var(--brand-orange)', 
                fontWeight: 800, 
                letterSpacing: '0.08em',
                textTransform: 'uppercase'
              }}>
                Live Kitchen Display System • Station Routing
              </span>
            </div>
            <h1 style={{ 
              fontFamily: 'var(--font-display)', 
              fontSize: '2.4rem', 
              fontWeight: 800, 
              color: 'var(--text-primary)',
              letterSpacing: '-0.02em',
              lineHeight: 1.15
            }}>
              Kitchen Operating Queue
            </h1>
            <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Real-time ticket dispatch, prep staging & contactless counter pickup verification.
            </p>
          </div>

          {/* Right Action Bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            {/* Filter Pill Dock */}
            <div style={{
              display: 'flex',
              background: '#FFFFFF',
              border: '1px solid var(--border-subtle)',
              borderRadius: '999px',
              padding: '4px',
              boxShadow: 'var(--shadow-sm)'
            }}>
              {(['ALL', 'DINE_IN', 'TAKEAWAY'] as const).map((filter) => {
                const count = filter === 'ALL' 
                  ? orders.filter(o => o.status !== 'COMPLETED' && o.status !== 'CANCELLED').length
                  : orders.filter(o => o.order_type === filter && o.status !== 'COMPLETED' && o.status !== 'CANCELLED').length;

                const isActive = activeFilter === filter;
                return (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    style={{
                      padding: '7px 16px',
                      borderRadius: '999px',
                      border: 'none',
                      background: isActive ? 'var(--text-primary)' : 'transparent',
                      color: isActive ? '#FFFFFF' : 'var(--text-secondary)',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <span>{filter === 'ALL' ? 'All Orders' : filter === 'DINE_IN' ? '🍽 Dine-In' : '📦 Takeaway'}</span>
                    <span style={{
                      fontSize: '0.72rem',
                      padding: '1px 6px',
                      borderRadius: '999px',
                      background: isActive ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.06)',
                      color: isActive ? '#FFFFFF' : 'var(--text-secondary)',
                      fontWeight: 800
                    }}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Chime Button */}
            <button
              onClick={() => {
                setSoundEnabled(!soundEnabled);
                playChimeNotice();
              }}
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                border: '1px solid var(--border-subtle)',
                background: '#FFFFFF',
                color: soundEnabled ? 'var(--brand-orange)' : 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: 'var(--shadow-sm)',
                transition: 'all 0.15s ease'
              }}
              title={soundEnabled ? 'Kitchen chime active' : 'Kitchen chime muted'}
            >
              <Bell size={18} />
            </button>

            {/* Counter Scanner Button */}
            <button
              className="btn btn-primary"
              style={{ 
                fontSize: '0.88rem', 
                padding: '10px 20px',
                borderRadius: '999px',
                fontWeight: 700
              }}
              onClick={() => {
                setScanModalOpen(true);
                setScanResult(null);
                setScanInput('');
              }}
            >
              <Scan size={18} /> Verify Pickup Scanner
            </button>
          </div>
        </div>

        {/* Status Strip Bar */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '28px'
        }}>
          <div style={{
            background: '#FFFFFF',
            border: '1px solid var(--border-subtle)',
            borderRadius: '16px',
            padding: '14px 18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase' }}>
                New Tickets
              </div>
              <div style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>
                {waitingOrders.length} <span style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-muted)' }}>waiting</span>
              </div>
            </div>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: '#EFF6FF',
              color: '#0284C7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <UtensilsCrossed size={18} />
            </div>
          </div>

          <div style={{
            background: '#FFFFFF',
            border: '1px solid var(--border-subtle)',
            borderRadius: '16px',
            padding: '14px 18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase' }}>
                On Stove / Prep
              </div>
              <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#D97706', marginTop: '2px' }}>
                {preparingOrders.length} <span style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-muted)' }}>cooking</span>
              </div>
            </div>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: '#FEF3C7',
              color: '#D97706',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Flame size={18} />
            </div>
          </div>

          <div style={{
            background: '#FFFFFF',
            border: '1px solid var(--border-subtle)',
            borderRadius: '16px',
            padding: '14px 18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase' }}>
                Counter Ready
              </div>
              <div style={{ fontSize: '1.45rem', fontWeight: 800, color: '#059669', marginTop: '2px' }}>
                {readyOrders.length} <span style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-muted)' }}>for pickup</span>
              </div>
            </div>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: '#D1FAE5',
              color: '#059669',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <CheckCircle2 size={18} />
            </div>
          </div>

          <div style={{
            background: '#FFFFFF',
            border: '1px solid var(--border-subtle)',
            borderRadius: '16px',
            padding: '14px 18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase' }}>
                Target Prep Time
              </div>
              <div style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>
                {canteen.avg_prep_time_minutes} <span style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--text-muted)' }}>mins avg</span>
              </div>
            </div>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: '#F4EFE6',
              color: 'var(--text-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Clock size={18} />
            </div>
          </div>
        </div>

        {/* 3 Columns Kanban Layout */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '24px',
          alignItems: 'start'
        }}>
          {/* ======================================================== */}
          {/* Column 1: NEW / WAITING TICKETS                         */}
          {/* ======================================================== */}
          <div style={{
            background: '#FFFFFF',
            border: '1px solid var(--border-subtle)',
            borderRadius: '20px',
            padding: '20px',
            minHeight: '620px',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {/* Column Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingBottom: '16px',
              borderBottom: '1.5px solid var(--border-subtle)',
              marginBottom: '18px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  background: '#0284C7'
                }} />
                <div>
                  <h3 style={{ 
                    fontWeight: 800, 
                    fontSize: '1.02rem', 
                    color: 'var(--text-primary)',
                    fontFamily: 'var(--font-display)',
                    letterSpacing: '0.01em',
                    lineHeight: 1.2
                  }}>
                    1. NEW TICKETS
                  </h3>
                  <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                    Incoming orders awaiting prep
                  </span>
                </div>
              </div>
              <span style={{
                background: '#EFF6FF',
                border: '1px solid #BFDBFE',
                color: '#0284C7',
                fontSize: '0.75rem',
                fontWeight: 800,
                padding: '4px 10px',
                borderRadius: '999px',
                letterSpacing: '0.03em'
              }}>
                {waitingOrders.length} ORDERS
              </span>
            </div>

            {/* Column Order List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
              {waitingOrders.length === 0 ? (
                <div style={{ 
                  textAlign: 'center', 
                  padding: '60px 20px', 
                  color: 'var(--text-muted)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    background: 'var(--bg-secondary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--text-secondary)',
                    marginBottom: '4px'
                  }}>
                    <CheckCircle2 size={22} />
                  </div>
                  <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.95rem' }}>All Clear!</div>
                  <div style={{ fontSize: '0.84rem' }}>No pending orders waiting for chef acceptance.</div>
                </div>
              ) : (
                waitingOrders.map((ord) => (
                  <div 
                    key={ord.id} 
                    style={{
                      background: '#FFFFFF',
                      border: '1.5px solid var(--border-subtle)',
                      borderRadius: '16px',
                      padding: '16px',
                      boxShadow: '0 2px 8px rgba(35, 40, 36, 0.04)',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {/* Ticket Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '1.35rem',
                          fontWeight: 900,
                          color: '#0284C7',
                          background: '#EFF6FF',
                          border: '1.5px solid #BAE6FD',
                          padding: '3px 12px',
                          borderRadius: '10px',
                          letterSpacing: '0.04em'
                        }}>
                          {ord.token_code}
                        </span>
                        <div>
                          <div style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                            {ord.user_name}
                          </div>
                          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                            Placed {ord.pickup_time || 'Just now'}
                          </div>
                        </div>
                      </div>

                      <span style={{
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        padding: '4px 10px',
                        borderRadius: '999px',
                        background: ord.order_type === 'DINE_IN' ? '#EFF6FF' : '#FFF7ED',
                        color: ord.order_type === 'DINE_IN' ? '#1D4ED8' : '#C2410C',
                        border: ord.order_type === 'DINE_IN' ? '1px solid #BFDBFE' : '1px solid #FED7AA'
                      }}>
                        {ord.order_type === 'DINE_IN' ? `Table ${ord.table_number || '2'}` : 'Takeaway'}
                      </span>
                    </div>

                    {/* Order Food Items Box */}
                    <div style={{
                      background: 'var(--bg-secondary)',
                      border: '1px solid #EFEAE1',
                      borderRadius: '12px',
                      padding: '12px',
                      marginBottom: '14px'
                    }}>
                      {ord.items?.map((item, idx) => (
                        <div 
                          key={idx} 
                          style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'space-between', 
                            fontSize: '0.88rem', 
                            fontWeight: 700, 
                            color: 'var(--text-primary)', 
                            padding: '4px 0',
                            borderBottom: idx !== (ord.items?.length || 1) - 1 ? '1px dashed var(--border-subtle)' : 'none'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{
                              background: '#FFFFFF',
                              border: '1px solid var(--border-subtle)',
                              color: 'var(--brand-orange)',
                              fontSize: '0.78rem',
                              fontWeight: 800,
                              padding: '1px 6px',
                              borderRadius: '6px'
                            }}>
                              {item.quantity}x
                            </span>
                            <span>{item.product_name}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Slot Timing */}
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center', 
                      fontSize: '0.78rem', 
                      color: 'var(--text-secondary)', 
                      marginBottom: '14px',
                      background: '#FFFFFF',
                      padding: '2px 4px'
                    }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={13} color="var(--text-muted)" /> Slot: <strong>{ord.pickup_time}</strong>
                      </span>
                      <span>Target: <strong style={{ color: 'var(--text-primary)' }}>{ord.estimated_ready_time}</strong></span>
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        className="btn btn-secondary"
                        style={{ padding: '8px 12px', fontSize: '0.84rem' }}
                        onClick={() => onOpenReceipt(ord)}
                        title="Print Thermal POS Receipt"
                      >
                        <Receipt size={16} />
                      </button>
                      <button
                        className="btn btn-primary"
                        style={{ 
                          flex: 1, 
                          padding: '9px 14px', 
                          fontSize: '0.86rem',
                          fontWeight: 700,
                          borderRadius: '10px'
                        }}
                        onClick={() => updateOrderStatus(ord.id, 'PREPARING')}
                      >
                        <ChefHat size={16} /> Accept & Start Prep
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* ======================================================== */}
          {/* Column 2: ON THE STOVE / PREPARING                       */}
          {/* ======================================================== */}
          <div style={{
            background: '#FFFFFF',
            border: '1px solid var(--border-subtle)',
            borderRadius: '20px',
            padding: '20px',
            minHeight: '620px',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {/* Column Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingBottom: '16px',
              borderBottom: '1.5px solid var(--border-subtle)',
              marginBottom: '18px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span className="pulse-dot" style={{ backgroundColor: '#D97706' }} />
                <div>
                  <h3 style={{ 
                    fontWeight: 800, 
                    fontSize: '1.02rem', 
                    color: 'var(--text-primary)',
                    fontFamily: 'var(--font-display)',
                    letterSpacing: '0.01em',
                    lineHeight: 1.2
                  }}>
                    2. ON THE STOVE / PREPARING
                  </h3>
                  <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                    Active cooking in progress
                  </span>
                </div>
              </div>
              <span style={{
                background: '#FEF3C7',
                border: '1px solid #FDE68A',
                color: '#D97706',
                fontSize: '0.75rem',
                fontWeight: 800,
                padding: '4px 10px',
                borderRadius: '999px',
                letterSpacing: '0.03em'
              }}>
                {preparingOrders.length} ACTIVE
              </span>
            </div>

            {/* Column Order List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
              {preparingOrders.length === 0 ? (
                <div style={{ 
                  textAlign: 'center', 
                  padding: '60px 20px', 
                  color: 'var(--text-muted)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    background: 'var(--bg-secondary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--text-secondary)',
                    marginBottom: '4px'
                  }}>
                    <Flame size={22} />
                  </div>
                  <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.95rem' }}>Kitchen Free</div>
                  <div style={{ fontSize: '0.84rem' }}>No orders currently on stove. Accept new tickets to begin prep.</div>
                </div>
              ) : (
                preparingOrders.map((ord) => (
                  <div 
                    key={ord.id} 
                    style={{
                      background: '#FFFFFF',
                      border: '1.5px solid #FDE68A',
                      borderTop: '3px solid #D97706',
                      borderRadius: '16px',
                      padding: '16px',
                      boxShadow: '0 4px 12px rgba(217, 119, 6, 0.08)',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {/* Ticket Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '1.35rem',
                          fontWeight: 900,
                          color: '#B45309',
                          background: '#FEF3C7',
                          border: '1.5px solid #FDE68A',
                          padding: '3px 12px',
                          borderRadius: '10px',
                          letterSpacing: '0.04em'
                        }}>
                          {ord.token_code}
                        </span>
                        <div>
                          <div style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                            {ord.user_name}
                          </div>
                          <div style={{ fontSize: '0.74rem', color: '#D97706', fontWeight: 600 }}>
                            Prep started
                          </div>
                        </div>
                      </div>

                      <span style={{
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        padding: '4px 10px',
                        borderRadius: '999px',
                        background: ord.order_type === 'DINE_IN' ? '#EFF6FF' : '#FFF7ED',
                        color: ord.order_type === 'DINE_IN' ? '#1D4ED8' : '#C2410C',
                        border: ord.order_type === 'DINE_IN' ? '1px solid #BFDBFE' : '1px solid #FED7AA'
                      }}>
                        {ord.order_type === 'DINE_IN' ? `Table ${ord.table_number || '8'}` : 'Takeaway'}
                      </span>
                    </div>

                    {/* Order Food Items Box */}
                    <div style={{
                      background: 'var(--bg-secondary)',
                      border: '1px solid #EFEAE1',
                      borderRadius: '12px',
                      padding: '12px',
                      marginBottom: '14px'
                    }}>
                      {ord.items?.map((item, idx) => (
                        <div 
                          key={idx} 
                          style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'space-between', 
                            fontSize: '0.88rem', 
                            fontWeight: 700, 
                            color: 'var(--text-primary)', 
                            padding: '4px 0',
                            borderBottom: idx !== (ord.items?.length || 1) - 1 ? '1px dashed var(--border-subtle)' : 'none'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{
                              background: '#FFFFFF',
                              border: '1px solid #FDE68A',
                              color: '#B45309',
                              fontSize: '0.78rem',
                              fontWeight: 800,
                              padding: '1px 6px',
                              borderRadius: '6px'
                            }}>
                              {item.quantity}x
                            </span>
                            <span>{item.product_name}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Status & Timing */}
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center', 
                      fontSize: '0.78rem', 
                      color: '#B45309', 
                      marginBottom: '14px',
                      background: '#FFFBEB',
                      padding: '6px 10px',
                      borderRadius: '8px',
                      border: '1px solid #FEF3C7'
                    }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 700 }}>
                        <Flame size={14} color="#D97706" /> Cooking in progress
                      </span>
                      <span>Target: <strong>{ord.estimated_ready_time}</strong></span>
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        className="btn btn-secondary"
                        style={{ padding: '8px 12px', fontSize: '0.84rem' }}
                        onClick={() => onOpenReceipt(ord)}
                        title="Print Thermal POS Receipt"
                      >
                        <Receipt size={16} />
                      </button>
                      <button
                        className="btn btn-success"
                        style={{ 
                          flex: 1, 
                          padding: '9px 14px', 
                          fontSize: '0.86rem',
                          fontWeight: 700,
                          borderRadius: '10px'
                        }}
                        onClick={() => updateOrderStatus(ord.id, 'READY')}
                      >
                        <CheckCircle2 size={16} /> Mark Ready & Notify Counter
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* ======================================================== */}
          {/* Column 3: READY FOR PICKUP AT COUNTER                    */}
          {/* ======================================================== */}
          <div style={{
            background: '#FFFFFF',
            border: '1px solid var(--border-subtle)',
            borderRadius: '20px',
            padding: '20px',
            minHeight: '620px',
            boxShadow: 'var(--shadow-sm)',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {/* Column Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingBottom: '16px',
              borderBottom: '1.5px solid var(--border-subtle)',
              marginBottom: '18px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span className="pulse-dot" style={{ backgroundColor: '#059669' }} />
                <div>
                  <h3 style={{ 
                    fontWeight: 800, 
                    fontSize: '1.02rem', 
                    color: 'var(--text-primary)',
                    fontFamily: 'var(--font-display)',
                    letterSpacing: '0.01em',
                    lineHeight: 1.2
                  }}>
                    3. COUNTER PICKUP (READY)
                  </h3>
                  <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                    Packed & awaiting student collection
                  </span>
                </div>
              </div>
              <span style={{
                background: '#D1FAE5',
                border: '1px solid #A7F3D0',
                color: '#059669',
                fontSize: '0.75rem',
                fontWeight: 800,
                padding: '4px 10px',
                borderRadius: '999px',
                letterSpacing: '0.03em'
              }}>
                {readyOrders.length} READY
              </span>
            </div>

            {/* Column Order List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
              {readyOrders.length === 0 ? (
                <div style={{ 
                  textAlign: 'center', 
                  padding: '60px 20px', 
                  color: 'var(--text-muted)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    background: 'var(--bg-secondary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--text-secondary)',
                    marginBottom: '4px'
                  }}>
                    <CheckCircle2 size={22} />
                  </div>
                  <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.95rem' }}>No Pickup Queues</div>
                  <div style={{ fontSize: '0.84rem' }}>Ready tickets will appear here for staff dispatch verification.</div>
                </div>
              ) : (
                readyOrders.map((ord) => (
                  <div 
                    key={ord.id} 
                    style={{
                      background: '#FFFFFF',
                      border: '1.5px solid #A7F3D0',
                      borderTop: '3px solid #059669',
                      borderRadius: '16px',
                      padding: '16px',
                      boxShadow: '0 4px 14px rgba(5, 150, 105, 0.08)',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {/* Ticket Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '1.35rem',
                          fontWeight: 900,
                          color: '#047857',
                          background: '#D1FAE5',
                          border: '1.5px solid #A7F3D0',
                          padding: '3px 12px',
                          borderRadius: '10px',
                          letterSpacing: '0.04em'
                        }}>
                          {ord.token_code}
                        </span>
                        <div>
                          <div style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                            {ord.user_name}
                          </div>
                          <div style={{ fontSize: '0.74rem', color: '#059669', fontWeight: 700 }}>
                            Ready at Counter 1
                          </div>
                        </div>
                      </div>

                      <span style={{
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        padding: '4px 10px',
                        borderRadius: '999px',
                        background: '#D1FAE5',
                        color: '#047857',
                        border: '1px solid #A7F3D0'
                      }}>
                        READY
                      </span>
                    </div>

                    {/* Order Food Items Box */}
                    <div style={{
                      background: 'var(--bg-secondary)',
                      border: '1px solid #EFEAE1',
                      borderRadius: '12px',
                      padding: '12px',
                      marginBottom: '14px'
                    }}>
                      {ord.items?.map((item, idx) => (
                        <div 
                          key={idx} 
                          style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'space-between', 
                            fontSize: '0.88rem', 
                            fontWeight: 700, 
                            color: 'var(--text-primary)', 
                            padding: '4px 0',
                            borderBottom: idx !== (ord.items?.length || 1) - 1 ? '1px dashed var(--border-subtle)' : 'none'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{
                              background: '#FFFFFF',
                              border: '1px solid #A7F3D0',
                              color: '#047857',
                              fontSize: '0.78rem',
                              fontWeight: 800,
                              padding: '1px 6px',
                              borderRadius: '6px'
                            }}>
                              {item.quantity}x
                            </span>
                            <span>{item.product_name}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Packed notice */}
                    <div style={{ 
                      fontSize: '0.82rem', 
                      color: '#065F46', 
                      marginBottom: '14px', 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '7px',
                      background: '#ECFDF5',
                      padding: '7px 12px',
                      borderRadius: '8px',
                      border: '1px solid #D1FAE5',
                      fontWeight: 600
                    }}>
                      <CheckCircle2 size={15} color="#059669" />
                      <span>Hot & Packed • Ready for collection</span>
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        className="btn btn-secondary"
                        style={{ padding: '8px 12px', fontSize: '0.84rem' }}
                        onClick={() => onOpenReceipt(ord)}
                        title="Print Thermal POS Receipt"
                      >
                        <Receipt size={16} />
                      </button>
                      <button
                        onClick={() => handleQuickVerify(ord.token_code)}
                        style={{
                          flex: 1,
                          padding: '10px 14px',
                          fontSize: '0.86rem',
                          fontWeight: 800,
                          borderRadius: '10px',
                          border: 'none',
                          background: 'var(--brand-orange)',
                          color: '#FFFFFF',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '8px',
                          boxShadow: '0 4px 14px rgba(238, 67, 34, 0.25)',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <Scan size={16} /> Verify & Hand Over
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Staff QR Pickup Scanner Modal (Section 23 of inst.md) */}
      {scanModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(28, 33, 29, 0.55)',
          backdropFilter: 'blur(8px)',
          zIndex: 1100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            background: '#FFFFFF',
            border: '1px solid var(--border-subtle)',
            borderRadius: '24px',
            maxWidth: '480px',
            width: '100%',
            padding: '28px',
            boxShadow: '0 25px 60px rgba(35, 40, 36, 0.2)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: '#D1FAE5',
                  color: '#059669',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Scan size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
                    Counter Pickup Verification
                  </h3>
                  <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                    Instant QR scan or token check
                  </div>
                </div>
              </div>
              <button
                onClick={() => setScanModalOpen(false)}
                style={{ 
                  background: 'var(--bg-secondary)', 
                  border: 'none', 
                  color: 'var(--text-secondary)', 
                  cursor: 'pointer', 
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700
                }}
              >
                ✕
              </button>
            </div>

            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '18px', lineHeight: 1.5 }}>
              Scan student pass QR code or type the token number (e.g. <strong>B137</strong>, <strong>B138</strong>) to verify authentication before handing over food.
            </p>

            {/* Quick Token Buttons for Easy Demoing */}
            <div style={{ marginBottom: '18px' }}>
              <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', fontWeight: 700, marginBottom: '8px', letterSpacing: '0.04em' }}>
                CLICK ACTIVE TOKEN TO AUTO-FILL:
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {readyOrders.length === 0 ? (
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>No tokens ready at counter</span>
                ) : (
                  readyOrders.map((ro) => (
                    <button
                      key={ro.id}
                      onClick={() => setScanInput(ro.token_code)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '8px',
                        background: '#D1FAE5',
                        border: '1.5px solid #A7F3D0',
                        color: '#047857',
                        fontSize: '0.84rem',
                        fontFamily: 'var(--font-mono)',
                        fontWeight: 800,
                        cursor: 'pointer',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {ro.token_code}
                    </button>
                  ))
                )}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', marginBottom: '18px' }}>
              <input
                type="text"
                placeholder="Enter Token (e.g. B137)..."
                value={scanInput}
                onChange={(e) => setScanInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleManualScan()}
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  borderRadius: '12px',
                  background: 'var(--bg-secondary)',
                  border: '1.5px solid var(--border-subtle)',
                  color: 'var(--text-primary)',
                  fontSize: '1rem',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 700,
                  outline: 'none'
                }}
              />
              <button
                className="btn btn-primary"
                onClick={handleManualScan}
                style={{ padding: '12px 20px', borderRadius: '12px', fontWeight: 700 }}
              >
                Verify
              </button>
            </div>

            {scanResult && (
              <div style={{
                padding: '14px 16px',
                borderRadius: '12px',
                background: scanResult.success ? '#ECFDF5' : '#FEF2F2',
                border: scanResult.success ? '1px solid #A7F3D0' : '1px solid #FECACA',
                color: scanResult.success ? '#065F46' : '#991B1B',
                fontSize: '0.9rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                {scanResult.success ? <CheckCircle2 size={20} color="#059669" /> : <AlertCircle size={20} color="#DC2626" />}
                {scanResult.message}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
