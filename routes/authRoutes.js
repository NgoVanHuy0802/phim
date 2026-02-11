const express = require('express');
const { register, login } = require('../controllers/authController');

const router = express.Router();

/**
 * Auth routes theo yêu cầu:
 * - POST /register
 * - POST /login
 */
router.post('/register', register);
router.post('/login', login);

module.exports = router;
