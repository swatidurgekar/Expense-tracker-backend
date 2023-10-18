const Expense = require("../models/expenseModel");
const User = require("../models/userModel");
const sequelize = require("../util/database");

exports.leaderboard = async (req, res, next) => {
  const users = await User.findAll({
    attributes: [
      "id",
      "name",
      "totalExpense",
      // [sequelize.fn("sum", sequelize.col("expenses.price")), "cost"],
    ],
    // include: [{ model: Expense, attributes: [] }],
    // group: ["user.Id"],
    order: [["totalExpense", "DESC"]],
  });
  res.json(users);
};
