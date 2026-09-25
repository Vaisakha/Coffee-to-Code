import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import toast from 'react-hot-toast';
import {
  Search,
  PackageCheck,
  MapPin,
  Calendar,
  Tag,
  Phone,
  Plus,
  X,
  Sparkles,
  HelpCircle,
  Laptop,
  FileText,
  Shirt,
  Watch,
  Briefcase,
  Key,
  Box,
} from 'lucide-react';
import { LostFoundItem } from '../types';

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  electronics: Laptop,
  documents: FileText,
  clothing: Shirt,
  accessories: Watch,
  bags: Briefcase,
  keys: Key,
  other: Box,
};

const LostFoundPage: React.FC = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<LostFoundItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filter, setFilter] = useState({ type: '', status: 'active', block: '' });
  const [showPost, setShowPost] = useState<boolean>(false);
  const [newItem, setNewItem] = useState({
    type: 'lost' as 'lost' | 'found',
    category: 'electronics' as const,
    title: '',
    description: '',
    location: '',
    block: user?.block || 'A',
    tags: '',
    contact_info: '',
  });

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const params: Record<string, string> = {};
        if (filter.type) params.type = filter.type;
        if (filter.status) params.status = filter.status;
        if (filter.block) params.block = filter.block;
        const { data } = await api.get('/lostfound', { params });
        setItems(data.items || []);
      } catch {
        setItems([]);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, [filter]);

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...newItem,
        tags: newItem.tags.split(',').map((t) => t.trim()).filter(Boolean),
      };
      const { data } = await api.post('/lostfound', payload);
      setItems((prev) => [data.item, ...prev]);
      setShowPost(false);
      toast.success(
        `Item reported! AI cross-matching engine active across campus blocks.`
      );
      setNewItem({
        type: 'lost',
        category: 'electronics',
        title: '',
        description: '',
        location: '',
        block: user?.block || 'A',
        tags: '',
        contact_info: '',
      });
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to submit report');
    }
  };

  return (
    <div className="page-content animate-in">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ margin: 0 }}>Lost & Found Network</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
            Automated item similarity matching & cross-department recovery engine
          </p>
        </div>

        <button className="btn btn-primary" onClick={() => setShowPost(true)} id="post-item-btn">
          <Plus size={18} />
          <span>Report Item</span>
        </button>
      </div>

      {/* Filter Tabs & Block Selector */}
      <div
        className="card"
        style={{
          padding: '1rem 1.4rem',
          marginBottom: '1.8rem',
          display: 'flex',
          gap: '1rem',
          alignItems: 'center',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {[
            { id: '', label: 'All Items' },
            { id: 'lost', label: 'Missing / Lost' },
            { id: 'found', label: 'Recovered / Found' },
          ].map((t) => (
            <button
              key={t.id}
              className={`btn btn-sm ${filter.type === t.id ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setFilter((f) => ({ ...f, type: t.id }))}
              id={`filter-${t.id || 'all'}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Filter Block:</span>
          <select
            className="form-select"
            style={{ width: 'auto', padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
            value={filter.block}
            onChange={(e) => setFilter((f) => ({ ...f, block: e.target.value }))}
            id="lf-block-filter"
          >
            <option value="">All Campus Blocks</option>
            {['A', 'B', 'C', 'D', 'Admin'].map((b) => (
              <option key={b} value={b}>
                Block {b}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Items Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
          <div style={{ width: '40px', height: '40px', border: '3px solid #e2e8f0', borderTopColor: '#4f46e5', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem' }} />
          <p style={{ color: 'var(--text-muted)' }}>Searching campus lost & found index...</p>
        </div>
      ) : items.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '4rem 1.5rem', color: 'var(--text-muted)' }}>
          <PackageCheck size={42} style={{ margin: '0 auto 0.8rem', opacity: 0.5 }} />
          <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)' }}>No Items Reported</h3>
          <p style={{ fontSize: '0.88rem' }}>Every reported item is automatically indexed for similarity matching.</p>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '1.4rem',
          }}
        >
          {items.map((item) => {
            const isLost = item.type === 'lost';
            const Icon = CATEGORY_ICONS[item.category] || Box;

            return (
              <div
                key={item._id}
                className="card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  borderTop: `4px solid ${isLost ? 'var(--warning)' : 'var(--success)'}`,
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
                    <span
                      style={{
                        padding: '0.2rem 0.65rem',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '0.74rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                        background: isLost ? 'var(--warning-light)' : 'var(--success-light)',
                        color: isLost ? 'var(--warning-dark)' : 'var(--success-dark)',
                        border: `1px solid ${isLost ? 'var(--warning-border)' : 'var(--success-border)'}`,
                      }}
                    >
                      {item.type} Item
                    </span>

                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: 'var(--radius-xs)',
                        background: 'var(--bg-canvas)',
                        color: 'var(--text-secondary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '1px solid var(--surface-glass-border)',
                      }}
                    >
                      <Icon size={16} />
                    </div>
                  </div>

                  <h3 style={{ fontSize: '1.15rem', marginBottom: '0.35rem' }}>{item.title}</h3>
                  <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                    {item.description}
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <MapPin size={13} color="var(--primary)" />
                      <span>{item.location || 'Campus Grounds'}</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Calendar size={13} color="var(--primary)" />
                      <span>Reported: {new Date(item.date_reported || (item as any).createdAt || Date.now()).toLocaleDateString()}</span>
                    </div>

                    {item.contact_info && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <Phone size={13} color="var(--primary)" />
                        <span>{item.contact_info}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div style={{ marginTop: '1.2rem', paddingTop: '0.85rem', borderTop: '1px solid var(--surface-glass-border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.76rem', color: 'var(--text-light)', fontWeight: 600 }}>
                      Status: {item.status}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 700 }}>
                      Cross-Match Active
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Report Item Modal */}
      {showPost && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '1.5rem',
          }}
        >
          <div
            className="card"
            style={{
              maxWidth: '520px',
              width: '100%',
              padding: '2.2rem',
              borderRadius: 'var(--radius-lg)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div>
                <h2 style={{ fontSize: '1.35rem', margin: 0 }}>Report Campus Item</h2>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                  Our AI similarity matcher compares descriptions across all reports
                </p>
              </div>
              <button
                className="btn btn-secondary btn-sm"
                style={{ padding: '0.35rem', borderRadius: '50%', border: 'none' }}
                onClick={() => setShowPost(false)}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handlePost} id="post-item-form">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.9rem' }}>
                <div className="form-group">
                  <label className="form-label">Report Type</label>
                  <select
                    className="form-select"
                    value={newItem.type}
                    onChange={(e) => setNewItem((f) => ({ ...f, type: e.target.value as any }))}
                  >
                    <option value="lost">I Lost An Item</option>
                    <option value="found">I Found An Item</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    className="form-select"
                    value={newItem.category}
                    onChange={(e) => setNewItem((f) => ({ ...f, category: e.target.value as any }))}
                  >
                    <option value="electronics">Electronics (Laptop, Phone, Charger)</option>
                    <option value="id_cards">ID Cards & Wallets</option>
                    <option value="books">Books & Notebooks</option>
                    <option value="keys">Keys & Lanyards</option>
                    <option value="clothing">Jackets & Clothing</option>
                    <option value="accessories">Watches & Glasses</option>
                    <option value="other">Other Item</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Item Title</label>
                <input
                  className="form-input"
                  type="text"
                  placeholder="e.g. Space Gray MacBook Pro 14-inch"
                  value={newItem.title}
                  onChange={(e) => setNewItem((f) => ({ ...f, title: e.target.value }))}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.9rem' }}>
                <div className="form-group">
                  <label className="form-label">Campus Block</label>
                  <select
                    className="form-select"
                    value={newItem.block}
                    onChange={(e) => setNewItem((f) => ({ ...f, block: e.target.value }))}
                  >
                    {['A', 'B', 'C', 'D', 'Admin'].map((b) => (
                      <option key={b} value={b}>
                        Block {b}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Specific Location</label>
                  <input
                    className="form-input"
                    type="text"
                    placeholder="e.g. 2nd Floor Library Lounge"
                    value={newItem.location}
                    onChange={(e) => setNewItem((f) => ({ ...f, location: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Detailed Description</label>
                <textarea
                  className="form-textarea"
                  placeholder="Color, stickers, case details, distinguishing features..."
                  value={newItem.description}
                  onChange={(e) => setNewItem((f) => ({ ...f, description: e.target.value }))}
                  style={{ minHeight: '80px' }}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Contact Info / WhatsApp (Optional)</label>
                <input
                  className="form-input"
                  type="text"
                  placeholder="Phone number or campus room"
                  value={newItem.contact_info}
                  onChange={(e) => setNewItem((f) => ({ ...f, contact_info: e.target.value }))}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.8rem', marginTop: '1.5rem' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ flex: 1 }}
                  onClick={() => setShowPost(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  Submit & Match
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LostFoundPage;
