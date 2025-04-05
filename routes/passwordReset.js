const express = require("express");
const router = express.Router();
const User = require("../models/user");

// Show "forgot password" form
router.get("/forgot", (req, res) => {
  res.render("users/forgot.ejs");
});

// Handle email input and show security question
router.post("/forgot", async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    req.flash("error", "No user with that email found.");
    return res.redirect("/forgot");
  }

  // ✅ Render page with email and security question
  res.render("users/answerSecurity.ejs", {
    email: user.email,
    securityQuestion: user.securityQuestion
  });
});

router.post("/verify-security", async (req, res) => {
    const { email, answer } = req.body;
    const user = await User.findOne({ email });
  
    // Prevent crash by checking if values exist first
    if (!user || !user.securityAnswer || !answer) {
      req.flash("error", "Missing information or invalid user.");
      return res.redirect("/forgot");
    }
  
    // Compare in lowercase for case-insensitive match
    if (user.securityAnswer.toLowerCase() !== answer.toLowerCase()) {
      req.flash("error", "Incorrect answer. Please try again.");
      return res.redirect("/forgot");
    }
  
    // ✅ If everything is correct, show reset form
    req.session.resetUserId = user._id;
    res.redirect("/reset-password");
  });

// Handle new password submission
router.post("/reset-password", async (req, res, next) => {
    const { password } = req.body;
  
    const userId = req.session.resetUserId;
    if (!userId) {
      req.flash("error", "Session expired.");
      return res.redirect("/forgot");
    }
  
    const user = await User.findById(userId);
    if (!user) {
      req.flash("error", "User not found.");
      return res.redirect("/forgot");
    }
  
    await user.setPassword(password);
    await user.save();
  
    // Clear session
    req.session.resetUserId = null;
  
    req.login(user, (err) => {
      if (err) return next(err);
      req.flash("success", "Password reset successfully!");
      res.redirect("/expenses");
    });
  });


router.get("/reset-password", async (req, res) => {
    if (!req.session.resetUserId) {
      req.flash("error", "Session expired.");
      return res.redirect("/forgot");
    }
  
    res.render("users/reset.ejs");
  });
module.exports = router;