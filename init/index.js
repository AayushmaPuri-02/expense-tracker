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
    const updatedExpenses = initData.data.map((obj)=>({...obj, owner: "67e94e9c7c194b9443607953" }));
    await Expense.insertMany(updatedExpenses); // Insert sample expenses
    console.log("Database initialized with sample expenses");
    mongoose.connection.close(); // Close connection after inserting data
};

initDB();