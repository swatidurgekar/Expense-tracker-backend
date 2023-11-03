import styles from "../css/dailyExpenses.module.css";
import { useRef, useState } from "react";
import axios from "axios";

const DailyExpenses = () => {
  const token = localStorage.getItem("token");
  const [filterExpenses, setFilterExpenses] = useState([]);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [filterby, setFilterby] = useState("");
  let sum = 0;
  const date = useRef();
  const days = {
    0: "Sunday",
    1: "Monday",
    2: "Tuesday",
    3: "Wednesday",
    4: "Thursday",
    5: "Friday",
    6: "Saturday",
  };
  const months = {
    0: "Jan",
    1: "Feb",
    2: "Mar",
    3: "Apr",
    4: "May",
    5: "Jun",
    6: "Jul",
    7: "Aug",
    8: "Sep",
    9: "Oct",
    10: "Nov",
    11: "Dec",
  };

  filterExpenses.forEach((expense) => {
    sum += expense.price;
  });

  const extractDate = (date) => {
    return new Date(date);
  };

  const filterByFunction = async (filterValue) => {
    setPage(1);
    setFilterby(filterValue);
    const currentDate = date.current.value;
    if (currentDate) {
      const res = await axios.post(
        `http://localhost:4000/expense/filterby/${currentDate}`,
        { page: 1, filterValue },
        {
          headers: { Authorization: token },
        }
      );
      setFilterExpenses(res.data.expense);
      setPages(Math.ceil(res.data.count / 10));
    }
  };

  const getFilteredExpenses = async (pageNumber) => {
    setPage(pageNumber);
    const currentDate = date.current.value;
    if (currentDate) {
      const res = await axios.post(
        `http://localhost:4000/expense/filterby/${currentDate}`,
        { page: pageNumber, filterValue: filterby },
        {
          headers: { Authorization: token },
        }
      );
      setFilterExpenses(res.data.expense);
    }
  };

  const previous = () => {
    getFilteredExpenses(page - 1);
  };

  const next = () => {
    getFilteredExpenses(page + 1);
  };

  return (
    <div className={styles.dailyExpenses}>
      <div className={styles.header}>
        <p>DAILY EXPENSE SHEET</p>
      </div>
      <div className={styles.innerdiv}>
        <div className={styles.filter}>
          <div>
            <div>
              <label htmlFor="date">
                <b>Filter </b>
              </label>
              <input name="date" type="date" ref={date} />
            </div>
            <div>
              <button onClick={() => filterByFunction("day")}>
                Filter by date
              </button>
              <button onClick={() => filterByFunction("month")}>
                Filter by month
              </button>
              <button onClick={() => filterByFunction("year")}>
                Filter by year
              </button>
            </div>
          </div>
          <div className={styles.totalExpenses}>
            <div>Total expenses (As filtered)</div>
            <div>${sum}</div>
          </div>
        </div>
        <div className={styles.expenseTable}>
          <table className={styles.expenseTable}>
            <thead>
              <tr className="expenseform-table-row">
                <th className="expenseform-table-header">Date</th>
                <th className="expenseform-table-header">Day</th>
                <th className="expenseform-table-header">Month</th>
                <th className="expenseform-table-header">Year</th>
                <th className="expenseform-table-header">Description</th>
                <th className="expenseform-table-header">Category</th>
                <th className="expenseform-table-header">Price</th>
              </tr>
            </thead>
            <tbody>
              {filterExpenses.map((expense) => {
                const date = extractDate(expense.date);
                return (
                  <tr key={expense.id} className="expenseform-table-row">
                    <td className="expenseform-table-data">{date.getDate()}</td>
                    <td className="expenseform-table-data">
                      {days[date.getDay()]}
                    </td>
                    <td className="expenseform-table-data">
                      {months[date.getMonth()]}
                    </td>
                    <td className="expenseform-table-data">
                      {date.getFullYear()}
                    </td>
                    <td className="expenseform-table-data">
                      {expense.description}
                    </td>

                    <td className="expenseform-table-data">
                      {expense.category}
                    </td>

                    <td className="expenseform-table-data">{expense.price}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <div>
        <button onClick={previous} disabled={page > 1 ? false : true}>
          {"<"}
        </button>
        <button onClick={() => getFilteredExpenses(page)}>{page}</button>
        {page < pages - 1 && <span>...</span>}
        {page < pages && (
          <button onClick={() => getFilteredExpenses(pages)}>{pages}</button>
        )}
        <button onClick={next} disabled={page < pages ? false : true}>
          {">"}
        </button>
      </div>
    </div>
  );
};

export default DailyExpenses;
