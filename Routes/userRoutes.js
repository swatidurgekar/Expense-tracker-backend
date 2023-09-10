const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");

router.get("/", userController.signUpForm);
router.post("/user/signUp", userController.postSignUpForm);

module.exports = router;
