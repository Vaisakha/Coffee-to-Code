# HabitFlow / Trackora — Project Handover & Technical Documentation

> **Tagline:** *Build better days, one habit at a time.*  
> **Repository:** `trackora` (`daily_tracker-main`)  
> **Current Workspace:** `c:\Users\mizpa\Downloads\daily_tracker-main\daily_tracker-main\trackora`  
> **Target Application:** HabitFlow & Daily Consistency Tracker  
> **Date:** September 2026  
> **Status:** Production-Ready High-Fidelity Prototype / Complete Feature Set  

---

## 1. Executive Summary

**HabitFlow (Trackora)** is a circadian-aligned daily routine, habit tracking, health telemetry, and productivity management web application. It combines high-end macOS-inspired aesthetics (soft neutral backgrounds, rounded surfaces, glassmorphism, micro-animations, and balanced typography) with an offline-first, zero-backend architecture powered by React Context and `localStorage`.

The application features two complementary operating modes:
1. **Primary Workspace (Daily Tracker UI):** A macOS-styled single-window interface featuring a Left Consistency Widget Column and a Right Health & Habit Dashboard with dedicated top-level views (`Home`, `Calorie Meter`, `Physical Details`, `Profile`, and `About`).
2. **Classic Explorer (Extended Management View):** Accessible via the floating bottom switch, offering deep tabular and calendar management across Habits, Schedulers, Milestone Goals, 90-Day Analytics, and AI Suggestion heuristics.

---

### Key Changes for "Elegant" Hackathon Transformation
1. Repurposed the original wellness dashboard into a Daily Routine & Habit Tracker.
2. Updated the main branding and dashboard content to focus on habits, routines, and consistency.
3. Added an Adaptive Routine Assistant for missed habits with reschedule, skip, and move-to-tomorrow options.
4. Added Today's Progress with habit completion, streak, productivity, focus time, and completion percentage.
5. Added Today's Routine with morning, afternoon, and evening habit sections.
6. Changed Add Task to Add Habit and introduced habit-focused activities.
7. Replaced health-focused metrics with productivity and habit-tracking metrics.
8. Added Routine Insights based on habit behaviour and consistency.
9. Added Daily Wins and XP-based rewards.
10. Added/updated Habit Consistency analytics and heatmap.
11. Updated Favourite Habit and progress information for habit tracking.
12. Preserved the original website's UI structure, styling, components, and overall visual design.

---

## 2. Technology Stack & Dependencies

