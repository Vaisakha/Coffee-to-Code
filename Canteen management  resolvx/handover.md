# BiteQ — Engineering Handover Documentation

> **Smart Campus Canteen Operating System**  
> *Tagline:* **Skip the queue. Get your food.**  
> *Document Version:* `1.0.0`  
> *Last Updated:* September 2026  
> *Status:* Production Ready / Hackathon Gold Edition  

---





# TEAM ELEGENT

## 🌟 Key Product Features & Enhancements

### 1. 🚚 Express Campus Delivery & GPS Location Tracing
- Integrated a live **Campus Express Delivery** system with high-precision GPS location tracing (`navigator.geolocation`) and OpenStreetMap Nominatim reverse geocoding.
- Auto-detects exact GPS coordinates and physical campus spots (building/hostel, room/bench number, and delivery notes) for direct delivery to students across campus.

### 2. 💰 BiteQ Savings Wallet & Direct Booking
- Added an in-app **BiteQ Savings Wallet** where students can deposit money using **GPay / UPI** or **Direct Bank Transfer**.
- Complete tracking dashboard to monitor savings, total deposited money, and past canteen spending history.
- Seamlessly integrated into checkout: **"Pay from Wallet"** automatically pops up as a 1-click payment option during food booking with live balance validation and automatic deduction.

### 3. 🛒 Cart Navigation (Tray Renamed to Cart)
- Transitioned top navigation and side drawers from "Tray" to **"Cart"** for an intuitive shopping and ordering experience.

### 4. 🎯 Redundant "Order Now" Option Removed
- Streamlined top-right header navigation by removing the redundant "Order Now" button and replacing it with the real-time **Wallet** balance widget.

### 5. 🤖 Help Guide & AI Food Assistant with Taste Preferences
- Added a **Help Guide** in the top-left section providing step-by-step visual instructions on using all app features.
- Built-in **AI Assistant** (`✨ AI Assistant`) accessible via header and floating widget:
  - Allows users to set dietary preferences (Pure Veg / Non-Veg / All), preferred spice levels, and food dislikes/allergies (e.g. *No mushrooms*, *Nuts allergy*, *Low oil*).
  - AI engine generates personalized 1-click dish suggestions matching taste profiles.
  - Interactive Q&A chatbot for instant app usage instructions and budget meal planning.

---

## 📑 Table of Contents

