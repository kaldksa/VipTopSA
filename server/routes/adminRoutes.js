const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');
const User = require('../models/User');

// Get all users (admin only)
router.get('/users', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update user plan (admin only)
router.put('/users/:id/plan', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { plan } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { plan }, { new: true });
    res.json({ message: 'Plan updated', user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get dashboard stats (admin only)
router.get('/stats', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const proUsers = await User.countDocuments({ plan: 'pro' });
    const premiumUsers = await User.countDocuments({ plan: 'premium' });
    const freeUsers = await User.countDocuments({ plan: 'free' });

    res.json({
      totalUsers,
      proUsers,
      premiumUsers,
      freeUsers,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
