const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const { isLoggedIn } = require("../middleware/isLoggedIn");
const loanController = require("../controllers/loan");
const multer = require("multer");
const { documentStorage } = require("../cloudConfig");
const upload = multer({ 
  storage: documentStorage,
  limits: { fileSize: 2 * 1024 * 1024 } // 2MB limit
});

// Routes for loan
router
  .route("/")
  .get(isLoggedIn, wrapAsync(loanController.index))
  .post(isLoggedIn, upload.single("document"), wrapAsync(loanController.createLoan)); // 👈 added file upload here

router.get("/new", isLoggedIn, loanController.renderNewForm);

router
  .route("/:id")
  .get(isLoggedIn, wrapAsync(loanController.showLoan))
  .put(isLoggedIn, upload.single("document"), wrapAsync(loanController.updateLoan)) // 👈 added file upload here too
  .delete(isLoggedIn, wrapAsync(loanController.deleteLoan));

router.get("/:id/edit", isLoggedIn, wrapAsync(loanController.renderEditForm));

module.exports = router;