const mongoose = require('mongoose');

/**
 * Favorite movie của user.
 * Mỗi user chỉ lưu 1 lần cho mỗi slug.
 */
const favoriteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    slug: {
      type: String,
      required: [true, 'Movie slug is required'],
      trim: true,
    },
    name: {
      type: String,
      required: [true, 'Movie name is required'],
      trim: true,
    },
    poster_url: {
      type: String,
      default: '',
      trim: true,
    },
    thumb_url: {
      type: String,
      default: '',
      trim: true,
    },
    year: {
      type: Number,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

favoriteSchema.index({ user: 1, slug: 1 }, { unique: true });

module.exports = mongoose.model('Favorite', favoriteSchema);
