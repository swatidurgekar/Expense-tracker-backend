import "./App.css";
import SignUpForm from "./components/signUpForm";
import LoginForm from "./components/loginForm";
import { Route, Routes } from "react-router";
import ExpenseForm from "./components/expenseForm";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<SignUpForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/expense/add-expenses" element={<ExpenseForm />} />
      </Routes>
    </div>
  );
}

export default App;
