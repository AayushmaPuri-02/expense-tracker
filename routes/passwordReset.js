const express = require("express");
const crypto = require("crypto");
const router = express.Router();
const User = require("../models/user");
const sendResetEmail = require("../utils/sendEmail");

// Show "forgot password" form
router.get("/forgot", (req, res) => {
  res.render("users/forgot.ejs");
});

// Handle email input, generate reset token, and send email
router.post("/forgot", async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    req.flash("error", "No user with that email found.");
    return res.redirect("/forgot");
  }

  const token = crypto.randomBytes(20).toString("hex");
  user.resetPasswordToken = token;
  user.resetPasswordExpires = Date.now() + 3600000; // valid for 1 hour
  await user.save();

  const resetLink = `http://${req.headers.host}/reset/${token}`;
  await sendResetEmail(user.email, resetLink);

  req.flash("success", "A password reset link has been sent to your email.");
  res.redirect("/login");
});

// Show reset form if token is valid
router.get("/reset/:token", async (req, res) => {
  const user = await User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: { $gt: Date.now() }
  });

  if (!user) {
    req.flash("error", "Reset link is invalid or has expired.");
    return res.redirect("/forgot");
  }

  res.render("users/reset.ejs", { token: req.params.token });
});

// Handle new password submission
router.post("/reset/:token", async (req, res, next) => {
  const user = await User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: { $gt: Date.now() }
  });

  if (!user) {
    req.flash("error", "Reset link is invalid or has expired.");
    return res.redirect("/forgot");
  }

  await user.setPassword(req.body.password);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  req.login(user, (err) => {
    if (err) return next(err);
    req.flash("success", "Password reset successfully. You're now logged in.");
    res.redirect("/expenses");
  });
});

module.exports = router;