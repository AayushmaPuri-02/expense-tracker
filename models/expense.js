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
        type: String,
        default: function () {
            const categoryImages = {
                "Food": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                "Electricity": "https://images.unsplash.com/photo-1529704193007-e8c78f0f46f9?q=80&w=3024&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                "Entertainment": "https://images.unsplash.com/photo-1606937295547-bc0f668595b3?q=80&w=3174&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                "Transport": "https://images.unsplash.com/photo-1532330384785-f94c84352e91?q=80&w=3211&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                "Water":"https://plus.unsplash.com/premium_photo-1729043730133-2d1d1a22760d?q=80&w=3095&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                "Internet":"https://plus.unsplash.com/premium_photo-1671017817487-baaae0de6d4d?q=80&w=3248&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                "TV":"https://images.unsplash.com/photo-1593784991095-a205069470b6?q=80&w=3270&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                "School Fee":"https://images.unsplash.com/photo-1517673132405-a56a62b18caf?q=80&w=3276&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                "Other": "https://images.pexels.com/photos/25626428/pexels-photo-25626428/free-photo-of-human-responsibility.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
            };
            return categoryImages[this.category] || categoryImages["Other"];
        }
    }
});

const Expense = mongoose.model("Expense", expenseSchema);
module.exports = Expense;