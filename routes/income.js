// routes/income.js
const express = require("express");
const router = express.Router();
const Income = require("../models/income");
const { isLoggedIn } = require("../middleware/isLoggedIn");
const wrapAsync = require("../utils/wrapAsync");
const incomeController = require("../controllers/income");

// Show all income entries for current user
router.get("/", isLoggedIn, wrapAsync(async (req, res) => {
  const incomes = await Income.find({ owner: req.user._id });
  res.render("income/index", { incomes });
}));

// Form to add new income
router.get("/new", isLoggedIn, (req, res) => {
  res.render("income/new");
});

// Add new income
router.post("/", isLoggedIn, wrapAsync(async (req, res) => {
  const { amount, category, note } = req.body.income;
  const newIncome = new Income({ amount, category, note, owner: req.user._id });
  await newIncome.save();
  req.flash("success", "Income added!");
  res.redirect("/incomes");
}));

// Form to edit income
router.get("/:id/edit", isLoggedIn, wrapAsync(async (req, res) => {
  const income = await Income.findOne({ _id: req.params.id, owner: req.user._id });
  if (!income) {
    req.flash("error", "Income not found");
    return res.redirect("/incomes");
  }
  res.render("income/edit", { income });
}));

// Update income
router.put("/:id", isLoggedIn, wrapAsync(async (req, res) => {
  const { amount, category, note } = req.body.income;
  await Income.findOneAndUpdate(
    { _id: req.params.id, owner: req.user._id },
    { amount, category, note }
  );
  req.flash("success", "Income updated!");
  res.redirect("/incomes");
}));

// Delete income
router.delete("/:id", isLoggedIn, wrapAsync(async (req, res) => {
  await Income.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
  req.flash("success", "Income deleted!");
  res.redirect("/incomes");
}));

module.exports = router;