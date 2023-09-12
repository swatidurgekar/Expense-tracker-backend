const path = require("path");
const express = require("express");
const router = express.Router();
const expenseController = require("../controllers/expense");

router.get("/add-expenses", expenseController.addExpensesForm);
router.post("/postAddExpense", expenseController.postAddExpense);
router.get("/all-expenses", expenseController.getExpenses);
module.exports = router;
