const axios = require('axios');
const asyncHandler = require('../middleware/asyncHandler');

/**
 * Tạo axios client riêng cho OPhim:
 * - baseURL rõ ràng để tái sử dụng
 * - timeout để tránh treo request quá lâu
 */
const ophimClient = axios.create({
  baseURL: 'https://ophim1.com',
  timeout: 10000,
});

/**
 * Helper chuẩn hóa lỗi từ upstream API.
 */
const buildUpstreamError = (message, fallbackStatusCode = 502) => {
  const error = new Error(message);
  error.statusCode = fallbackStatusCode;
  return error;
};

/**
 * GET /api/phim-moi
 * Gọi API phim mới cập nhật từ OPhim và trả JSON về frontend.
 */
const getLatestMovies = asyncHandler(async (req, res) => {
  try {
    const response = await ophimClient.get('/danh-sach/phim-moi-cap-nhat?page=1');

    return res.status(200).json({
      success: true,
      data: response.data,
    });
  } catch (err) {
    const statusCode = err.response?.status || 502;
    throw buildUpstreamError('Failed to fetch latest movies from upstream API.', statusCode);
  }
});

/**
 * GET /api/phim/:slug
 * Gọi API chi tiết phim theo slug từ OPhim và trả JSON về frontend.
 */
const getMovieDetailBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  if (!slug || typeof slug !== 'string' || !slug.trim()) {
    const error = new Error('Slug is required.');
    error.statusCode = 400;
    throw error;
  }

  try {
    const response = await ophimClient.get(`/phim/${encodeURIComponent(slug.trim())}`);

    return res.status(200).json({
      success: true,
      data: response.data,
    });
  } catch (err) {
    const upstreamStatus = err.response?.status;

    if (upstreamStatus === 404) {
      const notFoundError = new Error('Movie not found.');
      notFoundError.statusCode = 404;
      throw notFoundError;
    }

    throw buildUpstreamError('Failed to fetch movie detail from upstream API.', upstreamStatus || 502);
  }
});

module.exports = {
  getLatestMovies,
  getMovieDetailBySlug,
};
