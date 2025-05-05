const nodemailer = require("nodemailer");

const sendResetEmail = async (to, resetLink) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: `Expense Tracker <${process.env.EMAIL_USER}>`,
    to: to,
    subject: "Password Reset Link",
    html: `
      <p>Hello,</p>
      <p>We received a request to reset your password.</p>
      <p>Please copy and paste the following link into your browser to reset your password (especially if the link is not clickable):</p>
      <p style="font-weight: bold; color: blue;">${resetLink}</p>
      <br>
      <p>If you did not request a password reset, you can safely ignore this email.</p>
      <p>Thanks,<br>The Expense Tracker Team</p>
    `
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendResetEmail;