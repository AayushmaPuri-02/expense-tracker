if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Expense = require("./models/expense.js"); // Importing Expense model
///this is jsut smaple
const Review = require("./models/review");
const path = require("path"); // Require path module
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js")
const ExpressError = require("./utils/ExpressError.js")
const { expenseSchema } = require("./schema");
const { validateExpense } = require("./middleware/validateExpense");
const upload = require("./middleware/multer");
const Income = require("./models/income");
const loanRoutes = require("./routes/loan");
//routers
const expenses = require ("./routes/expense.js");
const userRouter = require("./routes/user.js");
const session = require("express-session");
const flash = require("connect-flash");
const incomeRoutes = require("./routes/income");
//authentication
const passport = require("passport"); //Passport is a middleware for authentication in Node.js.
const LocalStrategy = require("passport-local"); //You used passport-local strategy for local authentication (username + password).
const User = require("./models/user.js");

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


const sessionOptions = {
    secret : "mysecretcode" , 
    resave : false, 
    saveUninitialized : true,
    cookie :{
        expires : Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge:  7* 24 * 60 * 60 * 1000,
        httpOnly : true,
    },
}


app.use(session(sessionOptions));
app.use(flash());

//authetication
app.use(passport.initialize()) //a middleware that initializes passport
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate())); //all the users should be autheticated by LocalStrategy and autheticate method will be used.// Login handler
passport.serializeUser(User.serializeUser()); //storing users info in a session
passport.deserializeUser(User.deserializeUser());// Get user from session

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.info = req.flash("info");
    res.locals.danger = req.flash("danger");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
  });

  app.use("/loan", loanRoutes);
//review
const reviewRoutes = require("./routes/review")
app.use("/reviews", reviewRoutes);

//saving
const savingRoutes = require("./routes/saving");
app.use("/saving", savingRoutes);

app.use("/expenses", expenses);
app.use("/", userRouter);

app.use("/incomes", incomeRoutes);

const passwordResetRoutes = require("./routes/passwordReset");
app.use("/", passwordResetRoutes);

app.use((err, req, res, next) => {
  if (err.code === "LIMIT_FILE_SIZE") {
    req.flash("error", "File too large! Please upload a file under 2MB.");
    return res.redirect("back"); // ✅ redirects to the page the user came from
  }

  let { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).render("error.ejs", { message });
});

  //added jsut now
  app.get("/", async (req, res, next) => {
    try {
      const reviews = await Review.find({}).populate("author");
  
      let income = null;
      let totalIncome = 0;
      let totalExpenses = 0;
  
      if (req.user) {
        const user = await User.findById(req.user._id);
  
        // Income object (monthly, weekly, daily)
        if (typeof user.income === "object") {
          income = user.income;
        } else if (typeof user.income === "number") {
          income = { monthly: user.income };
        }
  
        const incomeRecords = await Income.find({ owner: req.user._id });
        totalIncome = incomeRecords.reduce((sum, inc) => sum + inc.amount, 0);
  
        const expenseRecords = await Expense.find({ owner: req.user._id });
        totalExpenses = expenseRecords.reduce((sum, exp) => sum + exp.amount, 0);
      }
  
      res.render("expenses/home.ejs", { reviews, income, totalIncome, totalExpenses });
  
    } catch (err) {
      console.error("Homepage crash:", err);
      next(err);
    }
  });
//old one
//   app.get("/", async (req, res) => {
//     const reviews = await Review.find({}).populate("author");
//     let income = null;
//     if (req.user) {
//         const user = await User.findById(req.user._id);
//         income = user.income;
//     }
//     res.render("expenses/home.ejs", { reviews, income });
// });


// This should go at the end, AFTER all other routes
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page not found!"));
});

app.listen(8080, ()=>{
    console.log(`listening on port 8080`);
})