const path = require("path");
const express = require("express");
const router = express.Router();
const expenseController = require("../controllers/expense");
const authentication = require("../middleware/auth");
const downloadExpenseController = require("../controllers/downloadExpense");
const filterExpenseController = require("../controllers/filterExpense");

router.post(
  "/postAddExpense",
  authentication,
  expenseController.postAddExpense
);
router.get(
  "/delete-expense/:id",
  authentication,
  expenseController.deleteExpense
);
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
router.post(
  "/filterby/:date",
  authentication,
  filterExpenseController.filterby
);
router.get("/countExpense", authentication, expenseController.countExpenses);
router.get(
  "/pagination/:page",
  authentication,
  expenseController.paginatingExpenses
);
module.exports = router;
