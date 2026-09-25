import React, { useState } from 'react';
import { useCanteen } from '../context/CanteenContext';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  Clock, 
  Tag, 
  ShieldCheck, 
  ArrowRight, 
  CreditCard, 
  Smartphone, 
  Wallet,
  Sparkles,
  AlertTriangle
} from 'lucide-react';
import { Order } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderSuccess: (order: Order) => void;
  onOpenWallet?: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose, onOrderSuccess, onOpenWallet }) => {
  const { 
    cart, 
    updateCartQuantity, 
    removeFromCart, 
    clearCart,
    orderType, 
    setOrderType, 
    tableNumber, 
    setTableNumber, 
    packagingType, 
    setPackagingType,
    selectedPickupSlot,
    setSelectedPickupSlot,
    appliedCoupon,
    applyCouponCode,
    removeCoupon,
    cartSubtotal,
    cartPackagingFee,
    cartDiscount,
    cartTotal,
    placeOrder,
    canteen,
    walletBalance
  } = useCanteen();

  const [couponInput, setCouponInput] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'RAZORPAY_TEST' | 'UPI' | 'WALLET'>('RAZORPAY_TEST');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState('');

  if (!isOpen) return null;

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setIsProcessing(true);

    if (paymentMethod === 'WALLET') {
      setProcessingStep('Authorizing 1-Click Wallet Pay...');
    } else {
      setProcessingStep('Connecting to Payment Gateway...');
    }

    setTimeout(() => {
      setProcessingStep('Authorizing payment with campus clearing...');
    }, 800);

    setTimeout(() => {
      setProcessingStep('Server verifying transaction & deducting inventory...');
    }, 1600);

    setTimeout(async () => {
      try {
        const order = await placeOrder(paymentMethod);
        setIsProcessing(false);
        onClose();
        onOrderSuccess(order);
      } catch (err) {
        setIsProcessing(false);
      }
    }, 2400);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 1000,
      display: 'flex',
      justifyContent: 'flex-end',
      background: 'rgba(0, 0, 0, 0.7)',
      backdropFilter: 'blur(8px)',
    }}>
      {/* Click outside to close */}
      <div style={{ flex: 1 }} onClick={onClose} />

      {/* Drawer Panel */}
      <div style={{
        width: '100%',
        maxWidth: '480px',
        height: '100vh',
        background: '#FFFFFF',
        borderLeft: '1px solid #E8E2D6',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '-10px 0 35px rgba(35, 40, 36, 0.15)',
        overflowY: 'auto'
      }}>
        {/* Drawer Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid #F0ECE2',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'sticky',
          top: 0,
          background: '#FFFFFF',
          zIndex: 10
        }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1C211D' }}>Your Food Cart</h2>
            <div style={{ fontSize: '0.8rem', color: '#58615A' }}>{cart.length} unique items selected</div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: '#FAF7F2',
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

        {/* Drawer Body */}
        <div style={{ padding: '20px 24px', flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#58615A' }}>
              <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🍽</div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#1C211D', marginBottom: '6px' }}>Nothing cooking yet</h3>
              <p style={{ fontSize: '0.88rem', maxWidth: '280px', margin: '0 auto 20px', color: '#707970' }}>
                Your tray is currently empty. Explore the campus canteen menu and add your favorite dishes.
              </p>
              <button className="btn btn-primary" style={{ borderRadius: '999px' }} onClick={onClose}>
                Browse Menu
              </button>
            </div>
          ) : (
            <>
              {/* Itemized List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {cart.map((item) => (
                  <div
                    key={item.product.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      background: '#FAF7F2',
                      border: '1px solid #E8E2D6',
                      padding: '12px',
                      borderRadius: '14px'
                    }}
                  >
                    <img
                      src={item.product.image_url}
                      alt={item.product.name}
                      style={{ width: '52px', height: '52px', borderRadius: '10px', objectFit: 'cover' }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1C211D', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {item.product.name}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#58615A' }}>
                        ₹{item.product.price} each
                      </div>
                    </div>

                    {/* Quantity controls */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <button
                        onClick={() => updateCartQuantity(item.product.id, -1)}
                        style={{
                          width: '26px',
                          height: '26px',
                          borderRadius: '8px',
                          background: '#E8E2D6',
                          border: 'none',
                          color: '#1C211D',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <Minus size={12} />
                      </button>
                      <span style={{ fontWeight: 800, fontSize: '0.88rem', color: '#1C211D', minWidth: '16px', textAlign: 'center' }}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(item.product.id, 1)}
                        style={{
                          width: '26px',
                          height: '26px',
                          borderRadius: '8px',
                          background: '#EE4322',
                          border: 'none',
                          color: '#FFF',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <Plus size={12} />
                      </button>
                    </div>

                    <div style={{ fontWeight: 800, fontSize: '0.94rem', color: '#EE4322', minWidth: '45px', textAlign: 'right' }}>
                      ₹{item.product.price * item.quantity}
                    </div>

                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#8A948C',
                        cursor: 'pointer',
                        padding: '4px'
                      }}
                      title="Remove"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Order Type Toggle: Dine-In vs Takeaway */}
              <div style={{
                background: '#FAF7F2',
                border: '1px solid #E8E2D6',
                padding: '16px',
                borderRadius: '16px'
              }}>
                <div style={{ fontSize: '0.78rem', color: '#58615A', fontWeight: 700, marginBottom: '10px' }}>
                  ORDER DINING PREFERENCE:
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <button
                    onClick={() => setOrderType('DINE_IN')}
                    style={{
                      padding: '10px',
                      borderRadius: '10px',
                      border: orderType === 'DINE_IN' ? '1px solid #EE4322' : '1px solid #E8E2D6',
                      background: orderType === 'DINE_IN' ? '#EE4322' : '#FFFFFF',
                      color: orderType === 'DINE_IN' ? '#FFFFFF' : '#58615A',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      cursor: 'pointer'
                    }}
                  >
                    🍽 Dine-In
                  </button>
                  <button
                    onClick={() => setOrderType('TAKEAWAY')}
                    style={{
                      padding: '10px',
                      borderRadius: '10px',
                      border: orderType === 'TAKEAWAY' ? '1px solid #EE4322' : '1px solid #E8E2D6',
                      background: orderType === 'TAKEAWAY' ? '#EE4322' : '#FFFFFF',
                      color: orderType === 'TAKEAWAY' ? '#FFFFFF' : '#58615A',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      cursor: 'pointer'
                    }}
                  >
                    📦 Takeaway Parcel
                  </button>
                </div>

                {orderType === 'DINE_IN' ? (
                  <div style={{ marginTop: '12px' }}>
                    <label style={{ fontSize: '0.76rem', color: '#58615A', display: 'block', marginBottom: '4px' }}>
                      Table Number (Optional or from QR)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Table 4"
                      value={tableNumber}
                      onChange={(e) => setTableNumber(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: '10px',
                        background: '#FFFFFF',
                        border: '1px solid #E8E2D6',
                        color: '#1C211D',
                        fontSize: '0.88rem'
                      }}
                    />
                  </div>
                ) : (
                  <div style={{ marginTop: '12px' }}>
                    <label style={{ fontSize: '0.76rem', color: '#58615A', display: 'block', marginBottom: '6px' }}>
                      Packaging Material
                    </label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => setPackagingType('NORMAL')}
                        style={{
                          flex: 1,
                          padding: '8px 10px',
                          borderRadius: '8px',
                          border: packagingType === 'NORMAL' ? '1px solid #0284C7' : '1px solid #E8E2D6',
                          background: packagingType === 'NORMAL' ? 'rgba(2, 132, 199, 0.1)' : '#FFFFFF',
                          color: packagingType === 'NORMAL' ? '#0284C7' : '#58615A',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          cursor: 'pointer'
                        }}
                      >
                        Standard (+₹0)
                      </button>
                      <button
                        onClick={() => setPackagingType('ECO')}
                        style={{
                          flex: 1,
                          padding: '8px 10px',
                          borderRadius: '8px',
                          border: packagingType === 'ECO' ? '1px solid #059669' : '1px solid #E8E2D6',
                          background: packagingType === 'ECO' ? 'rgba(5, 150, 105, 0.1)' : '#FFFFFF',
                          color: packagingType === 'ECO' ? '#059669' : '#58615A',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          cursor: 'pointer'
                        }}
                      >
                        🌿 Eco-Friendly (+₹5)
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Smart Pickup Scheduling */}
              <div style={{
                background: '#FAF7F2',
                border: '1px solid #E8E2D6',
                padding: '16px',
                borderRadius: '16px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <div style={{ fontSize: '0.78rem', color: '#58615A', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Clock size={13} color="#EE4322" /> QUEUE IQ PICKUP TIME:
                  </div>
                  <span style={{ fontSize: '0.72rem', color: '#059669', fontWeight: 700 }}>Optimal: ASAP</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
                  {[
                    `ASAP (~${canteen.avg_prep_time_minutes}m)`,
                    '1:15 PM',
                    '1:30 PM (Busy ⚠️)',
                  ].map((slot) => {
                    const isSelected = selectedPickupSlot.startsWith(slot.slice(0, 4));
                    return (
                      <button
                        key={slot}
                        onClick={() => setSelectedPickupSlot(slot)}
                        style={{
                          padding: '8px 6px',
                          borderRadius: '8px',
                          border: isSelected ? '1px solid #EE4322' : '1px solid #E8E2D6',
                          background: isSelected ? '#EE4322' : '#FFFFFF',
                          color: isSelected ? '#FFFFFF' : '#58615A',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          textAlign: 'center'
                        }}
                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Coupon Code Section */}
              <div style={{
                background: '#FAF7F2',
                border: '1px solid #E8E2D6',
                padding: '14px',
                borderRadius: '16px'
              }}>
                {appliedCoupon ? (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Tag size={16} color="#059669" />
                      <span style={{ fontWeight: 800, color: '#059669', fontSize: '0.88rem' }}>
                        {appliedCoupon.code} Applied (-₹{cartDiscount})
                      </span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      style={{ background: 'transparent', border: 'none', color: '#EE4322', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 700 }}
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                      type="text"
                      placeholder="Coupon: BITEQ50 or CAMPUS10"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      style={{
                        flex: 1,
                        padding: '10px 14px',
                        borderRadius: '10px',
                        background: '#FFFFFF',
                        border: '1px solid #E8E2D6',
                        color: '#1C211D',
                        fontSize: '0.88rem'
                      }}
                    />
                    <button
                      className="btn btn-secondary"
                      style={{ fontSize: '0.82rem', padding: '8px 16px', background: '#FFFFFF' }}
                      onClick={() => {
                        if (applyCouponCode(couponInput)) {
                          setCouponInput('');
                        }
                      }}
                    >
                      Apply
                    </button>
                  </div>
                )}
              </div>

              {/* Payment Method Selector */}
              <div style={{
                background: '#FAF7F2',
                border: '1px solid #E8E2D6',
                padding: '16px',
                borderRadius: '16px'
              }}>
                <div style={{ fontSize: '0.78rem', color: '#58615A', fontWeight: 700, marginBottom: '10px' }}>
                  PAYMENT GATEWAY (TEST MODE):
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                  {[
                    { id: 'WALLET', label: `Pay from Wallet`, icon: Wallet },
                    { id: 'UPI', label: 'UPI / GPay', icon: Smartphone },
                    { id: 'RAZORPAY_TEST', label: 'Cards / NetBanking', icon: CreditCard },
                  ].map(({ id, label, icon: Icon }) => (
                    <button
                      key={id}
                      onClick={() => setPaymentMethod(id as any)}
                      style={{
                        padding: '10px 6px',
                        borderRadius: '10px',
                        border: paymentMethod === id ? '2px solid #EE4322' : '1px solid #E8E2D6',
                        background: paymentMethod === id ? '#FFF9F6' : '#FFFFFF',
                        color: paymentMethod === id ? '#EE4322' : '#58615A',
                        fontSize: '0.76rem',
                        fontWeight: paymentMethod === id ? 800 : 600,
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <Icon size={16} color={paymentMethod === id ? '#EE4322' : '#8A948C'} />
                      {label}
                    </button>
                  ))}
                </div>

                {/* Wallet Balance Status Banner */}
                {paymentMethod === 'WALLET' && (
                  <div style={{
                    marginTop: '12px',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    background: walletBalance >= cartTotal ? '#E6F4EA' : '#FCE8E6',
                    border: walletBalance >= cartTotal ? '1px solid #CEEAD6' : '1px solid #FAD2CF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '0.8rem'
                  }}>
                    <span style={{ fontWeight: 700, color: walletBalance >= cartTotal ? '#137333' : '#C5221F' }}>
                      {walletBalance >= cartTotal 
                        ? `✓ Pay from Wallet (Balance: ₹${walletBalance})` 
                        : `⚠️ Insufficient Balance (Available: ₹${walletBalance})`}
                    </span>
                    {walletBalance < cartTotal && onOpenWallet && (
                      <button
                        onClick={onOpenWallet}
                        style={{
                          background: '#EE4322',
                          color: '#FFFFFF',
                          border: 'none',
                          borderRadius: '8px',
                          padding: '4px 10px',
                          fontSize: '0.74rem',
                          fontWeight: 800,
                          cursor: 'pointer'
                        }}
                      >
                        + Top Up
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Pricing Breakdown Summary */}
              <div style={{
                background: '#FAF7F2',
                border: '1px solid #E8E2D6',
                padding: '18px',
                borderRadius: '16px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.86rem', color: '#58615A', marginBottom: '6px' }}>
                  <span>Cart Subtotal</span>
                  <span style={{ fontWeight: 600, color: '#1C211D' }}>₹{cartSubtotal}</span>
                </div>
                {orderType === 'TAKEAWAY' && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.86rem', color: '#58615A', marginBottom: '6px' }}>
                    <span>Packaging Charge</span>
                    <span style={{ fontWeight: 600, color: '#1C211D' }}>₹{cartPackagingFee}</span>
                  </div>
                )}
                {cartDiscount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.86rem', color: '#059669', marginBottom: '6px' }}>
                    <span>Coupon Discount</span>
                    <span style={{ fontWeight: 700 }}>-₹{cartDiscount}</span>
                  </div>
                )}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '1.3rem',
                  fontWeight: 900,
                  color: '#1C211D',
                  borderTop: '1px solid #E8E2D6',
                  paddingTop: '10px',
                  marginTop: '8px'
                }}>
                  <span>Final Total</span>
                  <span style={{ color: '#EE4322' }}>₹{cartTotal}</span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Checkout Button Bar */}
        {cart.length > 0 && (
          <div style={{
            padding: '20px 24px',
            borderTop: '1px solid #F0ECE2',
            background: '#FFFFFF',
            position: 'sticky',
            bottom: 0
          }}>
            {isProcessing ? (
              <div style={{
                padding: '14px',
                background: 'rgba(238, 67, 34, 0.08)',
                border: '1px solid rgba(238, 67, 34, 0.25)',
                borderRadius: '14px',
                textAlign: 'center'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', color: '#EE4322', fontWeight: 700, fontSize: '0.92rem' }}>
                  <span className="pulse-dot" style={{ backgroundColor: '#EE4322' }} />
                  {processingStep}
                </div>
              </div>
            ) : (
              <button
                className="btn btn-primary"
                style={{ width: '100%', padding: '15px', fontSize: '1.05rem', borderRadius: '999px' }}
                onClick={handleCheckout}
              >
                Pay ₹{cartTotal} & Generate Token <ArrowRight size={18} />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