1. [Team Elegent Features & Enhancements](#-key-product-features--enhancements)
2. [Executive Summary & Product Vision](#1-executive-summary--product-vision)
3. [High-Level System Architecture](#2-high-level-system-architecture)
4. [Technology Stack](#3-technology-stack)
5. [Repository Structure](#4-repository-structure)
6. [User Roles & RBAC System](#5-user-roles--rbac-system)
7. [Core Functional Modules](#6-core-functional-modules)
8. [Database Schema & Supabase Backend](#7-database-schema--supabase-backend)
9. [Setup, Installation & Running Locally](#8-setup-installation--running-locally)
10. [Known Environment Caveats (Windows / OneDrive)](#9-known-environment-caveats-windows--onedrive)
11. [End-to-End Demo & Presentation Script](#10-end-to-end-demo--presentation-script)
12. [Engineering Roadmap for the Incoming Team](#11-engineering-roadmap-for-the-incoming-team)
13. [Handover Sign-off Checklist](#12-handover-sign-off-checklist)

---

## 1. Executive Summary & Product Vision

**BiteQ** is an end-to-end digital operating system purpose-built for collegiate and institutional campus canteens. During high-traffic rush hours (breakfast, lunch, and evening recess), traditional college canteens face severe bottlenecks: manual billing queues, inaccurate food prep estimates, order mix-ups, stock-outs, and unaccounted revenue leakage.

BiteQ solves this by providing a unified, multi-role digital ecosystem:
- **Students** order ahead from mobile/laptops, select dine-in tables via QR code or takeaway with eco-packaging, apply student coupons, make payments, and receive a live digital token with estimated prep countdowns.
- **Kitchen Staff** manage tickets via an interactive Kitchen Display System (KDS) Kanban board with SLA timers and verify handouts using an anti-fraud QR/token scanner.
- **Canteen Administrators** monitor real-time gross revenue, manage live menu item availability, maintain raw ingredient stocks that automatically deplete per recipe, and print authentic 80mm ESC/POS thermal receipts.
- **Principal & Super Administrators** access macro-level oversight across campus food turnover, rush-hour load distribution, hygiene SLA adherence, and food wastage prevention.

---

## 2. High-Level System Architecture

BiteQ follows a **Local-First Reactive Architecture** backed by a cloud **Supabase PostgreSQL** instance with real-time websocket synchronization.

```mermaid
graph TD
    subgraph Client Layer ["Client Layer (React 19 + TypeScript)"]
        LP[Landing Page & Canteen Mood Radar]
        SD[Student Dashboard & Tray System]
        KDS[Kitchen Display System Kanban]
        AD[Admin POS & Inventory Engine]
        PD[Principal Governance Dashboard]
    end

    subgraph State & Context ["Application State Layer"]
        CTX[CanteenContext.tsx]
        LOCAL[(Optimistic In-Memory Reactive Cache)]
    end

    subgraph Hardware & Simulation ["Hardware Integration Layer"]
        THERMAL[ESC/POS 80mm Thermal Receipt Simulator]
        QR_SCAN[Table QR & Token Pickup Scanner]
        CONFETTI[Celebration FX Engine]
    end

    subgraph Cloud Backend ["Backend Layer (Supabase)"]
        SB_AUTH[Supabase Auth]
        SB_DB[(PostgreSQL Database)]
        SB_RT[Supabase Realtime Channel 'biteq_realtime']
    end

    SD --> CTX
    KDS --> CTX
    AD --> CTX
    PD --> CTX
    LP --> CTX

    CTX <--> LOCAL
    CTX --> THERMAL
    CTX --> QR_SCAN
    CTX --> CONFETTI

    CTX <-->|REST API Fetch / Mutations| SB_DB
    SB_RT -.->|WebSocket postgres_changes| CTX
```

### Complete Order Lifecycle
```text
Student Selects Food ➔ Cart Tray ➔ Dining Option (Table QR / Takeaway) ➔ Pickup Slot 
  ➔ Payment Sim ➔ Token Generated (#B142) ➔ Recipe Inventory Auto-Deducted
  ➔ Ticket Lands on Kitchen KDS ➔ Kitchen Staff Accepts ➔ Preparing (Timer Running)
  ➔ Mark Ready ➔ Student Notification ➔ Counter QR Verification ➔ Order Complete ➔ CSAT Feedback
```

---

## 3. Technology Stack

| Domain | Technology / Library | Purpose |
| :--- | :--- | :--- |
| **Frontend Framework** | React 19 (`^19.0.0`) | Modern UI components with fast rendering |
| **Language** | TypeScript (`~5.7.2`) | Strict type safety across orders, products, and roles |
| **Build Tooling** | Vite (`^6.2.0`) | Lightning-fast HMR and bundling |
| **Styling & Theme** | Curated Vanilla CSS | Warm editorial palette (`#EE4322`, `#F4EFE6`, `#1C211D`), glassmorphism, responsive cards |
| **Icons** | Lucide React (`^1.16.0`) | Semantic iconography for navigation, statuses, and badges |
| **Database & Realtime** | Supabase (`@supabase/supabase-js ^2.49.1`) | Managed PostgreSQL with real-time pub/sub channels |
| **QR Code Engine** | QRCode (`qrcode ^1.5.4`) | High-contrast data URL generation for table & pickup tokens |
| **Animations & FX** | Canvas Confetti (`canvas-confetti ^1.9.4`) | Post-order payment success celebration |
| **Receipt Formatter** | ESC/POS Styled CSS + `@media print` | Authentic 80mm thermal receipt with browser print capability |

---

## 4. Repository Structure

```text
├── dist/                          # Production build output
├── node_modules/                  # Installed dependencies
├── src/
│   ├── components/                # Core UI modules & dashboards
│   │   ├── ActiveOrderModal.tsx   # Live pickup token card & order status tracker
│   │   ├── AdminDashboard.tsx     # Menu toggle, stock manager, POS orders, complaints
│   │   ├── CartDrawer.tsx         # Slide-out checkout tray, coupons, table selection
│   │   ├── ComplaintModal.tsx     # Student grievance submission dialog
│   │   ├── FeedbackModal.tsx      # Post-meal CSAT star rating & tags
│   │   ├── KitchenDisplay.tsx     # 3-column touch KDS Kanban & pickup verification scanner
│   │   ├── LandingPage.tsx        # High-converting public landing page with live radar
│   │   ├── Navbar.tsx             # Global navigation, role badge, mood pill, cart trigger
│   │   ├── PrincipalDashboard.tsx # Executive campus analytics, turnover, rush hour charts
│   │   ├── StudentDashboard.tsx   # Categorized food menu, search, diet filters, tray actions
│   │   ├── TableQrModal.tsx       # Canteen table QR code camera scanner simulator
│   │   └── ThermalReceiptModal.tsx# Authentic 80mm ESC/POS jagged thermal receipt
│   ├── context/
│   │   └── CanteenContext.tsx     # Centralized state: cart, orders, inventory, realtime sync
│   ├── data/
│   │   └── mockData.ts            # High-fidelity seed data (canteens, categories, foods, stock)
│   ├── lib/
│   │   └── supabase.ts            # Supabase client instantiation & realtime configuration
│   ├── types/
│   │   └── index.ts               # Complete TypeScript interfaces & enums
│   ├── App.tsx                    # Root component with role switcher dock & modal wrappers
│   ├── index.css                  # Design system tokens, thermal paper styles, print media
│   └── main.tsx                   # React 19 root bootstrap
├── .gitignore                     # Git ignore rules
├── index.html                     # HTML5 entrypoint with Google Fonts
├── inst.md                        # Master functional specifications & PRD reference
├── package.json                   # Dependencies, metadata, and scripts
├── README.md                      # Project quick-start & overview
├── tsconfig.json                  # Root TypeScript configuration
├── tsconfig.app.json              # Client TypeScript settings
└── vite.config.ts                 # Vite bundler plugins and settings
```

---

## 5. User Roles & RBAC System

The application implements 4 core roles accessible via the persistent bottom **Floating Demo Dock** and top navigation:

| Role | Target Persona | Primary Permissions & Capabilities |
| :--- | :--- | :--- |
| **Student** | Campus Students / Faculty | • Browse menu with Pure-Veg and Allergen filters<br>• Customise tray, select Table QR or Takeaway<br>• Apply coupon codes (`BITEQ50`, `CAMPUS10`)<br>• Generate token `#B142` with live QR and prep countdown<br>• Submit CSAT feedback & grievances |
| **Kitchen Staff (KDS)** | Head Chef & Kitchen Line Workers | • View touch-friendly 3-stage Kanban (Tickets ➔ Prep ➔ Ready)<br>• Audio chime & prep SLA overtime indicator<br>• Counter Pickup Verification scanner to prevent double handouts<br>• One-click thermal receipt reprints |
| **Canteen Admin** | Canteen Manager / Cashier | • Live POS orders audit table<br>• Instant menu toggle (Price, Stock count, Available/Sold-Out)<br>• Raw ingredient depletion tracking (Rice, Oil, Chicken)<br>• Manual ingredient restocking<br>• Student grievance desk with resolution notes |
| **Principal** | College Principal / Campus Dean | • Institutional macro overview (gross campus revenue, active volume)<br>• Hourly rush-hour distribution curves<br>• Hygiene SLA & kitchen prep compliance ratings<br>• Food wastage index and student satisfaction metrics |

---

## 6. Core Functional Modules

### 1. Canteen Mood Radar & Workload Estimation
- Evaluates active pending/preparing tickets in the queue.
- Computes real-time status:
  - `🟢 CHILL`: < 2 active orders (Avg prep: ~6 mins)
  - `🟡 BUSY RUSH`: 2–5 active orders (Avg prep: ~12 mins)
  - `🔴 CHAOTIC`: 6+ active orders (Avg prep: ~18 mins)

### 2. Smart Tray & Checkout Engine
- Supports **Dine-In** (Table 1 through 12, or dynamic QR code scan).
- Supports **Takeaway** with optional eco-friendly biodegradable packaging fee (+₹5).
- Flexible pickup slots: `ASAP`, `Break (11:00 AM)`, `Lunch (1:15 PM)`, `Evening (4:30 PM)`.
- Integrated voucher engine with automatic validation against minimum order constraints.

### 3. Automated Recipe-Level Inventory Depletion
- When an order is placed, BiteQ deducts both the finished product quantity and raw ingredients:
  - Biriyani / Fried Rice: Deducts basmati rice (kg) and chicken (kg).
  - Snacks / Fried items: Deducts cooking oil (L) and flour (kg).
- Automatically converts product status to `LIMITED` when stock ≤ 5 and `SOLD_OUT` when stock reaches 0.

### 4. ESC/POS 80mm Thermal Receipt Simulator
- Authentic thermal receipt rendering complete with jagged tear edge, monospace typography, store header, order metadata, itemized pricing, and verification QR code.
- Uses `@media print` CSS rules allowing direct printing to actual ESC/POS USB/Bluetooth thermal receipt printers or standard laser printers.

### 5. Counter Pickup Verification Scanner
- Staff can type or scan student token / QR code (`#B142` or `BITEQ-B142-VERIFY-...`).
- Prevents fraud: Alerts if ticket is still being cooked, or if the order has already been handed over.

---

## 7. Database Schema & Supabase Backend

The project is connected to Supabase PostgreSQL at `https://buugcsqgkiunejllxpqp.supabase.co`.

### Relational Schema Overview

```mermaid
erDiagram
    biteq_canteens ||--o{ biteq_categories : "has"
    biteq_canteens ||--o{ biteq_products : "offers"
    biteq_canteens ||--o{ biteq_orders : "processes"
    biteq_products ||--o{ biteq_order_items : "contains"
    biteq_orders ||--|{ biteq_order_items : "includes"
    biteq_orders ||--o| biteq_tokens : "generates"
    biteq_canteens ||--o{ biteq_ingredients : "stocks"
    biteq_orders ||--o{ biteq_complaints : "references"
```

### Table Definitions

1. **`biteq_canteens`**: Canteen profile, open/close status, load status, operating hours.
2. **`biteq_categories`**: Menu groups (Meals, Snacks, Beverages, Desserts, Tea & Coffee, Fast Food).
3. **`biteq_products`**: Items with prices, stock count, veg/non-veg flag, prep time, allergens, and calories.
4. **`biteq_ingredients`**: Raw materials (Basmati Rice, Oil, Chicken, Flour, Spices) with min threshold.
5. **`biteq_orders`**: Order records with token code, table number, order type, payment status, and timeline timestamps.
6. **`biteq_order_items`**: Line items joining `biteq_orders` to `biteq_products`.
7. **`biteq_tokens`**: Active queue token numbers and queue positions.
8. **`biteq_complaints`**: Student support tickets with status (`OPEN`, `RESOLVED`) and admin notes.
9. **`biteq_coupons`**: Discount vouchers, discount percentage, max discount, and expiry dates.

### Supabase Connection Configuration
The credentials are initialized in [`src/lib/supabase.ts`](file:///c:/Users/mizpa/OneDrive/Documents/Desktop/Canteen%20management%20%20resolvx/src/lib/supabase.ts):
```typescript
const SUPABASE_URL = 'https://buugcsqgkiunejllxpqp.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
```

> **Security Note for Incoming Team:** In production deployments (Vercel, Netlify, or Docker), migrate these keys into standard `.env` variables (`VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`).

---

## 8. Setup, Installation & Running Locally

### Prerequisites
- **Node.js**: Recommended `v20.x` or `v22.x` LTS.
- **Package Manager**: `npm` (v10+).

### Step-by-Step Setup

```bash
# 1. Clone repository (or open workspace)
git clone <repository_url>
cd "Canteen management resolvx"

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

The application will launch at:
👉 **`http://localhost:3000/`** (or next available port like `5173`).

### Production Build & Preview
```bash
# Compile and create production bundle in /dist
npm run build

# Preview production build locally
npm run preview
```

---

## 9. Known Environment Caveats (Windows / OneDrive)

> [!WARNING]
> **Windows OneDrive Path EPERM Notice**
> On certain Windows installations with Node.js v24+, running global commands or `npm run build` directly inside `C:\Users\<user>\OneDrive\...` may trigger a Node.js filesystem error:
> `EPERM: operation not permitted, stat 'C:\Users\<user>\OneDrive'`
>
> **Recommended Fixes for the New Team:**
> 1. **Best Practice**: Clone or move the repository outside of OneDrive (e.g. `C:\dev\biteq-canteen-os` or `D:\projects\biteq`).
> 2. **Or use Node.js v20.x LTS / v22.x LTS**: Node v20/v22 does not exhibit this realpath OneDrive issue.
> 3. **Or run within WSL2 (Windows Subsystem for Linux)** for native Linux filesystem performance.

---

## 10. End-to-End Demo & Presentation Script

Use this 5-minute walkthrough to demonstrate the system to academic juries, investors, or canteen managers:

1. **Landing Experience**:
   - Open `http://localhost:3000/`.
   - Point out the **Live Canteen Mood Radar** pill (`BUSY RUSH • 12m wait`) and real-time status card.
   - Click **"Order Food Now"** to enter the student terminal.
2. **Student Ordering Flow**:
   - Filter menu with the **"Pure Veg"** toggle.
   - Add **"Hyderabadi Chicken Biriyani"** and **"Fresh Mint Lime Juice"** to the tray.
   - Open Tray (top right).
   - Enter promo code `BITEQ50` and click Apply (saves 50% up to ₹100).
   - Select **Dine-In** ➔ Pick **Table 4**.
   - Click **"Pay & Generate Token"**.
   - 🎊 Confetti fires, generating official **Token #B142** with high-contrast QR code and progress timeline.
3. **Kitchen Display System (KDS)**:
   - Click **"Kitchen KDS"** on the floating bottom dock.
   - Show how Ticket `#B142` arrived in **1. NEW TICKETS** in real-time.
   - Click **"Accept & Start Prep"** ➔ Moves to **2. ON THE STOVE**.
   - Click **"Mark Ready & Notify Counter"** ➔ Moves to **3. COUNTER PICKUP (READY)**.
4. **Counter Pickup Fraud Prevention**:
   - In the KDS, click **"Verify Pickup Scanner"**.
   - Enter token `B142` and click **"Verify"**.
   - Observe the success confirmation and automatic order completion.
   - Enter `B142` again to show the **Duplicate Pickup Prevention** guardrail in action!
5. **Admin Operations & Thermal POS**:
   - Switch to **Admin** role.
   - View today's gross revenue metrics and raw ingredient alerts.
   - Under **Live POS Orders**, click **"Print Receipt"** on any ticket to reveal the realistic 80mm thermal receipt, and show the native print trigger.
   - Show the **Recipe Inventory Engine** and restock Basmati Rice.
6. **Principal Oversight**:
   - Switch to **Principal** role.
   - Review the campus-wide analytics, peak-hour rush curve, and hygiene audit indicators.

---

## 11. Engineering Roadmap for the Incoming Team

The foundation is solid and production-ready. Here are prioritized backlog tickets for the next team to take BiteQ to enterprise scale:

### Phase 1: Payment Gateway Webhooks (Immediate Priority)
- [ ] Connect real Razorpay / Stripe test webhooks in place of the simulated gateway.
- [ ] Implement campus RFID student card NFC reader via Web NFC API (`NDEFReader`).

### Phase 2: Hardware Integrations & Notifications
- [ ] Implement direct ESC/POS Bluetooth / WebUSB printing using ESC/POS binary command streams (`receipt-printer-encoder`).
- [ ] Implement browser Web Push Notifications and WhatsApp / SMS token alerts (Twilio or Firebase Cloud Messaging) when kitchen marks token as `READY`.

### Phase 3: Authentication & Multi-Tenancy
- [ ] Implement Supabase Email / Password & Google OAuth login for students.
- [ ] Support multi-canteen switching (e.g. "Main Canteen", "Engineering Block Café", "Hostel Night Canteen").

### Phase 4: Native Mobile Applications
- [ ] Wrap the responsive web app using **CapacitorJS** or **React Native** for deployment to Google Play Store and Apple App Store.

---

## 12. Handover Sign-off Checklist

| Item | Status | Verified By |
| :--- | :--- | :--- |
| **All core roles functional** (Student, KDS, Admin, Principal) | ✅ Verified | Engineering Team |
| **Local reactive cache + Supabase sync** | ✅ Verified | Engineering Team |
| **80mm Thermal Receipt printing styles** | ✅ Verified | Engineering Team |
| **Interactive Table QR & Token Pickup Scanner** | ✅ Verified | Engineering Team |
| **Automated Recipe Inventory Depletion logic** | ✅ Verified | Engineering Team |
| **Seed mock data & TypeScript definitions complete** | ✅ Verified | Engineering Team |
| **Comprehensive documentation provided (`handover.md`)** | ✅ Complete | Engineering Team |

---

*Thank you for taking over BiteQ! Feel free to refer to [inst.md](file:///c:/Users/mizpa/OneDrive/Documents/Desktop/Canteen%20management%20%20resolvx/inst.md) for original PRD specifications and [README.md](file:///c:/Users/mizpa/OneDrive/Documents/Desktop/Canteen%20management%20%20resolvx/README.md) for quick-start commands.*
Viewed shiftUtils.ts:80-102
Viewed PrincipalDashboard.tsx:260-313
Viewed PrincipalDashboard.tsx:18-35
Edited PrincipalDashboard.tsx
Viewed PrincipalDashboard.tsx:268-315
Edited PrincipalDashboard.tsx
Ran command: `npx tsc -b`
Ran command: `npm run build`
Used tool: manage_task
Ran command: `npm run dev`
Used tool: manage_task
Browser task: "Verifying BiteQ Features in Browser"
Ran command: `powershell -Command "(Invoke-WebRequest -Uri 'http://localhost:3000/' -UseBasicParsing).StatusCode"`
Ran command: `powershell -Command "Get-ChildItem -Path 'src\components' | Select-Object Name, Length"`

All three requested features for **BiteQ** have been implemented end-to-end with full Supabase PostgreSQL schemas, TypeScript interfaces, centralized state in [CanteenContext.tsx](file:///c:/Users/kani3/Downloads/Elegant-main/Elegant-main/Canteen%20management%20%20resolvx/src/context/CanteenContext.tsx), and complete dashboard integrations across Student, Kitchen KDS, Admin, and Principal views.

---

### Summary of Completed Deliverables

#### 1. Supabase PostgreSQL Schema & Realtime Grants
- **File:** [supabase/migrations/20260926_new_features.sql](file:///c:/Users/kani3/Downloads/Elegant-main/Elegant-main/Canteen%20management%20%20resolvx/supabase/migrations/20260926_new_features.sql)
- **Tables created:**
  - `biteq_group_sessions`: `{ id, table_number, canteen_id, created_by, status ('open'|'locked'|'completed'), created_at }`
  - `biteq_group_orders`: `{ id, session_id, student_id, student_name, items (jsonb), subtotal, packaging_fee_share, payment_status, paid_at }`
  - `biteq_meal_plans`: `{ id, name, description, price, meals_per_week, duration_weeks, canteen_id }`
  - `biteq_subscriptions`: `{ id, student_id, student_name, plan_id, start_date, end_date, status ('active'|'paused'|'expired'), credits_remaining, credits_carried_forward }`
  - `biteq_subscription_redemptions`: `{ id, subscription_id, order_id, redeemed_at, meal_slot }`
  - `biteq_staff`: `{ id, name, role ('cook'|'counter'|'cleaner'), canteen_id }`
  - `biteq_shifts`: `{ id, staff_id, canteen_id, shift_start, shift_end, day_of_week }`
  - `biteq_shift_load_snapshots`: `{ id, canteen_id, shift_start, shift_end, avg_active_tickets, mood_level, recorded_at }`
- Configured indexes, foreign keys, and `ALTER PUBLICATION supabase_realtime ADD TABLE ...` for live websocket broadcasting.

---

### Feature 1: Group Order & Split-Bill for Tables

1. **Table QR Detection & Realtime Joining:**
   - [TableQrModal.tsx](file:///c:/Users/kani3/Downloads/Elegant-main/Elegant-main/Canteen%20management%20%20resolvx/src/components/TableQrModal.tsx) detects if an open session already exists for the scanned table (e.g. Table 4).
   - Displays a live indicator: `👥 Table 4 Group Active — 2 joined!`, offering a 1-click **"Join Table 4 Group Session"** button rather than forcing a duplicate solo session.
2. **Independent Sub-Carts & Pure Itemized Bill Splitting:**
   - Each student maintains their own personal sub-cart. Subtotals reflect only what the student personally selected.
   - The table-level biodegradable packaging fee is split proportionally:
     $$\text{packaging\_fee\_share} = \left\lceil \frac{\text{rawPackagingFee}}{\text{activeMembersCount}} \right\rceil$$
3. **Session Locking:**
   - Any table member can lock the session via [GroupOrderPanel.tsx](file:///c:/Users/kani3/Downloads/Elegant-main/Elegant-main/Canteen%20management%20%20resolvx/src/components/GroupOrderPanel.tsx), transitioning the status to `'locked'` to prevent late joins once the table is ready to cook.
4. **Independent Checkout & Combined Kitchen Ticket Sets:**
   - Each student checks out independently, generating an individual `biteq_order` and `biteq_token` linked by `group_session_id`.
   - [KitchenDisplay.tsx](file:///c:/Users/kani3/Downloads/Elegant-main/Elegant-main/Canteen%20management%20%20resolvx/src/components/KitchenDisplay.tsx) automatically aggregates tickets with the same `group_session_id` under a **"👥 Table X Combined Table Ticket Set"** banner across Waiting, Preparing, and Ready columns.

---

### Feature 2: Subscription Mess/Meal-Plan Billing

1. **Student Dashboard Meal Pass Tab:**
   - [StudentDashboard.tsx](file:///c:/Users/kani3/Downloads/Elegant-main/Elegant-main/Canteen%20management%20%20resolvx/src/components/StudentDashboard.tsx) features a toggle between `🍽 Daily Canteen Menu` and `🍱 Mess & Meal Plan Pass` with a live credit counter pill.
   - [SubscriptionManager.tsx](file:///c:/Users/kani3/Downloads/Elegant-main/Elegant-main/Canteen%20management%20%20resolvx/src/components/SubscriptionManager.tsx) renders the active meal pass card with remaining weekly credits, next renewal date, and past redemption logs.
2. **Pure Function Credit Reconciliation & "Skip Today" Rollover:**
   - Implemented in [src/lib/subscriptionUtils.ts](file:///c:/Users/kani3/Downloads/Elegant-main/Elegant-main/Canteen%20management%20%20resolvx/src/lib/subscriptionUtils.ts):
     - `executeSkipCredit()` carries forward unredeemed credits up to a configurable cap (max 3 banked credits) without mutating historical records.
     - `reconcileSubscriptionCredits()` provides pure calculation of expected vs. redeemed credits.
3. **Checkout Integration ("Redeem from Meal Plan"):**
   - [CartDrawer.tsx](file:///c:/Users/kani3/Downloads/Elegant-main/Elegant-main/Canteen%20management%20%20resolvx/src/components/CartDrawer.tsx) offers **"Meal Plan Pass"** alongside UPI, Campus Cards, and Wallet. If selected, the cash due becomes ₹0 and one credit is debited upon order confirmation.
4. **Predictive Subscription Demand Forecast Panel:**
   - Implemented in [SubscriptionDemandForecastPanel.tsx](file:///c:/Users/kani3/Downloads/Elegant-main/Elegant-main/Canteen%20management%20%20resolvx/src/components/SubscriptionDemandForecastPanel.tsx) and embedded into both [AdminDashboard.tsx](file:///c:/Users/kani3/Downloads/Elegant-main/Elegant-main/Canteen%20management%20%20resolvx/src/components/AdminDashboard.tsx) and [PrincipalDashboard.tsx](file:///c:/Users/kani3/Downloads/Elegant-main/Elegant-main/Canteen%20management%20%20resolvx/src/components/PrincipalDashboard.tsx).
   - Computes:
     $$\text{Net Planned Meals} = \text{Committed Meals for Week} - \text{Total Banked Skips}$$
   - Projects bulk ingredient purchasing targets (Basmati rice, chicken, sunflower oil, atta flour, whole spices) before food orders are placed.

---

### Feature 3: Canteen Staff Shift & Labor-Load Matching

1. **Weekly Shift Calendar (Days × Time Blocks):**
   - [StaffShiftPlanner.tsx](file:///c:/Users/kani3/Downloads/Elegant-main/Elegant-main/Canteen%20management%20%20resolvx/src/components/StaffShiftPlanner.tsx) provides a full 6-day (Monday–Saturday) × 4-slot grid (Breakfast, Morning Break, Peak Lunch Rush, Evening Chai) showing assigned cooks, counter staff, and cleaners.
2. **Advisory Staffing Recommendations via Mood Radar:**
   - Algorithm implemented in [src/lib/shiftUtils.ts](file:///c:/Users/kani3/Downloads/Elegant-main/Elegant-main/Canteen%20management%20%20resolvx/src/lib/shiftUtils.ts):
     - Cross-references `biteq_shift_load_snapshots` sampled from Canteen Mood Radar:
       - 🔴 **CHAOTIC** blocks with $<4$ staff are flagged as **UNDERSTAFFED** (Advisory: Add +1 cook/counter).
       - 🟢 **CHILL** blocks with $>2$ staff are flagged as **OVERSTAFFED** (Advisory: Reassign to prep/cleaning to save hours).
     - Advisory only: administrators manually click to assign or remove shifts.
3. **Leadership Cost & Efficiency Governance:**
   - Evaluates weekly summary statistics:
     - **Estimated Labor-Hours Saved:** Weekly hours rebalanced from chill periods.
     - **Chaos-Risk Hours Mitigated:** Rush periods reinforced with adequate staffing.
     - **Est. Cost Economy:** Projected savings based on standard campus labor rates.
   - Displayed directly on [PrincipalDashboard.tsx](file:///c:/Users/kani3/Downloads/Elegant-main/Elegant-main/Canteen%20management%20%20resolvx/src/components/PrincipalDashboard.tsx) and [AdminDashboard.tsx](file:///c:/Users/kani3/Downloads/Elegant-main/Elegant-main/Canteen%20management%20%20resolvx/src/components/AdminDashboard.tsx).

---

### Verification & Testing
- **TypeScript Compiler:** `npx tsc -b` exited with **0 errors**.
- **Vite Production Bundler:** `npm run build` compiled all modules into production assets with **0 errors**.
- **Dev Server:** Running at `http://localhost:3000/` and responding with HTTP status `200 OK`.
- **Offline Resilience:** All features degrade gracefully using [src/data/mockData.ts](file:///c:/Users/kani3/Downloads/Elegant-main/Elegant-main/Canteen%20management%20%20resolvx/src/data/mockData.ts) if Supabase is offline.

*(Note: During visual automation testing, the Playwright browser runner failed to download drivers due to an upstream Azure CDN 404. All application code, builds, and local server endpoints are verified and running at `http://localhost:3000/`).*

Ran command: `npm run dev`
Ran command: `npm run build`