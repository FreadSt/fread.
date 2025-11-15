const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_KEY); // Use test secret key

router.post('/payment-intent', async (req, res) => {
  try {
    const { amount, currency } = req.body;

    if (!amount || !currency) {
      return res.status(400).json({ error: 'Missing required fields: amount and currency are required' });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount, // In cents (e.g., 1000 for $10)
      currency,
      automatic_payment_methods: { enabled: true }, // Enables dynamic payment methods
    });

    res.status(200).json({
      success: true,
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error('Stripe error:', error);
    res.status(500).json({
      error: error.message || 'Payment intent creation failed',
      type: error.type
    });
  }
});

module.exports = router;