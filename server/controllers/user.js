const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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
        try {
          await User.create({
            name,
            username,
            password: hashValue,
          });
          res.redirect("http://localhost:3000/login");
        } catch (err) {
          res.status(500).json({ message: "user exists" });
        }
      }
    });
  } catch (err) {
    return res.status(500).json({ message: "user exists" });
  }
};

function generateAccessToken(id) {
  return jwt.sign({ userId: id }, "8FA41289185F684A4D6F1DCEB2D59");
}

exports.postLoginForm = async (req, res, next) => {
  try {
    console.log(req.body);
    const { username, password } = req.body;

    const stringValidation = (string) => {
      if (!string) return true;
    };
    if (stringValidation(username) || stringValidation(password)) {
      return res.status(500).json({ message: "please fill all fields!" });
    }
    const user = await User.findAll({ where: { username } });
    if (user.length > 0) {
      if (user[0].username === username) {
        bcrypt.compare(password, user[0].password, (err, result) => {
          if (err)
            return res.status(500).json({ message: "something went wrong" });
          else if (result) {
            const token = generateAccessToken(user[0].id);
            return res.json(token);
            // res.redirect("http://localhost:3000/expense/add-expenses");
          } else {
            return res.status(400).json("incorrect password");
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
