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

 
module.exports = router;