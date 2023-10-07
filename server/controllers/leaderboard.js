const Expense = require("../models/expenseModel");
const User = require("../models/userModel");

exports.leaderboard = async (req, res, next) => {
  const users = await User.findAll();
  const expenses = await Expense.findAll();
  res.json({ expensesjson: expenses, usersjson: users });
};
