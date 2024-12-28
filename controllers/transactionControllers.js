const Transaction = require("../models/transactionModel");
const User = require("../models/userModel");

// API 2: Get Transactions for a User by User ID
exports.getTransactionsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 10, status, from, to, type } = req.query;

    const filters = { userId };
    if (status) filters.status = status;
    if (type) filters.type = type;
    if (from || to) {
      filters.transactionDate = {};
      if (from) filters.transactionDate.$gte = new Date(from);
      if (to) filters.transactionDate.$lte = new Date(to);
    }

    const transactions = await Transaction.find(filters)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const totalTransactions = await Transaction.countDocuments(filters);

    res.status(200).json({
      data: transactions,
      total: totalTransactions,
      page: parseInt(page),
      totalPages: Math.ceil(totalTransactions / limit),
    });
  } catch (error) {
    res.status(500).json({ error: "Error fetching transactions for user" });
  }
};

// API 3: Get Transactions with User Details
exports.getTransactionsWithUserDetails = async (req, res) => {
  try {
    const { page = 1, limit = 10, status, from, to, type } = req.query;

    const filters = [];
    if (status) filters.push({ status });
    if (type) filters.push({ type });
    if (from || to) {
      const dateFilter = {};
      if (from) dateFilter.$gte = new Date(from);
      if (to) dateFilter.$lte = new Date(to);
      filters.push({ transactionDate: dateFilter });
    }

    const pipeline = [
      ...(filters.length > 0 ? [{ $match: { $and: filters } }] : []),
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      { $unwind: "$userDetails" },
      { $skip: (page - 1) * limit },
      { $limit: parseInt(limit) },
    ];

    const transactions = await Transaction.aggregate(pipeline);
    const totalTransactions = await Transaction.countDocuments(filters.length > 0 ? { $and: filters } : {});

    res.status(200).json({
      data: transactions,
      total: totalTransactions,
      page: parseInt(page),
      totalPages: Math.ceil(totalTransactions / limit),
    });
  } catch (error) {
    res.status(500).json({ error: "Error fetching transactions with user details" });
  }
};
