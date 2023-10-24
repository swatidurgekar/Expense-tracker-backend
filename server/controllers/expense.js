const Expense = require("../models/expenseModel");
const User = require("../models/userModel");
const sequelize = require("../util/database");

exports.postAddExpense = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const user = req.user;
    const { price, description, category, date } = req.body;
    if (!price || !description || !category) {
      res.status(500).json({ message: "please fill all details." });
    } else {
      const createExpense = Expense.create(
        {
          price,
          description,
          category,
          date,
          userId: user.id,
        },
        { transaction: t }
      );

      const updateUser = user.update(
        {
          totalExpense: user.totalExpense + Number(req.body.price),
        },
        { transaction: t }
      );
      await Promise.all([createExpense, updateUser]);
      await t.commit();
      const expenses = await req.user.getExpenses();
      res.json(expenses);
    }
  } catch (err) {
    await t.rollback();
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
  const t = await sequelize.transaction();
  try {
    const expense = await Expense.findByPk(id);
    if (user.id === expense.userId) {
      const destroyExpense = expense.destroy({ transaction: t });
      const updateUser = user.update(
        { totalExpense: user.totalExpense - expense.price },
        { transaction: t }
      );
      await Promise.all([destroyExpense, updateUser]);
      await t.commit();
      const expenses = await user.getExpenses();
      res.json(expenses);
    }
  } catch (err) {
    await t.rollback();
    console.log(err);
  }
};

exports.dailyExpenses = (req, res, next) => {
  try {
    console.log("redirect");
    res.status(200).redirect("http://localhost:3000/expense/daily-expenses");
  } catch (err) {
    console.log(err);
  }
};
