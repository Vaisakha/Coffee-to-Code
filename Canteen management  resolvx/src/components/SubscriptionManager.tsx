import React, { useState } from 'react';
import { useCanteen } from '../context/CanteenContext';
import { MealPlanCard } from './MealPlanCard';
import { 
  Calendar, 
  CreditCard, 
  RotateCcw, 
  ShieldCheck, 
  Utensils, 
  Sparkles, 
  Clock, 
  AlertCircle,
  TrendingUp,
  CheckCircle2,
  Award
} from 'lucide-react';

interface SubscriptionManagerProps {
  onOpenCart?: () => void;
}

export const SubscriptionManager: React.FC<SubscriptionManagerProps> = ({ onOpenCart }) => {
  const { 
    mealPlans, 
    mySubscription, 
    subscriptionRedemptions, 
    subscribeToMealPlan, 
    skipTodayMealCredit 
  } = useCanteen();

  const [activeSubTab, setActiveSubTab] = useState<'MY_PLAN' | 'BROWSE_PLANS'>('MY_PLAN');

  const currentPlan = mealPlans.find((p) => p.id === mySubscription?.plan_id);
  const maxBankedCap = 3;
  const isCapReached = (mySubscription?.credits_carried_forward || 0) >= maxBankedCap;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Sub-navigation pill tabs */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="pulse-dot" style={{ backgroundColor: 'var(--brand-emerald)' }} />
            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--brand-emerald)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              Campus Mess & Meal Plan Pass
            </span>
          </div>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.75rem',
            fontWeight: 800,
            color: 'var(--text-primary)',
            marginTop: '2px'
          }}>
            Smart Meal Subscription
          </h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
            Unlimited convenience: zero checkout delays, rollover credits for missed meals, and big student savings.
          </p>
        </div>

        {/* Tab switcher */}
        <div style={{
          display: 'flex',
          background: '#FFFFFF',
          border: '1px solid var(--border-subtle)',
          borderRadius: '999px',
          padding: '4px',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <button
            onClick={() => setActiveSubTab('MY_PLAN')}
            style={{
              padding: '8px 18px',
              borderRadius: '999px',
              border: 'none',
              background: activeSubTab === 'MY_PLAN' ? 'var(--text-primary)' : 'transparent',
              color: activeSubTab === 'MY_PLAN' ? '#FFFFFF' : 'var(--text-secondary)',
              fontSize: '0.84rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            My Subscription Status
          </button>
          <button
            onClick={() => setActiveSubTab('BROWSE_PLANS')}
            style={{
              padding: '8px 18px',
              borderRadius: '999px',
              border: 'none',
              background: activeSubTab === 'BROWSE_PLANS' ? 'var(--text-primary)' : 'transparent',
              color: activeSubTab === 'BROWSE_PLANS' ? '#FFFFFF' : 'var(--text-secondary)',
              fontSize: '0.84rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            Explore Plans ({mealPlans.length})
          </button>
        </div>
      </div>

      {/* View 1: Student's Active Subscription Status */}
      {activeSubTab === 'MY_PLAN' && (
        mySubscription && mySubscription.status === 'active' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Active Plan Hero Card */}
            <div style={{
              background: '#FFFFFF',
              border: '1.5px solid var(--border-subtle)',
              borderRadius: '24px',
              padding: '28px',
              boxShadow: 'var(--shadow-sm)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: '180px',
                height: '180px',
                background: 'rgba(5, 150, 105, 0.06)',
                borderRadius: '50%',
                filter: 'blur(30px)',
                pointerEvents: 'none'
              }} />

              {/* Plan Status Header */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                flexWrap: 'wrap',
                gap: '16px',
                borderBottom: '1px solid var(--border-subtle)',
                paddingBottom: '20px',
                marginBottom: '22px'
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="badge badge-green">
                      ● Active Pass
                    </span>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      ID: {mySubscription.id}
                    </span>
                  </div>
                  <h3 style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.6rem',
                    fontWeight: 800,
                    color: 'var(--text-primary)',
                    marginTop: '4px'
                  }}>
                    {currentPlan?.name || 'Campus Meal Plan'}
                  </h3>
                  <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    Renewal Date: <strong style={{ color: 'var(--text-primary)' }}>{mySubscription.end_date}</strong> (in 12 days)
                  </div>
                </div>

                {/* Rollover Skip Action */}
                <div style={{
                  background: '#FAF7F2',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '16px',
                  padding: '14px 18px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  maxWidth: '300px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 700 }}>
                      CARRY-FORWARD ROLLOVER
                    </span>
                    <span style={{
                      fontSize: '0.74rem',
                      fontWeight: 800,
                      color: isCapReached ? '#B45309' : '#059669',
                      background: isCapReached ? '#FEF3C7' : '#D1FAE5',
                      padding: '2px 8px',
                      borderRadius: '999px'
                    }}>
                      {mySubscription.credits_carried_forward} / {maxBankedCap} Banked
                    </span>
                  </div>

                  <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)', lineHeight: 1.35 }}>
                    Skipping lunch or dinner? Bank it to redeem whenever you want instead of losing the credit!
                  </p>

                  <button
                    className="btn btn-secondary"
                    style={{
                      fontSize: '0.82rem',
                      padding: '8px 12px',
                      background: '#FFFFFF',
                      borderColor: '#E8E2D6',
                      fontWeight: 700
                    }}
                    onClick={skipTodayMealCredit}
                    disabled={mySubscription.credits_remaining <= 0 || isCapReached}
                  >
                    <RotateCcw size={14} color="var(--brand-orange)" />
                    {isCapReached ? 'Max Cap Reached (3/3)' : 'Skip Today (Bank +1)'}
                  </button>
                </div>
              </div>

              {/* Progress & Stat Cards */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '16px',
                marginBottom: '22px'
              }}>
                <div style={{
                  background: '#FAF7F2',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '16px',
                  padding: '16px'
                }}>
                  <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase' }}>
                    Credits Remaining This Week
                  </div>
                  <div style={{ fontSize: '1.9rem', fontWeight: 900, color: 'var(--brand-emerald)', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
                    {mySubscription.credits_remaining} <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-muted)' }}>meals</span>
                  </div>
                  <div style={{
                    height: '6px',
                    background: '#E8E2D6',
                    borderRadius: '4px',
                    marginTop: '10px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${Math.min(100, (mySubscription.credits_remaining / (currentPlan?.meals_per_week || 14)) * 100)}%`,
                      height: '100%',
                      background: 'var(--brand-emerald)',
                      borderRadius: '4px'
                    }} />
                  </div>
                </div>

                <div style={{
                  background: '#FAF7F2',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '16px',
                  padding: '16px'
                }}>
                  <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase' }}>
                    Banked Missed Meals (Rollover)
                  </div>
                  <div style={{ fontSize: '1.9rem', fontWeight: 900, color: '#D97706', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
                    {mySubscription.credits_carried_forward} <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-muted)' }}>banked</span>
                  </div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '8px' }}>
                    Cap: 3 max credits. Reconciled via pure immutable functions.
                  </div>
                </div>

                <div style={{
                  background: '#FAF7F2',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '16px',
                  padding: '16px'
                }}>
                  <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase' }}>
                    1-Click Checkout at POS
                  </div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CheckCircle2 size={18} color="var(--brand-emerald)" /> Ready at Tray
                  </div>
                  <div style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '8px' }}>
                    Select "Redeem from Meal Plan" on checkout.
                  </div>
                </div>
              </div>

              {/* Recent Redemptions Audit Log */}
              <div>
                <h4 style={{ fontSize: '0.94rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '12px' }}>
                  Recent Meal Plan Redemptions
                </h4>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {subscriptionRedemptions.map((red) => (
                    <div
                      key={red.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px 14px',
                        background: '#FAF7F2',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '12px',
                        fontSize: '0.82rem'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{
                          padding: '3px 8px',
                          borderRadius: '6px',
                          background: '#D1FAE5',
                          color: '#065F46',
                          fontWeight: 800,
                          fontSize: '0.72rem'
                        }}>
                          {red.meal_slot}
                        </span>
                        <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                          {red.item_name || 'Chef Hot Plate Meal'}
                        </span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--brand-orange)' }}>
                          Token #{red.token_code || 'B132'}
                        </span>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.76rem' }}>
                          {new Date(red.redeemed_at).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div style={{
            background: '#FFFFFF',
            border: '1px solid var(--border-subtle)',
            borderRadius: '24px',
            padding: '40px 20px',
            textAlign: 'center',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🍱</div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              No Active Meal Subscription
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', maxWidth: '400px', margin: '6px auto 20px' }}>
              Subscribe to a hostel or campus mess plan to unlock 1-click zero-cash dining and automated rollover credits.
            </p>
            <button
              className="btn btn-primary"
              style={{ borderRadius: '999px' }}
              onClick={() => setActiveSubTab('BROWSE_PLANS')}
            >
              Browse Campus Plans
            </button>
          </div>
        )
      )}

      {/* View 2: Browse All Available Meal Plans */}
      {activeSubTab === 'BROWSE_PLANS' && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '20px'
        }}>
          {mealPlans.map((plan) => (
            <MealPlanCard
              key={plan.id}
              plan={plan}
              isCurrentPlan={mySubscription?.plan_id === plan.id && mySubscription.status === 'active'}
              onSubscribe={(planId) => subscribeToMealPlan(planId)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
