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
  
    const start = new Date(startDate);
    const due = new Date(dueDate);
    const durationDays = Math.ceil((due - start) / (1000 * 60 * 60 * 24));
    const interest = (amount * interestRate * durationDays) / (100 * 365);
    const totalRepayable = amount + interest;
  
    const loan = new Loan({
      type,
      amount,
      interestRate,
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
  res.render("loan/show", { loan });
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
  
    const start = new Date(startDate);
    const due = new Date(dueDate);
    const durationDays = Math.ceil((due - start) / (1000 * 60 * 60 * 24));
    const interest = (amount * interestRate * durationDays) / (100 * 365);
    const totalRepayable = amount + interest;
  
    const loan = await Loan.findOne({ _id: id, owner: req.user._id });
    if (!loan) {
      req.flash("error", "Loan not found.");
      return res.redirect("/loan");
    }
  
    loan.type = type;
    loan.amount = amount;
    loan.interestRate = interestRate;
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