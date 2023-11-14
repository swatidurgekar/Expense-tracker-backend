import "../css/signUpForm.css";

const SignUpForm = () => {
  return (
    <>
      <div className="signupform-div">
        <h1 className="signupform-h1">SignUp</h1>
        <form
          className="signupform-form"
          action="http://13.51.234.248:3001/user/signUp"
          method="POST"
        >
          <label htmlFor="name">Name</label>
          <input
            className="signupform-input"
            placeholder="Type your name"
            name="name"
            id="name"
            type="text"
            required
          />
          <label htmlFor="username">Username</label>
          <input
            className="signupform-input"
            placeholder="Type your username"
            type="email"
            id="username"
            name="username"
            required
          />
          <label htmlFor="password">Password</label>
          <input
            className="signupform-input"
            placeholder="Type your password"
            type="password"
            name="password"
            id="password"
            required
          />
          <button className="signupform-button" type="submit">
            Submit
          </button>
        </form>
        <p className="signupform-p">Already a member?</p>
        <a className="signupform-a" href="/login">
          LOGIN
        </a>
      </div>
    </>
  );
};

export default SignUpForm;
