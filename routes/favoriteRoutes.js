const express = require('express');
const { addFavorite, getFavorites } = require('../controllers/favoriteController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Bảo vệ route bằng JWT
router.post('/favorites', protect, addFavorite);
router.get('/favorites', protect, getFavorites);

module.exports = router;
