const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('./asyncHandler');

/**
 * Middleware bảo vệ route bằng JWT.
 *
 * Chức năng:
 * - Đọc token từ header Authorization theo format: `Bearer <token>`
 * - Xác thực token bằng JWT secret
 * - Gắn thông tin user vào `req.user` nếu hợp lệ
 * - Trả lỗi 401 nếu token thiếu/không hợp lệ/hết hạn
 */
const protect = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  // 1) Kiểm tra format Authorization header
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    const error = new Error('Unauthorized: missing or invalid Authorization header.');
    error.statusCode = 401;
    throw error;
  }

  const token = authHeader.split(' ')[1];

  // 2) Kiểm tra biến môi trường dùng để verify JWT
  if (!process.env.JWT_SECRET) {
    const error = new Error('Server configuration error: JWT_SECRET is missing.');
    error.statusCode = 500;
    throw error;
  }

  let decoded;

  // 3) Xác thực token
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch (_err) {
    const error = new Error('Unauthorized: token is invalid or expired.');
    error.statusCode = 401;
    throw error;
  }

  // 4) Kiểm tra user còn tồn tại trong hệ thống
  const user = await User.findById(decoded.id).select('-password');
  if (!user) {
    const error = new Error('Unauthorized: user no longer exists.');
    error.statusCode = 401;
    throw error;
  }

  // 5) Cho phép truy cập
  req.user = user;
  next();
});

module.exports = { protect };
