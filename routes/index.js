const express = require('express');
const authRoutes = require('./authRoutes');
const movieRoutes = require('./movieRoutes');
const favoriteRoutes = require('./favoriteRoutes');

const router = express.Router();

router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

// Auth routes
router.use('/auth', authRoutes);
// Alias routes để hỗ trợ /api/login và /api/register
router.use('/', authRoutes);

// Movie routes (public)
router.use('/', movieRoutes);

// Favorite routes (protected)
router.use('/', favoriteRoutes);

module.exports = router;
