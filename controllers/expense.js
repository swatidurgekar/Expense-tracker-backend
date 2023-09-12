const Expense = require("../models/expenseModel");

exports.addExpensesForm = (req, res, next) => {
  res.render("addExpense.html");
};

exports.postAddExpense = async (req, res, next) => {
  const { price, description, category } = req.body;
  const created = await Expense.create({ price, description, category });
  res.redirect("/expense/all-expenses");
};

exports.getExpenses = async (req, res, next) => {
  let a = [];
  const expenses = await Expense.findAll();
  res.send(`<html><body><h1>Total expenses</h1>
  ${expenses.map((expense) => {
    return `
    <div><b>Rs.</b>${expense.price}</div>
    <div><b>Description:</b>${expense.description}</div>
    <div><b>Category:</b>${expense.category}</div>
    `;
  })}</body></html>`);
};
