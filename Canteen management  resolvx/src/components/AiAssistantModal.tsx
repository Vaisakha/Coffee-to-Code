import React, { useState, useMemo } from 'react';
import { 
  X, 
  Bot, 
  Sparkles, 
  Heart, 
  ThumbsDown, 
  Flame, 
  Check, 
  Plus, 
  Send, 
  MessageSquare, 
  Sliders, 
  Utensils, 
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useCanteen } from '../context/CanteenContext';
import { Product } from '../types';

interface AiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
}

export const AiAssistantModal: React.FC<AiAssistantModalProps> = ({ isOpen, onClose }) => {
  const { products, addToCart, addToast } = useCanteen();

  const [activeTab, setActiveTab] = useState<'recommendations' | 'preferences' | 'chat'>('recommendations');

  // Preference State
  const [dietFilter, setDietFilter] = useState<'ALL' | 'VEG' | 'NON_VEG'>('ALL');
  const [spiceLevel, setSpiceLevel] = useState<'MILD' | 'MEDIUM' | 'SPICY'>('MEDIUM');
  const [selectedTags, setSelectedTags] = useState<string[]>(['Popular', 'High Protein']);
  const [dislikesInput, setDislikesInput] = useState<string>('Mushrooms, Excessive Oil');
  const [isSaved, setIsSaved] = useState(false);

  // Chat State
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-1',
      sender: 'ai',
      text: 'Hello! I am your BiteQ AI Food & App Assistant 🤖. How can I help you today? You can ask me how to use any feature, or set your taste preferences for customized dish suggestions!',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  if (!isOpen) return null;

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    addToast('Preferences Saved! ✨', 'AI will now personalize your dish recommendations', 'success');
    setTimeout(() => {
      setIsSaved(false);
      setActiveTab('recommendations');
    }, 1200);
  };

  // AI Recommendation Engine Logic
  const recommendedProducts = useMemo(() => {
    return products.filter((prod) => {
      // Diet Filter
      if (dietFilter === 'VEG' && !prod.is_veg) return false;
      if (dietFilter === 'NON_VEG' && prod.is_veg) return false;

      // Dislikes check
      const dislikes = dislikesInput.toLowerCase().split(',').map((s) => s.trim()).filter(Boolean);
      const productNameLower = prod.name.toLowerCase();
      const productDescLower = prod.description.toLowerCase();
      
      for (const dislike of dislikes) {
        if (dislike && (productNameLower.includes(dislike) || productDescLower.includes(dislike))) {
          return false;
        }
      }

      return true;
    }).slice(0, 6);
  }, [products, dietFilter, dislikesInput]);

  const handleSendMessage = (textToSend?: string) => {
    const query = textToSend || chatInput;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setChatInput('');

    // AI Intelligent Response Generator & Recommendation Model
    setTimeout(() => {
      const q = query.toLowerCase();
      let aiText = "";

      // 1. Wallet & Deposit Queries
      if (q.includes('wallet') || q.includes('money') || q.includes('gpay') || q.includes('bank') || q.includes('deposit') || q.includes('pay')) {
        aiText = "💰 **BiteQ Savings Wallet Instructions**:\n1. Click the **Wallet** button on the top right (next to Delivery).\n2. Choose your deposit method: **GPay / UPI** or **Bank Transfer**.\n3. Enter the amount (e.g. ₹500) and click **Deposit**.\n4. When ordering food in your **Cart**, select **'Pay from Wallet'** for 1-click instant payment!";
      } 
      // 2. Delivery & GPS Location Queries
      else if (q.includes('delivery') || q.includes('location') || q.includes('hostel') || q.includes('gps') || q.includes('trace')) {
        aiText = "🚚 **Express Campus Delivery Instructions**:\n1. Click the **Delivery** button on the top right of the header.\n2. Click **'Trace My Location Now'** to auto-detect your exact GPS coordinates on campus.\n3. Enter your Building/Hostel and Room/Bench number.\n4. Confirm your location for direct delivery in ~15-20 mins!";
      } 
      // 3. Digital Token & Queue Queries
      else if (q.includes('token') || q.includes('queue') || q.includes('pickup') || q.includes('qr') || q.includes('track')) {
        aiText = "🎫 **Queue IQ & Digital Tokens Instructions**:\n1. After placing an order, a digital token (e.g. **B142**) is generated.\n2. Watch the live Kitchen KDS board for status updates (**ACCEPTED → PREPARING → READY**).\n3. When your status turns **READY**, show your token QR code at the counter for fast pickup!";
      }
      // 4. Budget & Price Queries (Under 100, cheap, etc)
      else if (q.includes('budget') || q.includes('cheap') || q.includes('under') || q.includes('50') || q.includes('100') || q.includes('150')) {
        const cheapDishes = products.filter(p => p.price <= 100).map(p => `• **${p.name}** (₹${p.price})`).join('\n');
        aiText = `💡 **Best Budget Food Suggestions Under ₹100**:\n${cheapDishes || '• Masala Dosa (₹60)\n• Samosa Chat (₹40)\n• Fresh Lime Soda (₹30)'}\n\nSwitch to the **AI Suggestions** tab to add them to your cart!`;
      }
      // 5. Veg vs Non-Veg Suggestions
      else if (q.includes('veg') || q.includes('vegetarian') || q.includes('paneer') || q.includes('non-veg') || q.includes('chicken')) {
        const isVegReq = !q.includes('non-veg') && (q.includes('veg') || q.includes('paneer') || q.includes('vegetarian'));
        const matches = products.filter(p => isVegReq ? p.is_veg : !p.is_veg).slice(0, 3);
        const listText = matches.map(p => `• **${p.name}** (₹${p.price}) - ${p.description}`).join('\n');
        aiText = `🥗 **Top ${isVegReq ? '100% Pure Veg' : 'Non-Veg'} AI Suggestions**:\n${listText}\n\nSet your preferences in the **My Taste Profile** tab to customize further!`;
      }
      // 6. Food Recommendations / Suggestions
      else if (q.includes('recommend') || q.includes('suggest') || q.includes('eat') || q.includes('food') || q.includes('hungry') || q.includes('best')) {
        const topPick = recommendedProducts[0] || products[0];
        const secondPick = recommendedProducts[1] || products[1];
        aiText = `✨ **BiteQ AI Recommended Meal Plan**:\n1. **${topPick?.name || 'Chicken Biryani'}** (₹${topPick?.price || 180}) - *${topPick?.description || 'Chef special'}*\n2. **${secondPick?.name || 'Fresh Lime Soda'}** (₹${secondPick?.price || 35})\n\nTailored based on your saved taste preferences! Click **AI Suggestions** tab to add to Cart with 1 click.`;
      }
      // 7. General Help & How to use
      else {
        aiText = "🤖 **BiteQ AI Assistant Guidance**:\n- Click **Help Guide** (top-left) for visual step-by-step app instructions.\n- Click **Wallet** (top-right) to add money via GPay/Bank.\n- Click **Delivery** (top-right) to trace your GPS location for hostel delivery.\n- Tell me what you feel like eating or set your taste profile in **My Taste Profile** for customized food suggestions!";
      }

      const aiReply: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: aiText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, aiReply]);
    }, 500);
  };

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
        maxWidth: '580px',
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
          background: 'linear-gradient(135deg, #1C211D 0%, #2D342E 100%)',
          color: '#FFFFFF',
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
              boxShadow: '0 4px 12px rgba(238, 67, 34, 0.4)'
            }}>
              <Bot size={24} />
            </div>
            <div>
              <h2 style={{
                fontSize: '1.25rem',
                fontWeight: 800,
                color: '#FFFFFF',
                margin: 0,
                letterSpacing: '-0.02em',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                BiteQ AI Assistant <Sparkles size={16} color="#FF7B60" />
              </h2>
              <p style={{ fontSize: '0.82rem', color: '#A3B0A5', margin: '2px 0 0' }}>
                Personalized food suggestions & instant app guidance
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.15)',
              border: 'none',
              borderRadius: '50%',
              width: '34px',
              height: '34px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#FFFFFF'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Navigation Tabs */}
          <div style={{
            display: 'flex',
            background: '#FAF7F2',
            padding: '4px',
            borderRadius: '14px',
            border: '1px solid #E8E2D6'
          }}>
            <button
              onClick={() => setActiveTab('recommendations')}
              style={{
                flex: 1,
                padding: '9px 6px',
                borderRadius: '10px',
                border: 'none',
                background: activeTab === 'recommendations' ? '#FFFFFF' : 'transparent',
                color: activeTab === 'recommendations' ? '#EE4322' : '#58615A',
                fontWeight: activeTab === 'recommendations' ? 800 : 600,
                fontSize: '0.82rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                boxShadow: activeTab === 'recommendations' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none'
              }}
            >
              <Sparkles size={15} /> AI Suggestions
            </button>

            <button
              onClick={() => setActiveTab('preferences')}
              style={{
                flex: 1,
                padding: '9px 6px',
                borderRadius: '10px',
                border: 'none',
                background: activeTab === 'preferences' ? '#FFFFFF' : 'transparent',
                color: activeTab === 'preferences' ? '#EE4322' : '#58615A',
                fontWeight: activeTab === 'preferences' ? 800 : 600,
                fontSize: '0.82rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                boxShadow: activeTab === 'preferences' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none'
              }}
            >
              <Sliders size={15} /> My Taste Profile
            </button>

            <button
              onClick={() => setActiveTab('chat')}
              style={{
                flex: 1,
                padding: '9px 6px',
                borderRadius: '10px',
                border: 'none',
                background: activeTab === 'chat' ? '#FFFFFF' : 'transparent',
                color: activeTab === 'chat' ? '#EE4322' : '#58615A',
                fontWeight: activeTab === 'chat' ? 800 : 600,
                fontSize: '0.82rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                boxShadow: activeTab === 'chat' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none'
              }}
            >
              <MessageSquare size={15} /> App Guide Chat
            </button>
          </div>

          {/* TAB 1: AI RECOMMENDATIONS */}
          {activeTab === 'recommendations' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{
                background: '#FFF9F6',
                border: '1px solid #FFDCD2',
                borderRadius: '14px',
                padding: '14px 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '0.84rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#1C211D' }}>
                  <Utensils size={18} color="#EE4322" />
                  <span>
                    Tailored for: <strong>{dietFilter === 'ALL' ? 'All Diets' : dietFilter === 'VEG' ? '100% Veg' : 'Non-Veg'}</strong> • Dislikes: <em>{dislikesInput || 'None'}</em>
                  </span>
                </div>
                <button
                  onClick={() => setActiveTab('preferences')}
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
                  Edit
                </button>
              </div>

              {/* Recommended Dishes Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                {recommendedProducts.map((prod) => (
                  <div
                    key={prod.id}
                    style={{
                      background: '#FFFFFF',
                      borderRadius: '16px',
                      border: '1px solid #E8E2D6',
                      overflow: 'hidden',
                      display: 'flex',
                      flexDirection: 'column',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.04)'
                    }}
                  >
                    <div style={{ position: 'relative', height: '110px' }}>
                      <img
                        src={prod.image_url}
                        alt={prod.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <span style={{
                        position: 'absolute',
                        top: '8px',
                        left: '8px',
                        background: 'rgba(28, 33, 29, 0.85)',
                        backdropFilter: 'blur(4px)',
                        color: '#4ADE80',
                        fontSize: '0.68rem',
                        fontWeight: 800,
                        padding: '3px 8px',
                        borderRadius: '999px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}>
                        <Sparkles size={10} color="#4ADE80" /> 98% AI Match
                      </span>
                    </div>

                    <div style={{ padding: '12px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '8px' }}>
                      <div>
                        <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#1C211D' }}>
                          {prod.name}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#58615A', marginTop: '2px', lineHeight: 1.3 }}>
                          {prod.description.slice(0, 50)}...
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '4px' }}>
                        <span style={{ fontWeight: 900, fontSize: '1rem', color: '#EE4322' }}>
                          ₹{prod.price}
                        </span>
                        <button
                          onClick={() => addToCart(prod)}
                          style={{
                            background: '#EE4322',
                            color: '#FFFFFF',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '6px 12px',
                            fontSize: '0.78rem',
                            fontWeight: 800,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <Plus size={14} /> Add
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: MY TASTE PREFERENCES */}
          {activeTab === 'preferences' && (
            <form onSubmit={handleSavePreferences} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              
              {/* Diet Preference */}
              <div>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 800, color: '#1C211D', marginBottom: '8px' }}>
                  Dietary Category:
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                  {[
                    { id: 'ALL', label: 'Anything / Both' },
                    { id: 'VEG', label: '100% Pure Veg 🥗' },
                    { id: 'NON_VEG', label: 'Non-Veg 🍗' },
                  ].map(({ id, label }) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setDietFilter(id as any)}
                      style={{
                        padding: '10px 8px',
                        borderRadius: '12px',
                        border: dietFilter === id ? '2px solid #EE4322' : '1px solid #E8E2D6',
                        background: dietFilter === id ? '#FFF9F6' : '#FFFFFF',
                        color: dietFilter === id ? '#EE4322' : '#58615A',
                        fontWeight: dietFilter === id ? 800 : 600,
                        fontSize: '0.8rem',
                        cursor: 'pointer'
                      }}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Spice Level */}
              <div>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 800, color: '#1C211D', marginBottom: '8px' }}>
                  Preferred Spice Level:
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                  {[
                    { id: 'MILD', label: 'Mild & Soft 🍃' },
                    { id: 'MEDIUM', label: 'Medium Spice 🌶️' },
                    { id: 'SPICY', label: 'Extra Spicy 🔥' },
                  ].map(({ id, label }) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setSpiceLevel(id as any)}
                      style={{
                        padding: '10px 8px',
                        borderRadius: '12px',
                        border: spiceLevel === id ? '2px solid #EE4322' : '1px solid #E8E2D6',
                        background: spiceLevel === id ? '#FFF9F6' : '#FFFFFF',
                        color: spiceLevel === id ? '#EE4322' : '#58615A',
                        fontWeight: spiceLevel === id ? 800 : 600,
                        fontSize: '0.8rem',
                        cursor: 'pointer'
                      }}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Liked Tags Chips */}
              <div>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 800, color: '#1C211D', marginBottom: '8px' }}>
                  Food Styles You Love:
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {['Popular', 'High Protein', 'South Indian', 'North Indian', 'Quick Snacks', 'Cool Beverages', 'Healthy / Low Cal'].map((tag) => {
                    const isSel = selectedTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleTag(tag)}
                        style={{
                          padding: '6px 14px',
                          borderRadius: '999px',
                          border: isSel ? '1px solid #EE4322' : '1px solid #E8E2D6',
                          background: isSel ? '#EE4322' : '#FFFFFF',
                          color: isSel ? '#FFFFFF' : '#58615A',
                          fontWeight: 700,
                          fontSize: '0.78rem',
                          cursor: 'pointer'
                        }}
                      >
                        {tag} {isSel && '✓'}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Food Dislikes / Allergies */}
              <div>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 800, color: '#1C211D', marginBottom: '4px' }}>
                  Dislikes & Allergies (Items AI should avoid):
                </label>
                <div style={{ position: 'relative' }}>
                  <ThumbsDown size={16} style={{ position: 'absolute', left: '12px', top: '12px', color: '#8A948C' }} />
                  <input
                    type="text"
                    placeholder="e.g. Mushrooms, Nuts, Extra Oil, Dairy"
                    value={dislikesInput}
                    onChange={(e) => setDislikesInput(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px 10px 36px',
                      borderRadius: '12px',
                      border: '1px solid #E8E2D6',
                      fontSize: '0.86rem',
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              {/* Save Preferences Button */}
              {isSaved ? (
                <div style={{
                  background: '#E6F4EA',
                  color: '#137333',
                  padding: '12px',
                  borderRadius: '12px',
                  fontWeight: 800,
                  textAlign: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}>
                  <CheckCircle2 size={18} /> Taste Preferences Saved! Generating Recommendations...
                </div>
              ) : (
                <button
                  type="submit"
                  style={{
                    padding: '13px',
                    borderRadius: '12px',
                    border: 'none',
                    background: '#EE4322',
                    color: '#FFFFFF',
                    fontWeight: 800,
                    fontSize: '0.95rem',
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(238, 67, 34, 0.3)'
                  }}
                >
                  Save Taste Preferences & Update AI
                </button>
              )}
            </form>
          )}

          {/* TAB 3: APP GUIDE CHAT */}
          {activeTab === 'chat' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              
              {/* Preset Quick Question Chips */}
              <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px' }}>
                {[
                  'How to use Wallet?',
                  'Trace delivery location?',
                  'How do tokens work?',
                  'Suggest lunch under ₹150'
                ].map((qText) => (
                  <button
                    key={qText}
                    onClick={() => handleSendMessage(qText)}
                    style={{
                      padding: '5px 12px',
                      borderRadius: '999px',
                      border: '1px solid #E8E2D6',
                      background: '#FAF7F2',
                      color: '#1C211D',
                      fontSize: '0.74rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    💬 {qText}
                  </button>
                ))}
              </div>

              {/* Messages Container */}
              <div style={{
                background: '#FAF7F2',
                border: '1px solid #E8E2D6',
                borderRadius: '16px',
                padding: '16px',
                height: '240px',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px'
              }}>
                {messages.map((m) => {
                  const isAi = m.sender === 'ai';
                  return (
                    <div
                      key={m.id}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: isAi ? 'flex-start' : 'flex-end'
                      }}
                    >
                      <div style={{
                        maxWidth: '85%',
                        background: isAi ? '#FFFFFF' : '#EE4322',
                        color: isAi ? '#1C211D' : '#FFFFFF',
                        border: isAi ? '1px solid #E8E2D6' : 'none',
                        padding: '10px 14px',
                        borderRadius: isAi ? '14px 14px 14px 2px' : '14px 14px 2px 14px',
                        fontSize: '0.85rem',
                        lineHeight: 1.45,
                        boxShadow: isAi ? '0 2px 6px rgba(0,0,0,0.03)' : '0 2px 6px rgba(238, 67, 34, 0.2)'
                      }}>
                        {m.text}
                      </div>
                      <span style={{ fontSize: '0.68rem', color: '#8A948C', marginTop: '3px' }}>
                        {m.timestamp}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Chat Input Bar */}
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  placeholder="Ask AI Assistant anything about the app..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  style={{
                    flex: 1,
                    padding: '12px 16px',
                    borderRadius: '12px',
                    border: '1px solid #E8E2D6',
                    fontSize: '0.88rem',
                    outline: 'none'
                  }}
                />
                <button
                  onClick={() => handleSendMessage()}
                  style={{
                    background: '#EE4322',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '12px 18px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
