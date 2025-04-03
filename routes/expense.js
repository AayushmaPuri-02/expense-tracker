const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { expenseSchema } = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const { validateExpense } = require("../middleware/validateExpense");
const Expense = require("../models/expense.js"); // Importing Expense model
// const upload = require("../middleware/multer.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js"); // ✅ Cloudinary storage
//const upload = multer({ storage }); // ✅ This connects multer to Cloudinary
const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // ✅ 2MB limit
  fileFilter(req, file, cb) {
    if (!file.mimetype.startsWith("image/")) {
      cb(new Error("Only image files are allowed!"));
    } else {
      cb(null, true);
    }
  }
});
const {isLoggedIn} = require("../middleware/isLoggedIn.js");

const expenseController = require("../controllers/expense.js");

router.route("/")
.get(isLoggedIn,expenseController.index)
.post(isLoggedIn,

  upload.single("image"),       // handle image upload from <input name="image">
        // validate fields like title, amount, etc.
        validateExpense,       
  wrapAsync(expenseController.createExpense)
);

// New Expense Form Route (GET)
router.get("/new",isLoggedIn, expenseController.renderNewForm);

router.route("/:id").get( isLoggedIn, wrapAsync( expenseController.showExpenses))
.put( isLoggedIn,  upload.single("image"),      validateExpense, wrapAsync(expenseController.updateExpense))
.delete( isLoggedIn, wrapAsync( expenseController.destroyExpense));

//Edit route
router.get("/:id/edit", isLoggedIn, wrapAsync( expenseController.renderEditForm));
module.exports = router;