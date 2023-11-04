import "./App.css";
import SignUpForm from "./components/signUpForm";
import LoginForm from "./components/loginForm";
import { Route, Routes } from "react-router";
import ExpenseForm from "./components/expenseForm";
import ForgotPasswordForm from "./components/forgotPasswordForm";
import UpdatePasswordForm from "./components/updatePasswordForm";
import { useSelector, useDispatch } from "react-redux";
import DailyExpenses from "./components/dailyExpenses";
import Downloads from "./components/downloads";
import { useEffect } from "react";
import axios from "axios";
import { expenseActions, premiumActions } from "./store/Premium";

function App() {
  const premium = useSelector((state) => state.premium.isPremiumUser);
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");
  const rows = useSelector((state) => state.expense.rows);
  const isLoggedIn = useSelector((state) => state.login.isLoggedIn);

  useEffect(() => {
    if (!rows) {
      localStorage.setItem("rows", 10);
    }
    if (token) {
      dispatch(expenseActions.setPage(1));
      async function getExpenses() {
        const res = await axios.post(
          `http://localhost:4000/expense/pagination/1`,
          { rows },
          { headers: { Authorization: token } }
        );
        if (res && res.data && res.data.expensesSlice) {
          const expenses = res.data.expensesSlice;
          dispatch(expenseActions.setExpenses(expenses));
        }
      }

      async function checkPremium() {
        const response = await axios.get(
          "http://localhost:4000/purchase/checkPremium",
          { headers: { Authorization: token } }
        );
        if (response.data) {
          dispatch(premiumActions.setPremium(true));
        } else {
          dispatch(premiumActions.setPremium(false));
        }
      }

      getExpenses();
      checkPremium();
    }
  }, [token, dispatch]);

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<SignUpForm />} />

        <Route path="/login" element={<LoginForm />} />

        <Route path="/forgotPassword" element={<ForgotPasswordForm />} />

        <Route
          path="/updatePassword/:requestId"
          element={<UpdatePasswordForm />}
        />
        {isLoggedIn && (
          <Route path="/expense/add-expenses" element={<ExpenseForm />} />
        )}
        {premium && isLoggedIn && (
          <Route path="/expense/daily-expenses" element={<DailyExpenses />} />
        )}
        {premium && isLoggedIn && (
          <Route path="/expense/downloads" element={<Downloads />} />
        )}
      </Routes>
    </div>
  );
}

export default App;
