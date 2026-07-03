const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const Post = require('../models/Post');

// Get analytics
router.get('/', authMiddleware, async (req, res) => {
  try {
    const posts = await Post.find({ userId: req.userId });

    const totalLikes = posts.reduce((sum, post) => sum + post.engagementMetrics.likes, 0);
    const totalComments = posts.reduce((sum, post) => sum + post.engagementMetrics.comments, 0);
    const totalShares = posts.reduce((sum, post) => sum + post.engagementMetrics.shares, 0);
    const totalSaves = posts.reduce((sum, post) => sum + post.engagementMetrics.saves, 0);

    res.json({
      totalPosts: posts.length,
      totalLikes,
      totalComments,
      totalShares,
      totalSaves,
      averageLikes: posts.length > 0 ? totalLikes / posts.length : 0,
      posts,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
