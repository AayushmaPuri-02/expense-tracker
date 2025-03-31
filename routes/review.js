const express = require("express");
const router = express.Router();
const Review = require("../models/review");
const { isLoggedIn, isReviewAuthor } = require("../middleware/isLoggedIn"); // You'll create `isReviewAuthor`

// Create Review
router.post("/", isLoggedIn, async (req, res) => {
    const { comment, rating } = req.body.review;
    const review = new Review({
        comment,
        rating,
        author: req.user._id
    });
    await review.save();
    req.flash("success", "Thanks for your review!");
    res.redirect("/");
});

// Delete Review
router.delete("/:id", isLoggedIn, isReviewAuthor, async (req, res) => {
    const { id } = req.params;
    await Review.findByIdAndDelete(id);
    req.flash("info", "Review deleted.");
    res.redirect("/");
});

module.exports = router;