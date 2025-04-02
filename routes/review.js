const express = require("express");
const router = express.Router();
const Review = require("../models/review");
const { isLoggedIn, isReviewAuthor } = require("../middleware/isLoggedIn"); // You'll create `isReviewAuthor`
const reviewController = require("../controllers/review.js");
// Create Review
router.post("/", isLoggedIn, reviewController.createReview);

// Delete Review
router.delete("/:id", isLoggedIn, isReviewAuthor, reviewController.destroyReviews);

module.exports = router;