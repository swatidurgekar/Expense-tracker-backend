import { useParams } from "react-router";
import "../css/updatePasswordForm.css";
import { useRef } from "react";

const UpdatePasswordForm = () => {
  const params = useParams();
  const { requestId } = params;
  const pass1 = useRef();
  const pass2 = useRef();

  return (
    <>
      <div className="resetForm-div">
        <p className="updatePassword-p">Change Password:</p>
        <p className="resetForm-p">Enter a new password.</p>
        <form
          action={`http://13.51.234.248:3001/password/updatePassword/${requestId}`}
          className="updatePassword-form"
          method="POST"
        >
          <div>
            <label htmlFor="password1">Password:</label>
            <input type="password" name="password1" ref={pass1} required />
          </div>
          <div>
            <label htmlFor="password2">Password (again):</label>
            <input type="password" name="password2" ref={pass2} required />
            <p>Enter the same password as before, for verification.</p>
          </div>
          <button className="signupform-button" type="submit">
            Change password
          </button>
        </form>
      </div>
    </>
  );
};

export default UpdatePasswordForm;
