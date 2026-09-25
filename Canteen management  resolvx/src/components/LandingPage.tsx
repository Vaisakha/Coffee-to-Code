import React from 'react';
import { useCanteen } from '../context/CanteenContext';
import { 
  ArrowRight, 
  Clock, 
  Sparkles, 
  ShieldCheck, 
  ChefHat, 
  Layers, 
  TrendingUp, 
  QrCode, 
  CheckCircle2,
  UtensilsCrossed,
  Zap,
  Truck
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { canteen, orders, setActiveView, setCurrentRole } = useCanteen();
  const activeOrdersCount = orders.filter((o) => o.status === 'ACCEPTED' || o.status === 'PREPARING' || o.status === 'PENDING').length;

  // The 6 signature category cards as seen in the reference image
  const categoryHighlights = [
    {
      title: 'Pizza & Porotta',
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&auto=format&fit=crop&q=80',
      tag: 'Crispy & Flaky',
      categoryId: 'cat-meals'
    },
    {
      title: 'Burgers',
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80',
      tag: 'Double Patty',
      categoryId: 'cat-fastfood'
    },
    {
      title: 'Kathi Rolls',
      image: 'https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?w=600&auto=format&fit=crop&q=80',
      tag: 'Hand-rolled Fresh',
      categoryId: 'cat-snacks'
    },
    {
      title: 'Biriyani Bowls',
      image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80',
      tag: 'Dum Cooked',
      categoryId: 'cat-meals'
    },
    {
      title: 'Desserts',
      image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=600&auto=format&fit=crop&q=80',
      tag: 'Sweet Tooth',
      categoryId: 'cat-desserts'
    },
    {
      title: 'Drinks & Juices',
      image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&auto=format&fit=crop&q=80',
      tag: 'Cold Pressed',
      categoryId: 'cat-beverages'
    },
  ];

  return (
    <div style={{ backgroundColor: '#FAF7F2', minHeight: '100vh', paddingBottom: '90px' }}>
      {/* Editorial Hero Section (Exact EASY & TASTY aesthetic from reference) */}
      <section style={{
        position: 'relative',
        padding: '50px 20px 40px',
        overflow: 'hidden'
      }}>
        <div className="container" style={{ maxWidth: '1240px' }}>
          {/* Main Hero Composite with Giant Editorial Typography & Overlapping Dish */}
          <div style={{
            position: 'relative',
            minHeight: '480px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            marginBottom: '40px'
          }}>
            {/* Background Massive Text: Line 1: EASY */}
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(5rem, 14vw, 11rem)',
              fontWeight: 900,
              lineHeight: 0.9,
              color: '#EE4322',
              letterSpacing: '-0.04em',
              textTransform: 'uppercase',
              zIndex: 1,
              userSelect: 'none',
              maxWidth: '85%'
            }}>
              EASY
            </div>

            {/* Central High-Resolution Circular Bowl Overlapping Text */}
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 'clamp(280px, 38vw, 480px)',
              height: 'clamp(280px, 38vw, 480px)',
              borderRadius: '50%',
              zIndex: 2,
              filter: 'drop-shadow(0 25px 40px rgba(30, 20, 15, 0.18))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              pointerEvents: 'none'
            }}>
              <img
                src="https://images.unsplash.com/photo-1540420773420-3366772f4999?w=900&auto=format&fit=crop&q=85"
                alt="Fresh Campus Salad and Gourmet Food Bowl"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: '50%',
                  border: '8px solid rgba(255, 255, 255, 0.95)',
                  boxShadow: 'inset 0 0 20px rgba(0,0,0,0.1)'
                }}
              />
            </div>

            {/* Right-Side Editorial Paragraph as seen in reference image */}
            <div style={{
              position: 'absolute',
              right: '10px',
              top: '32%',
              maxWidth: '260px',
              fontSize: '0.86rem',
              lineHeight: 1.6,
              color: '#58615A',
              zIndex: 3,
              display: 'none'
            }} className="hero-editorial-copy">
              We appreciate your trust greatly. Our students choose us and our freshly prepared campus meals. Skip the queue and eat hot.
            </div>

            {/* Background Massive Text: Line 2: & TASTY */}
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(5rem, 14vw, 11rem)',
              fontWeight: 900,
              lineHeight: 0.9,
              color: '#EE4322',
              letterSpacing: '-0.04em',
              textTransform: 'uppercase',
              zIndex: 1,
              userSelect: 'none',
              marginTop: '-10px'
            }}>
              & TASTY
            </div>
          </div>

          {/* Subheader: Delivery Icon + "What are you craving today?" */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '20px'
          }}>
            <Truck size={24} color="#1C211D" />
            <h2 style={{
              fontSize: '1.45rem',
              fontWeight: 700,
              color: '#1C211D',
              letterSpacing: '-0.02em'
            }}>
              What are you craving today?
            </h2>
          </div>

          {/* Sub-description row */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: '40px',
            marginBottom: '32px',
            flexWrap: 'wrap'
          }}>
            <div style={{
              fontSize: '0.78rem',
              fontWeight: 800,
              letterSpacing: '0.08em',
              color: '#1C211D',
              textTransform: 'uppercase',
              paddingTop: '4px'
            }}>
              WE'VE GOT IT ALL!
            </div>

            <div style={{
              maxWidth: '680px',
              fontSize: '0.86rem',
              lineHeight: 1.6,
              color: '#707970'
            }}>
              Freshly cooked breakfast, dum-layered biriyanis, flaky Kerala porottas, and chilled pressed juices.
              Prepared fresh every hour by certified campus chefs, ready for zero-wait pickup.
            </div>
          </div>

          {/* Horizontal Photo Category Gallery (Exact 6 Cards from reference image) */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '18px',
            marginBottom: '60px'
          }}>
            {categoryHighlights.map((item, idx) => (
              <div
                key={idx}
                onClick={() => {
                  setCurrentRole('student');
                  setActiveView('app');
                }}
                style={{
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  transition: 'transform 0.25s ease'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-4px)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
              >
                <div style={{
                  aspectRatio: '1 / 1',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  background: '#EBE5D8',
                  boxShadow: '0 4px 16px rgba(35, 40, 36, 0.08)'
                }}>
                  <img
                    src={item.image}
                    alt={item.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: 'block'
                    }}
                  />
                </div>
                <div style={{
                  fontSize: '0.96rem',
                  fontWeight: 700,
                  color: '#1C211D',
                  letterSpacing: '-0.01em'
                }}>
                  {item.title}
                </div>
              </div>
            ))}
          </div>

          {/* Live Canteen Status Widget Card in Warm Palette */}
          <div style={{
            background: '#FFFFFF',
            border: '1px solid #E8E2D6',
            borderRadius: '24px',
            padding: '28px',
            boxShadow: '0 12px 30px rgba(35, 40, 36, 0.06)',
            marginBottom: '60px'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '16px',
              borderBottom: '1px solid #F0ECE2',
              paddingBottom: '18px',
              marginBottom: '20px'
            }}>
              <div>
                <div style={{ fontSize: '0.78rem', color: '#8A948C', fontWeight: 700, letterSpacing: '0.04em' }}>
                  CAMPUS CANTEEN RADAR
                </div>
                <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#1C211D' }}>
                  {canteen.name}
                </div>
                <div style={{ fontSize: '0.84rem', color: '#58615A' }}>
                  {canteen.location}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="badge badge-green" style={{ padding: '6px 14px' }}>
                  <span className="pulse-dot" style={{ backgroundColor: '#059669' }} />
                  {canteen.is_open ? 'Open Now' : 'Closed'}
                </span>
                <span className={`badge ${canteen.current_load === 'CHILL' ? 'badge-green' : canteen.current_load === 'BUSY' ? 'badge-amber' : 'badge-red'}`} style={{ padding: '6px 14px' }}>
                  {canteen.current_load} RUSH
                </span>
              </div>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '20px'
            }}>
              <div style={{ background: '#FAF7F2', padding: '18px', borderRadius: '16px', border: '1px solid #E8E2D6' }}>
                <div style={{ fontSize: '0.78rem', color: '#58615A', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Clock size={15} color="#0284C7" /> Avg Kitchen Prep Time
                </div>
                <div style={{ fontSize: '1.9rem', fontWeight: 800, color: '#1C211D', marginTop: '4px' }}>
                  {canteen.avg_prep_time_minutes} <span style={{ fontSize: '0.9rem', color: '#8A948C' }}>mins</span>
                </div>
                <div style={{ fontSize: '0.74rem', color: '#059669', marginTop: '4px' }}>Fastest turnaround in Campus Block A</div>
              </div>

              <div style={{ background: '#FAF7F2', padding: '18px', borderRadius: '16px', border: '1px solid #E8E2D6' }}>
                <div style={{ fontSize: '0.78rem', color: '#58615A', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Zap size={15} color="#EE4322" /> Live Cooking Tickets
                </div>
                <div style={{ fontSize: '1.9rem', fontWeight: 800, color: '#1C211D', marginTop: '4px' }}>
                  {activeOrdersCount} <span style={{ fontSize: '0.9rem', color: '#8A948C' }}>active</span>
                </div>
                <div style={{ fontSize: '0.74rem', color: '#D97706', marginTop: '4px' }}>Chefs operating at steady pace</div>
              </div>

              <div style={{ background: '#FAF7F2', padding: '18px', borderRadius: '16px', border: '1px solid #E8E2D6' }}>
                <div style={{ fontSize: '0.78rem', color: '#58615A', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <ShieldCheck size={15} color="#059669" /> Daily Service Hours
                </div>
                <div style={{ fontSize: '1.35rem', fontWeight: 800, color: '#1C211D', marginTop: '6px' }}>
                  {canteen.opening_time}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#8A948C' }}>Closes at {canteen.closing_time}</div>
              </div>
            </div>
          </div>

          {/* Quick CTA to start order */}
          <div style={{
            background: 'linear-gradient(135deg, #EE4322 0%, #D73819 100%)',
            borderRadius: '24px',
            padding: '40px 32px',
            color: '#FFFFFF',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '24px',
            boxShadow: '0 16px 40px rgba(238, 67, 34, 0.28)'
          }}>
            <div>
              <div style={{ fontSize: '0.84rem', fontWeight: 800, letterSpacing: '0.06em', opacity: 0.9 }}>
                SMART CAMPUS QUEUE OS
              </div>
              <h2 style={{ fontSize: '2.1rem', fontWeight: 900, marginTop: '4px', letterSpacing: '-0.02em' }}>
                Skip the lunch rush. Order ahead now.
              </h2>
              <p style={{ opacity: 0.88, fontSize: '0.94rem', maxWidth: '520px', marginTop: '6px' }}>
                Select your dishes, choose your pickup slot, get your digital token, and collect without standing in lines.
              </p>
            </div>

            <button
              style={{
                background: '#FFFFFF',
                color: '#EE4322',
                border: 'none',
                padding: '16px 32px',
                borderRadius: '999px',
                fontWeight: 800,
                fontSize: '1.05rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)'
              }}
              onClick={() => {
                setCurrentRole('student');
                setActiveView('app');
              }}
            >
              Order Food Now <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>

      <style>{`
        @media (min-width: 900px) {
          .hero-editorial-copy {
            display: block !important;
          }
        }
      `}</style>
    </div>
  );
};
