const mongoose = require("mongoose");
const initData = require("./data.js"); // Importing sample expenses
const Expense = require("../models/expense.js"); // Importing the Expense model

const mongo_Url = "mongodb://127.0.0.1:27017/expense"; 

async function main() {
    await mongoose.connect(mongo_Url);
}
main().then(() => {
    console.log(`Connected successfully`);
}).catch((err) => {
    console.log(err);
});

const initDB = async () => {
    await Expense.deleteMany({}); // Clear previous data
    await Expense.insertMany(initData.data); // Insert sample expenses
    console.log("Database initialized with sample expenses");
    mongoose.connection.close(); // Close connection after inserting data
};

initDB();