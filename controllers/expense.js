const Income = require("../models/income"); // make sure this is at the top

const Expense = require("../models/expense.js")

//this section contains the logic that finds the expenses of that specific user and calculates the expense and renders the index.ejs file which is the first file we view, which shows all the expenses and cateegory.
module.exports.index = async (req, res) => {
  const allExpenses = await Expense.find({ owner: req.user._id });   // Find all expenses that belong to the currently logged-in user
  const totalExpenses = allExpenses.reduce((sum, exp) => sum + exp.amount, 0);     // Calculate the total amount of all expenses

  // Prepare category-wise summary
  const categorySummary = {};
  allExpenses.forEach((exp) => {
    if (categorySummary[exp.category]) {
      categorySummary[exp.category] += exp.amount;
    } else {
      categorySummary[exp.category] = exp.amount;
    }
  });
  const incomes = await Income.find({ owner: req.user._id });
  const totalIncome = incomes.reduce((sum, inc) => sum + inc.amount, 0);  // ✅ Add this
   // Render the index page with the data
  res.render("expenses/index.ejs", {  
    allExpenses,
    totalExpenses,
    categorySummary,
    incomes,
    totalIncome  
  });
};

//the part of the code rendres a form to add the new expenses
  module.exports.renderNewForm =  (req, res) => {
    res.render("expenses/new.ejs");
}


// Show details of a specific expense,
module.exports.showExpenses = async (req, res) => {
    let { id } = req.params;
    const expense = await Expense.findById(id).populate( {
      path : "reviews",
      populate:{
        path : "author",
      },
    }).populate("owner");
    if(!expense){
        req.flash("error", "the expense you requested does not exist");
        res.redirect("/expenses");
    }
    console.log(expense);
    res.render("expenses/show.ejs", { expense });
}

// Create a new expense and save it to the database
module.exports.createExpense = async (req, res, next) => {
  const expenseData = req.body.expense;
  const newExpense = new Expense(expenseData);
  newExpense.owner = req.user._id;
 // If an image is uploaded, save it
  if (req.file) {
    newExpense.image = {
      url: req.file.path,
      filename: req.file.filename
    };
  }

  await newExpense.save();

  req.flash("success", "New expense added in the list");
  res.redirect("/expenses");
};

// Render form to edit an existing expense
  module.exports.renderEditForm = async (req,res)=>{
    let { id } = req.params;
    const expense = await Expense.findById(id);
    if(!expense){
        req.flash("error", "the expense you requested does not exist");
        res.redirect("/expenses");
    }
      // Resize image preview for the edit form
   let origianlImgUrl = expense.image.url;
   origianlImgUrl = origianlImgUrl.replace("/upload","/upload/h_300,w_250");
    res.render("expenses/edit.ejs",{expense , origianlImgUrl});
}

//update route
module.exports.updateExpense = async (req, res) => {
  const { id } = req.params;

  // Update the date to the current time
  req.body.expense.date = new Date();

  // Find the expense
  const expense = await Expense.findById(id);

  // Update all fields
  expense.title = req.body.expense.title;
  expense.amount = req.body.expense.amount;
  expense.category = req.body.expense.category;
  expense.note = req.body.expense.note;
  expense.date = req.body.expense.date;

  // If a new image is uploaded, replace the old one
  if (req.file) {
    expense.image = {
      url: req.file.path,
      filename: req.file.filename
    };
  }

  await expense.save();
  req.flash("info", "Expense updated successfully");
  res.redirect(`/expenses/${id}`);
};
// Delete a specific expense
  module.exports.destroyExpense = async (req, res) => {
    let { id } = req.params;
   let deleted = await Expense.findByIdAndDelete(id);
   console.log(deleted);
   req.flash("danger", " Expense deleted ");
    res.redirect("/expenses");
}