const Expense = require("../models/expense.js")

module.exports.index =  async (req, res) => {
    const allExpenses = await Expense.find({ owner: req.user._id });
    const totalExpenses = allExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    res.render("expenses/index.ejs", { allExpenses, totalExpenses });
  }

  module.exports.renderNewForm =  (req, res) => {
    res.render("expenses/new.ejs");
}

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


module.exports.createExpense = async (req, res, next) => {
  const expenseData = req.body.expense;
  const newExpense = new Expense(expenseData);
  newExpense.owner = req.user._id;

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

// module.exports.createExpense = async (req, res, next) => {
//     // let imagePath;
// let url = req.file.path;
// let filename = req.file.filename;
//     // If user uploaded an image, use it. Else, use default from category
//     if (req.file) {
//       imagePath = "/uploads/" + req.file.filename; // accessible from public folder
//     } else {
//       // Fallback: Use default category image (already handled in schema)
//       imagePath = undefined;
//     }

//     const expenseData = req.body.expense;
//     if (imagePath) {
//       expenseData.image = imagePath;
//     }

//     const newExpense = new Expense(expenseData);
//     newExpense.owner = req.user._id;
//     newExpense.image ={url,filename};
//     await newExpense.save();

//     req.flash("success", "New expense added in the list");
//     res.redirect("/expenses");
//   }

  module.exports.renderEditForm = async (req,res)=>{
    let { id } = req.params;
    const expense = await Expense.findById(id);
    if(!expense){
        req.flash("error", "the expense you requested does not exist");
        res.redirect("/expenses");
    }
    res.render("expenses/edit.ejs",{expense});
}

module.exports.updateExpense = async (req, res) => {
    let { id } = req.params;
    req.body.expense.date = new Date();
    await Expense.findByIdAndUpdate(id, { ...req.body.expense });
    req.flash("info", "Expense updated successfully");
    res.redirect(`/expenses/${id}`);
  }

  module.exports.destroyExpense = async (req, res) => {
    let { id } = req.params;
   let deleted = await Expense.findByIdAndDelete(id);
   console.log(deleted);
   req.flash("danger", " Expense deleted ");
    res.redirect("/expenses");
}