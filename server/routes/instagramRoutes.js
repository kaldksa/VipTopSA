const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const User = require('../models/User');

// Connect Instagram account
router.post('/connect', authMiddleware, async (req, res) => {
  try {
    const { accessToken, businessId, handle } = req.body;

    const user = await User.findByIdAndUpdate(
      req.userId,
      {
        instagramAccessToken: accessToken,
        instagramBusinessId: businessId,
        instagramHandle: handle,
      },
      { new: true }
    );

    res.json({ message: 'Instagram connected', user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Disconnect Instagram account
router.post('/disconnect', authMiddleware, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.userId,
      {
        instagramAccessToken: null,
        instagramBusinessId: null,
        instagramHandle: null,
      },
      { new: true }
    );

    res.json({ message: 'Instagram disconnected', user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get Instagram profile
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user.instagramAccessToken) {
      return res.status(400).json({ message: 'Instagram not connected' });
    }

    // Here you would fetch from Instagram API
    res.json({
      handle: user.instagramHandle,
      businessId: user.instagramBusinessId,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
