const mongoose = require('mongoose');
const { Schema } = mongoose;

// MongoDB URI
const MONGO_URI = 'mongodb+srv://ayushm850:ayush@cluster0.zjae4.mongodb.net/?retryWrites=true&w=majority';

// User Schema
const userSchema = new Schema({
  name: String,
  phoneNumber: String,
});

// Transaction Schema
const transactionSchema = new Schema({
  status: String,
  type: String,
  transactionDate: Date,
  amount: Number,
  userId: mongoose.Schema.Types.ObjectId,
});

const User = mongoose.model('User', userSchema);
const Transaction = mongoose.model('Transaction', transactionSchema);

// Connect to MongoDB
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Transaction.deleteMany({});

    // Populate Users
    const users = [];
    for (let i = 1; i <= 10; i++) {
      users.push({
        name: `User ${i}`,
        phoneNumber: `123456789${i}`,
      });
    }
    const createdUsers = await User.insertMany(users);
    console.log('Users inserted:', createdUsers);

    // Populate Transactions
    const transactions = [];
    createdUsers.forEach((user) => {
      for (let j = 1; j <= 5; j++) {
        transactions.push({
          status: ['success', 'pending', 'failed'][Math.floor(Math.random() * 3)],
          type: ['debit', 'credit'][Math.floor(Math.random() * 2)],
          transactionDate: new Date(Date.now() - Math.floor(Math.random() * 1000000000)),
          amount: Math.floor(Math.random() * 10000) + 100,
          userId: user._id,
        });
      }
    });
    const createdTransactions = await Transaction.insertMany(transactions);
    console.log('Transactions inserted:', createdTransactions);

    mongoose.connection.close();
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error.message);
    mongoose.connection.close();
  });
