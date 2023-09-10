const User = require("../models/userModel");

exports.signUpForm = (req, res, next) => {
  res.render("signUpForm.html");
};

exports.loginForm = (req, res, next) => {
  res.render("loginForm.html");
};

exports.postSignUpForm = (req, res, next) => {
  const { name, username, password } = req.body;
  const stringValidation = (string) => {
    if (!string) return true;
  };
  if (
    stringValidation(name) ||
    stringValidation(username) ||
    stringValidation(password)
  )
    return res.status(500).json({ message: "please enter all details" });
  User.create({
    name,
    username,
    password,
  })
    .then(() => {
      res.redirect("/login");
    })
    .catch((err) => {
      res.status(500).json({ message: "user exists" });
      console.log(err.errors.message);
    });
};

exports.postLoginForm = (req, res, next) => {
  const { username, password } = req.body;
  let foundUser;
  const stringValidation = (string) => {
    if (!string) return true;
  };
  if (stringValidation(username) || stringValidation(password)) {
    return res.status(500).json({ message: "please enter all details" });
  }
  User.findAll()
    .then((users) => {
      for (let user of users) {
        if (user.username === username) {
          foundUser = user;
          return user;
        }
      }
      return res.status(500).json({ message: "user not found" });
    })
    .then((user) => {
      if (foundUser) {
        if (user.password === password) {
          res.redirect("/login");
        } else {
          res.status(500).json({ message: "incorrect password" });
        }
      }
    })
    .catch((err) => {
      console.log(err);
    });
};
