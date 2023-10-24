import axios from "axios";
import styles from "../css/dailyExpenses.module.css";
import { useEffect, useRef, useState } from "react";

const DailyExpenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [filterExpenses, setFilterExpenses] = useState([]);
  let sum = 0;
  const token = localStorage.getItem("token");
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

  useEffect(() => {
    async function getExpenses() {
      const res = await axios.get(
        "http://localhost:4000/expense/get-expenses",
        { headers: { Authorization: token } }
      );
      if (res) {
        const expenses = res.data.expense;
        setExpenses(expenses);
      }
    }
    getExpenses();
  }, []);

  filterExpenses.forEach((expense) => {
    sum += expense.price;
  });

  const extractDate = (date) => {
    return new Date(date);
  };

  const filterByDay = () => {
    const newFilteredDate = extractDate(date.current.value);
    const filteredExpenses = expenses.filter((expense) => {
      const expenseDate = extractDate(expense.date);
      return (
        newFilteredDate.getDate() == expenseDate.getDate() &&
        newFilteredDate.getMonth() === expenseDate.getMonth() &&
        newFilteredDate.getFullYear() === expenseDate.getFullYear()
      );
    });
    setFilterExpenses(filteredExpenses);
  };

  const filterByMonth = () => {
    const newFilteredDate = extractDate(date.current.value);
    const filteredExpenses = expenses.filter((expense) => {
      const expenseDate = extractDate(expense.date);
      return (
        newFilteredDate.getMonth() === expenseDate.getMonth() &&
        newFilteredDate.getFullYear() === expenseDate.getFullYear()
      );
    });
    setFilterExpenses(filteredExpenses);
  };

  const filterByYear = () => {
    const newFilteredDate = extractDate(date.current.value);
    const filteredExpenses = expenses.filter((expense) => {
      const expenseDate = extractDate(expense.date);
      return newFilteredDate.getFullYear() === expenseDate.getFullYear();
    });
    setFilterExpenses(filteredExpenses);
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
              <button onClick={filterByDay}>Filter by date</button>
              <button onClick={filterByMonth}>Filter by month</button>
              <button onClick={filterByYear}>Filter by year</button>
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
                // const date = expense.createdAt.split(/[A-Z]/g)[0];
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
    </div>
  );
};

export default DailyExpenses;
