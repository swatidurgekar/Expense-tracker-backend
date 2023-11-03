import { useEffect, useRef, useState } from "react";
import "../css/expenseForm.css";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import { useSelector, useDispatch } from "react-redux";
import { expenseActions, premiumActions } from "../store/Premium";
import { NavLink } from "react-router-dom";
import DynamicButtons from "./dynamicButtons";

const ExpenseForm = () => {
  const Razorpay = window.Razorpay;
  const expenses = useSelector((state) => state.expense.expenses);
  const premium = useSelector((state) => state.premium.isPremiumUser);
  const page = useSelector((state) => state.expense.page);
  const rows = useSelector((state) => state.expense.rows);
  const token = localStorage.getItem("token");
  const [leaderboard, setLeaderboard] = useState([]);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const pri = useRef();
  const des = useRef();
  const cat = useRef();
  const dispatch = useDispatch();

  useEffect(() => {
    leaderboardFunc();
    paginatingExpenses();
    countExpenses();
  }, [token, dispatch, rows]);

  async function countExpenses() {
    const response = await axios.post(
      "http://localhost:4000/expense/countExpense",
      { rows },
      { headers: { Authorization: token } }
    );
    const pages = response.data.pages;
    dispatch(expenseActions.setPages(pages));
  }

  async function leaderboardFunc() {
    const response = await axios.get(
      "http://localhost:4000/purchase/leaderboard"
    );
    const arr = response.data;
    setLeaderboard(arr);
  }

  const paginatingExpenses = async () => {
    const res = await axios.post(
      `http://localhost:4000/expense/pagination/${page}`,
      { rows },
      { headers: { Authorization: token } }
    );
    dispatch(expenseActions.setExpenses(res.data.expensesSlice));
    countExpenses();
    leaderboardFunc();
  };

  const deleteExpense = async (id) => {
    await axios.get(`http://localhost:4000/expense/delete-expense/${id}`, {
      headers: { Authorization: token },
    });
    paginatingExpenses();
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const price = pri.current.value;
    const description = des.current.value;
    const category = cat.current.value;
    const date = new Date();
    const obj = { price, description, category, date };
    await axios.post("http://localhost:4000/expense/postAddExpense", obj, {
      headers: { Authorization: token },
    });

    paginatingExpenses();
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
        dispatch(premiumActions.setPremium(true));
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

  const download = async () => {
    const res = await axios.get("http://localhost:4000/expense/download", {
      headers: { Authorization: token },
    });
    try {
      if (res.status === 200) {
        const a = document.createElement("a");
        a.href = res.data.fileURL;
        a.download = "myexpenses.csv";
        a.click();
      } else {
        throw new Error(res.data.message);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="expense-form">
      <div className="buttons">
        {!premium && (
          <div className="premium-btn">
            <button onClick={buyPremium}>Buy Premium</button>
          </div>
        )}
        {premium && (
          <>
            <div className="premium-btn">
              <WorkspacePremiumIcon
                style={{ color: "gold", fontSize: "40px" }}
              />
              <span className="premium-account">Premium account</span>
            </div>

            <NavLink to="/expense/daily-expenses" className="premium-btn">
              Daily expense sheet
            </NavLink>

            <NavLink to="/expense/downloads" className="premium-btn">
              Downloads
            </NavLink>
          </>
        )}
        <div className="premium-btn">
          <button onClick={toggleLeaderboard}>
            {showLeaderboard ? "Hide Leaderboard" : "Show Leaderboard"}
          </button>
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
      </div>
      <div className="expenseform-div">
        <h1 className="expenseform-h1">Expense Form</h1>
        <form className="expenseform-form" onSubmit={submitHandler}>
          <div className="expenseform-form-div">
            <label htmlFor="price">Expense Price:</label>
            <input ref={pri} id="price" type="number" name="price" required />
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
      <div className="expense-table">
        <div className="expenseform-expenses-div">
          <div>
            <h2 className="expenseform-h2">Expenses</h2>
            <table className="expenseform-table">
              <thead>
                <tr className="expenseform-table-row">
                  <th className="expenseform-table-header">Description</th>
                  <th className="expenseform-table-header">Category</th>
                  <th className="expenseform-table-header">Price</th>
                  <th className="expenseform-table-header">Delete</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((expense, index) => {
                  return (
                    <tr key={expense.id} className="expenseform-table-row">
                      <td className="expenseform-table-data">
                        {expense.description}
                      </td>

                      <td className="expenseform-table-data">
                        {expense.category}
                      </td>

                      <td className="expenseform-table-data">
                        {expense.price}
                      </td>

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
          {premium && <button onClick={download}>Download</button>}
        </div>
        <div>
          <DynamicButtons />
        </div>
      </div>
    </div>
  );
};

export default ExpenseForm;
