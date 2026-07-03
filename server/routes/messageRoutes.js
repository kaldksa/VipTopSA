const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const Message = require('../models/Message');

// Get all messages
router.get('/', authMiddleware, async (req, res) => {
  try {
    const messages = await Message.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Mark message as read
router.put('/:id/read', authMiddleware, async (req, res) => {
  try {
    const message = await Message.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );
    res.json({ message: 'Message marked as read', data: message });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Reply to message
router.post('/:id/reply', authMiddleware, async (req, res) => {
  try {
    const { replyText } = req.body;
    const message = await Message.findByIdAndUpdate(
      req.params.id,
      { replied: true, autoReplyText: replyText },
      { new: true }
    );
    res.json({ message: 'Reply sent', data: message });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
