const jwt = require('jsonwebtoken');
const User = require('../models/User');

// In-memory user store for demo mode (when MongoDB is not connected)
const demoUsers = new Map();

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Not authorized, no token' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'campus_secret_key_2024_hackathon');

    // Try DB first, fallback to demo store
    try {
      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        // Check demo store
        const demoUser = demoUsers.get(decoded.id);
        if (demoUser) {
          req.user = demoUser;
          return next();
        }
        return res.status(401).json({ message: 'User not found' });
      }
      req.user = user;
    } catch (dbErr) {
      // DB not available — use demo store
      const demoUser = demoUsers.get(decoded.id);
      if (demoUser) {
        req.user = demoUser;
      } else {
        req.user = { _id: decoded.id, id: decoded.id, role: decoded.role, name: decoded.name, email: decoded.email };
      }
    }

    next();
  } catch (err) {
    return res.status(401).json({ message: 'Not authorized, invalid token' });
  }
};

const requireRole = (...roles) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: 'Not authenticated' });
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: `Access denied. Required role: ${roles.join(' or ')}` });
  }
  next();
};

module.exports = { protect, requireRole, demoUsers };
