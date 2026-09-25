import React, { useState } from 'react';
import { useCanteen } from './context/CanteenContext';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { StudentDashboard } from './components/StudentDashboard';
import { KitchenDisplay } from './components/KitchenDisplay';
import { AdminDashboard } from './components/AdminDashboard';
import { PrincipalDashboard } from './components/PrincipalDashboard';
import { CartDrawer } from './components/CartDrawer';
import { ActiveOrderModal } from './components/ActiveOrderModal';
import { ThermalReceiptModal } from './components/ThermalReceiptModal';
import { TableQrModal } from './components/TableQrModal';
import { FeedbackModal } from './components/FeedbackModal';
import { ComplaintModal } from './components/ComplaintModal';
import { DeliveryModal } from './components/DeliveryModal';
import { WalletModal } from './components/WalletModal';
import { HelpModal } from './components/HelpModal';
import { AiAssistantModal } from './components/AiAssistantModal';
import { Order } from './types';
import { Sparkles, Terminal, ChefHat, LayoutDashboard, ShieldCheck, GraduationCap, Bot } from 'lucide-react';

export const AppContent: React.FC = () => {
  const { currentRole, setCurrentRole, activeView, setActiveView } = useCanteen();

  const [cartOpen, setCartOpen] = useState(false);
  const [tableQrOpen, setTableQrOpen] = useState(false);
  const [activeOrderModalOrder, setActiveOrderModalOrder] = useState<Order | null>(null);
  const [receiptOrder, setReceiptOrder] = useState<Order | null>(null);
  const [feedbackOrder, setFeedbackOrder] = useState<Order | null>(null);
  const [complaintModalOpen, setComplaintModalOpen] = useState(false);
  const [deliveryOpen, setDeliveryOpen] = useState(false);
  const [walletOpen, setWalletOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [aiAssistantOpen, setAiAssistantOpen] = useState(false);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Navbar */}
      <Navbar
        onOpenCart={() => setCartOpen(true)}
        onOpenTableQr={() => setTableQrOpen(true)}
        onOpenDelivery={() => setDeliveryOpen(true)}
        onOpenWallet={() => setWalletOpen(true)}
        onOpenHelp={() => setHelpOpen(true)}
        onOpenAiAssistant={() => setAiAssistantOpen(true)}
      />

      {/* Main Body */}
      <main style={{ flex: 1 }}>
        {activeView === 'landing' ? (
          <LandingPage />
        ) : (
          <>
            {currentRole === 'student' && (
              <StudentDashboard
                onOpenCart={() => setCartOpen(true)}
                onOpenQrModal={(order) => setActiveOrderModalOrder(order)}
                onOpenReceiptModal={(order) => setReceiptOrder(order)}
                onOpenFeedbackModal={(order) => setFeedbackOrder(order)}
                onOpenComplaintModal={() => setComplaintModalOpen(true)}
              />
            )}

            {currentRole === 'kitchen' && (
              <KitchenDisplay
                onOpenReceipt={(order) => setReceiptOrder(order)}
              />
            )}

            {currentRole === 'admin' && (
              <AdminDashboard
                onOpenReceipt={(order) => setReceiptOrder(order)}
              />
            )}

            {currentRole === 'principal' && (
              <PrincipalDashboard />
            )}
          </>
        )}
      </main>

      {/* Floating Demo Quick-Switcher Dock */}
      <div style={{
        position: 'fixed',
        bottom: '18px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 900,
        background: 'rgba(255, 255, 255, 0.94)',
        backdropFilter: 'blur(16px)',
        border: '1px solid #E8E2D6',
        borderRadius: '999px',
        padding: '6px 10px',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        boxShadow: '0 10px 30px rgba(35, 40, 36, 0.12)'
      }}>
        <div style={{
          fontSize: '0.72rem',
          fontWeight: 800,
          color: '#EE4322',
          padding: '2px 8px',
          borderRight: '1px solid #E8E2D6',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          <Sparkles size={12} /> DEMO ROLE:
        </div>

        {[
          { role: 'student', label: 'Student', icon: GraduationCap },
          { role: 'kitchen', label: 'Kitchen KDS', icon: ChefHat },
          { role: 'admin', label: 'Admin', icon: LayoutDashboard },
          { role: 'principal', label: 'Principal', icon: ShieldCheck },
        ].map(({ role, label, icon: Icon }) => {
          const isSelected = currentRole === role && activeView === 'app';
          return (
            <button
              key={role}
              onClick={() => {
                setCurrentRole(role as any);
                setActiveView('app');
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                padding: '6px 14px',
                borderRadius: '999px',
                border: 'none',
                background: isSelected ? '#EE4322' : 'transparent',
                color: isSelected ? '#FFFFFF' : '#58615A',
                fontWeight: isSelected ? 800 : 600,
                fontSize: '0.78rem',
                cursor: 'pointer',
                transition: 'all 0.18s ease'
              }}
            >
              <Icon size={13} style={{ color: isSelected ? '#FFFFFF' : '#8A948C' }} />
              {label}
            </button>
          );
        })}
      </div>

      {/* Global Modals & Drawers */}
      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        onOpenWallet={() => setWalletOpen(true)}
        onOrderSuccess={(order) => {
          setActiveOrderModalOrder(order);
        }}
      />

      <ActiveOrderModal
        order={activeOrderModalOrder}
        onClose={() => setActiveOrderModalOrder(null)}
        onOpenReceipt={(order) => setReceiptOrder(order)}
        onOpenFeedback={(order) => {
          setActiveOrderModalOrder(null);
          setFeedbackOrder(order);
        }}
      />

      <ThermalReceiptModal
        order={receiptOrder}
        onClose={() => setReceiptOrder(null)}
      />

      <TableQrModal
        isOpen={tableQrOpen}
        onClose={() => setTableQrOpen(false)}
      />

      <FeedbackModal
        order={feedbackOrder}
        onClose={() => setFeedbackOrder(null)}
      />

      <ComplaintModal
        isOpen={complaintModalOpen}
        onClose={() => setComplaintModalOpen(false)}
      />

      <DeliveryModal
        isOpen={deliveryOpen}
        onClose={() => setDeliveryOpen(false)}
      />

      <WalletModal
        isOpen={walletOpen}
        onClose={() => setWalletOpen(false)}
      />

      <HelpModal
        isOpen={helpOpen}
        onClose={() => setHelpOpen(false)}
        onOpenAiAssistant={() => {
          setHelpOpen(false);
          setAiAssistantOpen(true);
        }}
      />

      <AiAssistantModal
        isOpen={aiAssistantOpen}
        onClose={() => setAiAssistantOpen(false)}
      />

      {/* Floating AI Assistant Trigger Widget (Bottom Right) */}
      <button
        onClick={() => setAiAssistantOpen(true)}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 950,
          background: 'linear-gradient(135deg, #1C211D 0%, #2D342E 100%)',
          color: '#FFFFFF',
          border: '2px solid #EE4322',
          borderRadius: '999px',
          padding: '12px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontWeight: 800,
          fontSize: '0.9rem',
          cursor: 'pointer',
          boxShadow: '0 10px 28px rgba(0,0,0,0.3)',
          transition: 'transform 0.2s ease'
        }}
        title="Open AI Food & App Assistant"
      >
        <Bot size={20} color="#FF7B60" />
        <span>AI Assistant</span>
        <Sparkles size={14} color="#FF7B60" />
      </button>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid #E8E2D6',
        background: '#F4EFE6',
        padding: '30px 20px 70px',
        textAlign: 'center',
        fontSize: '0.84rem',
        color: '#58615A'
      }}>
        <div className="container">
          <div style={{ fontWeight: 800, color: '#1C211D', marginBottom: '4px', fontSize: '0.95rem' }}>
            biteq — smart campus canteen operating system
          </div>
          <div>Easy & Tasty. Skip the queue. Get your food. Built for high-volume collegiate canteens.</div>
        </div>
      </footer>
    </div>
  );
};

export const App: React.FC = () => {
  return <AppContent />;
};

export default App;
