const { JSON } = require("sequelize");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");

exports.signUpForm = (req, res, next) => {
  res.render("signUpForm.html");
};

exports.loginForm = (req, res, next) => {
  res.render("loginForm.html");
};

exports.postSignUpForm = (req, res, next) => {
  try {
    const { name, username, password } = req.body;
    const stringValidation = (string) => {
      if (!string) return true;
    };
    if (
      stringValidation(name) ||
      stringValidation(username) ||
      stringValidation(password)
    ) {
      return res.status(500).json({ message: "please enter all details" });
    }

    bcrypt.hash(password, 10, async (err, hashValue) => {
      if (err) {
        throw new Error();
      } else {
        const creation = User.create({
          name,
          username,
          password: hashValue,
        })
          .then(() => {
            res.redirect("/");
          })

          .catch((err) => {
            return res.status(500).json({ message: "user exists" });
          });
      }
    });
  } catch (err) {
    return res.status(500).json({ message: "user exists" });
  }
};

exports.postLoginForm = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const stringValidation = (string) => {
      if (!string) return true;
    };
    if (stringValidation(username) || stringValidation(password)) {
      return res.status(500).json({ message: "please fill all fields!" });
    }
    const user = await User.findAll({ where: { username } });
    console.log("user", user);
    if (user.length > 0) {
      if (user[0].username === username) {
        bcrypt.compare(password, user[0].password, (err, result) => {
          if (err)
            return res.status(500).json({ message: "something went wrong" });
          else if (result) {
            return res
              .status(200)
              .json({ success: true, message: "user logged in successfully." });
          } else {
            console.log("incorrect password");
            return res.status(500).json({ message: "incorrect password" });
          }
        });
      }
    } else {
      return res.status(500).json({ message: "user not found!" });
    }
  } catch (err) {
    console.log(err.message);
  }
};
