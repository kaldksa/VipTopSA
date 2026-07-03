const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  senderUsername: String,
  senderProfilePicture: String,
  text: String,
  instagramMessageId: String,
  isRead: { type: Boolean, default: false },
  autoReplyEnabled: { type: Boolean, default: false },
  autoReplyText: String,
  replied: { type: Boolean, default: false },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Message', messageSchema);
