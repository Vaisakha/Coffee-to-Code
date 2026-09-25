-- ============================================================================
-- BiteQ Migration: Group Orders, Subscription Meal Plans, Staff Labor Matching
-- Prefix: biteq_
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. FEATURE 1: Group Order & Split-Bill for Tables
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS biteq_group_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    table_number TEXT NOT NULL,
    canteen_id TEXT NOT NULL,
    created_by TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('open', 'locked', 'completed')) DEFAULT 'open',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    locked_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS biteq_group_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES biteq_group_sessions(id) ON DELETE CASCADE,
    student_id TEXT NOT NULL,
    student_name TEXT NOT NULL,
    items JSONB NOT NULL DEFAULT '[]'::jsonb,
    subtotal NUMERIC NOT NULL DEFAULT 0,
    packaging_fee_share NUMERIC NOT NULL DEFAULT 0,
    payment_status TEXT NOT NULL CHECK (payment_status IN ('PENDING', 'PAID', 'FAILED')) DEFAULT 'PENDING',
    paid_at TIMESTAMPTZ,
    order_id TEXT,
    token_code TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add group_session_id to biteq_orders if not present
DO $$ 
BEGIN 
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'biteq_orders' AND column_name = 'group_session_id'
    ) THEN 
        ALTER TABLE biteq_orders ADD COLUMN group_session_id UUID REFERENCES biteq_group_sessions(id) ON DELETE SET NULL;
    END IF;
END $$;

-- Enable Realtime for group tables
ALTER PUBLICATION supabase_realtime ADD TABLE biteq_group_sessions;
ALTER PUBLICATION supabase_realtime ADD TABLE biteq_group_orders;


-- ----------------------------------------------------------------------------
-- 2. FEATURE 2: Subscription Mess / Meal-Plan Billing
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS biteq_meal_plans (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    price NUMERIC NOT NULL,
    meals_per_week INTEGER NOT NULL,
    duration_weeks INTEGER NOT NULL,
    canteen_id TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS biteq_subscriptions (
    id TEXT PRIMARY KEY,
    student_id TEXT NOT NULL,
    student_name TEXT NOT NULL,
    plan_id TEXT NOT NULL REFERENCES biteq_meal_plans(id),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('active', 'paused', 'expired')) DEFAULT 'active',
    credits_remaining INTEGER NOT NULL DEFAULT 0,
    credits_carried_forward INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS biteq_subscription_redemptions (
    id TEXT PRIMARY KEY,
    subscription_id TEXT NOT NULL REFERENCES biteq_subscriptions(id) ON DELETE CASCADE,
    order_id TEXT,
    redeemed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    meal_slot TEXT NOT NULL
);

-- Enable Realtime for subscriptions
ALTER PUBLICATION supabase_realtime ADD TABLE biteq_subscriptions;
ALTER PUBLICATION supabase_realtime ADD TABLE biteq_subscription_redemptions;


-- ----------------------------------------------------------------------------
-- 3. FEATURE 3: Canteen Staff Shift & Labor-Load Matching
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS biteq_staff (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('cook', 'counter', 'cleaner')),
    canteen_id TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS biteq_shifts (
    id TEXT PRIMARY KEY,
    staff_id TEXT NOT NULL REFERENCES biteq_staff(id) ON DELETE CASCADE,
    canteen_id TEXT NOT NULL,
    shift_start TEXT NOT NULL,
    shift_end TEXT NOT NULL,
    day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS biteq_shift_load_snapshots (
    id TEXT PRIMARY KEY,
    canteen_id TEXT NOT NULL,
    shift_start TEXT NOT NULL,
    shift_end TEXT NOT NULL,
    avg_active_tickets NUMERIC NOT NULL DEFAULT 0,
    mood_level TEXT NOT NULL CHECK (mood_level IN ('CHILL', 'BUSY', 'CHAOTIC')),
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Realtime for shifts and snapshots
ALTER PUBLICATION supabase_realtime ADD TABLE biteq_shifts;
ALTER PUBLICATION supabase_realtime ADD TABLE biteq_shift_load_snapshots;

-- ----------------------------------------------------------------------------
-- Indexes for performance
-- ----------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_group_sessions_table ON biteq_group_sessions(table_number, status);
CREATE INDEX IF NOT EXISTS idx_group_orders_session ON biteq_group_orders(session_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_student ON biteq_subscriptions(student_id, status);
CREATE INDEX IF NOT EXISTS idx_sub_redemptions_sub ON biteq_subscription_redemptions(subscription_id);
CREATE INDEX IF NOT EXISTS idx_shifts_day ON biteq_shifts(canteen_id, day_of_week);
CREATE INDEX IF NOT EXISTS idx_shift_snapshots_canteen ON biteq_shift_load_snapshots(canteen_id, recorded_at);
