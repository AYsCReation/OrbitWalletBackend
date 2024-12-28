const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config(); // Load environment variables

const app = require('./app'); // Assuming app.js contains the main Express app logic

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://ayushm850:ayush@cluster0.zjae4.mongodb.net/?retryWrites=true&w=majority';

// Connect to MongoDB
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error.message);
  });
