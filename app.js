const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Expense = require("./models/expense.js"); // Importing Expense model

const path = require("path"); // Require path module
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js")
const ExpressError = require("./utils/ExpressError.js")
const { expenseSchema } = require("./schema");
const { validateExpense } = require("./middleware/validateExpense");
const upload = require("./middleware/multer");

app.set("view engine", "ejs");  // Set EJS as the view engine
app.set("views", path.join(__dirname, "views")); // Set views folder
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

//connection for database.
const mongo_Url = "mongodb://127.0.0.1:27017/expense";
async function main() {
    await mongoose.connect(mongo_Url);
}
main().then(()=>{
    console.log(`connected sucessfully`);
}).catch((err)=>{
    console.log(err);
});

//api routes
// "/" route.
app.get("/", (req,res)=>{
    res.send("Hi. this is the root route")
})

//index route
// Index route - Show all expenses
app.get("/expenses", async (req, res) => {
    let allExpenses = await Expense.find({});
    let totalExpenses = allExpenses.reduce((sum, exp) => sum + exp.amount, 0); // Calculate total
    res.render("expenses/index.ejs", { allExpenses, totalExpenses });
});

// New Expense Form Route (GET)
app.get("/expenses/new", (req, res) => {
    res.render("expenses/new.ejs");
});

// Show route - Display details of a single expense
app.get("/expenses/:id", wrapAsync( async (req, res) => {
    let { id } = req.params;
    const expense = await Expense.findById(id);
    res.render("expenses/show.ejs", { expense });
}));
//+++++++++++++++++++++++++++++
// POST route
// app.post("/expenses", validateExpense, wrapAsync(async (req, res) => {
//     const newExpense = new Expense(req.body.expense);
//     await newExpense.save();
//     res.redirect("/expenses");
// }));
//++++++++++++++++++++++
app.post(
    "/expenses",
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
      res.redirect("/expenses");
    })
  );
//Edit route
app.get("/expenses/:id/edit", wrapAsync( async (req,res)=>{
    let { id } = req.params;
    const expense = await Expense.findById(id);
    res.render("expenses/edit.ejs",{expense});
}));


// UPDATE route
app.put("/expenses/:id", validateExpense, wrapAsync(async (req, res) => {
    let { id } = req.params;
    req.body.expense.date = new Date(); // updating date
    await Expense.findByIdAndUpdate(id, { ...req.body.expense });
    res.redirect(`/expenses/${id}`);
}));

//Delete route
app.delete("/expenses/:id",wrapAsync( async (req, res) => {
    let { id } = req.params;
   let deleted = await Expense.findByIdAndDelete(id);
   console.log(deleted);
    res.redirect("/expenses");
}));

// This should go at the end, AFTER all other routes
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page not found!"));
});

app.use((err,req,res,next)=>{
    let {statusCode = 500, message ="something went wrong"} = err;
    res.status(statusCode).render("error.ejs", {message});
    //res.status(statusCode).send(message);
})

// Test route to add an expense
// app.get("/testexpense", async (req, res) => {
//     let sampleExpense = new Expense({
//         title: "Groceries",
//         amount: 50,
//         category: "Food",
//         date: new Date(),
//         note: "Bought vegetables and fruits"
//     });
//     await sampleExpense.save();
//     console.log("Data saved to the database");
//     res.send("Expense added successfully");
// });

app.listen(8080, ()=>{
    console.log(`listening on port 8080`);
})