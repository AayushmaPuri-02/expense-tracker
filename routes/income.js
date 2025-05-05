// routes/income.js
const express = require("express");
const Papa = require("papaparse");
const router = express.Router();
const Income = require("../models/income");
const Expense = require("../models/expense");
const SavingGoal = require("../models/savingGoal");
const Loan = require("../models/loan");
const { isLoggedIn } = require("../middleware/isLoggedIn");
const wrapAsync = require("../utils/wrapAsync");
const incomeController = require("../controllers/income");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });




router.get("/", isLoggedIn, async (req, res) => {
  const userId = req.user._id;
  const user = req.user;

  const incomes = await Income.find({ owner: userId });
  const expenses = await Expense.find({ owner: userId });
  const loans = await Loan.find({ owner: userId });
  const savingGoals = await SavingGoal.find({ owner: userId });

  const totalIncome = incomes.reduce((sum, inc) => sum + inc.amount, 0);
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  const totalLent = loans
    .filter((loan) => loan.type === "lent")
    .reduce((sum, loan) => sum + loan.amount, 0);

  const totalBorrowed = loans
    .filter((loan) => loan.type === "borrowed")
    .reduce((sum, loan) => sum + loan.amount, 0);

  const totalSavingGoal = savingGoals.reduce((sum, goal) => sum + goal.amount, 0);

  res.render("expenses/home", {
    currUser: user,
    totalIncome,
    totalExpenses,
    totalLent,
    totalBorrowed,
    totalSavingGoal
  });
});

// Form to add new income
router.get("/new", isLoggedIn, (req, res) => {
  res.render("income/new");
});


// Add new income with file upload
router.post("/", isLoggedIn, upload.single("receipt"), wrapAsync(incomeController.createIncome));
// Form to edit income
router.get("/:id/edit", isLoggedIn, wrapAsync(async (req, res) => {
  const income = await Income.findOne({ _id: req.params.id, owner: req.user._id });
  if (!income) {
    req.flash("error", "Income not found");
    return res.redirect("/incomes");
  }
  res.render("income/edit", { income });
}));

// Download income records as CSV
// Download income records as CSV
router.get("/download", isLoggedIn, wrapAsync(async (req, res) => {
  const incomes = await Income.find({ owner: req.user._id }).lean();

  // Map and format data to include receipt URL safely
  const csvData = incomes.map(income => ({
    amount: income.amount,
    category: income.category,
    sourceDesc: income.sourceDesc,
    note: income.note,
    addedAt: income.addedAt,
    receiptUrl: income.receipt?.url || "—"
  }));

  const csv = Papa.unparse(csvData, {
    columns: ["amount", "category", "sourceDesc", "note", "addedAt", "receiptUrl"]
  });

  res.header("Content-Type", "text/csv");
  res.attachment("income-records.csv");
  res.send(csv);
}));

// Update income
router.put("/:id", isLoggedIn, upload.single("receipt"), wrapAsync(async (req, res) => {
  const { amount, category, note, sourceDesc } = req.body.income;
  const updateData = { amount, category, note, sourceDesc };

  // if receipt is re-uploaded
  if (req.file) {
    updateData.receipt = {
      url: req.file.path,
      filename: req.file.filename
    };
  }

  await Income.findOneAndUpdate(
    { _id: req.params.id, owner: req.user._id },
    updateData
  );

  req.flash("success", "Income updated!");
  res.redirect(`/incomes/${req.params.id}`);
}));


// Show single income
router.get("/:id", isLoggedIn, wrapAsync(async (req, res) => {
  const income = await Income.findOne({ _id: req.params.id, owner: req.user._id });
  if (!income) {
    req.flash("error", "Income not found");
    return res.redirect("/incomes");
  }
  res.render("income/show", { income });
}));

// Delete income
router.delete("/:id", isLoggedIn, wrapAsync(async (req, res) => {
  await Income.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
  req.flash("success", "Income deleted!");
  res.redirect("/expenses");
}));


module.exports = router;