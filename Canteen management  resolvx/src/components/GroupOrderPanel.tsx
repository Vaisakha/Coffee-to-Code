import React from 'react';
import { useCanteen } from '../context/CanteenContext';
import { 
  Users, 
  Lock, 
  Unlock, 
  Utensils, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  CreditCard, 
  LogOut,
  Sparkles,
  ShoppingBag,
  ArrowRight
} from 'lucide-react';

interface GroupOrderPanelProps {
  onClose?: () => void;
  onOpenCart: () => void;
}

export const GroupOrderPanel: React.FC<GroupOrderPanelProps> = ({ onClose, onOpenCart }) => {
  const { 
    activeGroupSession, 
    groupOrders, 
    leaveGroupSession, 
    lockGroupSession, 
    cart, 
    cartSubtotal, 
    cartPackagingFee, 
    cartTotal,
    getGroupSessionMembersCount,
    tableNumber,
    packagingType
  } = useCanteen();

  if (!activeGroupSession) return null;

  const sessionOrders = groupOrders.filter((g) => g.session_id === activeGroupSession.id);
  const isLocked = activeGroupSession.status === 'locked';
  const membersCount = getGroupSessionMembersCount(activeGroupSession.id);

  // Calculate table-level totals
  const tableCombinedTotal = sessionOrders.reduce((acc, g) => acc + g.subtotal + (g.packaging_fee_share || 0), 0);
  const paidMembersCount = sessionOrders.filter((g) => g.payment_status === 'PAID').length;

  return (
    <div style={{
      background: '#FFFFFF',
      border: '1.5px solid var(--border-subtle)',
      borderRadius: '24px',
      padding: '24px',
      boxShadow: 'var(--shadow-md)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background soft ambient highlight */}
      <div style={{
        position: 'absolute',
        top: '-40px',
        right: '-40px',
        width: '140px',
        height: '140px',
        borderRadius: '50%',
        background: 'rgba(238, 67, 34, 0.08)',
        filter: 'blur(30px)',
        pointerEvents: 'none'
      }} />

      {/* Header Bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        gap: '12px',
        paddingBottom: '16px',
        borderBottom: '1px solid var(--border-subtle)',
        marginBottom: '18px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="pulse-dot" style={{ backgroundColor: isLocked ? 'var(--brand-amber)' : 'var(--brand-emerald)' }} />
            <span style={{ 
              fontSize: '0.76rem', 
              fontWeight: 800, 
              color: isLocked ? 'var(--brand-amber)' : 'var(--brand-emerald)',
              letterSpacing: '0.06em',
              textTransform: 'uppercase'
            }}>
              {isLocked ? 'Session Locked 🔒 Ready for Kitchen' : 'Live Group Order • Table Open'}
            </span>
          </div>

          <h3 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.5rem',
            fontWeight: 800,
            color: 'var(--text-primary)',
            marginTop: '2px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <Utensils size={20} color="var(--brand-orange)" /> Table {tableNumber || activeGroupSession.table_number}
          </h3>

          <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
            <Users size={15} color="var(--brand-orange)" />
            <strong>{membersCount} {membersCount === 1 ? 'person has' : 'people have'} joined this table</strong>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {!isLocked ? (
            <button
              className="btn btn-secondary"
              style={{
                fontSize: '0.78rem',
                padding: '6px 12px',
                borderRadius: '999px',
                background: '#FFF7ED',
                borderColor: '#FED7AA',
                color: '#C2410C',
                fontWeight: 700
              }}
              onClick={() => lockGroupSession(activeGroupSession.id)}
              title="Lock session so no new students join, and proceed to submit all tickets"
            >
              <Lock size={13} /> Lock Session
            </button>
          ) : (
            <span style={{
              fontSize: '0.74rem',
              fontWeight: 800,
              padding: '4px 10px',
              borderRadius: '999px',
              background: '#FEF3C7',
              color: '#B45309',
              border: '1px solid #FDE68A'
            }}>
              🔒 Locked ({paidMembersCount}/{sessionOrders.length} Paid)
            </span>
          )}

          <button
            onClick={leaveGroupSession}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '0.78rem',
              padding: '6px'
            }}
            title="Leave table session"
          >
            <LogOut size={14} /> Leave Table
          </button>

          {onClose && (
            <button
              onClick={onClose}
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
                width: '28px',
                height: '28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'var(--text-secondary)'
              }}
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Info Pill: Itemized Split Bill Guarantee */}
      <div style={{
        background: '#FAF7F2',
        border: '1px solid var(--border-subtle)',
        borderRadius: '12px',
        padding: '10px 14px',
        marginBottom: '18px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        fontSize: '0.8rem',
        color: 'var(--text-secondary)'
      }}>
        <ShieldCheck size={18} color="var(--brand-emerald)" style={{ flexShrink: 0 }} />
        <span>
          <strong>Itemized Split-Bill:</strong> Each student pays only for what they personally ordered, plus an equal share of table eco-packaging if chosen. No awkward manual math!
        </span>
      </div>

      {/* Sub-Carts of All Joined Diners */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
        {sessionOrders.map((memberOrder) => {
          const isMe = memberOrder.student_id === 'student-sherin-01';
          const isPaid = memberOrder.payment_status === 'PAID';
          const memberItems = isMe && cart.length > 0
            ? cart.map(c => ({ product_name: c.product.name, quantity: c.quantity, total_price: c.product.price * c.quantity }))
            : memberOrder.items;

          const memberSubtotal = isMe && cart.length > 0 ? cartSubtotal : memberOrder.subtotal;
          const memberPackagingShare = isMe ? cartPackagingFee : (memberOrder.packaging_fee_share || 0);
          const memberTotal = memberSubtotal + memberPackagingShare;

          return (
            <div
              key={memberOrder.id}
              style={{
                background: isMe ? '#FFF9F6' : '#FAF7F2',
                border: isMe ? '1.5px solid var(--brand-orange)' : '1px solid var(--border-subtle)',
                borderRadius: '16px',
                padding: '14px 16px',
                transition: 'all 0.18s ease'
              }}
            >
              {/* Member Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: isMe ? 'var(--brand-orange)' : '#E2E8F0',
                    color: isMe ? '#FFFFFF' : 'var(--text-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '0.76rem'
                  }}>
                    {memberOrder.student_name.slice(0, 1).toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.88rem', color: 'var(--text-primary)' }}>
                      {memberOrder.student_name} {isMe && <span style={{ color: 'var(--brand-orange)', fontSize: '0.74rem' }}>(You)</span>}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {isPaid ? (
                    <span style={{
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      padding: '2px 8px',
                      borderRadius: '999px',
                      background: '#D1FAE5',
                      color: '#065F46',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <CheckCircle2 size={11} /> Paid (Token #{memberOrder.token_code || 'B139'})
                    </span>
                  ) : (
                    <span style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: '999px',
                      background: '#FEF3C7',
                      color: '#92400E'
                    }}>
                      Ordering in cart...
                    </span>
                  )}
                  <span style={{ fontWeight: 800, fontSize: '0.94rem', color: isMe ? 'var(--brand-orange)' : 'var(--text-primary)' }}>
                    ₹{memberTotal}
                  </span>
                </div>
              </div>

              {/* Items List */}
              {memberItems && memberItems.length > 0 ? (
                <div style={{
                  background: '#FFFFFF',
                  borderRadius: '10px',
                  padding: '8px 12px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                  fontSize: '0.8rem',
                  color: 'var(--text-secondary)'
                }}>
                  {memberItems.map((item, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>
                        <strong style={{ color: 'var(--text-primary)' }}>{item.quantity}x</strong> {item.product_name}
                      </span>
                      <span style={{ fontWeight: 600 }}>₹{item.total_price}</span>
                    </div>
                  ))}
                  {memberPackagingShare > 0 && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#059669', fontSize: '0.75rem', paddingTop: '4px', borderTop: '1px dashed #E8E2D6' }}>
                      <span>🌿 Shared Eco-Packaging ({membersCount} diners)</span>
                      <span>+₹{memberPackagingShare}</span>
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontStyle: 'italic', padding: '4px 0' }}>
                  {isMe ? 'Your sub-cart is empty. Browse the menu and add your dishes.' : 'Browsing menu...'}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Table Summary Bar */}
      <div style={{
        background: '#FAF7F2',
        border: '1px solid var(--border-subtle)',
        borderRadius: '16px',
        padding: '14px 18px',
        marginBottom: '18px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
          <span>Table Combined Food Total ({membersCount} people)</span>
          <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>₹{tableCombinedTotal}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.98rem', fontWeight: 800, color: 'var(--text-primary)', borderTop: '1px solid var(--border-subtle)', paddingTop: '8px', marginTop: '6px' }}>
          <span>Your Individual Share to Pay:</span>
          <span style={{ color: 'var(--brand-orange)', fontSize: '1.15rem' }}>₹{cartTotal}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '10px' }}>
        <button
          className="btn btn-secondary"
          style={{ flex: 1, fontSize: '0.86rem', padding: '12px' }}
          onClick={onOpenCart}
        >
          <ShoppingBag size={16} /> View My Cart ({cart.length})
        </button>

        <button
          className="btn btn-primary"
          style={{ flex: 1.4, fontSize: '0.88rem', padding: '12px', borderRadius: '12px' }}
          onClick={onOpenCart}
        >
          Pay My Share (₹{cartTotal}) <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};
