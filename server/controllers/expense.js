const Expense = require("../models/expenseModel");

exports.postAddExpense = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { price, description, category } = req.body;
    if (!price || !description || !category) {
      res.status(500).json({ message: "please fill all details." });
    } else {
      await Expense.create({
        price,
        description,
        category,
        userId,
      });
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
  res.json(expenses);
};

exports.deleteExpense = async (req, res, next) => {
  const user = req.user;
  const id = req.params.id;
  const expense = await Expense.findByPk(id);
  if (req.user.id === expense.userId) {
    await expense.destroy();
    const expenses = await Expense.findAll();
    res.json(expenses);
  }
};
