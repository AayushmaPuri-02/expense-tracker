// controllers/loan.js
const Loan = require("../models/loan");

// View all loans
module.exports.index = async (req, res) => {
  const loans = await Loan.find({ owner: req.user._id });
  res.render("loan/index", { loans });
};

// Render new loan form
module.exports.renderNewForm = (req, res) => {
  res.render("loan/new");
};

// Create new loan
module.exports.createLoan = async (req, res) => {
    const {
      type,
      amount,
      interestRate,
      startDate,
      dueDate,
      party,
      notes
    } = req.body.loan;
  
    // Convert string to number
    const amountNum = parseFloat(amount);
    const interestRateNum = parseFloat(interestRate);
  
    const start = new Date(startDate);
    const due = new Date(dueDate);
    const durationDays = Math.ceil((due - start) / (1000 * 60 * 60 * 24));
  
    const interest = parseFloat(((amountNum * interestRateNum * durationDays) / (100 * 365)).toFixed(2));
    const totalRepayable = parseFloat((amountNum + interest).toFixed(2));
  
    const loan = new Loan({
      type,
      amount: amountNum,
      interestRate: interestRateNum,
      startDate: start,
      dueDate: due,
      totalInterest: interest,
      totalRepayable,
      party,
      notes,
      owner: req.user._id
    });
  
    if (req.file) {
      console.log("File uploaded:", req.file);
      loan.document = {
        url: req.file.path,
        filename: req.file.filename,
        mimetype: req.file.mimetype
      };
    }
  
    await loan.save();
    req.flash("success", "Loan record added.");
    res.redirect("/loan");
  };
  
// Show a specific loan
module.exports.showLoan = async (req, res) => {
    const loan = await Loan.findOne({ _id: req.params.id, owner: req.user._id });
    if (!loan) {
      req.flash("error", "Loan not found.");
      return res.redirect("/loan");
    }
  
    const durationDays = Math.ceil(
      (loan.dueDate - loan.startDate) / (1000 * 60 * 60 * 24)
    );
  
    const monthlyInterest = parseFloat(
      (loan.totalInterest / (durationDays / 30)).toFixed(2)
    );
  
    res.render("loan/show", { loan, durationDays, monthlyInterest }); // ⬅️ pass both
  };
// Render edit form
module.exports.renderEditForm = async (req, res) => {
  const loan = await Loan.findOne({ _id: req.params.id, owner: req.user._id });
  if (!loan) {
    req.flash("error", "Loan not found.");
    return res.redirect("/loan");
  }
  res.render("loan/edit", { loan });
};

// Update loan
module.exports.updateLoan = async (req, res) => {
    const { id } = req.params;
  
    const {
      type,
      amount,
      interestRate,
      startDate,
      dueDate,
      party,
      notes,
      status
    } = req.body.loan;
  
    const amountNum = parseFloat(amount);
    const interestRateNum = parseFloat(interestRate);
  
    const start = new Date(startDate);
    const due = new Date(dueDate);
    const durationDays = Math.ceil((due - start) / (1000 * 60 * 60 * 24));
  
    const interest = parseFloat(((amountNum * interestRateNum * durationDays) / (100 * 365)).toFixed(2));
    const totalRepayable = parseFloat((amountNum + interest).toFixed(2));
  
    const loan = await Loan.findOne({ _id: id, owner: req.user._id });
    if (!loan) {
      req.flash("error", "Loan not found.");
      return res.redirect("/loan");
    }
  
    loan.type = type;
    loan.amount = amountNum;
    loan.interestRate = interestRateNum;
    loan.startDate = start;
    loan.dueDate = due;
    loan.totalInterest = interest;
    loan.totalRepayable = totalRepayable;
    loan.party = party;
    loan.notes = notes;
    loan.status = status;
  
    if (req.file) {
      console.log("File uploaded:", req.file);
      loan.document = {
        url: req.file.path,
        filename: req.file.filename,
        mimetype: req.file.mimetype
      };
    }
  
    await loan.save();
    req.flash("success", "Loan updated.");
    res.redirect(`/loan/${id}`);
  };

// Delete loan
module.exports.deleteLoan = async (req, res) => {
  await Loan.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
  req.flash("success", "Loan deleted.");
  res.redirect("/loan");
};