const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('../middleware/asyncHandler');

/**
 * Tạo JWT token cho user, mặc định hết hạn sau 7 ngày.
 */
const generateToken = (id) => {
  if (!process.env.JWT_SECRET) {
    const error = new Error('JWT_SECRET is not configured.');
    error.statusCode = 500;
    throw error;
  }

  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

/**
 * POST /api/auth/register
 * Tạo tài khoản mới.
 */
const register = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  // Validate input cơ bản
  if (!username || !email || !password) {
    const error = new Error('Username, email and password are required.');
    error.statusCode = 400;
    throw error;
  }

  // Kiểm tra trùng username/email trước khi tạo mới
  const existingUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existingUser) {
    const isUsernameTaken = existingUser.username === username;
    const error = new Error(isUsernameTaken ? 'Username already exists.' : 'Email already exists.');
    error.statusCode = 409;
    throw error;
  }

  // Password được hash tự động ở pre-save hook trong model
  const createdUser = await User.create({ username, email, password });

  res.status(201).json({
    success: true,
    message: 'Register successful.',
    data: {
      _id: createdUser._id,
      username: createdUser.username,
      email: createdUser.email,
      createdAt: createdUser.createdAt,
    },
  });
});

/**
 * POST /api/auth/login
 * Đăng nhập bằng username/email + password, trả JWT token khi thành công.
 */
const login = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  if ((!username && !email) || !password) {
    const error = new Error('Username (or email) and password are required.');
    error.statusCode = 400;
    throw error;
  }

  // Cần select password vì field này mặc định select: false trong model
  const user = await User.findOne({
    $or: [{ username }, { email }],
  }).select('+password');

  if (!user) {
    const error = new Error('Invalid email or password.');
    error.statusCode = 401;
    throw error;
  }

  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    const error = new Error('Invalid email or password.');
    error.statusCode = 401;
    throw error;
  }

  const token = generateToken(user._id);

  res.status(200).json({
    success: true,
    message: 'Login successful.',
    data: {
      _id: user._id,
      username: user.username,
      email: user.email,
      token,
      expiresIn: '7d',
    },
  });
});

module.exports = {
  register,
  login,
};
