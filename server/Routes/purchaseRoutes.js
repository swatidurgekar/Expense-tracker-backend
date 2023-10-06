const express = require("express");
const router = express.Router();
const authentication = require("../middleware/auth");
const purchaseController = require("../controllers/purchase");

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

module.exports = router;
