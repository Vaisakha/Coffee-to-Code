import React from 'react';
import { MealPlan } from '../types';
import { Check, Sparkles, Utensils, Calendar, ShieldCheck, ArrowRight } from 'lucide-react';

interface MealPlanCardProps {
  plan: MealPlan;
  isCurrentPlan: boolean;
  onSubscribe: (planId: string) => void;
}

export const MealPlanCard: React.FC<MealPlanCardProps> = ({ plan, isCurrentPlan, onSubscribe }) => {
  const costPerMeal = Math.round(plan.price / (plan.meals_per_week * plan.duration_weeks));

  return (
    <div style={{
      background: '#FFFFFF',
      border: isCurrentPlan ? '2px solid var(--brand-emerald)' : plan.recommended ? '2px solid var(--brand-orange)' : '1px solid var(--border-subtle)',
      borderRadius: '20px',
      padding: '24px',
      position: 'relative',
      boxShadow: plan.recommended ? 'var(--shadow-md)' : 'var(--shadow-sm)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      transition: 'all 0.2s ease',
    }}>
      {/* Top Badge */}
      {isCurrentPlan ? (
        <span style={{
          position: 'absolute',
          top: '-12px',
          right: '20px',
          background: 'var(--brand-emerald)',
          color: '#FFFFFF',
          fontSize: '0.74rem',
          fontWeight: 800,
          padding: '4px 12px',
          borderRadius: '999px',
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
          boxShadow: '0 4px 10px rgba(5, 150, 105, 0.3)'
        }}>
          ✓ Current Active Plan
        </span>
      ) : plan.recommended ? (
        <span style={{
          position: 'absolute',
          top: '-12px',
          right: '20px',
          background: 'var(--brand-orange)',
          color: '#FFFFFF',
          fontSize: '0.74rem',
          fontWeight: 800,
          padding: '4px 12px',
          borderRadius: '999px',
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
          boxShadow: '0 4px 10px rgba(238, 67, 34, 0.3)'
        }}>
          ⭐ Most Popular Choice
        </span>
      ) : null}

      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: isCurrentPlan ? '#D1FAE5' : '#FFF7ED',
            color: isCurrentPlan ? 'var(--brand-emerald)' : 'var(--brand-orange)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Utensils size={18} />
          </div>
          <div>
            <h4 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.18rem',
              fontWeight: 800,
              color: 'var(--text-primary)',
              lineHeight: 1.2
            }}>
              {plan.name}
            </h4>
            <span style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
              {plan.meals_per_week} meals/week • {plan.duration_weeks} weeks
            </span>
          </div>
        </div>

        <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: 1.45 }}>
          {plan.description}
        </p>

        {/* Pricing Block */}
        <div style={{
          background: '#FAF7F2',
          border: '1px solid var(--border-subtle)',
          borderRadius: '14px',
          padding: '12px 16px',
          marginBottom: '18px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline'
        }}>
          <div>
            <span style={{ fontSize: '1.65rem', fontWeight: 900, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>
              ₹{plan.price}
            </span>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginLeft: '4px' }}>
              / {plan.duration_weeks} wks
            </span>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span style={{
              fontSize: '0.74rem',
              fontWeight: 800,
              color: 'var(--brand-emerald)',
              background: '#D1FAE5',
              padding: '2px 8px',
              borderRadius: '999px'
            }}>
              ~₹{costPerMeal}/meal
            </span>
          </div>
        </div>

        {/* Perks List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '22px' }}>
          {plan.perks?.map((perk, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', color: 'var(--text-primary)' }}>
              <div style={{
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                background: '#D1FAE5',
                color: 'var(--brand-emerald)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Check size={11} strokeWidth={3} />
              </div>
              <span>{perk}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Action Button */}
      {isCurrentPlan ? (
        <button
          className="btn"
          disabled
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: '12px',
            background: '#D1FAE5',
            color: 'var(--brand-emerald)',
            border: '1px solid #A7F3D0',
            fontWeight: 800,
            cursor: 'default'
          }}
        >
          <ShieldCheck size={16} /> Subscribed (Active)
        </button>
      ) : (
        <button
          className="btn btn-primary"
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: '12px',
            fontSize: '0.9rem',
            fontWeight: 700
          }}
          onClick={() => onSubscribe(plan.id)}
        >
          Subscribe to Plan <ArrowRight size={15} />
        </button>
      )}
    </div>
  );
};
