import React, { useState } from 'react';
import { useCanteen } from '../context/CanteenContext';
import { Order } from '../types';
import { Star, Sparkles, X, Check } from 'lucide-react';

interface FeedbackModalProps {
  order: Order | null;
  onClose: () => void;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({ order, onClose }) => {
  const { submitFeedback } = useCanteen();

  const [foodRating, setFoodRating] = useState(5);
  const [prepRating, setPrepRating] = useState(5);
  const [packagingRating, setPackagingRating] = useState(5);
  const [serviceRating, setServiceRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!order) return null;

  const handleSubmit = () => {
    const overall = Number(((foodRating + prepRating + packagingRating + serviceRating) / 4).toFixed(1));
    submitFeedback({
      order_id: order.id,
      user_id: order.user_id,
      user_name: order.user_name,
      rating_food: foodRating,
      rating_prep: prepRating,
      rating_packaging: packagingRating,
      rating_service: serviceRating,
      overall_rating: overall,
      comments: comment,
    });
    setIsSubmitted(true);
    setTimeout(() => {
      onClose();
      setIsSubmitted(false);
    }, 1500);
  };

  const renderStars = (rating: number, setRating: (r: number) => void) => (
    <div style={{ display: 'flex', gap: '4px' }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => setRating(star)}
          style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '2px' }}
        >
          <Star
            size={22}
            fill={star <= rating ? '#FBBF24' : 'transparent'}
            color={star <= rating ? '#FBBF24' : '#64748B'}
          />
        </button>
      ))}
    </div>
  );

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.8)',
      backdropFilter: 'blur(8px)',
      zIndex: 1250,
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
        padding: '24px',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>How was your order?</h3>
            <div style={{ fontSize: '0.8rem', color: '#94A3B8' }}>Token #{order.token_code} • {order.items?.[0]?.product_name}</div>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: '#94A3B8', cursor: 'pointer', fontSize: '1.2rem' }}
          >
            ✕
          </button>
        </div>

        {isSubmitted ? (
          <div style={{ textAlign: 'center', padding: '30px 10px', color: '#34D399' }}>
            <Sparkles size={40} style={{ margin: '0 auto 12px' }} />
            <div style={{ fontWeight: 800, fontSize: '1.2rem' }}>Feedback Received!</div>
            <div style={{ color: '#94A3B8', fontSize: '0.85rem', marginTop: '4px' }}>+15 Bite Points added to your streak!</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.88rem', color: '#E2E8F0' }}>Food Quality & Taste</span>
              {renderStars(foodRating, setFoodRating)}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.88rem', color: '#E2E8F0' }}>Preparation Speed</span>
              {renderStars(prepRating, setPrepRating)}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.88rem', color: '#E2E8F0' }}>Packaging & Freshness</span>
              {renderStars(packagingRating, setPackagingRating)}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.88rem', color: '#E2E8F0' }}>Counter Service</span>
              {renderStars(serviceRating, setServiceRating)}
            </div>

            <div style={{ marginTop: '8px' }}>
              <label style={{ fontSize: '0.78rem', color: '#94A3B8', display: 'block', marginBottom: '4px' }}>Comments / Suggestions (Optional)</label>
              <textarea
                placeholder="Crispy and hot! Loved the mint chutney."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                style={{ width: '100%', padding: '10px', borderRadius: '10px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#FFF', fontFamily: 'var(--font-sans)', fontSize: '0.85rem' }}
              />
            </div>

            <button
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '6px' }}
              onClick={handleSubmit}
            >
              Submit Rating & Collect Points
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
