const UserServices = require("../services/userservices");

const extractDate = (date) => {
  return new Date(date);
};

const sliceFunction = (filteredExpenses, page, res) => {
  const slicedExpenses = filteredExpenses.slice((page - 1) * 10, page * 10);
  res.status(200).json({
    success: true,
    expense: slicedExpenses,
    count: filteredExpenses.length,
  });
};

exports.filterby = async (req, res, next) => {
  const filter = req.body.filterValue;
  console.log("filter", filter);
  const expenses = await UserServices.getExpenses(req);
  const newFilteredDate = extractDate(req.params.date);
  let filteredExpenses;
  if (filter === "day") {
    filteredExpenses = expenses.filter((expense) => {
      const expenseDate = extractDate(expense.date);
      return (
        newFilteredDate.getDate() === expenseDate.getDate() &&
        newFilteredDate.getMonth() === expenseDate.getMonth() &&
        newFilteredDate.getFullYear() === expenseDate.getFullYear()
      );
    });
  }
  if (filter === "month") {
    filteredExpenses = expenses.filter((expense) => {
      const expenseDate = extractDate(expense.date);
      return (
        newFilteredDate.getMonth() === expenseDate.getMonth() &&
        newFilteredDate.getFullYear() === expenseDate.getFullYear()
      );
    });
  }
  if (filter === "year") {
    filteredExpenses = expenses.filter((expense) => {
      const expenseDate = extractDate(expense.date);
      return newFilteredDate.getFullYear() === expenseDate.getFullYear();
    });
  }

  sliceFunction(filteredExpenses, req.body.page, res);
};
