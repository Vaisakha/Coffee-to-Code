import React, { useState } from 'react';
import { 
  X, 
  HelpCircle, 
  ShoppingBag, 
  Wallet, 
  Truck, 
  QrCode, 
  Bot, 
  Sparkles, 
  ChevronRight, 
  ChevronLeft, 
  BookOpen, 
  CheckCircle2,
  Lightbulb
} from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAiAssistant: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose, onOpenAiAssistant }) => {
  const [activeStep, setActiveStep] = useState(0);

  if (!isOpen) return null;

  const tutorialSteps = [
    {
      title: '1. Browse & Add Dishes to Cart',
      icon: ShoppingBag,
      color: '#EE4322',
      bg: '#FFEFEA',
      description: 'Explore the full canteen menu sorted by categories (Breakfast, Snacks, Meals, Beverages). Filter by Veg/Non-Veg, check popularity badges, and click "Add to Cart" to build your order.',
      tips: [
        'Use search to quickly locate your favorite dishes.',
        'View prep time estimates before adding items.'
      ]
    },
    {
      title: '2. BiteQ Savings Wallet & Instant Pay',
      icon: Wallet,
      color: '#059669',
      bg: '#E6F4EA',
      description: 'Deposit money into your BiteQ Savings Wallet using GPay, UPI, or Direct Bank Transfer. When checking out, select "Pay from Wallet" for 1-click instant payment with zero gateway delay.',
      tips: [
        'Check total saved money and past spending history in the Wallet modal.',
        'Top up anytime with quick deposit shortcuts.'
      ]
    },
    {
      title: '3. Express Campus Delivery with GPS',
      icon: Truck,
      color: '#2563EB',
      bg: '#E8F0FE',
      description: 'Press the Delivery button in the top header and click "Trace My Location Now". Our GPS feature will pinpoint your exact location on campus so canteen staff deliver food directly to your hostel or bench.',
      tips: [
        'Add specific block/bench number for ultra-fast delivery.',
        'Track estimated delivery time in real time.'
      ]
    },
    {
      title: '4. Digital Tokens & Queue Tracking',
      icon: QrCode,
      color: '#D97706',
      bg: '#FEF3C7',
      description: 'Once placed, your order gets a digital token code (e.g. B142) and QR code. Track live preparation status on the Kitchen KDS board or scan your QR code at the counter for instant pickup.',
      tips: [
        'No standing in physical queues — wait until your status turns READY.',
        'Download or view thermal receipts anytime.'
      ]
    },
    {
      title: '5. AI Food Assistant & Taste Preferences',
      icon: Bot,
      color: '#9333EA',
      bg: '#F3E8FF',
      description: 'Our built-in AI Assistant learns your eating preferences and food dislikes. Tell it what you love or allergies you have, and it will generate personalized dish recommendations.',
      tips: [
        'Set your dietary preference (Veg / Non-Veg / Spicy / Healthy).',
        'Ask the AI Assistant any questions about using the app.'
      ]
    }
  ];

  const currentTutorial = tutorialSteps[activeStep];
  const Icon = currentTutorial.icon;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      backgroundColor: 'rgba(28, 33, 29, 0.65)',
      backdropFilter: 'blur(8px)',
      animation: 'fadeIn 0.2s ease-out'
    }}>
      <div style={{
        background: '#FFFFFF',
        borderRadius: '24px',
        width: '100%',
        maxWidth: '560px',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 24px 48px rgba(0,0,0,0.18)',
        border: '1px solid #E8E2D6',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header */}
        <div style={{
          padding: '24px 28px 20px',
          borderBottom: '1px solid #F0ECE1',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'linear-gradient(135deg, #FFF9F5 0%, #FFFFFF 100%)',
          borderRadius: '24px 24px 0 0'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '14px',
              background: '#EE4322',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              boxShadow: '0 4px 12px rgba(238, 67, 34, 0.25)'
            }}>
              <HelpCircle size={22} />
            </div>
            <div>
              <h2 style={{
                fontSize: '1.25rem',
                fontWeight: 800,
                color: '#1C211D',
                margin: 0,
                letterSpacing: '-0.02em'
              }}>
                App Usage Guide & Tutorial
              </h2>
              <p style={{ fontSize: '0.82rem', color: '#58615A', margin: '2px 0 0' }}>
                Learn how to order, pay with wallet, trace delivery & track tokens
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: '#F4EFE6',
              border: 'none',
              borderRadius: '50%',
              width: '34px',
              height: '34px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#58615A'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Progress Indicators */}
          <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
            {tutorialSteps.map((_, idx) => (
              <div
                key={idx}
                onClick={() => setActiveStep(idx)}
                style={{
                  flex: 1,
                  height: '6px',
                  borderRadius: '999px',
                  background: idx === activeStep ? '#EE4322' : '#E8E2D6',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              />
            ))}
          </div>

          {/* Active Tutorial Card */}
          <div style={{
            background: '#FAF7F2',
            border: '1px solid #E8E2D6',
            borderRadius: '20px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '16px',
                background: currentTutorial.bg,
                color: currentTutorial.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Icon size={24} />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#1C211D', margin: 0 }}>
                {currentTutorial.title}
              </h3>
            </div>

            <p style={{ fontSize: '0.92rem', color: '#444A45', lineHeight: 1.55, margin: 0 }}>
              {currentTutorial.description}
            </p>

            <div style={{
              background: '#FFFFFF',
              borderRadius: '14px',
              padding: '14px',
              border: '1px solid #E8E2D6',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}>
              <div style={{
                fontSize: '0.78rem',
                fontWeight: 800,
                color: '#EE4322',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <Lightbulb size={14} /> PRO TIPS:
              </div>
              {currentTutorial.tips.map((tip, idx) => (
                <div key={idx} style={{ fontSize: '0.84rem', color: '#58615A', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <CheckCircle2 size={14} color="#059669" style={{ marginTop: '2px', flexShrink: 0 }} />
                  <span>{tip}</span>
                </div>
              ))}
            </div>
          </div>

          {/* AI Assistant Banner Link */}
          <div style={{
            background: 'linear-gradient(135deg, #1C211D 0%, #2D342E 100%)',
            borderRadius: '16px',
            padding: '16px 20px',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '12px',
                background: 'rgba(238, 67, 34, 0.25)',
                color: '#FF7B60',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Bot size={20} />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#FFFFFF' }}>Need AI Help or Food Suggestions?</div>
                <div style={{ fontSize: '0.76rem', color: '#A3B0A5' }}>Set your taste preferences & get AI dish recommendations</div>
              </div>
            </div>

            <button
              onClick={() => {
                onClose();
                onOpenAiAssistant();
              }}
              style={{
                background: '#EE4322',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '10px',
                padding: '8px 14px',
                fontSize: '0.82rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                whiteSpace: 'nowrap'
              }}
            >
              <Sparkles size={14} /> Open AI Assistant
            </button>
          </div>

          {/* Carousel Step Controls */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button
              onClick={() => setActiveStep((prev) => Math.max(0, prev - 1))}
              disabled={activeStep === 0}
              style={{
                padding: '10px 16px',
                borderRadius: '12px',
                border: '1px solid #E8E2D6',
                background: '#FFFFFF',
                color: activeStep === 0 ? '#C4C9C5' : '#58615A',
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: activeStep === 0 ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <ChevronLeft size={16} /> Previous Step
            </button>

            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#8A948C' }}>
              Step {activeStep + 1} of {tutorialSteps.length}
            </span>

            {activeStep < tutorialSteps.length - 1 ? (
              <button
                onClick={() => setActiveStep((prev) => Math.min(tutorialSteps.length - 1, prev + 1))}
                style={{
                  padding: '10px 18px',
                  borderRadius: '12px',
                  border: 'none',
                  background: '#EE4322',
                  color: '#FFFFFF',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                Next Step <ChevronRight size={16} />
              </button>
            ) : (
              <button
                onClick={onClose}
                style={{
                  padding: '10px 18px',
                  borderRadius: '12px',
                  border: 'none',
                  background: '#137333',
                  color: '#FFFFFF',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  cursor: 'pointer'
                }}
              >
                Got It, Thanks!
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
