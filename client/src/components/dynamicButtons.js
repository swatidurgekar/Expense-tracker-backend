import axios from "axios";
import React, { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { expenseActions } from "../store/Premium";

const DynamicButtons = () => {
  const token = localStorage.getItem("token");
  const rows = useSelector((state) => state.expense.rows);
  const page = useSelector((state) => state.expense.page);
  const numberOfPages = useSelector((state) => state.expense.pages);
  const dispatch = useDispatch();
  const selectedRows = useRef();

  //function to get expenses
  const getExpenses = async (pageNumber) => {
    dispatch(expenseActions.setPage(pageNumber));
    const expense = await axios.post(
      `http://13.51.234.248:3001/expense/pagination/${pageNumber}`,
      { rows },
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

  const setRowsPerPage = () => {
    dispatch(expenseActions.setRows(selectedRows.current.value));
    localStorage.setItem("rows", selectedRows.current.value);
  };

  return (
    <div>
      <div>
        <span>Rows per page: </span>
        <select value={rows} ref={selectedRows} onChange={setRowsPerPage}>
          <option>10</option>
          <option>25</option>
          <option>50</option>
          <option>100</option>
        </select>
      </div>
      <button onClick={previous} disabled={page === 1 ? true : false}>
        {"<"}
      </button>
      <button onClick={() => getExpenses(page)}>{page}</button>
      {page < numberOfPages - 1 && <span>...</span>}
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
