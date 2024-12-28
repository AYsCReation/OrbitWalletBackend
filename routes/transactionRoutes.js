const express = require("express");
const router = express.Router();
const {
  getTransactionsByUserId,
  getTransactionsWithUserDetails,
} = require("../controllers/transactionController");

router.get("/user/:userId", getTransactionsByUserId);
router.get("/user", getTransactionsWithUserDetails);

module.exports = router;
