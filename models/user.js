const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    income: {
        daily: {
          type: Number,
          default: 0
        },
        weekly: {
          type: Number,
          default: 0
        },
        monthly: {
          type: Number,
          default: 0
        },
        addedAt: {
          type: Date,
          default: Date.now
        }
      },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    securityQuestion: {
        type: String,
        required: true
    },
    securityAnswer: {
        type: String,
        required: true
    }
});

userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model("User", userSchema);