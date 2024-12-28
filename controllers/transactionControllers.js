const Transaction = require('../models/transactionModel');
const User = require('../models/userModel');

exports.getUserTransactions = async (req, res) => {
  const { status, from, to, type } = req.query;
  const { userId } = req.params;

  const filters = { userId };
  if (status) filters.status = status;
  if (type) filters.type = type;
  if (from || to) {
    filters.transactionDate = {};
    if (from) filters.transactionDate.$gte = new Date(from);
    if (to) filters.transactionDate.$lte = new Date(to);
  }

  try {
    const transactions = await Transaction.find(filters).sort({ transactionDate: -1 });
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getTransactionsWithUserDetails = async (req, res) => {
  const { status, from, to, type } = req.query;

  const match = {};
  if (status) match.status = status;
  if (type) match.type = type;
  if (from || to) {
    match.transactionDate = {};
    if (from) match.transactionDate.$gte = new Date(from);
    if (to) match.transactionDate.$lte = new Date(to);
  }

  try {
    const transactions = await Transaction.aggregate([
      { $match: match },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: '$user' },
    ]);
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};