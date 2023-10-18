const Expense = require("../models/expenseModel");
const User = require("../models/userModel");

exports.postAddExpense = async (req, res, next) => {
  try {
    const user = req.user;
    const { price, description, category } = req.body;
    if (!price || !description || !category) {
      res.status(500).json({ message: "please fill all details." });
    } else {
      await Expense.create({
        price,
        description,
        category,
        userId: user.id,
      });
      if (!user.totalExpense) {
        user.update({
          totalExpense: req.body.price,
        });
      } else {
        user.update({
          totalExpense: user.totalExpense + Number(req.body.price),
        });
      }
      const expenses = await req.user.getExpenses();
      res.json(expenses);
    }
  } catch (err) {
    console.log(err);
  }
};

exports.getExpenses = async (req, res, next) => {
  const user = req.user;
  const expenses = await user.getExpenses();
  res.json({ expense: expenses });
};

exports.deleteExpense = async (req, res, next) => {
  const user = req.user;
  const id = req.params.id;
  const expense = await Expense.findByPk(id);
  if (user.id === expense.userId) {
    user.update({ totalExpense: user.totalExpense - expense.price });
    await expense.destroy();
    const expenses = await user.getExpenses();
    res.json(expenses);
  }
};
