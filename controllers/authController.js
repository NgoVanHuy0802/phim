const jwt = require('jsonwebtoken');
const axios = require('axios');
const User = require('../models/User');
const asyncHandler = require('../middleware/asyncHandler');

/**
 * Tạo JWT token cho user.
 */
const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

/**
 * POST /api/auth/register
 */
const register = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    const error = new Error('Username, email and password are required.');
    error.statusCode = 400;
    throw error;
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    const error = new Error('Email already exists.');
    error.statusCode = 409;
    throw error;
  }

  const user = await User.create({ username, email, password });

  res.status(201).json({
    success: true,
    data: {
      _id: user._id,
      username: user.username,
      email: user.email,
      token: generateToken(user._id),
    },
  });
});

/**
 * POST /api/auth/login
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    const error = new Error('Email and password are required.');
    error.statusCode = 400;
    throw error;
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.comparePassword(password))) {
    const error = new Error('Invalid email or password.');
    error.statusCode = 401;
    throw error;
  }

  res.status(200).json({
    success: true,
    data: {
      _id: user._id,
      username: user.username,
      email: user.email,
      token: generateToken(user._id),
    },
  });
});

/**
 * GET /api/auth/profile
 */
const getProfile = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    data: req.user,
  });
});

/**
 * GET /api/auth/ping-external
 * Demo sử dụng axios để gọi API ngoài.
 */
const pingExternal = asyncHandler(async (req, res) => {
  const response = await axios.get('https://api.github.com/zen', {
    timeout: 5000,
    headers: {
      'User-Agent': 'express-api-sample',
    },
  });

  res.status(200).json({
    success: true,
    message: 'External API call success.',
    data: response.data,
  });
});

module.exports = {
  register,
  login,
  getProfile,
  pingExternal,
};
