const User = require("../models/user.js");
const emailExistence = require("email-existence");
const util = require("util");
const checkEmail = util.promisify(emailExistence.check);
const questions = require("../utils/securityQuestions");

module.exports.renderSignupForm = (req, res) => {
  const randomIndex = Math.floor(Math.random() * questions.length);
  const question = questions[randomIndex];
  res.render("users/signup.ejs", { question });
};

module.exports.signup = async (req, res) => {
  try {
    let { username, email, password, securityQuestion, securityAnswer } = req.body;

    const emailFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailFormat.test(email)) {
      req.flash("error", "Please enter a valid email format (e.g., user@example.com)");
      return res.redirect("/signup");
    }

    const emailValid = await checkEmail(email);
    if (!emailValid) {
      req.flash("error", "Please enter a valid and existing email address.");
      return res.redirect("/signup");
    }

    const newUser = new User({ email, username, securityQuestion, securityAnswer });
    const registeredUser = await User.register(newUser, password);

    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "Welcome to expense tracker");
      res.redirect("/expenses");
    });

  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
  }
};

module.exports.renderLoginform =  (req,res)=>{
    res.render("users/login.ejs");
}

module.exports.login = async(req,res)=>{
        req.flash("success", "Welcome back to expense-tracker :). You are logged In");
        let redirectUrl = res.locals.redirectUrl || "/expenses";
        res.redirect(redirectUrl);
}
module.exports.logout =  (req,res,next)=>{
    req.logout((err)=>{
        if(err){
           return next(err);
        }
        req.flash("success", "you are logged out now");
        res.redirect("/expenses");
    })
}