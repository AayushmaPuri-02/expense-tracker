const Review = require("../models/review");
const Expense = require("../models/expense.js")
module.exports.createReview = async (req, res) => {
    const { comment, rating } = req.body.review;
    const review = new Review({
        comment,
        rating,
        author: req.user._id
    });
    await review.save();
    req.flash("success", "Thanks for your review!");
    res.redirect("/");
}

module.exports.destroyReviews =  async (req, res) => {
    const { id } = req.params;
    await Review.findByIdAndDelete(id);
    req.flash("info", "Review deleted.");
    res.redirect("/");
}