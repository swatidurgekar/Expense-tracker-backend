const path = require("path");
const express = require("express");
const router = express.Router();
const expenseController = require("../controllers/expense");
const authentication = require("../middleware/auth");

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
module.exports = router;
