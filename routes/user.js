const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user.js");
const {saveRedirectUrl}  = require("../middleware/isLoggedIn.js");
const wrapAsync = require("../utils/wrapAsync");
router.get("/signup", (req,res)=>{
    res.render("users/signup.ejs");
})

router.post("/signup", wrapAsync( async(req,res)=>{
    try{
        let {username, email, password} = req.body;
        const newUser = new User({email, username});
        const registredUser=  await User.register(newUser, password);
        console.log(registredUser);
        req.login(registredUser, (err)=>{
            if(err){
                return next(err);
            }
            req.flash("success", "Welcome to expense tracker");
            res.redirect("/expenses");
        })
       
    }catch(e){
        req.flash("error", e.message);
        res.redirect("/signup");
    }

}));

//login
router.get("/login", (req,res)=>{
    res.render("users/login.ejs");
})
router.post("/login", saveRedirectUrl,  passport.authenticate("local",
     {failureRedirect : '/login' , failureFlash : true}), 
     async(req,res)=>{
        req.flash("success", "Welcome back to expense-tracker :). You are logged In");
        let redirectUrl = res.locals.redirectUrl || "/expenses";
        res.redirect(redirectUrl);
})

//logout
router.get("/logout", (req,res,next)=>{
    req.logout((err)=>{
        if(err){
           return next(err);
        }
        req.flash("success", "you are logged out now");
        res.redirect("/expenses");
    })
})
module.exports = router;