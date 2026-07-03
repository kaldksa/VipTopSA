const User = require('../models/User');

const adminMiddleware = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    
    if (!user || !user.features.admin) {
      return res.status(403).json({ message: 'Admin access required' });
    }
    
    next();
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = adminMiddleware;
