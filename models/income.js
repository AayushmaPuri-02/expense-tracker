// models/income.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const incomeSchema = new Schema({
  amount: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  note: {
    type: String
  },
  addedAt: {
    type: Date,
    default: Date.now
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
});

const Income = mongoose.model("Income", incomeSchema);
module.exports = Income;