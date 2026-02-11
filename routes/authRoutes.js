const express = require('express');
const {
  register,
  login,
  getProfile,
  pingExternal,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', protect, getProfile);
router.get('/ping-external', pingExternal);

module.exports = router;
