const express = require('express');
const router = express.Router();

// Import route modules
const authRoutes = require('./auth');

// Health check route
router.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Mount routes
router.use('/auth', authRoutes);

module.exports = router;

