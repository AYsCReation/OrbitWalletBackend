const express = require("express");
const router = express.Router();
const {
  getTransactionsByUserId,
  getTransactionsWithUserDetails,
} = require("../controllers/transactionControllers");

router.get("/user/:userId", getTransactionsByUserId);
router.get("/user", getTransactionsWithUserDetails);

module.exports = router;
