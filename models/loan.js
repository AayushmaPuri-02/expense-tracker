const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const loanSchema = new Schema({
    type: {
      type: String,
      enum: ["lent", "borrowed"],
      required: true
    },
    amount: { type: Number, required: true },
    interestRate: { type: Number, required: true }, // as percentage
    startDate: { type: Date, required: true },
    dueDate: { type: Date, required: true }, // 🟢 now directly ask or calculate
    totalInterest: Number,
    totalRepayable: Number,
    party: String,
    notes: String,
    status: {
      type: String,
      enum: ["unpaid", "paid"],
      default: "unpaid"
    },
    document: {
        url: String,
        filename: String,
        mimetype: String 
      },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  });
module.exports = mongoose.model("Loan", loanSchema);