import { useRef } from "react";
import "../css/signUpForm.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const uname = useRef();
  const pword = useRef();
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    const username = uname.current.value;
    const password = pword.current.value;
    const obj = { username, password };
    const res = await axios.post("http://localhost:4000/user/login", obj);
    if (res) {
      localStorage.setItem("token", res.data);
      navigate("/expense/add-expenses");
    }
  };

  return (
    <>
      <div className="signupform-div">
        <h1 className="signupform-h1">Login</h1>
        <form className="signupform-form" onSubmit={submitHandler}>
          <label htmlFor="username">Username</label>
          <input
            className="signupform-input"
            placeholder="Type your username"
            type="text"
            id="username"
            name="username"
            ref={uname}
            required
          />
          <label htmlFor="password">Password</label>
          <input
            className="signupform-input"
            placeholder="Type your password"
            type="password"
            name="password"
            id="password"
            ref={pword}
            required
          />
          <button className="signupform-button" type="submit">
            Submit
          </button>
        </form>
        <a href="/forgotPassword" className="forgotPassword-btn">
          Forgot password ?
        </a>
        <p className="signupform-p">Not a member?</p>
        <a className="signupform-a" href="/">
          SIGN UP
        </a>
      </div>
    </>
  );
};

export default LoginForm;
