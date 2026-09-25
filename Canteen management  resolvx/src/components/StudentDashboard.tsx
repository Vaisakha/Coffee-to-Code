import React, { useState } from 'react';
import { useCanteen } from '../context/CanteenContext';
import { Product, Order } from '../types';
import { 
  Search, 
  Clock, 
  Star, 
  Plus, 
  Minus, 
  Check, 
  Sparkles, 
  QrCode, 
  Receipt, 
  MessageSquarePlus, 
  Info,
  Flame,
  AlertCircle
} from 'lucide-react';

interface StudentDashboardProps {
  onOpenCart: () => void;
  onOpenQrModal: (order: Order) => void;
  onOpenReceiptModal: (order: Order) => void;
  onOpenFeedbackModal: (order: Order) => void;
  onOpenComplaintModal: () => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  onOpenCart,
  onOpenQrModal,
  onOpenReceiptModal,
  onOpenFeedbackModal,
  onOpenComplaintModal,
}) => {
  const { 
    canteen, 
    categories, 
    products, 
    orders, 
    activeOrder, 
    cart, 
    addToCart, 
    updateCartQuantity 
  } = useCanteen();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [vegOnly, setVegOnly] = useState<boolean>(false);
  const [detailProduct, setDetailProduct] = useState<Product | null>(null);

  // Filter products
  const filteredProducts = products.filter((prod) => {
    const matchesCategory = selectedCategory === 'all' || prod.category_id === selectedCategory;
    const matchesSearch = prod.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          prod.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesVeg = !vegOnly || prod.is_veg;
    return matchesCategory && matchesSearch && matchesVeg;
  });

  // Active queue tokens list for the Live Queue strip
  const activeQueueOrders = orders
    .filter((o) => o.status !== 'PICKED_UP' && o.status !== 'CANCELLED')
    .slice(0, 7);

  return (
    <div style={{ backgroundColor: '#FAF7F2', minHeight: '100vh', paddingBottom: '90px' }}>
      {/* Student Greeting & Status Header */}
      <section style={{ padding: '36px 0 20px' }}>
        <div className="container">
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            gap: '20px'
          }}>
            <div>
              <div style={{ fontSize: '0.84rem', color: '#58615A', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
                <span style={{ color: '#059669' }}>●</span> Connected to {canteen.name}
              </div>
              <h1 style={{
                fontFamily: 'var(--font-display)',
                fontSize: '2.3rem',
                fontWeight: 800,
                color: '#1C211D',
                marginTop: '4px',
                letterSpacing: '-0.03em'
              }}>
                Good evening, Sherin 👋
              </h1>
              <p style={{ color: '#58615A', fontSize: '0.96rem', marginTop: '2px' }}>
                What are you craving today? Queue IQ recommends ordering before the 1:20 PM lunch rush.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <button
                className="btn btn-secondary"
                style={{ fontSize: '0.84rem', background: '#FFFFFF', borderColor: '#E8E2D6' }}
                onClick={onOpenComplaintModal}
              >
                <MessageSquarePlus size={16} /> Help / Issue
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Active Order Card Tracker (if user has active order) */}
      {activeOrder && activeOrder.status !== 'PICKED_UP' && (
        <section style={{ marginBottom: '32px' }}>
          <div className="container">
            <div style={{
              background: '#FFFFFF',
              border: activeOrder.status === 'READY' ? '2px solid #059669' : '1px solid #E8E2D6',
              borderRadius: '24px',
              padding: '24px 28px',
              boxShadow: '0 8px 30px rgba(35, 40, 36, 0.06)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '16px',
                borderBottom: '1px solid #F0ECE2',
                paddingBottom: '18px',
                marginBottom: '18px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{
                    padding: '8px 20px',
                    borderRadius: '16px',
                    background: '#EE4322',
                    color: '#FFFFFF',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 900,
                    fontSize: '1.9rem',
                    letterSpacing: '0.04em',
                    boxShadow: '0 4px 14px rgba(238, 67, 34, 0.25)'
                  }}>
                    {activeOrder.token_code}
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontWeight: 800, fontSize: '1.25rem', color: '#1C211D' }}>Active Order</span>
                      <span className={`badge ${activeOrder.status === 'READY' ? 'badge-green' : activeOrder.status === 'PREPARING' ? 'badge-amber' : 'badge-blue'}`}>
                        {activeOrder.status === 'READY' ? '🔔 READY FOR PICKUP' : activeOrder.status === 'PREPARING' ? '👨‍🍳 PREPARING NOW' : 'WAITING IN QUEUE'}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.84rem', color: '#58615A', marginTop: '2px' }}>
                      {activeOrder.order_type === 'DINE_IN' ? `Dine-In • Table ${activeOrder.table_number || '4'}` : 'Takeaway Parcel'} • Estimated ready: <strong style={{ color: '#1C211D' }}>{activeOrder.estimated_ready_time}</strong>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <button
                    className="btn btn-secondary"
                    style={{ fontSize: '0.84rem', background: '#FAF7F2' }}
                    onClick={() => onOpenReceiptModal(activeOrder)}
                  >
                    <Receipt size={16} /> Thermal Ticket
                  </button>
                  <button
                    className="btn btn-primary"
                    style={{ fontSize: '0.88rem' }}
                    onClick={() => onOpenQrModal(activeOrder)}
                  >
                    <QrCode size={16} /> Show Pickup QR
                  </button>
                </div>
              </div>

              {/* Progress Steps Timeline */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '8px',
                marginTop: '16px'
              }}>
                {[
                  { key: 'ACCEPTED', label: 'Order Placed', done: true },
                  { key: 'ACCEPTED_2', label: 'Kitchen Accepted', done: activeOrder.status === 'ACCEPTED' || activeOrder.status === 'PREPARING' || activeOrder.status === 'READY' },
                  { key: 'PREPARING', label: 'Cooking Hot', done: activeOrder.status === 'PREPARING' || activeOrder.status === 'READY' },
                  { key: 'READY', label: 'Counter Pickup', done: activeOrder.status === 'READY' },
                ].map((step, idx) => (
                  <div key={idx} style={{ textAlign: 'center' }}>
                    <div style={{
                      height: '6px',
                      borderRadius: '4px',
                      background: step.done ? (activeOrder.status === 'READY' ? '#059669' : '#EE4322') : '#E8E2D6',
                      marginBottom: '8px',
                      transition: 'background 0.3s ease'
                    }} />
                    <div style={{
                      fontSize: '0.76rem',
                      fontWeight: step.done ? 700 : 500,
                      color: step.done ? '#1C211D' : '#8A948C'
                    }}>
                      {step.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* Ready Announcement Banner */}
              {activeOrder.status === 'READY' && (
                <div style={{
                  marginTop: '18px',
                  background: 'rgba(5, 150, 105, 0.08)',
                  border: '1px solid rgba(5, 150, 105, 0.25)',
                  padding: '12px 18px',
                  borderRadius: '14px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '12px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span className="pulse-dot" style={{ backgroundColor: '#059669' }} />
                    <span style={{ fontSize: '0.92rem', color: '#047857', fontWeight: 600 }}>
                      Your order is ready and waiting at <strong>Counter 1</strong>! Please present your QR code.
                    </span>
                  </div>
                  <button 
                    className="btn btn-success" 
                    style={{ fontSize: '0.8rem', padding: '6px 14px' }}
                    onClick={() => onOpenQrModal(activeOrder)}
                  >
                    Scan at Counter
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Live Queue Strip */}
      <section style={{ marginBottom: '32px' }}>
        <div className="container">
          <div style={{
            background: '#FFFFFF',
            border: '1px solid #E8E2D6',
            borderRadius: '16px',
            padding: '14px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            overflowX: 'auto',
            boxShadow: '0 2px 10px rgba(35, 40, 36, 0.03)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.8rem',
              fontWeight: 800,
              color: '#EE4322',
              whiteSpace: 'nowrap',
              textTransform: 'uppercase',
              letterSpacing: '0.04em'
            }}>
              <Flame size={15} /> Live Token Radar:
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'nowrap' }}>
              {activeQueueOrders.map((ord) => {
                const isMyToken = activeOrder?.id === ord.id;
                return (
                  <div
                    key={ord.id}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '5px 12px',
                      borderRadius: '10px',
                      background: isMyToken ? 'rgba(238, 67, 34, 0.12)' : '#FAF7F2',
                      border: isMyToken ? '1px solid #EE4322' : '1px solid #E8E2D6',
                      whiteSpace: 'nowrap',
                      fontSize: '0.82rem'
                    }}
                  >
                    <span style={{
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 800,
                      color: isMyToken ? '#EE4322' : '#1C211D'
                    }}>
                      {ord.token_code}
                    </span>
                    <span style={{
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      color: ord.status === 'READY' ? '#059669' : ord.status === 'PREPARING' ? '#D97706' : '#58615A'
                    }}>
                      {ord.status}
                    </span>
                    {isMyToken && (
                      <span style={{
                        background: '#EE4322',
                        color: '#FFF',
                        fontSize: '0.65rem',
                        fontWeight: 900,
                        padding: '1px 5px',
                        borderRadius: '4px'
                      }}>YOU</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Search & Category Filter Bar */}
      <section style={{ marginBottom: '28px' }}>
        <div className="container">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Search Input & Veg Filter */}
            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', alignItems: 'center' }}>
              <div style={{ flex: 1, minWidth: '260px', position: 'relative' }}>
                <Search size={18} color="#8A948C" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  placeholder="Search biriyani, porotta, rolls, samosa, chai..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '13px 18px 13px 46px',
                    borderRadius: '14px',
                    background: '#FFFFFF',
                    border: '1px solid #E8E2D6',
                    color: '#1C211D',
                    fontFamily: 'var(--font-sans)',
                    fontSize: '0.94rem',
                    outline: 'none',
                    boxShadow: '0 2px 6px rgba(35, 40, 36, 0.03)'
                  }}
                />
              </div>

              {/* Veg Toggle */}
              <button
                onClick={() => setVegOnly(!vegOnly)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '11px 18px',
                  borderRadius: '14px',
                  border: vegOnly ? '1px solid #059669' : '1px solid #E8E2D6',
                  background: vegOnly ? 'rgba(5, 150, 105, 0.1)' : '#FFFFFF',
                  color: vegOnly ? '#059669' : '#58615A',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                <span style={{
                  width: '14px',
                  height: '14px',
                  borderRadius: '3px',
                  border: '1.5px solid #059669',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#059669' }} />
                </span>
                Pure Veg
              </button>
            </div>

            {/* Category Pills */}
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
              <button
                onClick={() => setSelectedCategory('all')}
                style={{
                  padding: '9px 18px',
                  borderRadius: '999px',
                  border: selectedCategory === 'all' ? '1px solid #EE4322' : '1px solid #E8E2D6',
                  background: selectedCategory === 'all' ? '#EE4322' : '#FFFFFF',
                  color: selectedCategory === 'all' ? '#FFFFFF' : '#58615A',
                  fontWeight: selectedCategory === 'all' ? 700 : 500,
                  fontSize: '0.86rem',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  boxShadow: '0 2px 6px rgba(35, 40, 36, 0.03)'
                }}
              >
                All Menu
              </button>

              {categories.map((cat) => {
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    style={{
                      padding: '9px 18px',
                      borderRadius: '999px',
                      border: isSelected ? '1px solid #EE4322' : '1px solid #E8E2D6',
                      background: isSelected ? '#EE4322' : '#FFFFFF',
                      color: isSelected ? '#FFFFFF' : '#58615A',
                      fontWeight: isSelected ? 700 : 500,
                      fontSize: '0.86rem',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      boxShadow: '0 2px 6px rgba(35, 40, 36, 0.03)'
                    }}
                  >
                    {cat.name}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Food Cards Grid */}
      <section>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '24px'
          }}>
            {filteredProducts.map((prod) => {
              const inCartItem = cart.find((item) => item.product.id === prod.id);
              const isSoldOut = prod.availability === 'SOLD_OUT' || prod.stock_quantity <= 0;

              return (
                <div
                  key={prod.id}
                  style={{
                    background: '#FFFFFF',
                    border: '1px solid #E8E2D6',
                    borderRadius: '18px',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    boxShadow: '0 4px 16px rgba(35, 40, 36, 0.05)',
                    opacity: isSoldOut ? 0.65 : 1,
                    transition: 'transform 0.25s ease, box-shadow 0.25s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.boxShadow = '0 10px 25px rgba(35, 40, 36, 0.08)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 16px rgba(35, 40, 36, 0.05)';
                  }}
                >
                  {/* Food Image Banner */}
                  <div 
                    style={{
                      height: '180px',
                      position: 'relative',
                      cursor: 'pointer',
                      overflow: 'hidden'
                    }}
                    onClick={() => setDetailProduct(prod)}
                  >
                    <img
                      src={prod.image_url}
                      alt={prod.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />

                    {/* Prep Time Badge */}
                    <div style={{
                      position: 'absolute',
                      bottom: '12px',
                      left: '12px',
                      background: 'rgba(255, 255, 255, 0.92)',
                      backdropFilter: 'blur(8px)',
                      padding: '4px 10px',
                      borderRadius: '8px',
                      fontSize: '0.74rem',
                      fontWeight: 700,
                      color: '#1C211D',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)'
                    }}>
                      <Clock size={12} color="#EE4322" /> {prod.prep_time_minutes} min prep
                    </div>

                    {/* Veg / Non-Veg Indicator */}
                    <div style={{
                      position: 'absolute',
                      top: '12px',
                      left: '12px',
                      width: '18px',
                      height: '18px',
                      borderRadius: '4px',
                      background: '#FFFFFF',
                      border: prod.is_veg ? '1.5px solid #059669' : '1.5px solid #E11D48',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)'
                    }}>
                      <span style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: prod.is_veg ? '50%' : '2px',
                        backgroundColor: prod.is_veg ? '#059669' : '#E11D48'
                      }} />
                    </div>

                    {/* Badges */}
                    {isSoldOut ? (
                      <span className="badge badge-red" style={{ position: 'absolute', top: '12px', right: '12px' }}>
                        Sold Out
                      </span>
                    ) : prod.stock_quantity <= 5 ? (
                      <span className="badge badge-amber" style={{ position: 'absolute', top: '12px', right: '12px' }}>
                        Only {prod.stock_quantity} Left
                      </span>
                    ) : prod.is_popular ? (
                      <span className="badge badge-purple" style={{ position: 'absolute', top: '12px', right: '12px' }}>
                        🔥 Popular
                      </span>
                    ) : null}
                  </div>

                  {/* Food Info Body */}
                  <div style={{ padding: '18px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                      <h3
                        style={{
                          fontSize: '1.08rem',
                          fontWeight: 700,
                          color: '#1C211D',
                          cursor: 'pointer',
                          lineHeight: 1.3
                        }}
                        onClick={() => setDetailProduct(prod)}
                      >
                        {prod.name}
                      </h3>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '3px',
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        color: '#D97706',
                        background: 'rgba(217, 119, 6, 0.1)',
                        padding: '2px 6px',
                        borderRadius: '6px'
                      }}>
                        <Star size={12} fill="#D97706" /> {prod.rating}
                      </div>
                    </div>

                    <p style={{
                      fontSize: '0.82rem',
                      color: '#58615A',
                      lineHeight: 1.45,
                      marginBottom: '16px',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {prod.description}
                    </p>

                    {/* Price and Cart Controls */}
                    <div style={{
                      marginTop: 'auto',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderTop: '1px solid #F0ECE2',
                      paddingTop: '14px'
                    }}>
                      <div>
                        <span style={{ fontSize: '0.74rem', color: '#8A948C' }}>Price</span>
                        <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#EE4322' }}>
                          ₹{prod.price}
                        </div>
                      </div>

                      {inCartItem ? (
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          background: 'rgba(238, 67, 34, 0.1)',
                          border: '1px solid rgba(238, 67, 34, 0.25)',
                          borderRadius: '12px',
                          padding: '4px 6px'
                        }}>
                          <button
                            onClick={() => updateCartQuantity(prod.id, -1)}
                            style={{
                              width: '28px',
                              height: '28px',
                              borderRadius: '8px',
                              border: 'none',
                              background: '#EE4322',
                              color: '#FFF',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer'
                            }}
                          >
                            <Minus size={14} />
                          </button>
                          <span style={{ fontWeight: 800, fontSize: '0.9rem', color: '#1C211D', minWidth: '18px', textAlign: 'center' }}>
                            {inCartItem.quantity}
                          </span>
                          <button
                            onClick={() => updateCartQuantity(prod.id, 1)}
                            style={{
                              width: '28px',
                              height: '28px',
                              borderRadius: '8px',
                              border: 'none',
                              background: '#EE4322',
                              color: '#FFF',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer'
                            }}
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      ) : (
                        <button
                          className="btn btn-primary"
                          style={{
                            padding: '8px 18px',
                            fontSize: '0.86rem',
                            borderRadius: '999px',
                            opacity: isSoldOut ? 0.4 : 1,
                            cursor: isSoldOut ? 'not-allowed' : 'pointer'
                          }}
                          disabled={isSoldOut}
                          onClick={() => addToCart(prod)}
                        >
                          <Plus size={16} /> Add
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Food Detail Modal */}
      {detailProduct && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(28, 33, 29, 0.6)',
          backdropFilter: 'blur(8px)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div style={{
            background: '#FFFFFF',
            border: '1px solid #E8E2D6',
            borderRadius: '24px',
            maxWidth: '520px',
            width: '100%',
            overflow: 'hidden',
            boxShadow: '0 25px 50px rgba(35, 40, 36, 0.15)'
          }}>
            <div style={{ height: '220px', position: 'relative' }}>
              <img
                src={detailProduct.image_url}
                alt={detailProduct.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <button
                onClick={() => setDetailProduct(null)}
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: 'rgba(0, 0, 0, 0.6)',
                  border: 'none',
                  color: '#FFF',
                  cursor: 'pointer',
                  fontWeight: 700,
                  fontSize: '1rem'
                }}
              >
                ✕
              </button>
            </div>

            <div style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <div>
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1C211D' }}>{detailProduct.name}</h2>
                  <div style={{ fontSize: '0.84rem', color: '#58615A', marginTop: '2px' }}>
                    {detailProduct.is_veg ? '🌱 100% Vegetarian' : '🍗 Non-Vegetarian'} • {detailProduct.prep_time_minutes} min prep time
                  </div>
                </div>
                <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#EE4322' }}>
                  ₹{detailProduct.price}
                </div>
              </div>

              <p style={{ color: '#58615A', fontSize: '0.92rem', lineHeight: 1.5, margin: '14px 0 18px' }}>
                {detailProduct.description}
              </p>

              {detailProduct.allergens.length > 0 && (
                <div style={{ marginBottom: '18px' }}>
                  <div style={{ fontSize: '0.78rem', color: '#8A948C', fontWeight: 700, marginBottom: '6px' }}>
                    ALLERGEN INFORMATION:
                  </div>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {detailProduct.allergens.map((alg, i) => (
                      <span key={i} className="badge badge-amber" style={{ fontSize: '0.72rem' }}>
                        Contains {alg}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div style={{
                background: '#FAF7F2',
                border: '1px solid #E8E2D6',
                padding: '12px 16px',
                borderRadius: '12px',
                fontSize: '0.84rem',
                color: '#58615A',
                marginBottom: '20px'
              }}>
                <Info size={14} color="#EE4322" style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
                Smart Queue IQ: Estimated cooking preparation takes ~{detailProduct.prep_time_minutes} minutes upon kitchen acceptance.
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  className="btn btn-secondary"
                  style={{ flex: 1, background: '#FAF7F2' }}
                  onClick={() => setDetailProduct(null)}
                >
                  Close
                </button>
                <button
                  className="btn btn-primary"
                  style={{ flex: 2, borderRadius: '999px' }}
                  onClick={() => {
                    addToCart(detailProduct);
                    setDetailProduct(null);
                    onOpenCart();
                  }}
                >
                  Add to Tray & View Checkout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
