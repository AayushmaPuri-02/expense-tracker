const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { expenseSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const { validateExpense } = require("../middleware/validateExpense");
const Expense = require("../models/expense.js"); // Importing Expense model
const upload = require("../middleware/multer.js");

// Index route - Show all expenses
router.get("/", async (req, res) => {
    let allExpenses = await Expense.find({});
    let totalExpenses = allExpenses.reduce((sum, exp) => sum + exp.amount, 0); // Calculate total
    res.render("expenses/index.ejs", { allExpenses, totalExpenses });
});

// New Expense Form Route (GET)
router.get("/new", (req, res) => {
    res.render("expenses/new.ejs");
});

// Show route - Display details of a single expense
router.get("/:id", wrapAsync( async (req, res) => {
    let { id } = req.params;
    const expense = await Expense.findById(id);
    if(!expense){
        req.flash("error", "the expense you requested does not exist");
        res.redirect("/expenses");
    }
    res.render("expenses/show.ejs", { expense });
}));

//CREATE ROUTE
router.post(
    "/",
    upload.single("image"),       // handle image upload from <input name="image">
    validateExpense,              // validate fields like title, amount, etc.
    wrapAsync(async (req, res, next) => {
      let imagePath;
  
      // If user uploaded an image, use it. Else, use default from category
      if (req.file) {
        imagePath = "/uploads/" + req.file.filename; // accessible from public folder
      } else {
        // Fallback: Use default category image (already handled in schema)
        imagePath = undefined;
      }
  
      const expenseData = req.body.expense;
      if (imagePath) {
        expenseData.image = imagePath;
      }
  
      const newExpense = new Expense(expenseData);
      await newExpense.save();
      req.flash("success", "New expense added in the list");
      res.redirect("/expenses");
    })
  );
//Edit route
router.get("/:id/edit", wrapAsync( async (req,res)=>{
    let { id } = req.params;
    const expense = await Expense.findById(id);
    if(!expense){
        req.flash("error", "the expense you requested does not exist");
        res.redirect("/expenses");
    }
    res.render("expenses/edit.ejs",{expense});
}));


// UPDATE route
router.put("/:id", validateExpense, wrapAsync(async (req, res) => {
    let { id } = req.params;
    req.body.expense.date = new Date(); // updating date
    await Expense.findByIdAndUpdate(id, { ...req.body.expense });
    req.flash("info", " Expense updated successfully ");
    res.redirect(`/expenses/${id}`);
}));

//Delete route
router.delete("/:id",wrapAsync( async (req, res) => {
    let { id } = req.params;
   let deleted = await Expense.findByIdAndDelete(id);
   console.log(deleted);
   req.flash("danger", " Expense deleted ");
    res.redirect("/expenses");
}));

module.exports = router;