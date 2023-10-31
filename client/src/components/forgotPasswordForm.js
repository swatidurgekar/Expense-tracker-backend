import axios from "axios";
import "../css/forgotPasswordForm.css";
import { useRef } from "react";

const ForgotPasswordForm = () => {
  const emailRef = useRef();
  const token = localStorage.getItem("token");

  const submitHandler = async (event) => {
    event.preventDefault();
    const email = emailRef.current.value;
    const res = await axios.post(
      "http://localhost:4000/password/forgotPassword",
      { email },
      { headers: { Authorization: token } }
    );
    if (res.data) {
      alert("Email successfully sent to your mailId!");
    } else {
      alert("Email does not exist");
    }
  };

  return (
    <>
      <div className="resetForm-div">
        <h3 className="signupform-h1">Reset Your Password</h3>
        <p className="resetForm-p">
          Enter the email address associated with your account and we'll send
          you a link to reset your password.
        </p>
        <form onSubmit={submitHandler}>
          <label htmlFor="email">Email</label>
          <input type="email" name="email" ref={emailRef} />
          <button type="submit">Continue</button>
        </form>
        <p className="signupform-p">Not a member?</p>
        <a className="signupform-a" href="/">
          SIGN UP
        </a>
      </div>
    </>
  );
};

export default ForgotPasswordForm;
