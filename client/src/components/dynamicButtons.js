import axios from "axios";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { expenseActions } from "../store/Premium";

const DynamicButtons = () => {
  const token = localStorage.getItem("token");
  const page = useSelector((state) => state.expense.page);
  const numberOfPages = useSelector((state) => state.expense.pages);
  const dispatch = useDispatch();

  //function to get expenses
  const getExpenses = async (pageNumber) => {
    dispatch(expenseActions.setPage(pageNumber));
    const expense = await axios.get(
      `http://localhost:4000/expense/pagination/${pageNumber}`,
      {
        headers: { Authorization: token },
      }
    );
    dispatch(expenseActions.setExpenses(expense.data.expensesSlice));
  };

  const next = () => {
    getExpenses(page + 1);
  };

  const previous = () => {
    getExpenses(page - 1);
  };

  return (
    <div>
      <button onClick={previous} disabled={page === 1 ? true : false}>
        {"<"}
      </button>
      <button onClick={() => getExpenses(page)}>{page}</button>
      {page !== numberOfPages - 1 && page < numberOfPages && <span>...</span>}
      {page < numberOfPages && (
        <button onClick={() => getExpenses(numberOfPages)}>
          {numberOfPages}
        </button>
      )}
      <button onClick={next} disabled={page >= numberOfPages ? true : false}>
        {">"}
      </button>
    </div>
  );
};

export default DynamicButtons;
