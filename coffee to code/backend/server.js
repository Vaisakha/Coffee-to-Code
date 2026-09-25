require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  }
});

// Attach io to app so routes can access it
app.set('io', io);

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Connect to DB (non-blocking — app runs in demo mode if DB unavailable)
connectDB();

// ─── Routes ─────────────────────────────────────────────────────────────────
app.use('/api/auth', require('./routes/auth'));
app.use('/api/rooms', require('./routes/rooms'));
app.use('/api/attendance', require('./routes/attendance'));
app.use('/api/emergency', require('./routes/emergency'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/lostfound', require('./routes/lostfound'));
app.use('/api/complaints', require('./routes/complaints'));
app.use('/api/events', require('./routes/events'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), mode: 'Smart Campus Management Platform' });
});

// ─── WebSocket Connection Handler ────────────────────────────────────────────
io.on('connection', (socket) => {
  console.log(`[WS] Client connected: ${socket.id}`);

  // Client joins role-based rooms for targeted notifications
  socket.on('join_role', ({ role, userId, block }) => {
    if (role) socket.join(`role_${role}`);
    if (userId) socket.join(`user_${userId}`);
    if (block) socket.join(`block_${block}`);
    console.log(`[WS] ${socket.id} joined role:${role}, user:${userId}, block:${block}`);
  });

  // Subscribe to specific room updates (for availability map)
  socket.on('subscribe_room', ({ room_id }) => {
    socket.join(`room_${room_id}`);
  });

  socket.on('disconnect', () => {
    console.log(`[WS] Client disconnected: ${socket.id}`);
  });

  // Client-side SOS (alternative to HTTP endpoint)
  socket.on('sos_triggered', (data) => {
    io.emit('emergency_alert', {
      ...data,
      timestamp: new Date(),
      socket_id: socket.id,
    });
  });
});

// ─── Start Server ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`\n🚀 Smart Campus Backend running on http://localhost:${PORT}`);
  console.log(`📡 WebSocket server ready`);
  console.log(`🗄️  Attempting MongoDB connection...`);
  console.log(`\nDemo accounts available at GET /api/auth/demo-accounts\n`);
});

module.exports = { app, io };
