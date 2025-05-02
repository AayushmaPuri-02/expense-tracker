// routes/saving.js
const express = require("express");
const router = express.Router();
const SavingGoal = require("../models/savingGoal");
const { isLoggedIn } = require("../middleware/isLoggedIn");
const wrapAsync = require("../utils/wrapAsync");

// View all saving goals
router.get("/", isLoggedIn, wrapAsync(async (req, res) => {
    const savingGoals = await SavingGoal.find({ owner: req.user._id });
    res.render("saving/index", { savings: savingGoals }); // 👈 Fixed variable name
  }));

// Form to add new saving goal
router.get("/new", isLoggedIn, (req, res) => {
  res.render("saving/new");
});

// Create saving goal
router.post("/", isLoggedIn, wrapAsync(async (req, res) => {
  const { goalAmount, goalReason, targetDate } = req.body.saving;
  const newGoal = new SavingGoal({
    goalAmount,
    goalReason,
    targetDate,
    owner: req.user._id
  });
  await newGoal.save();
  req.flash("success", "Saving goal created!");
  res.redirect("/saving");
}));

// Show single saving goal
router.get("/:id", isLoggedIn, wrapAsync(async (req, res) => {
  const goal = await SavingGoal.findOne({ _id: req.params.id, owner: req.user._id });
  if (!goal) {
    req.flash("error", "Saving goal not found!");
    return res.redirect("/saving");
  }
  res.render("saving/show", { savingGoal: goal });
}));

// Edit form
router.get("/:id/edit", isLoggedIn, wrapAsync(async (req, res) => {
  const goal = await SavingGoal.findOne({ _id: req.params.id, owner: req.user._id });
  if (!goal) {
    req.flash("error", "Saving goal not found!");
    return res.redirect("/saving");
  }
  res.render("saving/edit", { savingGoal: goal });
}));

// Update goal
router.put("/:id", isLoggedIn, wrapAsync(async (req, res) => {
  const { goalAmount, goalReason, targetDate } = req.body.saving;
  await SavingGoal.findOneAndUpdate(
    { _id: req.params.id, owner: req.user._id },
    { goalAmount, goalReason, targetDate }
  );
  req.flash("success", "Saving goal updated!");
  res.redirect("/saving");
}));

// Delete goal
router.delete("/:id", isLoggedIn, wrapAsync(async (req, res) => {
  await SavingGoal.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
  req.flash("success", "Saving goal deleted.");
  res.redirect("/saving");
}));

module.exports = router;