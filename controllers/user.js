const User = require("../models/userModel");

exports.signUpForm = (req, res, next) => {
  res.render("signUpForm.html");
};

exports.postSignUpForm = (req, res, next) => {
  const { name, username, password } = req.body;
  User.create({
    name,
    username,
    password,
  })
    .then(() => {
      res.redirect("/");
    })
    .catch((err) => {
      res.status(500).json({ message: "user exists" });
      console.log(err.errors.message);
    });
};
