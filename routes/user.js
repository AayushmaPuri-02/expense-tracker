const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user.js");
const {saveRedirectUrl}  = require("../middleware/isLoggedIn.js");
const wrapAsync = require("../utils/wrapAsync");
const userController = require("../controllers/user.js")
const { isLoggedIn } = require("../middleware/isLoggedIn");

router.route("/signup")
.get(userController.renderSignupForm)
.post( wrapAsync(userController.signup ));

router.route("/login")
.get(userController.renderLoginform)
.post(saveRedirectUrl,  passport.authenticate("local",
    {failureRedirect : '/login' , failureFlash : true}), 
    userController.login)

    
//logout
router.get("/logout", userController.logout)

// Show income input form
// router.get("/set-income", isLoggedIn, async (req, res) => {
//     const user = await User.findById(req.user._id);
//     res.render("users/setIncome.ejs", { user });
// });
// router.post("/set-income", isLoggedIn, async (req, res) => {
//     const { income } = req.body; // income = { daily, weekly, monthly }
  
//     await User.findByIdAndUpdate(req.user._id, { income });
//     req.flash("success", "Income updated!");
//     res.redirect("/expenses");
//   });
 
module.exports = router;