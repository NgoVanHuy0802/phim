/**
 * Middleware xử lý lỗi tập trung.
 * Chuẩn hóa response lỗi để frontend dễ xử lý.
 */
const errorHandler = (err, req, res, next) => {
  // eslint-disable-next-line no-unused-vars
  const _next = next;

  const statusCode = err.statusCode || 500;

  // eslint-disable-next-line no-console
  console.error('[ERROR]', {
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
    path: req.originalUrl,
    method: req.method,
  });

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
};

module.exports = errorHandler;