| Layer | Technology | Version | Purpose |
|---|---|---|---|
| **Framework** | [React](https://react.dev/) | `^18.3.1` | Component-based UI rendering |
| **Language** | [TypeScript](https://www.typescriptlang.org/) | `^5.6.3` | Strict type safety and structured data modeling |
| **Build Tool** | [Vite](https://vitejs.dev/) | `^5.4.11` | Lightning-fast HMR dev server & optimized production rollup |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) | `^3.4.15` | Modern design system, custom utility classes, dark-mode ready |
| **Icons** | [Lucide React](https://lucide.dev/) | `^1.16.0` | Comprehensive icon library with dynamic resolvers |
| **Class Utilities** | `clsx`, `tailwind-merge` | Latest | Conditional and conflict-free Tailwind class resolution |
| **State & Storage** | React Context + `localStorage` | Built-in | Client-side reactive persistence with robust seed models |

---

## 3. Directory Layout & Architecture

```
trackora/
├── index.html                           # App HTML entry with Google Inter/Outfit fonts & SEO tags
├── package.json                         # Scripts, dependencies, and Vite configuration
├── postcss.config.js                    # PostCSS pipeline configuration
├── tailwind.config.js                   # Tailwind theme extensions, palettes, and animations
├── tsconfig.json                        # TypeScript strict compiler options
├── vite.config.ts                       # Vite server configuration (Default Port 3000)
├── README.md                            # High-level product summary
├── HANDOVER.md                          # This comprehensive technical handover documentation
└── src/
    ├── main.tsx                         # React 18 root mount
    ├── App.tsx                          # Root router toggling Tracker UI vs Classic Explorer
    ├── index.css                        # Tailwind directives, custom scrollbars, and keyframes
    ├── types/
    │   └── index.ts                     # TypeScript definitions (Habit, PhysicalDetails, Calorie, etc.)
    ├── data/
    │   └── mockData.ts                  # Rich initial seed data for Elena C. & Alex Vance
    ├── context/
    │   └── AppContext.tsx               # Central application state, persistence engine, and XP logic
    └── components/
        ├── tracker/                     # 🌟 macOS Daily Tracker Window Components (Primary UI)
        │   ├── TrackerLayout.tsx        # Outer macOS window wrapper, modal coordinators, toasts
        │   ├── LeftWidgetsSidebar.tsx   # Left widget column (Mode switcher, reading, runner, music, timer)
        │   ├── DashboardMain.tsx        # Right dashboard (Header, top tabs, circadian grid, heatmap)
        │   ├── CalorieMeterView.tsx     # Energy balance gauge, macro bars, quick logs, meal journal
        │   ├── PhysicalDetailsView.tsx  # Biometrics (Height, weight, BMI, body fat %, BMR, TDEE)
        │   ├── ProfileView.tsx          # User profile card, level badges, preferences, data reset
        │   ├── AboutView.tsx            # Philosophy, 4 core pillars, and local-first architecture
        │   ├── DailyWinsCard.tsx        # Micro-win logging with XP rewards, categories, and timeline
        │   ├── HabitHeatmapCard.tsx     # 18-week GitHub-style habit activity matrix with filters
        │   ├── StreakFreezeModal.tsx    # Streak freeze vault, shield activation, and usage history
        │   ├── LevelXPModal.tsx         # XP progression tier roadmap and daily bonus claims
        │   ├── AddWidgetModal.tsx       # Custom widget addition modal
        │   ├── AskAIModal.tsx           # Contextual AI coach modal
        │   ├── TrackerChatModal.tsx     # Real-time assistant chat panel
        │   └── TrackerNotificationsDrawer.tsx # Sliding notification drawer
        ├── common/                      # Reusable UI primitives
        │   ├── Badge.tsx                # Categorical and difficulty tag pills
        │   ├── CircularProgress.tsx     # Animated SVG circular gauge
        │   ├── DynamicIcon.tsx          # Dynamic Lucide component resolver
        │   ├── Modal.tsx                # Accessible dialog shell with backdrop blur & ESC listener
        │   └── ToastContainer.tsx       # Floating reactive toast notifications
        ├── layout/                      # Classic Explorer shell components
        │   ├── Sidebar.tsx              # Classic desktop navigation sidebar
        │   ├── TopHeader.tsx            # Classic header with search and notification panels
        │   └── MobileNav.tsx            # Fixed mobile bottom navigation
        ├── dashboard/                   # Classic Explorer dashboard widgets
        │   ├── HabitOverview.tsx        # 7-day dot habit cards
        │   ├── ProductivityScore.tsx    # Overall productivity gauge
        │   ├── SmartInsights.tsx        # Telemetry-driven insight cards
        │   ├── StreaksSection.tsx       # Flame streak records
        │   ├── TodayRoutine.tsx         # Chronological checkoff list
        │   ├── UpcomingReminders.tsx    # Task reminder list
        │   └── WeeklyConsistency.tsx   # Trend line chart (7d, 30d, 90d)
        ├── modals/                      # Classic CRUD modals
        │   ├── CreateHabitModal.tsx     # Habit creator & editor
        │   ├── CreateGoalModal.tsx      # Milestone goal creator
        │   ├── CreateScheduleModal.tsx  # Time-block builder
        │   └── OnboardingModal.tsx      # Multi-step setup wizard
        └── pages/                       # Classic Explorer dedicated views
            ├── DashboardView.tsx        # Standard analytics & habit overview
            ├── TodayView.tsx            # Circadian-grouped daily routine
            ├── HabitsView.tsx           # Full habit management grid
            ├── ScheduleView.tsx         # Day, week, and month time block calendars
            ├── GoalsView.tsx            # Milestone goals with fast +1 increments
            ├── AnalyticsView.tsx        # Long-term consistency analytics
            ├── RewardsView.tsx          # Gamification, XP progress, and badges
            ├── AISuggestionsView.tsx    # AI coach suggestions and one-click applications
            └── SettingsView.tsx         # Profile preferences and raw data controls
```

---

## 4. Key Systems & Feature Workflows

### A. Ambient Routine Mode Switcher
Located at the top of [`LeftWidgetsSidebar.tsx`](file:///c:/Users/mizpa/Downloads/daily_tracker-main/daily_tracker-main/trackora/src/components/tracker/LeftWidgetsSidebar.tsx):
- **4 Operational Modes:**
  - 💼 **Work mode**: Focus sprint setup with Slate/Blue tint (`Briefcase` icon).
  - ⚡ **Focus mode**: Pomodoro deep focus with Amber/Orange tint (`Zap` icon).
  - 🌙 **Rest mode**: Mindful decompression with Emerald tint (`Moon` icon).
  - ☀️ **Weekend mode**: Relaxed pacing with Violet tint (`Sun` icon).
- **Interactive Features:**
  - Custom popover menu (`w-72`) displaying contextual subtitles and active checkmarks.
  - Automatic click-outside dismissal via `useRef` event listener.
  - **Live Workspace Adaptation:** Switching a mode automatically adjusts the countdown timer preset (e.g. 25:00 for Focus, 15:00 for Work, 10:00 for Rest, 20:00 for Weekend) and synchronizes the recommended background music track (*Deep work Music*, *Binaural Focus 40Hz*, or *Nordic Forest Rain*).

### B. Gamification: Streak Freeze Vault & Level/XP System
- **Streak Freeze Vault ([`StreakFreezeModal.tsx`](file:///c:/Users/mizpa/Downloads/daily_tracker-main/daily_tracker-main/trackora/src/components/tracker/StreakFreezeModal.tsx)):**
  - Displays remaining protective shields (seeded at 2).
  - Users can activate protection for today, preventing streak resets if routines are missed.
  - Provides a one-click restock option (+1 Freeze per 7-day streak) and historical protection event logs.
- **Level & XP Progression ([`LevelXPModal.tsx`](file:///c:/Users/mizpa/Downloads/daily_tracker-main/daily_tracker-main/trackora/src/components/tracker/LevelXPModal.tsx)):**
  - Live progress bar tracking XP towards the next tier (e.g., Level 6: Consistency Vanguard ➔ Level 7: Master of Routine).
  - Daily Login Streak XP claim button (+50 XP).
  - Complete progression roadmap displaying past and future unlocked privileges.

### C. Daily Wins Journaling & 18-Week Habit Heatmap
- **Daily Wins ([`DailyWinsCard.tsx`](file:///c:/Users/mizpa/Downloads/daily_tracker-main/daily_tracker-main/trackora/src/components/tracker/DailyWinsCard.tsx)):**
  - Quick-entry input for recording daily micro-accomplishments.
  - Categorization pills: `Productivity`, `Health`, `Fitness`, `Mindfulness`, `Learning`, `Streak`, `Personal`.
  - Automatically awards +25 XP per logged win and records time-stamped entries with category badges.
- **18-Week Habit Heatmap ([`HabitHeatmapCard.tsx`](file:///c:/Users/mizpa/Downloads/daily_tracker-main/daily_tracker-main/trackora/src/components/tracker/HabitHeatmapCard.tsx)):**
  - GitHub-style contribution matrix rendering 18 weeks (126 days).
  - Filterable by specific habits (e.g., *Morning Sunlight & Water*, *Read 20 Pages*, *Strength Workout*, *Meditation*) or All Habits combined.
  - 4-tier emerald color intensity scale reflecting completion density.

### D. Multi-Tab Navigation in Dashboard Main
Managed in [`DashboardMain.tsx`](file:///c:/Users/mizpa/Downloads/daily_tracker-main/daily_tracker-main/trackora/src/components/tracker/DashboardMain.tsx):
1. **Home Tab:**
   - **Sleep Time Metric:** 7.5 hrs sleep card with circadian target arc.
   - **Weekly Calendar Slider:** Dynamic date selector (Oct 19–25) with day selection.
   - **Daily Routine Checklist:** Interactive checklist with real-time completion counter and XP rewards.
   - **Cardiovascular & Stress Telemetry:** Real-time animated Heart Rate ECG waveform (72 bpm) and Cortisol Gradient Meter.
   - **Habit Streak Tracker:** Calendar strip (Days 12–28) with completion flame badges.
   - **Favourite Habit Bar Chart:** 7-day volume chart with interactive hover tooltips.
   - **Spotlight Journal Banner:** Fast prompt for evening reflections.
2. **Calorie Meter Tab ([`CalorieMeterView.tsx`](file:///c:/Users/mizpa/Downloads/daily_tracker-main/daily_tracker-main/trackora/src/components/tracker/CalorieMeterView.tsx)):**
   - Circular energy balance gauge (Target: 2,150 kcal, Burned: 520 kcal, Consumed: 1,640 kcal, Net: 1,120 kcal, Remaining: 510 kcal).
   - Dynamic macro progress bars (Protein, Carbs, Fats) with gram targets and percentages.
   - Quick-add food presets (Greek Yogurt Bowl, Grilled Chicken Salad, Protein Shake, etc.).
   - Custom meal logging form with instant macro calculations.
3. **Physical Details Tab ([`PhysicalDetailsView.tsx`](file:///c:/Users/mizpa/Downloads/daily_tracker-main/daily_tracker-main/trackora/src/components/tracker/PhysicalDetailsView.tsx)):**
   - Key biometrics: Height (168 cm), Weight (62.5 kg), Target Weight (60 kg), Age (27), Activity Level.
   - Automated real-time calculations: BMI with color-coded classification badge, BMR (Basal Metabolic Rate), TDEE (Total Daily Energy Expenditure), Body Fat %, Resting Heart Rate, and Hydration Goal (2.5 L).
   - Editable metrics form with instant `localStorage` synchronization.
4. **Profile Tab ([`ProfileView.tsx`](file:///c:/Users/mizpa/Downloads/daily_tracker-main/daily_tracker-main/trackora/src/components/tracker/ProfileView.tsx)):**
   - User identity card (Elena C., `@elena_c`, Member since Sept 2025).
   - Account settings: First day of week preference, push & email alerts, sound effects.
   - Safe data reset trigger for demonstration and testing.
5. **About Tab ([`AboutView.tsx`](file:///c:/Users/mizpa/Downloads/daily_tracker-main/daily_tracker-main/trackora/src/components/tracker/AboutView.tsx)):**
   - Core philosophy: Circadian recovery and micro-habit compounding.
   - 4 Architectural Pillars: Local-First Privacy, Frictionless Telemetry, Visual Harmony, Behavioral Positive Reinforcement.

### E. Left Sidebar Consistency Widgets
Managed in [`LeftWidgetsSidebar.tsx`](file:///c:/Users/mizpa/Downloads/daily_tracker-main/daily_tracker-main/trackora/src/components/tracker/LeftWidgetsSidebar.tsx):
- **Interactive Reading Widget:** Book cover art (`Atomic Habits`), real-time page logger modal, progress bar (142 / 320 pages), and quick `+10 pages` increment.
- **Running Distance Widget:** Distance stat (12.08 km), trail photo, and GPS polyline trail map overlay.
- **Deep Work Music Player:** Vinyl record with spinning animation on play, track title/artist display, play/pause, and track skip controls.
- **Quiet Time Timer:** Countdown display (`HH : MM : SS`), live interval countdown, Start/Pause and Cancel/Reset controls.
- **Photo & Quote Cards:** Visual cards with positive reinforcement quotes.
- **Add Widget Modal:** Modal allowing users to activate additional custom widgets.

---

## 5. Core Data Models Reference

Defined in [`src/types/index.ts`](file:///c:/Users/mizpa/Downloads/daily_tracker-main/daily_tracker-main/trackora/src/types/index.ts):

```typescript
// Physical Biometrics
export interface PhysicalDetails {
  heightCm: number;
  weightKg: number;
  targetWeightKg: number;
  age: number;
  gender: 'female' | 'male' | 'other';
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'very_active';
  bodyFatPercentage?: number;
  restingHeartRate?: number;
  bloodPressure?: string;
  lastUpdated: string;
}

// Nutrition & Calorie Tracking
export interface CalorieMealItem {
  id: string;
  name: string;
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatsGrams: number;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  time: string;
}

export interface CalorieMeterData {
  dailyTargetCalories: number;
  burnedCalories: number;
  targetProteinGrams: number;
  targetCarbsGrams: number;
  targetFatsGrams: number;
  meals: CalorieMealItem[];
}

// Daily Micro-Wins
export interface DailyWin {
  id: string;
  title: string;
  category: HabitCategory | 'streak' | 'personal';
  time: string;
  xpEarned: number;
  icon?: string;
}

// Routine Mode Options
export type TrackerMode = 'rest' | 'work' | 'focus' | 'weekend';

// Top-Level Tracker Views
export type TrackerView = 'home' | 'calorie' | 'physical' | 'profile' | 'about';
```

---

## 6. How to Run & Build

### Prerequisites
- **Node.js:** `18.x` or higher
- **npm:** `9.x` or higher

### Local Development
```bash
# Navigate to the project root
cd trackora

# Install dependencies
npm install

# Start development server (runs on http://localhost:3000)
npm run dev
```

> **Note for Windows PowerShell:** If running scripts is blocked by execution policy, use `npm.cmd run dev` or launch via cmd.

### Production Build & Verification
```bash
# Type check and build optimized bundle
npm run build

# Preview production build locally
npm run preview
```
Production build bundles cleanly into the `dist/` directory with 0 TypeScript compiler warnings or errors.

---

## 7. Handover Recommendations for Next Engineering Phase

If connecting HabitFlow to a remote backend (Supabase / Node.js / PostgreSQL):
1. **API Persistence Layer:**
   - In [`src/context/AppContext.tsx`](file:///c:/Users/mizpa/Downloads/daily_tracker-main/daily_tracker-main/trackora/src/context/AppContext.tsx), replace the synchronous `localStorage` helper functions with asynchronous queries (TanStack Query / SWR).
   - The data schemas in [`src/types/index.ts`](file:///c:/Users/mizpa/Downloads/daily_tracker-main/daily_tracker-main/trackora/src/types/index.ts) map 1:1 to SQL tables (`habits`, `meals`, `physical_metrics`, `daily_wins`).
2. **Audio Streaming:**
   - Connect the music player in [`LeftWidgetsSidebar.tsx`](file:///c:/Users/mizpa/Downloads/daily_tracker-main/daily_tracker-main/trackora/src/components/tracker/LeftWidgetsSidebar.tsx) to real HTML5 Audio streams or the Spotify Web Playback SDK.
3. **Wearables & Apple Health / Google Fit:**
   - Connect the Heart Rate and Sleep metrics in [`DashboardMain.tsx`](file:///c:/Users/mizpa/Downloads/daily_tracker-main/daily_tracker-main/trackora/src/components/tracker/DashboardMain.tsx) to HealthKit / Google Health Connect webhooks.

---

## 8. Handover Sign-Off

- **Workspace Path:** `c:\Users\mizpa\Downloads\daily_tracker-main\daily_tracker-main\trackora`
- **Build Status:** Verified passing with 0 errors (`tsc && vite build`)
- **Dev Server Status:** Running live on `http://localhost:3000/`
- **Documentation Updated:** [`HANDOVER.md`](file:///c:/Users/mizpa/Downloads/daily_tracker-main/daily_tracker-main/trackora/HANDOVER.md)
