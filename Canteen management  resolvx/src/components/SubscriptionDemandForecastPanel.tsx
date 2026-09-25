import React from 'react';
import { useCanteen } from '../context/CanteenContext';
import { 
  TrendingUp, 
  Package, 
  ShoppingBag, 
  Clock, 
  Utensils, 
  Calendar, 
  CheckCircle2, 
  Info,
  DollarSign
} from 'lucide-react';

export const SubscriptionDemandForecastPanel: React.FC = () => {
  const { demandForecast, mealPlans, mySubscription } = useCanteen();

  const {
    totalActiveSubscriptions,
    committedMealsComingWeek,
    bankedSkipsCount,
    netPurchasingForecastMeals,
    slotBreakdown,
    bulkIngredients,
  } = demandForecast;

  return (
    <div style={{
      background: '#FFFFFF',
      border: '1.5px solid var(--border-subtle)',
      borderRadius: '24px',
      padding: '26px',
      boxShadow: 'var(--shadow-sm)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Top Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        gap: '14px',
        borderBottom: '1px solid var(--border-subtle)',
        paddingBottom: '18px',
        marginBottom: '20px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="pulse-dot" style={{ backgroundColor: 'var(--brand-emerald)' }} />
            <span style={{ fontSize: '0.76rem', fontWeight: 800, color: 'var(--brand-emerald)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              Predictive Inventory Intelligence
            </span>
          </div>
          <h3 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.45rem',
            fontWeight: 800,
            color: 'var(--text-primary)',
            marginTop: '2px'
          }}>
            Subscription Demand Forecast (Coming Week)
          </h3>
          <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
            Total committed meals calculated from active student passes minus banked skips. Provides pre-prep purchasing volumes before cooking starts.
          </p>
        </div>

        <span style={{
          fontSize: '0.74rem',
          fontWeight: 800,
          padding: '4px 12px',
          borderRadius: '999px',
          background: '#D1FAE5',
          color: '#065F46',
          border: '1px solid #A7F3D0'
        }}>
          Bulk Purchase Target: {netPurchasingForecastMeals} Meals
        </span>
      </div>

      {/* KPI Cards Grid */}
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
            Active Meal Pass Holders
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 900, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
            {totalActiveSubscriptions} <span style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-muted)' }}>students</span>
          </div>
          <div style={{ fontSize: '0.74rem', color: '#059669', marginTop: '6px' }}>
            100% upfront prepaid revenue
          </div>
        </div>

        <div style={{
          background: '#FAF7F2',
          border: '1px solid var(--border-subtle)',
          borderRadius: '16px',
          padding: '16px'
        }}>
          <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase' }}>
            Total Committed Meals
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 900, color: 'var(--brand-orange)', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
            {committedMealsComingWeek} <span style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-muted)' }}>meals</span>
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            Based on active pass weekly quotas
          </div>
        </div>

        <div style={{
          background: '#FAF7F2',
          border: '1px solid var(--border-subtle)',
          borderRadius: '16px',
          padding: '16px'
        }}>
          <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase' }}>
            Already-Banked Skips
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 900, color: '#D97706', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
            -{bankedSkipsCount} <span style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-muted)' }}>skips</span>
          </div>
          <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '6px' }}>
            Rollover deduction applied
          </div>
        </div>

        <div style={{
          background: '#FAF7F2',
          border: '1.5px solid #A7F3D0',
          borderRadius: '16px',
          padding: '16px'
        }}>
          <div style={{ fontSize: '0.76rem', color: '#065F46', fontWeight: 800, textTransform: 'uppercase' }}>
            Net Bulk Prep Forecast
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 900, color: '#059669', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
            {netPurchasingForecastMeals} <span style={{ fontSize: '0.84rem', fontWeight: 600, color: '#065F46' }}>meals</span>
          </div>
          <div style={{ fontSize: '0.74rem', color: '#059669', marginTop: '6px' }}>
            Chef target for raw food stocking
          </div>
        </div>
      </div>

      {/* Bulk Raw Material Purchasing Forecast Table */}
      <div style={{
        background: '#FAF7F2',
        border: '1px solid var(--border-subtle)',
        borderRadius: '16px',
        padding: '20px',
        marginBottom: '16px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <div>
            <h4 style={{ fontSize: '0.96rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              Bulk Raw Ingredient Purchase Target (Weekly Procurement)
            </h4>
            <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)' }}>
              Distinct from live inventory depletion — calculates purchase volumes before rush cooking begins
            </span>
          </div>
          <span style={{ fontSize: '0.74rem', background: '#FFFFFF', border: '1px solid var(--border-subtle)', padding: '3px 8px', borderRadius: '8px', fontWeight: 700 }}>
            Standard Campus Recipe Norms
          </span>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '12px'
        }}>
          <div style={{ background: '#FFFFFF', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '12px 14px' }}>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', fontWeight: 700 }}>🌾 BASMATI RICE</div>
            <div style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', marginTop: '2px' }}>
              {bulkIngredients.riceKg} kg
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>@ 0.25 kg / meal</div>
          </div>

          <div style={{ background: '#FFFFFF', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '12px 14px' }}>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', fontWeight: 700 }}>🍗 CHICKEN / PANEER</div>
            <div style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', marginTop: '2px' }}>
              {bulkIngredients.chickenKg} kg
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>@ 0.20 kg / meal</div>
          </div>

          <div style={{ background: '#FFFFFF', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '12px 14px' }}>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', fontWeight: 700 }}>🛢 COOKING OIL</div>
            <div style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', marginTop: '2px' }}>
              {bulkIngredients.oilLitres} L
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>@ 0.05 L / meal</div>
          </div>

          <div style={{ background: '#FFFFFF', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '12px 14px' }}>
            <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', fontWeight: 700 }}>🥖 FLOUR & BREADING</div>
            <div style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', marginTop: '2px' }}>
              {bulkIngredients.flourKg} kg
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>@ 0.08 kg / meal</div>
          </div>
        </div>
      </div>

      {/* Meal Slot Distribution */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Clock size={14} color="var(--brand-orange)" />
          <span>Expected Slot Turnout:</span>
          <strong>Breakfast: {slotBreakdown.breakfast} meals</strong> • 
          <strong>Lunch: {slotBreakdown.lunch} meals</strong> • 
          <strong>Dinner: {slotBreakdown.dinner} meals</strong>
        </div>

        <span style={{ color: 'var(--brand-emerald)', fontWeight: 700 }}>
          ✓ Verified against Campus Canteen Pass Database
        </span>
      </div>
    </div>
  );
};
