// src/config/db.js
const mongoose = require('mongoose');
const NetworkUtils = require('../config/networkUtils');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(NetworkUtils.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log(`Database Name: ${conn.connection.db.databaseName}`);

    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB disconnected. Attempting to reconnect...');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('MongoDB reconnected');
    });
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
