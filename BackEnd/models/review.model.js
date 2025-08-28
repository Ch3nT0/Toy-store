const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  productId: String,
  userId: String,
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: String,
  createdAt: { type: Date, default: Date.now }
});

const Review = mongoose.model('Review', reviewSchema, 'reviews');
module.exports = Review;