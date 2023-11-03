const Expense = require("../models/expenseModel");
const sequelize = require("../util/database");
const UserServices = require("../services/userservices");

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
      res.status(200).json({ success: true });
    }
  } catch (err) {
    await t.rollback();
    console.log(err);
  }
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
      res.status(200).json({ success: true });
    }
  } catch (err) {
    await t.rollback();
    console.log(err);
  }
};

exports.countExpenses = async (req, res, next) => {
  const { rows } = req.body;
  const expenses = await UserServices.getExpenses(req);
  const pages = Math.ceil(expenses.length / rows);
  res.json({ pages });
};

exports.paginatingExpenses = async (req, res, next) => {
  const { page } = req.params;
  const { rows } = req.body;
  const expenses = await UserServices.getExpenses(req);
  const expensesSlice = expenses.slice((page - 1) * rows, page * rows);
  res.json({ expensesSlice });
};
