/**
 * Wrapper cho async route handlers để tự động forward lỗi qua next().
 */
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

module.exports = asyncHandler;
