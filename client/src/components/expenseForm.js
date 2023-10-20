import { useEffect, useRef, useState } from "react";
import "../css/expenseForm.css";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const ExpenseForm = () => {
  const Razorpay = window.Razorpay;
  const [expenses, setExpenses] = useState([]);
  const [premium, setPremium] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [leaderboard, setLeaderboard] = useState([]);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
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
        const expenses = res.data.expense;
        setExpenses(expenses);
      }
    }

    async function checkPremium() {
      const response = await axios.get(
        "http://localhost:4000/purchase/checkPremium",
        { headers: { Authorization: token } }
      );
      if (response.data) {
        setPremium(true);
      } else {
        setPremium(false);
      }
    }

    getExpenses();
    checkPremium();
    leaderboardFunc();
  }, [token]);

  async function leaderboardFunc() {
    const response = await axios.get(
      "http://localhost:4000/purchase/leaderboard"
    );
    const arr = response.data;
    setLeaderboard(arr);
  }

  const deleteExpense = async (id) => {
    const res = await axios.get(
      `http://localhost:4000/expense/delete-expense/${id}`,
      { headers: { Authorization: token } }
    );
    const remexpenses = await res.data;
    setExpenses(remexpenses);
    leaderboardFunc();
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
      leaderboardFunc();
    }
  };

  const buyPremium = async () => {
    const response = await axios.get(
      "http://localhost:4000/purchase/buypremium",
      {
        headers: { Authorization: token },
      }
    );
    const rzp = new Razorpay({
      key: response.data.key_id,
      order_id: response.data.order.id,
      handler: async function (res) {
        setPremium(true);
        alert("Transaction success!!");
        const successMessage = await axios.post(
          "http://localhost:4000/purchase/updatePremiumStatus",
          {
            order_id: response.data.order.id,
            payment_id: res.razorpay_payment_id,
          },
          { headers: { Authorization: token } }
        );
        console.log(successMessage);
      },
    });
    rzp.open();
    rzp.on("payment.failed", async (res) => {
      alert("Transaction failed!!");
      console.log(token);
      await axios.post(
        "http://localhost:4000/purchase/transactionFailed",
        { order_id: response.data.order.id },
        {
          headers: { Authorization: token },
        }
      );
    });
  };

  const toggleLeaderboard = () => {
    setShowLeaderboard((prevValue) => !prevValue);
  };

  return (
    <>
      <div className="buttons">
        {!premium && (
          <div className="premium-div">
            <button onClick={buyPremium} className="premium-btn">
              Buy Premium
            </button>
          </div>
        )}
        {premium && (
          <div className="premium-btn">
            <WorkspacePremiumIcon style={{ color: "gold", fontSize: "40px" }} />
            <span className="premium-account">Premium account</span>
          </div>
        )}
        <div className="premium-div">
          <button onClick={toggleLeaderboard} className="premium-btn">
            {showLeaderboard ? "Hide Leaderboard" : "Show Leaderboard"}
          </button>
        </div>
      </div>
      {showLeaderboard && (
        <div className="leaderboard-div">
          <h2 className="leaderboard-h2">LEADERBOARD</h2>
          {leaderboard.map((user) => {
            return (
              <div key={user.id} className="leaderboard-user">
                <span className="leaderboard-name">{user.name}</span>
                <span className="leaderboard-price">{user.totalExpense}</span>
              </div>
            );
          })}
        </div>
      )}
      <div className="expenseform-div">
        <h1 className="expenseform-h1">Expense Form</h1>
        <form className="expenseform-form" onSubmit={submitHandler}>
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
