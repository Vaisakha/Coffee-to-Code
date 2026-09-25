# 🎓 Smart Campus Management Platform

A unified, real-time campus management system that connects student, faculty, and administrator services into a single ecosystem. Modules share data and trigger cross-system actions through an integrated **Notification Engine** and **WebSocket real-time backbone**.

---

## 🎨 Design System: Warm & Earthy Palette
- **Clockwork Brown:** `#72583E` (Brand primary, headers & key interactive elements)
- **Linen:** `#FFF9F3` (App canvas & card backgrounds)
- **Mauve:** `#755151` (Top navigation bar & accents)
- **Latte:** `#DBC4A5` / `#EDD9BE` (Accents, active borders & badges)
- **Emergency Crimson:** `#D32F2F` (Urgent SOS beacon & alert banners)

---

## 🏗️ Architecture & Integrations

The defining principle of this platform is **deep module integration**:
- **Emergency SOS & Geo-Beacon:** When any user triggers an SOS, an urgent red banner displays across all active sessions, audio-visual sirens ping campus security, and the Emergency Dispatch Console tracks real-time status.
- **Room Booking & Event Auto-Reservation:** Creating an academic or cultural event automatically checks and reserves the campus hall through the Room Management service with conflict prevention.
- **Attendance & Low-Attendance Alerts:** Faculty can create QR-code-based attendance sessions with live headcounts via WebSockets. If attendance drops below threshold, warning notifications automatically fire.
- **Lost & Found Cross-Matching:** Submitting a lost or found item automatically computes similarity matches against existing reports and notifies owners across departments.
- **Facilities & Maintenance Auto-Routing:** Complaints submitted for rooms or IT systems alert facility administrators and update the room's maintenance status.
- **Interactive Wayfinding & Navigation:** Multi-block floor map (Blocks A, B, C, Admin Tower, Hub) with real-time room availability, turn-by-turn route calculations, accessible paths, and emergency exit routing.

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js** (v16+ recommended)
- **npm** or **yarn**
- **MongoDB** (Optional: backend includes automated in-memory demo fallback if MongoDB is not running!)

---

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# (Optional) Seed demo database if MongoDB is running locally
npm run seed

# Start development server
npm run dev
# Or production server
npm start
```

Backend will be running on `http://localhost:5000`.

---

### 3. Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install

# Start React app
npm start
```

Frontend will open automatically on `http://localhost:3000`.

---

## 🔑 Demo Login Accounts

Preconfigured demo accounts with different role privileges:

| Role | Email | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **Student** | `student@campus.edu` | `demo1234` | View rooms, RSVP events, mark QR attendance, report lost items & complaints, trigger SOS |
| **Faculty** | `faculty@campus.edu` | `demo1234` | Book rooms, create events, launch QR attendance sessions, broadcast bulletins, report complaints |
| **Admin** | `admin@campus.edu` | `demo1234` | Manage rooms, resolve maintenance complaints, emergency dispatch console, broadcast campus alerts |

> 💡 *On the Login page (`/login`), click the quick-fill buttons at the bottom to sign in as Student, Faculty, or Admin with a single click!*

---

## 📂 Project Structure

```
coffee to code/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection with demo fallback
│   ├── middleware/
│   │   └── auth.js               # JWT verification & role authorization
│   ├── models/
│   │   ├── Attendance.js         # QR sessions & student check-ins
│   │   ├── Booking.js            # Room reservations & conflicts
│   │   ├── Complaint.js          # Facilities & maintenance tickets
│   │   ├── Emergency.js          # SOS distress records & geolocation
│   │   ├── Event.js              # Campus events & RSVPs
│   │   ├── LostFound.js          # Lost & found item listings
│   │   ├── Notification.js       # Stored notifications
│   │   ├── Room.js               # Campus spaces & status
│   │   └── User.js               # Roles: student, faculty, admin
│   ├── routes/
│   │   ├── attendance.js         # QR generation & live session stream
│   │   ├── auth.js               # Register, login, demo accounts
│   │   ├── complaints.js         # Maintenance tickets & status
│   │   ├── emergency.js          # SOS endpoints & resolution
│   │   ├── events.js             # Event creation & room linking
│   │   ├── lostfound.js          # Item reports & similarity matching
│   │   ├── notifications.js      # User notifications & broadcasting
│   │   └── rooms.js              # Room availability & booking engine
│   ├── services/
│   │   └── NotificationEngine.js # Central cross-module dispatcher
│   ├── seed.js                   # Database seeder script
│   ├── server.js                 # Express server & Socket.IO initialization
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── public/
│   │   └── index.html            # HTML shell with Google Fonts
│   ├── src/
│   │   ├── components/
│   │   │   ├── EmergencyBanner.js# Floating emergency alert banner
│   │   │   ├── Navbar.js         # Top header & quick user menu
│   │   │   ├── NotificationPanel.js # Slide-out notifications tray
│   │   │   ├── ProtectedRoute.js # Route guard & role permissions
│   │   │   ├── Sidebar.js        # Module navigation menu
│   │   │   └── SosButton.js      # Red emergency button with modal
│   │   ├── context/
│   │   │   ├── AuthContext.js    # SSO, token persistence & roles
│   │   │   └── NotificationContext.js # Live Socket.IO listener & badge counter
│   │   ├── hooks/
│   │   │   ├── index.js          # Unified hooks barrel export
│   │   │   ├── useAttendance.js  # QR attendance & real-time headcounts
│   │   │   ├── useDebounce.js    # Search debouncing utility
│   │   │   ├── useEmergency.js   # SOS distress beacons & geolocation
│   │   │   ├── useLocalStorage.js# Safe persistent browser state
│   │   │   ├── useRooms.js       # Live availability & socket updates
│   │   │   └── useSocket.js      # Declarative WebSocket subscriptions
│   │   ├── pages/
│   │   │   ├── AttendancePage.js # QR attendance creator & scanner
│   │   │   ├── ComplaintsPage.js # Issue reporting & maintenance workflow
│   │   │   ├── DashboardPage.js  # Overview metrics & quick links
│   │   │   ├── EmergencyPage.js  # Admin SOS incident control center
│   │   │   ├── EventsPage.js     # Campus events, RSVPs & capacity
│   │   │   ├── LoginPage.js      # Auth screen with 1-click role switcher
│   │   │   ├── LostFoundPage.js  # Lost & found board with category filter
│   │   │   ├── NavigationPage.js # Interactive campus map & wayfinding
│   │   │   ├── NotificationsPage.js # Notification center & broadcast composer
│   │   │   └── RoomsPage.js      # Live room availability & booking
│   │   ├── services/
│   │   │   ├── index.js          # Unified services barrel export
│   │   │   ├── attendanceService.js # QR sessions & check-in API
│   │   │   ├── authService.js    # Authentication & token management
│   │   │   ├── complaintService.js  # Maintenance tickets API
│   │   │   ├── emergencyService.js  # SOS distress & resolution API
│   │   │   ├── eventService.js   # Campus events & room auto-booking
│   │   │   ├── lostFoundService.js  # Lost items & similarity matching
│   │   │   ├── notificationService.js # Announcements & notifications
│   │   │   └── roomService.js    # Room availability & reservations
│   │   ├── utils/
│   │   │   ├── api.js            # Axios client with JWT interceptor
│   │   │   └── socket.js         # Socket.IO client manager
│   │   ├── App.js                # Router & layout assembly
│   │   ├── index.css             # Complete design tokens & stylesheet
│   │   └── index.js              # React root entry
│   └── package.json
├── Handover.md
└── README.md
```
