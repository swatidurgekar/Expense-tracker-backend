import { useEffect, useRef, useState } from "react";
import "../css/expenseForm.css";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";

const ExpenseForm = () => {
  const [expenses, setExpenses] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const pri = useRef();
  const des = useRef();
  const cat = useRef();

  useEffect(() => {
    async function getExpenses() {
      const res = await axios.get(
        "http://localhost:4000/expense/get-expenses",
        { headers: { Authorization: token } }
      );
      if (res) {
        const expenses = res.data;
        setExpenses(expenses);
      }
    }
    getExpenses();
  }, [token]);

  const deleteExpense = async (id) => {
    const res = await axios.get(
      `http://localhost:4000/expense/delete-expense/${id}`,
      { headers: { Authorization: token } }
    );
    const expenses = await res.data;
    setExpenses(expenses);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const price = pri.current.value;
    const description = des.current.value;
    const category = cat.current.value;
    const obj = { price, description, category };
    const res = await axios.post(
      "http://localhost:4000/expense/postAddExpense",
      obj,
      {
        headers: { Authorization: token },
      }
    );
    if (res) {
      const expenses = res.data;
      setExpenses(expenses);
    }
  };

  return (
    <>
      <div className="expenseform-div">
        <h1 className="expenseform-h1">Expense Form</h1>
        <form
          className="expenseform-form"
          onSubmit={submitHandler}
          // action="http://localhost:4000/expense/postAddExpense"
          // method="POST"
        >
          <div className="expenseform-form-div">
            <label htmlFor="price">Expense Price:</label>
            <input ref={pri} id="price" type="text" name="price" required />
          </div>
          <div className="expenseform-form-div">
            <label htmlFor="description">Description</label>
            <input
              ref={des}
              name="description"
              type="text"
              id="description"
              required
            />
          </div>
          <div className="expenseform-form-div">
            <label htmlFor="category">Category:</label>
            <select ref={cat} name="category" required>
              <option name="food">Food</option>
              <option name="fuel">Fuel</option>
              <option name="appliances">Appliances</option>
              <option name="others">Others</option>
            </select>
          </div>
          <button className="expenseform-button" type="submit">
            Next
          </button>
        </form>
      </div>
      <div className="expenseform-expenses-div">
        <h2 className="expenseform-h2">Expenses</h2>
        <table className="expenseform-table">
          <thead>
            <tr className="expenseform-table-row">
              <th className="expenseform-table-header">Date</th>
              <th className="expenseform-table-header">Description</th>
              <th className="expenseform-table-header">Category</th>
              <th className="expenseform-table-header">Price</th>
              <th className="expenseform-table-header">Delete</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense) => {
              const date = expense.createdAt.split(/[A-Z]/g)[0];
              return (
                <tr key={expense.id} className="expenseform-table-row">
                  <td className="expenseform-table-data">{date}</td>

                  <td className="expenseform-table-data">
                    {expense.description}
                  </td>

                  <td className="expenseform-table-data">{expense.category}</td>

                  <td className="expenseform-table-data">{expense.price}</td>

                  <td
                    onClick={() => deleteExpense(expense.id)}
                    className="expenseform-table-data"
                  >
                    <DeleteIcon style={{ color: "red" }} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default ExpenseForm;
