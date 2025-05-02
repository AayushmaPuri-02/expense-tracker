const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const savingGoalSchema = new Schema({
  goalAmount: {
    type: Number,
    required: true
  },
  goalReason: {
    type: String,
    default: "General"
  },
  targetDate: {
    type: Date,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
});

module.exports = mongoose.model("SavingGoal", savingGoalSchema);