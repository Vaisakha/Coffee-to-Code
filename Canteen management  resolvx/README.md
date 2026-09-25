# BiteQ — Smart Campus Canteen Management System

> **Skip the queue. Get your food.**  
> A complete digital operating system engineered for collegiate canteens.

---

## 🚀 Live Demo & Quick Start

The application is running live at:
**`http://localhost:3000/`**

### To Run Locally:
```bash
# Install dependencies
npm install

# Start development server
npm run dev
# Or preview built production bundle
npm run preview
```

---

## 🌟 Key Architecture & Highlights

### 1. Digital Operating System Lifecycle
```
Student → Menu → Cart → Smart Slot → Payment → Digital Token → Kitchen KDS → Preparation → Pickup QR → Feedback
   ↓
Admin → Menu → Automated Recipe Inventory → Orders → POS Thermal Printer → Complaints Desk → CSAT
```

### 2. Multi-Role RBAC System
Switch seamlessly using the top role switcher or floating demo dock:
* 🎓 **Student**: Menu exploration, pure-veg filtering, allergen warnings, dynamic cart, table QR dining preference, Razorpay test payment, live digital token with high-contrast QR code, real-time queue timeline, CSAT feedback.
* 👨‍🍳 **Kitchen Staff (KDS)**: 3-column touch-optimized Kanban (New Tickets ➔ Cooking/Preparing ➔ Counter Pickup Ready). Includes ticket timers and counter pickup verification scanner.
* 📊 **Canteen Admin**: Real-time revenue analytics, food menu editor (price & availability toggle), raw ingredient inventory with automatic recipe depletion, and ESC/POS thermal printer simulation.
* 🏛️ **Principal / Super Admin**: Executive governance dashboard reporting gross campus turnover, rush-hour load distribution, hygiene SLA metrics, and food wastage ratios.

---

## 🧠 Smart Features

1. **Queue IQ & Workload Estimation**:
   Dynamically estimates preparation time and warns students when pickup slots are crowded.
2. **Canteen Mood Radar**:
   Live campus canteen load indicator (`🟢 CHILL` / `🟡 BUSY RUSH` / `🔴 CHAOTIC`) based on active ticket volume.
3. **Automated Inventory Depletion**:
   Every ordered biriyani, roll, or meal automatically deducts required grams of basmati rice, chicken, cooking oil, and flour from the live database. When stock falls below threshold, items auto-tag as Limited or Sold Out.
4. **Table QR Ordering**:
   Simulate table QR code scans (`Table 1` to `Table 12`) to automatically lock table delivery to your food tray.
5. **ESC/POS 80mm Thermal Receipt Simulator**:
   Authentic thermal paper receipt with jagged tear edges, canteen branding, pickup token number, itemized pricing, and browser print trigger (`window.print()`).
6. **Supabase PostgreSQL & Realtime**:
   Integrated with Supabase database (`https://buugcsqgkiunejllxpqp.supabase.co`) with complete DDL migrations and seed data.

---

## 📋 Recommended Hackathon Demo Script

1. **Open BiteQ** at `http://localhost:3000/`.
2. Notice the live **Canteen Mood** indicator (`BUSY RUSH • 12m wait`) and active queue tokens.
3. **Student Flow**:
   - Filter menu by **Pure Veg** or search for *"Biriyani"*.
   - Add **Hyderabadi Chicken Biriyani** and **Fresh Mint Lime Juice** to tray.
   - Click **Tray** in top right.
   - Apply coupon `BITEQ50` (or `CAMPUS10`).
   - Select **Dine-In** with **Table 4**.
   - Click **"Pay & Generate Token"**.
   - Watch the celebration confetti and receive official **Token #B142** with secure QR code.
4. **Kitchen Display System (KDS)**:
   - Click **"Kitchen KDS"** in the floating role switcher.
   - Order **B142** appears immediately under **1. NEW TICKETS**.
   - Click **"Accept & Start Prep"** ➔ Moves to **2. ON THE STOVE**.
   - Click **"Mark Ready & Notify Counter"** ➔ Moves to **3. COUNTER PICKUP (READY)**.
5. **Counter Pickup Verification**:
   - Click **"Verify & Hand Over"** or use the **"Verify Pickup Scanner"** to validate token `B142`.
   - Prevents duplicate pickups and completes the order.
6. **Admin & Thermal POS**:
   - Switch to **Admin** role.
   - Inspect today's gross revenue and low-stock alerts.
   - Click **Live POS Orders** and select **Print Receipt** on any order to view the realistic 80mm thermal receipt!
7. **Principal Oversight**:
   - Switch to **Principal** role to review rush-hour curves and campus food turnover.

---

## 🛠 Tech Stack
* **Framework**: React 19 + TypeScript + Vite 6
* **Styling**: Curated Vanilla CSS Design System (Apple/Linear/Vercel Dark & Glassmorphism Aesthetics)
* **Icons**: Lucide React
* **Database & Realtime**: Supabase PostgreSQL
* **Animations & Delight**: Canvas Confetti, Micro-interactions, CSS animations
* **Utilities**: QRCode generator, ESC/POS Thermal Receipt styling
