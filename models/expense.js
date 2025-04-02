const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const expenseSchema = new Schema({
    title: { 
        type: String,
        required: true
    },
    amount: { 
        type: Number,
        required: true
    },
    category: { 
        type: String,
        required: true
    },
    date: { 
        type: Date,
        default: Date.now
    },
    note: String,
    image: {
        url: {
            type: String,
            // Optionally, add a default URL if no image is provided:
            default: "https://images.pexels.com/photos/25626428/pexels-photo-25626428/free-photo-of-human-responsibility.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"  
        },
        filename: String
    },
    reviews: [
        {
            type : Schema.Types.ObjectId,
            ref : "Review",
        }
    ],
    owner : {
        type : Schema.Types.ObjectId,
        ref : "User",
    }

});

const Expense = mongoose.model("Expense", expenseSchema);
module.exports = Expense;