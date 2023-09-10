const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");

router.get("/", userController.signUpForm);
router.get("/login", userController.loginForm);
router.post("/user/signUp", userController.postSignUpForm);
router.post("/user/login", userController.postLoginForm);

module.exports = router;
