import { Subscription, SubscriptionRedemption, MealPlan, SubscriptionDemandForecast } from '../types';

/**
 * Reconciles expected vs. redeemed credits as a pure function without mutating historical records.
 *
 * @param subscription Current active subscription record
 * @param redemptions Historical list of redemptions for this subscription
 * @param maxBankedCap Maximum allowed banked / carried forward credits (default 3)
 */
export function reconcileSubscriptionCredits(
  subscription: Subscription,
  redemptions: SubscriptionRedemption[],
  maxBankedCap: number = 3
): {
  creditsRemaining: number;
  creditsCarriedForward: number;
  totalRedeemed: number;
  canBankMore: boolean;
} {
  const totalRedeemed = redemptions.filter(r => r.subscription_id === subscription.id).length;
  const creditsCarriedForward = Math.min(subscription.credits_carried_forward, maxBankedCap);
  const creditsRemaining = Math.max(0, subscription.credits_remaining);

  return {
    creditsRemaining,
    creditsCarriedForward,
    totalRedeemed,
    canBankMore: creditsCarriedForward < maxBankedCap && creditsRemaining > 0,
  };
}

/**
 * Pure function to execute a "Skip Today" meal credit carry-forward.
 * Does not mutate historical redemption records.
 *
 * @param subscription Current active subscription
 * @param maxBankedCap Max credits permitted to carry forward (e.g., 3)
 */
export function executeSkipCredit(
  subscription: Subscription,
  maxBankedCap: number = 3
): {
  updatedSubscription: Subscription;
  success: boolean;
  message: string;
} {
  if (subscription.status !== 'active') {
    return {
      updatedSubscription: subscription,
      success: false,
      message: 'Subscription is not active.',
    };
  }

  if (subscription.credits_remaining <= 0) {
    return {
      updatedSubscription: subscription,
      success: false,
      message: 'No credits remaining to skip.',
    };
  }

  if (subscription.credits_carried_forward >= maxBankedCap) {
    return {
      updatedSubscription: subscription,
      success: false,
      message: `Maximum carry-forward cap (${maxBankedCap} credits) already reached. Please redeem a banked meal.`,
    };
  }

  const updatedSubscription: Subscription = {
    ...subscription,
    credits_remaining: subscription.credits_remaining - 1,
    credits_carried_forward: subscription.credits_carried_forward + 1,
  };

  return {
    updatedSubscription,
    success: true,
    message: `Meal credit successfully skipped and banked! (${updatedSubscription.credits_carried_forward}/${maxBankedCap} banked credits).`,
  };
}

/**
 * Pure function to compute the Subscription Demand Forecast for the coming week.
 * Cross-references active subscriptions, expected meals, and banked skips to calculate
 * exact bulk ingredient purchase requirements for Admin/Principal oversight.
 */
export function computeSubscriptionDemandForecast(
  subscriptions: Subscription[],
  plans: MealPlan[]
): SubscriptionDemandForecast {
  const activeSubs = subscriptions.filter(s => s.status === 'active');
  const planMap = new Map(plans.map(p => [p.id, p]));

  let totalCommittedMeals = 0;
  let totalBankedSkips = 0;

  activeSubs.forEach(sub => {
    const plan = planMap.get(sub.plan_id);
    const mealsPerWeek = plan ? plan.meals_per_week : 14;
    // Expected weekly load based on active remaining credits proportion
    const committedForSub = Math.min(sub.credits_remaining, mealsPerWeek);
    totalCommittedMeals += committedForSub;
    totalBankedSkips += sub.credits_carried_forward;
  });

  // Net expected meals to prepare = Committed - (Banked skips not being redeemed immediately)
  const netMeals = Math.max(0, totalCommittedMeals - Math.floor(totalBankedSkips * 0.4));

  // Proportional breakdown across meal slots
  const breakfast = Math.round(netMeals * 0.28);
  const lunch = Math.round(netMeals * 0.44);
  const dinner = Math.max(0, netMeals - breakfast - lunch);

  // Bulk ingredient recipe estimates:
  // Average canteen meal: 0.25 kg rice, 0.20 kg chicken/paneer, 0.05 L oil, 0.08 kg flour
  return {
    totalActiveSubscriptions: activeSubs.length,
    committedMealsComingWeek: totalCommittedMeals,
    bankedSkipsCount: totalBankedSkips,
    netPurchasingForecastMeals: netMeals,
    slotBreakdown: {
      breakfast,
      lunch,
      dinner,
    },
    bulkIngredients: {
      riceKg: Number((netMeals * 0.25).toFixed(1)),
      chickenKg: Number((netMeals * 0.20).toFixed(1)),
      oilLitres: Number((netMeals * 0.05).toFixed(1)),
      flourKg: Number((netMeals * 0.08).toFixed(1)),
    },
  };
}
