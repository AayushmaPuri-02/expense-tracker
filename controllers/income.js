const Income = require("../models/income");

module.exports.renderNewForm = (req, res) => {
  res.render("income/new.ejs");
};

module.exports.createIncome = async (req, res) => {
  const { amount, category, type, note } = req.body.income;

  const newIncome = new Income({
    amount,
    category,
    type,
    note,
    owner: req.user._id
  });

  await newIncome.save();
  req.flash("success", "Income added successfully!");
  res.redirect("/incomes");
};