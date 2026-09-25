# SynapseCollab — Project Handover Document

> **Project Name:** `my new project`
> **App Title:** SynapseCollab: AI-Powered Teammate Matchmaker & Dream Team Forge
> **Type:** Client-Side Web Application (Vanilla HTML + CSS + JS)
> **Status:** ✅ Feature Complete — Ready for Deployment

---

## 📁 Project Structure

```
my new project/
├── index.html                            ← Main app shell & all UI markup
├── style.css                             ← Full design system (2,675 lines)
├── app.js                                ← All logic, state & event handlers (2,050+ lines)
├── server.ps1                            ← PowerShell static file server script
├── start-server.bat                      ← One-click Windows launcher (double-click to run)
├── assets/                               ← Static assets folder
├── handover.md                           ← This document
└── collaboration-find-the-right-teammate.md  ← Original feature specification
```

---

## 🚀 How to Run Locally

### Option 1 — One-Click Launch (Windows)
Double-click **`start-server.bat`** → opens at **http://localhost:3000**

### Option 2 — Manual PowerShell
```powershell
powershell -ExecutionPolicy Bypass -File .\server.ps1 -Port 3000
```

### Option 3 — Direct File Open
Open **`index.html`** directly in Chrome, Edge, Firefox, or Safari.
> Everything is client-side and works fully offline. No Node.js or build tools required.

---

## ✨ Features Built

### 1. 🧠 AI Matchmaker Wizard
An interactive **4-step modal** that profiles the user and recalculates all compatibility scores in real time:

| Step | What it captures |
|------|-----------------|
| Step 1 | Your role, primary tech stack, and experience level |
| Step 2 | Project type (AI/LLMs, Web3, SaaS, Mobile, GameDev, Open Source) |
| Step 3 | Desired teammate role, complementary skills, and weekly commitment |
| Step 4 | Collaboration style (rapid vs. meticulous, async vs. sync, timezone) |

- Scores update live across all 10 candidate cards after wizard completes
- Each card shows a personalized **compatibility reasoning tag**

---

### 2. 🏗️ Squad Forge (Dream Team Builder)
An interactive **4-slot team bench** for assembling the perfect squad:

| Slot | Role |
|------|------|
| Slot 1 | UI/UX & Product Design |
| Slot 2 | Frontend & Client Architecture *(auto-filled with YOU)* |
| Slot 3 | Backend & Infrastructure |
| Slot 4 | AI/ML & Data Engineering |

**Real-time Squad Analytics Sidebar:**
- 🔵 **Synergy Health Score** — animated circular gauge (0–100%)
- 📊 **Role Completeness** — progress bar (X/4 roles filled)
- 🛠️ **Tech Coverage** — complementary stack analysis
- 🌍 **Timezone Overlap** — estimated sync hours per day
- 💡 **AI Advice Text** — dynamic squad coaching message

**Actions available:** Auto-Assemble, Clear Squad, Finalize & Export Squad Manifesto

---

