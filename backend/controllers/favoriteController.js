const Favorite = require('../models/Favorite');
const asyncHandler = require('../middleware/asyncHandler');

/**
 * POST /api/favorites
 * Lưu phim yêu thích theo user đăng nhập.
 */
const addFavorite = asyncHandler(async (req, res) => {
  const { slug, name, poster_url, thumb_url, year } = req.body;

  if (!slug || !name) {
    const error = new Error('slug and name are required.');
    error.statusCode = 400;
    throw error;
  }

  const favorite = await Favorite.findOneAndUpdate(
    { user: req.user._id, slug },
    {
      $setOnInsert: {
        user: req.user._id,
        slug,
        name,
        poster_url: poster_url || '',
        thumb_url: thumb_url || '',
        year: Number.isFinite(Number(year)) ? Number(year) : null,
      },
    },
    { upsert: true, new: true }
  );

  res.status(201).json({
    success: true,
    message: 'Saved to favorites.',
    data: favorite,
  });
});

/**
 * GET /api/favorites
 * Lấy danh sách phim yêu thích của user.
 */
const getFavorites = asyncHandler(async (req, res) => {
  const favorites = await Favorite.find({ user: req.user._id }).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    data: favorites,
  });
});

module.exports = {
  addFavorite,
  getFavorites,
};
