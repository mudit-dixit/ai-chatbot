// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const chatRoutes = require('./routes/chatRoutes');
const { Department, Teacher, Student, Course } = require('./models');
const NetworkUtils = require('./config/networkUtils');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Create necessary indexes for efficient searching
async function createSearchIndexes() {
  try {
    // Create text indexes for searching across collections
    await Promise.all([
      Department.collection.createIndex({
        name: 'text',
        code: 'text',
        description: 'text',
      }),
      Teacher.collection.createIndex({
        firstName: 'text',
        lastName: 'text',
        specializations: 'text',
      }),
      Student.collection.createIndex({
        firstName: 'text',
        lastName: 'text',
        rollNumber: 'text',
      }),
      Course.collection.createIndex({
        name: 'text',
        courseCode: 'text',
        description: 'text',
      }),
    ]);
    console.log('Search indexes created successfully');
  } catch (error) {
    console.error('Error creating search indexes:', error);
  }
}

// Routes - we only need the chat route for our AI chatbot
app.use('/api/chat', chatRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

const PORT = NetworkUtils.PORT || 4000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });
// Connect to MongoDB
connectDB().then(async () => {
  // Create indexes
  await createSearchIndexes();

  // Start server
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
