const User = require("../models/user.js");

module.exports.renderSignupForm = (req, res) => {
  res.render("users/signup.ejs"); // remove question
};

module.exports.signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const emailFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailFormat.test(email)) {
      req.flash("error", "Please enter a valid email format (e.g., user@example.com)");
      return res.redirect("/signup");
    }

    const newUser = new User({ email, username });
    const registeredUser = await User.register(newUser, password);

    req.login(registeredUser, (err) => {
      if (err) return next(err);
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