const Income = require("../models/income");

module.exports.renderNewForm = (req, res) => {
  res.render("income/new.ejs");
};

module.exports.createIncome = async (req, res) => {
  const { amount, category, sourceDesc, note } = req.body.income;

  const newIncome = new Income({
    amount,
    category,
    sourceDesc,
    note,
    owner: req.user._id
  });

  // ✅ Add this block to store uploaded receipt if it exists
  if (req.file) {
    newIncome.receipt = {
      url: req.file.path,
      filename: req.file.filename
    };
  }

  await newIncome.save();
  req.flash("success", "Income added successfully!");
  res.redirect("/expenses");
};