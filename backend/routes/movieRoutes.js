const express = require('express');
const { getLatestMovies, getMovieDetailBySlug } = require('../controllers/movieController');

const router = express.Router();

/**
 * Route phim public:
 * - GET /api/phim-moi
 * - GET /api/phim/:slug
 */
router.get('/phim-moi', getLatestMovies);
router.get('/phim/:slug', getMovieDetailBySlug);

module.exports = router;
