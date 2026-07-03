const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const User = require('../models/User');
const Payment = require('../models/Payment');

const PLANS = {
  pro: { price: 29.99, features: ['scheduling', 'analytics'] },
  premium: { price: 79.99, features: ['scheduling', 'analytics', 'autoReply', 'directMessages'] },
};

// Create payment
router.post('/create-checkout-session', authMiddleware, async (req, res) => {
  try {
    const { plan } = req.body;
    const planData = PLANS[plan];

    if (!planData) {
      return res.status(400).json({ message: 'Invalid plan' });
    }

    const user = await User.findById(req.userId);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${plan.toUpperCase()} Plan`,
            },
            unit_amount: Math.round(planData.price * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/cancel`,
      customer_email: user.email,
      client_reference_id: req.userId.toString(),
      metadata: { plan },
    });

    res.json({ sessionId: session.id });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get user subscription
router.get('/subscription', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    res.json(user.subscription);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
