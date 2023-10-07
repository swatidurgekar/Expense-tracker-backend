const express = require("express");
const router = express.Router();
const authentication = require("../middleware/auth");
const purchaseController = require("../controllers/purchase");
const leaderboardController = require("../controllers/leaderboard");

router.get("/buypremium", authentication, purchaseController.buyPremium);
router.post(
  "/updatePremiumStatus",
  authentication,
  purchaseController.updatePremiumStatus
);
router.post(
  "/transactionFailed",
  authentication,
  purchaseController.transactionFailed
);

router.get("/checkPremium", authentication, purchaseController.checkPremium);
router.get("/leaderboard", leaderboardController.leaderboard);

module.exports = router;