### 3. 👥 Teammate Discovery Roster
- **10 pre-loaded candidate profiles** spanning AI/ML, Backend, Frontend, Design, Full-Stack, Web3, Mobile, and Creative Dev
- **Instant full-text search** across names, roles, bios, and skills
- **Multi-filter system**: Role pills · Commitment level · Timezone · Sort order
- **Candidate cards** include:
  - Compatibility % match badge (color-coded: cyan ≥95%, indigo ≥85%, emerald otherwise)
  - Skill complementarity reasoning line
  - Vibe tags (#Async-First, #Night-Owl, #Rapid-Prototyper, etc.)
  - Meta footer: timezone, weekly hours, rating & wins
- **Full Profile Modal** on click — shows radar-style skill breakdown, hackathon track record, testimonials, portfolio links, and direct "Add to Squad" / "Message" CTAs
- **Bookmarks Drawer** — save candidates for quick reference via the header bookmark icon

---

### 4. 📋 Project Showcase & Recruitment Board
4 pre-loaded projects actively seeking collaborators:

| Project | Category | Prize |
|---------|----------|-------|
| NeuroVoice: Zero-Latency Voice Copilot | AI & Autonomous Agents | $50,000 |
| VeriChain: Smart Contract Auditing Agent | FinTech & Web3 | $100,000 |
| DevPulse: Collaborative Spatial IDE | Developer Tools & SaaS | Product Hunt |
| AgriSense: Satellite Climate Adaptation | HealthTech & GreenTech | UN Challenge |

- Each project card shows: open role slots, tech stack, project lead
- **Apply to Join** button — triggers instant notification flow (see Notification Center)
- **Category filter chips**: All · AI · Web3 · SaaS · HealthTech
- **Post a Project** modal to publish new recruitment listings

---

### 5. 💬 Collab Lounge (Chat System)
- **3 pre-loaded conversation threads** with Elena Rostova, Marcus Vance, and Aria Chen
- Simulated **auto-reply** after 1.2 seconds for a live-chat feel
- **Icebreaker Quick Chips**: pre-filled message suggestions for quick conversation starters
- **View Profile** and **Add to Squad** shortcuts directly from the chat panel
- Chat history persists across page reloads via `localStorage`

---

### 6. 🔔 Notification Center (Real-Time Alerts)
A fully interactive **notification bell** in the header with:

| Trigger | Notification Type |
|---------|------------------|
| User applies to a project | "Application Submitted 🚀" — immediate |
| Project lead accepts (simulated, 4s delay) | "Application Accepted 🎉" — with sound chime |
| User adds teammate to Squad Forge | "Teammate Confirmed 🤝" — instant |
| App loads (6s delay) | Live incoming "New Candidate Application 📥" demo |

**UI Features:**
- Pulsing green dot when unread notifications exist
- Red badge counter on bell icon
- Filter chips: All · Project Updates · Teammate Invites
- "Mark All Read" and "Clear All" buttons
- Action buttons inside each notification navigate directly to the relevant section

---

## ⚙️ Algorithmic Compatibility Engine

The match score between the user `u` and any teammate `t` is:

```
C(u, t) = (SkillComplementarity × 0.45)
         + (WorkStylePaceFit    × 0.25)
         + (CommitmentAlignment × 0.15)
         + (TimezoneOverlap     × 0.15)
```

| Vector | Weight | What it measures |
|--------|--------|-----------------|
| Skill Complementarity | 45% | Rewards different, complementary skill sets; penalizes redundancy |
| Work Style & Pace | 25% | Rapid Prototyper vs. Meticulous Architect; Async vs. Sync comms |
| Commitment & Goals | 15% | Hackathon sprint / Startup / Open Source + weekly hours delta |
| Timezone Sync | 15% | Minimum 3–4 hrs viable synchronous overlap window |

---

## 🏛️ Architecture & State Management

### AppState Class (app.js)
Single source of truth. All state is persisted to `localStorage` automatically:

| State Key | localStorage Key | Description |
|-----------|-----------------|-------------|
| `state.user` | `synapse_user` | Current user profile & preferences |
| `state.teammates` | `synapse_teammates` | All candidate profiles + computed scores |
| `state.squad` | `synapse_squad` | 4 squad slot assignments |
| `state.projects` | `synapse_projects` | Project board + applied status |
| `state.conversations` | `synapse_conversations` | Chat message threads |
| `state.bookmarks` | `synapse_bookmarks` | Saved teammate IDs |
| `state.notifications` | `synapse_notifications` | Notification objects + read status |

### Key Functions Reference

| Function | File | Purpose |
|----------|------|---------|
| `renderTeammatesGrid()` | app.js | Re-renders all candidate cards with current filters & scores |
| `renderSquadForge()` | app.js | Updates squad slots + analytics sidebar |
| `renderProjectsGrid()` | app.js | Draws project board with apply status |
| `renderNotifications()` | app.js | Updates bell badge + dropdown list |
| `handleApplyToProject(id)` | app.js | Applies to project + fires 2 notifications |
| `handleQuickAddToSquad(id)` | app.js | Assigns teammate to best-fit slot + notifies |
| `openProfileModal(id)` | app.js | Opens full-detail teammate profile modal |
| `openWizardModal()` | app.js | Launches 4-step AI Matchmaker Wizard |
| `state.addNotification(obj)` | app.js | Adds notification, plays chime, shows toast |
| `showToast(message)` | app.js | Displays bottom-right transient toast |
| `switchTab(name)` | app.js | Switches between main sections |

---

## 🎨 Design System

| Token | Value | Usage |
|-------|-------|-------|
| Electric Indigo | `#6366f1` | Primary actions, active states |
| Cyber Cyan | `#06b6d4` | Highlights, online indicators |
| Neon Violet | `#a855f7` | Accent gradients |
| Emerald Glow | `#10b981` | Success states, accepted badges |
| Rose Alert | `#f43f5e` | Remove / danger actions |
| Background | `#080b12` | Base dark surface |

- **Glassmorphism**: `backdrop-filter: blur(16–20px)` on all panels and cards
- **Typography**: `Plus Jakarta Sans` (body) + `Outfit` (headings) + `Space Grotesk` (accents) via Google Fonts
- **Sound FX**: Web Audio API synthesizer — chimes, clicks, and pop sounds (toggleable)
- **Animations**: Keyframe pulses, scale-up dropdowns, slide-in drawers, toast fade-ins

---

## 🛠️ Technology Stack

| Layer | Technology |
|-------|-----------|
| Structure | Semantic HTML5 with ARIA tags |
| Styling | Vanilla CSS (no frameworks) — 2,675 lines |
| Logic | Vanilla ES6+ JavaScript — 2,050+ lines |
| Persistence | `localStorage` (client-side, no backend needed) |
| Audio | Web Audio API (synthesized SFX, no audio files) |
| Fonts | Google Fonts CDN |
| Server | PowerShell static HTTP server (`server.ps1`) |

---

## 🔮 Suggested Future Improvements

1. **Real Backend** — Replace localStorage with Supabase/Firebase for multi-user live data
2. **WebSocket Chat** — Replace simulated replies with real-time messaging
3. **OAuth Login** — GitHub/Google sign-in to pull real portfolios and contribution data
4. **Email Notifications** — Integrate with Resend or SendGrid for real acceptance emails
5. **AI Matching API** — Connect to an LLM to generate richer compatibility reasoning
6. **Mobile Responsive Nav** — Add hamburger menu for screens < 900px
7. **Project Application Tracking** — Kanban-style view of pending/accepted/rejected applications

---

## 🚢 Deploying to GitHub

```powershell
# After installing Git (https://git-scm.com/download/win)

git init
git add .
git commit -m "Initial commit: SynapseCollab AI Teammate Matchmaker"

# Replace YOUR_TOKEN, YOUR_USERNAME, YOUR_REPO with actual values
git remote add origin https://YOUR_TOKEN@github.com/YOUR_USERNAME/YOUR_REPO.git

git branch -M main
git push -u origin main
```

> Get your Personal Access Token at: https://github.com/settings/tokens
> Check the `repo` scope when creating the token.

---

*Handover document generated from `collaboration-find-the-right-teammate.md` specification.*
*Project: `my new project` | Last updated: 2026-09-25*
