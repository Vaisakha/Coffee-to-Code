const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { demoUsers } = require('../middleware/auth');
const NotificationEngine = require('../services/NotificationEngine');

const JWT_SECRET = process.env.JWT_SECRET || 'campus_secret_key_2024_hackathon';

// In-memory store for demo mode
const inMemoryUsers = new Map();

// Generate JWT
const generateToken = (user) => jwt.sign(
  { id: user._id || user.id, role: user.role, name: user.name, email: user.email },
  JWT_SECRET,
  { expiresIn: '7d' }
);

// @route  POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, department, block, rollNumber, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    let user;
    try {
      // Try DB
      const existingUser = await User.findOne({ email });
      if (existingUser) return res.status(400).json({ message: 'Email already registered' });

      user = await User.create({ name, email, password, role: role || 'student', department, block, rollNumber, phone });
      user = user.toSafeObject();
    } catch (dbErr) {
      // Demo mode
      for (const [, u] of inMemoryUsers) {
        if (u.email === email) return res.status(400).json({ message: 'Email already registered' });
      }
      const hashedPwd = await bcrypt.hash(password, 10);
      const id = `demo_${Date.now()}`;
      user = { _id: id, id, name, email, password: hashedPwd, role: role || 'student', department: department || '', block: block || '', rollNumber: rollNumber || '', phone: phone || '', createdAt: new Date() };
      inMemoryUsers.set(id, user);
      demoUsers.set(id, user);
      delete user.password;
    }

    const token = generateToken(user);

    // Notify admins of new registration
    if (req.app.get('io')) {
      await NotificationEngine.publish(req.app.get('io'), {
        source_module: 'auth',
        type: 'info',
        title: 'New User Registered',
        message: `${name} joined as ${role || 'student'}`,
        target_role: 'admin',
      });
    }

    res.status(201).json({ token, user });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// @route  POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    let user;
    let passwordMatch;

    try {
      // Try DB
      user = await User.findOne({ email });
      if (!user) return res.status(401).json({ message: 'Invalid credentials' });
      passwordMatch = await user.comparePassword(password);
      if (!passwordMatch) return res.status(401).json({ message: 'Invalid credentials' });
      user = user.toSafeObject();
    } catch (dbErr) {
      // Demo mode — check in-memory
      let found = null;
      for (const [, u] of inMemoryUsers) {
        if (u.email === email) { found = u; break; }
      }
      // Also check seed users
      const seedUsers = getSeedUsers();
      if (!found) found = seedUsers.find(u => u.email === email);

      if (!found) return res.status(401).json({ message: 'Invalid credentials' });
      passwordMatch = await bcrypt.compare(password, found.password);
      if (!passwordMatch) return res.status(401).json({ message: 'Invalid credentials' });
      user = { ...found };
      delete user.password;
      demoUsers.set(found.id || found._id, { ...found });
    }

    const token = generateToken(user);
    res.json({ token, user });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// @route  GET /api/auth/me
router.get('/me', require('../middleware/auth').protect, (req, res) => {
  res.json({ user: req.user });
});

// Seed demo users (preloaded accounts for hackathon demo)
function getSeedUsers() {
  const bcryptHash = '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lEDy'; // 'demo1234'
  return [
    { id: 'seed_student_1', _id: 'seed_student_1', name: 'Alice Johnson', email: 'student@campus.edu', password: bcryptHash, role: 'student', department: 'Computer Science', block: 'A', rollNumber: 'CS2021001' },
    { id: 'seed_faculty_1', _id: 'seed_faculty_1', name: 'Dr. Robert Singh', email: 'faculty@campus.edu', password: bcryptHash, role: 'faculty', department: 'Computer Science', block: 'B' },
    { id: 'seed_admin_1', _id: 'seed_admin_1', name: 'Admin Kumar', email: 'admin@campus.edu', password: bcryptHash, role: 'admin', department: 'Administration', block: 'Admin Block' },
  ];
}

// @route  GET /api/auth/demo-accounts
router.get('/demo-accounts', (req, res) => {
  res.json({
    accounts: [
      { email: 'student@campus.edu', password: 'demo1234', role: 'student', name: 'Alice Johnson' },
      { email: 'faculty@campus.edu', password: 'demo1234', role: 'faculty', name: 'Dr. Robert Singh' },
      { email: 'admin@campus.edu', password: 'demo1234', role: 'admin', name: 'Admin Kumar' },
    ]
  });
});

module.exports = router;
