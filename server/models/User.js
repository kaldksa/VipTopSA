const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  instagramHandle: String,
  instagramAccessToken: String,
  instagramBusinessId: String,
  profileImage: String,
  plan: {
    type: String,
    enum: ['free', 'pro', 'premium'],
    default: 'free',
  },
  subscription: {
    status: { type: String, enum: ['active', 'inactive', 'cancelled'], default: 'inactive' },
    startDate: Date,
    endDate: Date,
    stripeCustomerId: String,
  },
  features: {
    scheduling: { type: Boolean, default: true },
    analytics: { type: Boolean, default: true },
    autoReply: { type: Boolean, default: false },
    directMessages: { type: Boolean, default: false },
    admin: { type: Boolean, default: false },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare passwords
userSchema.methods.comparePassword = async function (inputPassword) {
  return await bcrypt.compare(inputPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
