const express = require('express');
const {
  getUserTransactions,
  getTransactionsWithUserDetails,
} = require('../controllers/transactionControllers');

const router = express.Router();

router.get('/user/:userId', getUserTransactions);
router.get('/', getTransactionsWithUserDetails);

module.exports = router;
