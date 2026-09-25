import React, { useState } from 'react';
import { useCanteen } from '../context/CanteenContext';
import { Product, Ingredient, Order } from '../types';
import { 
  TrendingUp, 
  DollarSign, 
  ShoppingBag, 
  Clock, 
  Plus, 
  Edit3, 
  Trash2, 
  AlertTriangle, 
  CheckCircle2, 
  Receipt, 
  Package, 
  Utensils, 
  Layers, 
  MessageSquare,
  Sparkles,
  RefreshCw,
  Search
} from 'lucide-react';

interface AdminDashboardProps {
  onOpenReceipt: (order: Order) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onOpenReceipt }) => {
  const { 
    orders, 
    products, 
    ingredients, 
    complaints, 
    updateProduct, 
    addProduct, 
    restockIngredient, 
    resolveComplaint,
    canteen,
    categories
  } = useCanteen();

  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'MENU' | 'INVENTORY' | 'ORDERS' | 'COMPLAINTS'>('OVERVIEW');
  const [addFoodModalOpen, setAddFoodModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // New Food Form State
  const [newFood, setNewFood] = useState({
    name: '',
    category_id: categories[0]?.id || '',
    price: 60,
    prep_time_minutes: 8,
    is_veg: true,
    description: '',
    image_url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80',
    stock_quantity: 40,
  });

  // Calculate Metrics
  const totalRevenue = orders.reduce((acc, o) => acc + (o.payment_status === 'PAID' ? o.total_amount : 0), 0);
  const totalOrders = orders.length;
  const activeOrdersCount = orders.filter((o) => o.status === 'ACCEPTED' || o.status === 'PREPARING' || o.status === 'PENDING').length;
  const lowStockCount = ingredients.filter((i) => i.status === 'LOW' || i.status === 'CRITICAL' || i.status === 'OUT_OF_STOCK').length;

  const handleSaveNewFood = () => {
    if (!newFood.name.trim()) return;
    const prod: Product = {
      id: `prod-${Date.now()}`,
      canteen_id: canteen.id,
      category_id: newFood.category_id,
      name: newFood.name,
      description: newFood.description || 'Freshly prepared daily in campus kitchen.',
      price: Number(newFood.price),
      image_url: newFood.image_url,
      prep_time_minutes: Number(newFood.prep_time_minutes),
      is_veg: newFood.is_veg,
      allergens: [],
      is_popular: false,
      is_featured: false,
      stock_quantity: Number(newFood.stock_quantity),
      availability: 'AVAILABLE',
      rating: 4.8,
      review_count: 0,
    };
    addProduct(prod);
    setAddFoodModalOpen(false);
    setNewFood({
      name: '',
      category_id: categories[0]?.id || '',
      price: 60,
      prep_time_minutes: 8,
      is_veg: true,
      description: '',
      image_url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80',
      stock_quantity: 40,
    });
  };

  return (
    <div style={{ padding: '28px 0 80px' }}>
      <div className="container">
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '28px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="pulse-dot" style={{ backgroundColor: '#10B981' }} />
              <span style={{ fontSize: '0.8rem', color: '#10B981', fontWeight: 800 }}>CANTEEN OPERATIONS CONTROL</span>
            </div>
            <h1 style={{ fontSize: '1.9rem', fontWeight: 800, marginTop: '2px' }}>
              Admin Operations Center
            </h1>
            <p style={{ fontSize: '0.86rem', color: '#94A3B8' }}>
              Manage menus, automated inventory deductions, live thermal POS printing, and student complaints.
            </p>
          </div>

          {/* Tab Navigation Pill Dock */}
          <div style={{
            display: 'flex',
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '14px',
            padding: '4px',
            gap: '4px',
            flexWrap: 'wrap'
          }}>
            {[
              { id: 'OVERVIEW', label: 'Overview', icon: TrendingUp },
              { id: 'MENU', label: 'Menu & Stock', icon: Utensils },
              { id: 'INVENTORY', label: 'Inventory', icon: Layers },
              { id: 'ORDERS', label: 'Live POS Orders', icon: ShoppingBag },
              { id: 'COMPLAINTS', label: `Complaints (${complaints.length})`, icon: MessageSquare },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as any)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 14px',
                  borderRadius: '10px',
                  border: 'none',
                  background: activeTab === id ? 'rgba(255, 255, 255, 0.12)' : 'transparent',
                  color: activeTab === id ? '#FFF' : '#94A3B8',
                  fontWeight: activeTab === id ? 700 : 500,
                  fontSize: '0.84rem',
                  cursor: 'pointer'
                }}
              >
                <Icon size={15} />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'OVERVIEW' && (
          <div>
            {/* Top Metric Cards */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '20px',
              marginBottom: '28px'
            }}>
              <div className="glass-card" style={{ padding: '22px' }}>
                <div style={{ fontSize: '0.8rem', color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <DollarSign size={16} color="#10B981" /> Today's Gross Revenue
                </div>
                <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#F8FAFC', marginTop: '6px' }}>
                  ₹{totalRevenue}
                </div>
                <div style={{ fontSize: '0.74rem', color: '#10B981', marginTop: '4px' }}>
                  ↑ 18.4% compared to yesterday
                </div>
              </div>

              <div className="glass-card" style={{ padding: '22px' }}>
                <div style={{ fontSize: '0.8rem', color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ShoppingBag size={16} color="#38BDF8" /> Total Orders Logged
                </div>
                <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#F8FAFC', marginTop: '6px' }}>
                  {totalOrders}
                </div>
                <div style={{ fontSize: '0.74rem', color: '#38BDF8', marginTop: '4px' }}>
                  Avg ticket size: ₹{Math.round(totalRevenue / (totalOrders || 1))}
                </div>
              </div>

              <div className="glass-card" style={{ padding: '22px' }}>
                <div style={{ fontSize: '0.8rem', color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Clock size={16} color="#F59E0B" /> Active Cooking Tickets
                </div>
                <div style={{ fontSize: '2.2rem', fontWeight: 900, color: '#F8FAFC', marginTop: '6px' }}>
                  {activeOrdersCount}
                </div>
                <div style={{ fontSize: '0.74rem', color: '#F59E0B', marginTop: '4px' }}>
                  Kitchen running on schedule
                </div>
              </div>

              <div className="glass-card" style={{ padding: '22px' }}>
                <div style={{ fontSize: '0.8rem', color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <AlertTriangle size={16} color={lowStockCount > 0 ? '#F43F5E' : '#10B981'} /> Low Stock Alerts
                </div>
                <div style={{ fontSize: '2.2rem', fontWeight: 900, color: lowStockCount > 0 ? '#FB7185' : '#34D399', marginTop: '6px' }}>
                  {lowStockCount}
                </div>
                <div style={{ fontSize: '0.74rem', color: '#94A3B8', marginTop: '4px' }}>
                  {lowStockCount > 0 ? 'Replenish inventory below' : 'All ingredient stocks healthy'}
                </div>
              </div>
            </div>

            {/* Live Operational Status and Quick Actions */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '24px'
            }}>
              <div className="glass-card" style={{ padding: '24px' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '14px' }}>Popular Campus Foods</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {products.slice(0, 5).map((p) => (
                    <div key={p.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <img src={p.image_url} alt={p.name} style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover' }} />
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>{p.name}</div>
                          <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>₹{p.price} • {p.stock_quantity} left</div>
                        </div>
                      </div>
                      <span className="badge badge-purple">{p.review_count} orders</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-card" style={{ padding: '24px' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '14px' }}>Quick Canteen Actions</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <button
                    className="btn btn-primary"
                    style={{ justifyContent: 'flex-start', padding: '12px 16px' }}
                    onClick={() => setAddFoodModalOpen(true)}
                  >
                    <Plus size={16} /> Add New Dish to Menu
                  </button>
                  <button
                    className="btn btn-secondary"
                    style={{ justifyContent: 'flex-start', padding: '12px 16px' }}
                    onClick={() => setActiveTab('INVENTORY')}
                  >
                    <Layers size={16} /> Review Raw Ingredients Stock
                  </button>
                  <button
                    className="btn btn-secondary"
                    style={{ justifyContent: 'flex-start', padding: '12px 16px' }}
                    onClick={() => setActiveTab('ORDERS')}
                  >
                    <Receipt size={16} /> Open Simulated Thermal POS
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Menu Management */}
        {activeTab === 'MENU' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ fontSize: '1.1rem', fontWeight: 800 }}>Manage Food Items & Real-Time Availability</div>
              <button
                className="btn btn-primary"
                onClick={() => setAddFoodModalOpen(true)}
              >
                <Plus size={16} /> Add Food Item
              </button>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '20px'
            }}>
              {products.map((prod) => (
                <div key={prod.id} className="glass-card" style={{ padding: '16px' }}>
                  <div style={{ display: 'flex', gap: '12px', marginBottom: '12px' }}>
                    <img src={prod.image_url} alt={prod.name} style={{ width: '64px', height: '64px', borderRadius: '12px', objectFit: 'cover' }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: '0.96rem' }}>{prod.name}</div>
                      <div style={{ fontSize: '0.8rem', color: '#94A3B8' }}>₹{prod.price} • {prod.prep_time_minutes} min prep</div>
                      <div style={{ fontSize: '0.76rem', color: '#64748B', marginTop: '2px' }}>
                        Stock: <strong style={{ color: prod.stock_quantity <= 5 ? '#F43F5E' : '#10B981' }}>{prod.stock_quantity}</strong>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '10px' }}>
                    {/* Availability state toggle */}
                    <select
                      value={prod.availability}
                      onChange={(e) => updateProduct({ ...prod, availability: e.target.value as any })}
                      style={{
                        padding: '6px 10px',
                        borderRadius: '8px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        color: prod.availability === 'AVAILABLE' ? '#34D399' : prod.availability === 'LIMITED' ? '#FBBF24' : '#FB7185',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      <option value="AVAILABLE" style={{ background: '#0F172A', color: '#34D399' }}>Available</option>
                      <option value="LIMITED" style={{ background: '#0F172A', color: '#FBBF24' }}>Limited Stock</option>
                      <option value="SOLD_OUT" style={{ background: '#0F172A', color: '#FB7185' }}>Sold Out</option>
                    </select>

                    <button
                      className="btn btn-secondary"
                      style={{ fontSize: '0.78rem', padding: '6px 12px' }}
                      onClick={() => setEditingProduct(prod)}
                    >
                      <Edit3 size={13} /> Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Inventory Intelligence (Section 27, 28, 29) */}
        {activeTab === 'INVENTORY' && (
          <div>
            <div style={{
              background: 'rgba(255, 94, 54, 0.08)',
              border: '1px solid rgba(255, 94, 54, 0.25)',
              padding: '16px 20px',
              borderRadius: '16px',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <Layers size={22} color="#FF7A50" />
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.94rem', color: '#FF7A50' }}>Automated Recipe-Ingredient Depletion Active</div>
                <div style={{ fontSize: '0.82rem', color: '#CBD5E1' }}>
                  Every student order automatically calculates and subtracts exact ingredient grams. If an ingredient drops to 0, related items auto-switch to SOLD OUT.
                </div>
              </div>
            </div>

            <div style={{
              background: 'rgba(15, 23, 42, 0.8)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '20px',
              overflow: 'hidden'
            }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ background: 'rgba(255, 255, 255, 0.04)', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', color: '#94A3B8' }}>
                    <th style={{ padding: '14px 20px' }}>Ingredient</th>
                    <th style={{ padding: '14px 20px' }}>Current Stock</th>
                    <th style={{ padding: '14px 20px' }}>Threshold (Min / Max)</th>
                    <th style={{ padding: '14px 20px' }}>Supplier</th>
                    <th style={{ padding: '14px 20px' }}>Status</th>
                    <th style={{ padding: '14px 20px', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {ingredients.map((ing) => (
                    <tr key={ing.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                      <td style={{ padding: '14px 20px', fontWeight: 700, color: '#FFF' }}>{ing.name}</td>
                      <td style={{ padding: '14px 20px', fontFamily: 'var(--font-mono)', fontWeight: 800 }}>
                        {ing.current_quantity} {ing.unit}
                      </td>
                      <td style={{ padding: '14px 20px', color: '#94A3B8' }}>
                        Min {ing.min_quantity} / Max {ing.max_quantity} {ing.unit}
                      </td>
                      <td style={{ padding: '14px 20px', color: '#94A3B8' }}>{ing.supplier}</td>
                      <td style={{ padding: '14px 20px' }}>
                        <span className={`badge ${ing.status === 'NORMAL' ? 'badge-green' : ing.status === 'LOW' ? 'badge-amber' : 'badge-red'}`}>
                          {ing.status}
                        </span>
                      </td>
                      <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                        <button
                          className="btn btn-secondary"
                          style={{ fontSize: '0.78rem', padding: '6px 12px' }}
                          onClick={() => restockIngredient(ing.id, 10)}
                        >
                          <Plus size={13} /> +10 {ing.unit} Restock
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 4: Live Orders & Simulated Thermal POS */}
        {activeTab === 'ORDERS' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <div style={{ fontSize: '1.1rem', fontWeight: 800 }}>All Canteen Orders & POS Printer Simulator</div>
              <div style={{ fontSize: '0.84rem', color: '#94A3B8' }}>
                Click any order to inspect or print an 80mm ESC/POS thermal ticket.
              </div>
            </div>

            <div style={{
              background: 'rgba(15, 23, 42, 0.8)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '20px',
              overflow: 'hidden'
            }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ background: 'rgba(255, 255, 255, 0.04)', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', color: '#94A3B8' }}>
                    <th style={{ padding: '14px 20px' }}>Token #</th>
                    <th style={{ padding: '14px 20px' }}>Customer</th>
                    <th style={{ padding: '14px 20px' }}>Type</th>
                    <th style={{ padding: '14px 20px' }}>Amount</th>
                    <th style={{ padding: '14px 20px' }}>Status</th>
                    <th style={{ padding: '14px 20px' }}>Pickup Slot</th>
                    <th style={{ padding: '14px 20px', textAlign: 'right' }}>Thermal Print</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((ord) => (
                    <tr key={ord.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                      <td style={{ padding: '14px 20px', fontFamily: 'var(--font-mono)', fontWeight: 800, color: '#FF7A50' }}>
                        {ord.token_code}
                      </td>
                      <td style={{ padding: '14px 20px', color: '#FFF' }}>{ord.user_name}</td>
                      <td style={{ padding: '14px 20px', color: '#94A3B8' }}>
                        {ord.order_type === 'DINE_IN' ? `Dine-In (T${ord.table_number || '4'})` : 'Takeaway'}
                      </td>
                      <td style={{ padding: '14px 20px', fontWeight: 700, color: '#FFF' }}>₹{ord.total_amount}</td>
                      <td style={{ padding: '14px 20px' }}>
                        <span className={`badge ${ord.status === 'READY' ? 'badge-green' : ord.status === 'PREPARING' ? 'badge-amber' : 'badge-blue'}`}>
                          {ord.status}
                        </span>
                      </td>
                      <td style={{ padding: '14px 20px', color: '#94A3B8' }}>{ord.pickup_time}</td>
                      <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                        <button
                          className="btn btn-secondary"
                          style={{ fontSize: '0.8rem', padding: '6px 12px' }}
                          onClick={() => onOpenReceipt(ord)}
                        >
                          <Receipt size={14} /> Print Receipt
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 5: Complaints & Issues */}
        {activeTab === 'COMPLAINTS' && (
          <div>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '18px' }}>
              Student Grievances & Resolution Desk
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {complaints.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 20px', color: '#94A3B8' }}>
                  ✨ No complaints. That's a good sign.
                </div>
              ) : (
                complaints.map((comp) => (
                  <div key={comp.id} className="glass-card" style={{ padding: '22px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontWeight: 800, fontSize: '1rem', color: '#FFF' }}>{comp.category}</span>
                          <span className={`badge ${comp.status === 'RESOLVED' ? 'badge-green' : 'badge-amber'}`}>
                            {comp.status}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#94A3B8', marginTop: '2px' }}>
                          Reported by {comp.user_name} • Order: {comp.order_id || 'General'}
                        </div>
                      </div>
                    </div>

                    <p style={{ color: '#E2E8F0', fontSize: '0.9rem', marginBottom: '14px', background: 'rgba(0, 0, 0, 0.2)', padding: '12px', borderRadius: '10px' }}>
                      "{comp.description}"
                    </p>

                    {comp.admin_notes && (
                      <div style={{ fontSize: '0.84rem', color: '#34D399', marginBottom: '12px' }}>
                        <strong>Resolution Note:</strong> {comp.admin_notes}
                      </div>
                    )}

                    {comp.status !== 'RESOLVED' && (
                      <button
                        className="btn btn-success"
                        style={{ fontSize: '0.82rem', padding: '8px 16px' }}
                        onClick={() => resolveComplaint(comp.id, 'Investigated and resolved by canteen manager. Student notified.')}
                      >
                        <CheckCircle2 size={15} /> Resolve & Approve Action
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Add Food Modal */}
        {addFoodModalOpen && (
          <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(8px)',
            zIndex: 1100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}>
            <div style={{
              background: '#0F172A',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '24px',
              maxWidth: '500px',
              width: '100%',
              padding: '24px',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Add Food Item to Menu</h3>
                <button
                  onClick={() => setAddFoodModalOpen(false)}
                  style={{ background: 'transparent', border: 'none', color: '#94A3B8', cursor: 'pointer', fontSize: '1.2rem' }}
                >
                  ✕
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', color: '#94A3B8', display: 'block', marginBottom: '4px' }}>Food Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Masala Dosa, Cold Coffee"
                    value={newFood.name}
                    onChange={(e) => setNewFood({ ...newFood, name: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#FFF' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '0.78rem', color: '#94A3B8', display: 'block', marginBottom: '4px' }}>Price (₹)</label>
                    <input
                      type="number"
                      value={newFood.price}
                      onChange={(e) => setNewFood({ ...newFood, price: Number(e.target.value) })}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#FFF' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.78rem', color: '#94A3B8', display: 'block', marginBottom: '4px' }}>Prep Time (min)</label>
                    <input
                      type="number"
                      value={newFood.prep_time_minutes}
                      onChange={(e) => setNewFood({ ...newFood, prep_time_minutes: Number(e.target.value) })}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#FFF' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.78rem', color: '#94A3B8', display: 'block', marginBottom: '4px' }}>Category</label>
                  <select
                    value={newFood.category_id}
                    onChange={(e) => setNewFood({ ...newFood, category_id: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', background: '#1E293B', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#FFF' }}
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <input
                    type="checkbox"
                    id="isVegCheck"
                    checked={newFood.is_veg}
                    onChange={(e) => setNewFood({ ...newFood, is_veg: e.target.checked })}
                    style={{ width: '16px', height: '16px', accentColor: '#10B981' }}
                  />
                  <label htmlFor="isVegCheck" style={{ fontSize: '0.85rem', color: '#FFF', cursor: 'pointer' }}>
                    Pure Vegetarian Item
                  </label>
                </div>

                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                  <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setAddFoodModalOpen(false)}>
                    Cancel
                  </button>
                  <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleSaveNewFood}>
                    Add to Menu
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Food Modal */}
        {editingProduct && (
          <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(8px)',
            zIndex: 1100,
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
              padding: '24px'
            }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '16px' }}>Edit {editingProduct.name}</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', color: '#94A3B8', display: 'block', marginBottom: '4px' }}>Price (₹)</label>
                  <input
                    type="number"
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#FFF' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', color: '#94A3B8', display: 'block', marginBottom: '4px' }}>Available Stock</label>
                  <input
                    type="number"
                    value={editingProduct.stock_quantity}
                    onChange={(e) => setEditingProduct({ ...editingProduct, stock_quantity: Number(e.target.value) })}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#FFF' }}
                  />
                </div>
                <div style={{ display: 'flex', gap: '10px', marginTop: '14px' }}>
                  <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setEditingProduct(null)}>
                    Cancel
                  </button>
                  <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => { updateProduct(editingProduct); setEditingProduct(null); }}>
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
