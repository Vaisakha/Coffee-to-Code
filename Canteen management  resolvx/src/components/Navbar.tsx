import React from 'react';
import { useCanteen } from '../context/CanteenContext';
import { 
  ShoppingBag, 
  ChefHat, 
  LayoutDashboard, 
  ShieldCheck, 
  GraduationCap, 
  QrCode, 
  Sparkles,
  Flame,
  Clock,
  Phone,
  ChevronDown,
  Truck,
  Wallet,
  HelpCircle,
  Bot
} from 'lucide-react';
import { UserRole } from '../types';

interface NavbarProps {
  onOpenCart: () => void;
  onOpenTableQr: () => void;
  onOpenDelivery: () => void;
  onOpenWallet: () => void;
  onOpenHelp: () => void;
  onOpenAiAssistant: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  onOpenCart, 
  onOpenTableQr, 
  onOpenDelivery, 
  onOpenWallet,
  onOpenHelp,
  onOpenAiAssistant
}) => {
  const { 
    currentRole, 
    setCurrentRole, 
    activeView, 
    setActiveView, 
    cart, 
    canteen, 
    orders,
    walletBalance
  } = useCanteen();

  const totalCartItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const activeOrdersCount = orders.filter((o) => o.status === 'ACCEPTED' || o.status === 'PREPARING' || o.status === 'PENDING').length;

  const roleConfigs: { role: UserRole; label: string; icon: any }[] = [
    { role: 'student', label: 'Student', icon: GraduationCap },
    { role: 'kitchen', label: 'Kitchen KDS', icon: ChefHat },
    { role: 'admin', label: 'Admin', icon: LayoutDashboard },
    { role: 'principal', label: 'Principal', icon: ShieldCheck },
  ];

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      backgroundColor: 'rgba(250, 247, 242, 0.95)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderBottom: '1px solid #E8E2D6'
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '76px',
        gap: '20px'
      }}>
        {/* Left Section: Brand Logo + Top-Left Help & AI Assistant Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div 
            style={{ display: 'flex', alignItems: 'baseline', gap: '8px', cursor: 'pointer' }} 
            onClick={() => setActiveView('landing')}
          >
            <span style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 900,
              fontSize: '2.1rem',
              color: '#EE4322',
              letterSpacing: '-0.04em',
              lineHeight: 1
            }}>
              biteq
            </span>
            <span style={{
              fontSize: '0.68rem',
              fontWeight: 800,
              color: '#58615A',
              letterSpacing: '0.04em',
              textTransform: 'uppercase'
            }}>
              canteen
            </span>
          </div>

          {/* Top Left Help & AI Assistant Action Pills */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
            <button
              onClick={onOpenHelp}
              style={{
                background: '#FAF7F2',
                border: '1px solid #E8E2D6',
                borderRadius: '8px',
                padding: '3px 9px',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                fontSize: '0.74rem',
                fontWeight: 700,
                color: '#1C211D',
                cursor: 'pointer'
              }}
              title="App Usage Tutorial & Guide"
            >
              <HelpCircle size={13} color="#EE4322" />
              <span>Help Guide</span>
            </button>

            <button
              onClick={onOpenAiAssistant}
              style={{
                background: 'linear-gradient(135deg, #1C211D 0%, #2D342E 100%)',
                border: 'none',
                borderRadius: '8px',
                padding: '3px 9px',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                fontSize: '0.72rem',
                fontWeight: 800,
                color: '#FFFFFF',
                cursor: 'pointer',
                boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
              }}
              title="AI Food Recommendations & App Assistant"
            >
              <Bot size={13} color="#FF7B60" />
              <span>AI Assistant</span>
              <Sparkles size={10} color="#FF7B60" />
            </button>
          </div>
        </div>

        {/* Center Navigation Links - Styled like Home ⌄, Menu ⌄, etc. */}
        <nav style={{
          display: 'flex',
          alignItems: 'center',
          gap: '24px',
          fontSize: '0.9rem',
          fontWeight: 600,
          color: '#1C211D'
        }} className="desktop-nav-links">
          <button
            onClick={() => setActiveView('landing')}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              fontWeight: activeView === 'landing' ? 800 : 600,
              color: activeView === 'landing' ? '#EE4322' : '#1C211D',
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            Home <ChevronDown size={14} color="#8A948C" />
          </button>

          <button
            onClick={() => {
              setCurrentRole('student');
              setActiveView('app');
            }}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              fontWeight: currentRole === 'student' && activeView === 'app' ? 800 : 600,
              color: currentRole === 'student' && activeView === 'app' ? '#EE4322' : '#1C211D',
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            Menu <ChevronDown size={14} color="#8A948C" />
          </button>

          <button
            onClick={() => {
              setCurrentRole('kitchen');
              setActiveView('app');
            }}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              fontWeight: currentRole === 'kitchen' && activeView === 'app' ? 800 : 600,
              color: currentRole === 'kitchen' && activeView === 'app' ? '#EE4322' : '#1C211D',
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            Kitchen KDS <ChevronDown size={14} color="#8A948C" />
          </button>

          <button
            onClick={() => {
              setCurrentRole('admin');
              setActiveView('app');
            }}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              fontWeight: currentRole === 'admin' && activeView === 'app' ? 800 : 600,
              color: currentRole === 'admin' && activeView === 'app' ? '#EE4322' : '#1C211D',
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            Admin <ChevronDown size={14} color="#8A948C" />
          </button>

          <button
            onClick={onOpenTableQr}
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 600,
              color: '#58615A',
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <QrCode size={15} /> Table QR
          </button>
        </nav>

        {/* Right Section: Campus Phone Hotline + Order Now Pill Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
          {/* Phone Hotline as seen in reference image */}
          <div style={{
            display: 'none',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.88rem',
            fontWeight: 700,
            color: '#1C211D'
          }} className="phone-hotline">
            <Phone size={15} color="#EE4322" />
            <span>555-123-4567</span>
          </div>

          {/* Tray Trigger (if in student mode) */}
          {currentRole === 'student' && (
            <button
              onClick={onOpenCart}
              style={{
                background: 'transparent',
                border: '1px solid #E8E2D6',
                borderRadius: '12px',
                padding: '9px 14px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: '#1C211D',
                fontWeight: 700,
                fontSize: '0.88rem',
                cursor: 'pointer'
              }}
            >
              <ShoppingBag size={17} color="#EE4322" />
              <span>Cart</span>
              {totalCartItems > 0 && (
                <span style={{
                  background: '#EE4322',
                  color: '#FFFFFF',
                  fontWeight: 800,
                  fontSize: '0.72rem',
                  padding: '1px 7px',
                  borderRadius: '999px',
                }}>
                  {totalCartItems}
                </span>
              )}
            </button>
          )}

          {/* Delivery Button on Top Right */}
          <button
            onClick={onOpenDelivery}
            style={{
              background: '#FFEFEA',
              border: '1px solid #FFDCD2',
              borderRadius: '999px',
              padding: '9px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: '#EE4322',
              fontWeight: 700,
              fontSize: '0.88rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <Truck size={17} color="#EE4322" />
            <span>Delivery</span>
          </button>

          {/* Wallet Button on Top Right (Replaces Order Now) */}
          <button
            onClick={onOpenWallet}
            style={{
              background: '#EE4322',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '999px',
              padding: '10px 18px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontWeight: 800,
              fontSize: '0.9rem',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(238, 67, 34, 0.3)',
              transition: 'all 0.2s ease'
            }}
          >
            <Wallet size={17} />
            <span>Wallet</span>
            <span style={{
              background: 'rgba(255, 255, 255, 0.25)',
              padding: '2px 8px',
              borderRadius: '999px',
              fontSize: '0.78rem',
              fontWeight: 800
            }}>
              ₹{walletBalance.toLocaleString('en-IN')}
            </span>
          </button>
        </div>
      </div>

      <style>{`
        @media (min-width: 960px) {
          .desktop-nav-links {
            display: flex !important;
          }
          .phone-hotline {
            display: flex !important;
          }
        }
        @media (max-width: 959px) {
          .desktop-nav-links {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
};
