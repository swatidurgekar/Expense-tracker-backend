const express = require("express");
const router = express.Router();
const passwordController = require("../controllers/forgotPassword");

router.post("/forgotPassword", passwordController.forgotPassword);

module.exports = router;
