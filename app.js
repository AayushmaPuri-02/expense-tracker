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
//routers
const expenses = require ("./routes/expense.js");
const userRouter = require("./routes/user.js");
const session = require("express-session");
const flash = require("connect-flash");
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


  //thsi is demo for the application of authentication
//   app.get("/demouser", async (req,res)=>{
//     let fakeUser = new User({
//         email : "demouser12@gmail.com",
//         username : "Lizzy"
//     });
//     let registredUser = await User.register(fakeUser,"helloworld");
//     res.send(registredUser);
//   })
// app.use((req,res,next)=>{
//     res.locals.success = req.flash("success");
//     console.log(res.locals.success);
// next();
// })
app.use("/expenses", expenses);
app.use("/", userRouter);


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

// Homepage route (GET /)
app.get("/", (req, res) => {
    if (!req.isAuthenticated()) {
        return res.render("expenses/home.ejs");  // This is your marketing home page
    }
    res.redirect("/expenses"); // Already logged in? Go to expenses
});
// This should go at the end, AFTER all other routes
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page not found!"));
});

app.listen(8080, ()=>{
    console.log(`listening on port 8080`);
})