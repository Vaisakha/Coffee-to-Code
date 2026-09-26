# HabitFlow — Build better days, one habit at a time.

HabitFlow is a personalized daily routine, habit tracking, and productivity management web application built with **React**, **TypeScript**, **Tailwind CSS**, and **Lucide Icons**.

---

## ✨ Features & Architecture

### 1. 📊 Executive Dashboard (Priority Above-the-Fold Layout)
- **Personalized Header**: Dynamic greeting based on time of day ("Good morning, Alex 👋"), formatted live date, motivational quote, user level badge, and notifications bell.
- **Top Statistics**:
  - Today’s completion percentage (live reactive calculation)
  - Current active streak & active habit counters
  - Habits completed today ratio (`5/8 Habits`)
  - Weekly consistency percentage (+8% vs previous week)
- **Today's Routine Timeline**: Interactive chronological schedule blocks (06:30 Wake Up, 07:00 Exercise, 09:00 Deep Work, etc.) with real-time completion checkoff and category badges.
- **Habit Overview Cards**: Quick check-in cards with current streak, best streak, 7-day mini heatmap pulses, and completion triggers.
- **Consistency Trends Chart**: Visual completion trend with toggles for **7 Days**, **30 Days**, and **90 Days**, plus interactive tooltips.
- **Productivity Score Ring**: Circular SVG progress gauge (87/100) broken down into sub-scores: Habits, Focus, Sleep, and Routine Consistency.
- **Smart Behavioral Insights**: Evidence-backed correlation cards (e.g. workout impact on daily habit completion, circadian focus peaks).
- **Active Streaks & Upcoming Reminders**: Flame-tagged streak momentum and next scheduled activities.

---

### 2. 📅 Today's Flow View
- Dedicated timeline mode grouped by circadian windows:
  - **Morning Routine (06:00 – 12:00)**: Energy priming and foundational habits
  - **Afternoon Focus (12:00 – 17:00)**: Deep work, nutrition, and team syncs
  - **Evening Wind-down (17:00 – 23:00)**: Reflection, reading, and bedtime preparation
- Granular checkoff with instant XP awards.

---

### 3. 🎯 Full Habit Management (`/habits`)
- **Filters & Search**: Instant filter by category (*Health, Fitness, Mindfulness, Productivity, Learning, Lifestyle*) and frequency (*Daily, Weekdays, Weekends*), plus real-time text search.
- **Actions**:
  - Create new habits with full validation (name, description, frequency, target value & unit, preferred time of day, reminder time, difficulty, icon, color accent, linked goal)
  - Edit existing habits
  - Pause & Resume habits
  - Delete habits with confirmation
  - 7-day adherence dot calendar

---

### 4. 📆 Schedule & Time Blocks (`/schedule`)
- Multiple calendar views:
  - **Day View**: Detailed time blocks with start time, duration, reminders, and category tags
  - **Week View**: 7-day calendar matrix displaying daily routine blocks
  - **Month View**: 30-day heatmap grid showing historical consistency percentages
- Ability to add new time blocks or link existing habits directly to schedule slots.

---

### 5. 🎯 Long-Term Goals (`/goals`)
- Milestone tracking for quarterly/annual objectives (e.g., *Read 12 Books This Year*, *Exercise 150 Times*, *Study 100 Hours*).
- **+1 Metric / +5 Metric** quick-logging buttons.
- Progress percentage bars and linked supporting daily habits.
- Completed goals archive with celebration badges.

---

### 6. 📈 Productivity & Streak Analytics (`/analytics`)
- Filter by: **This Week**, **This Month**, **Last 3 Months**.
- Multi-layer trend visualization for daily completion trajectory.
- Pillar-by-pillar Category Performance bars.
- Top performing habits ranking.
- Missed habit diagnostic patterns (e.g. evening screen curfew delays, weekend meditation variance).

---

### 7. 🏆 Gamification & Rewards (`/rewards`)
- **XP Progression Engine**:
  - Daily habit completion (+25 XP)
  - Routine item checkoff (+15 XP)
  - 7-day streak milestone (+50 XP)
  - Goal completion (+150 XP)
- Level gauge with remaining XP calculation.
- Unlockable badges & achievements (🏆 7 Day Streak, 🔥 30 Day Master, 📚 Reading Champion, 💪 Fitness Starter, 🌅 Early Bird, 🎯 Goal Crusher, 🧘 Zen Master).

---

### 8. 🤖 Smart Coach & Adaptive Routines (`/ai-suggestions`)
- Algorithmic analysis of completion logs suggesting actionable routine optimizations:
  - Shifting evening workouts earlier based on skip patterns
  - Habit stacking suggestions (e.g. reading with wind-down routines)
  - Routine simplification recommendations
- **"Apply Suggestion"** button that directly adjusts the user's habits/schedule and grants XP!
- Non-authoritative, transparent behavioral evidence rationale.

---

### 9. ⚙️ Settings & Personalization (`/settings`)
- User profile editing (Name, avatar, tagline, email).
- Start of day window & week starting day (Monday / Sunday).
- Dark Mode / Light Mode toggle with seamless class switching.
- **Export Data (JSON)**: Full backup download of habits, schedule, and goals.
- **Reset Demo Data**: Easily restore original populated demo state.
- **Relaunch Setup Tour**: Interactive 4-step onboarding wizard.

---

## 🚀 Running the Project Locally

```bash
# 1. Install dependencies
npm install

# 2. Start the development server
npm run dev

# 3. Build for production
npm run build
```

Open [http://localhost:3000](http://localhost:3000) in your browser.
