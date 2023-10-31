const path = require("path");
const express = require("express");
const router = express.Router();
const expenseController = require("../controllers/expense");
const authentication = require("../middleware/auth");
const downloadExpenseController = require("../controllers/downloadExpense");

router.post(
  "/postAddExpense",
  authentication,
  expenseController.postAddExpense
);
router.get("/get-expenses", authentication, expenseController.getExpenses);
router.get(
  "/delete-expense/:id",
  authentication,
  expenseController.deleteExpense
);
router.get("/daily-expenses", expenseController.dailyExpenses);
router.get(
  "/download",
  authentication,
  downloadExpenseController.downloadExpense
);
router.get(
  "/get-download",
  authentication,
  downloadExpenseController.getDownloadExpenses
);
module.exports = router;
