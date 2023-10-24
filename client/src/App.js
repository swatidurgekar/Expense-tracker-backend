import "./App.css";
import SignUpForm from "./components/signUpForm";
import LoginForm from "./components/loginForm";
import { Route, Routes } from "react-router";
import ExpenseForm from "./components/expenseForm";
import ForgotPasswordForm from "./components/forgotPasswordForm";
import UpdatePasswordForm from "./components/updatePasswordForm";
import { useSelector } from "react-redux";
import DailyExpenses from "./components/dailyExpenses";

function App() {
  const premium = useSelector((state) => state.premium.isPremiumUser);
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
        <Route path="/expense/add-expenses" element={<ExpenseForm />} />
        {/* {!premium && ( */}
        <Route path="/expense/daily-expenses" element={<DailyExpenses />} />
        {/* )} */}
      </Routes>
    </div>
  );
}

export default App;
