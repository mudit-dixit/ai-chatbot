// server/routes/chatRoutes.js
const express = require('express');
const router = express.Router();
const { generateResponse } = require('../controllers/chatController');

// Main chat endpoint for handling questions
router.post('/ask', async (req, res) => {
  try {
    if (!req.body.question) {
      return res.status(400).json({
        error: 'Question is required',
      });
    }
    console.log('================Request Details:=================');
    console.log({
      body: req.body,
      query: req.query,
      params: req.params,
      method: req.method,
      headers: req.headers,
      url: req.url,
    });

    // Better logging for response
    console.log('================Response Details:=================');
    console.log({
      statusCode: res.statusCode,
      headersSent: res.headersSent,
      locals: res.locals,
    });
    const response = await generateResponse(req, res);
    res.json(response);
  } catch (error) {
    console.error('Chat route error:', error);
    res.status(500).json({
      error: 'Error processing your question',
      details: error.message,
    });
  }
});

// Get chat history (optional - if you want to implement history)
router.get('/history', async (req, res) => {
  try {
    // You can implement chat history retrieval here if needed
    res.json({
      message: 'History endpoint - implement if needed',
    });
  } catch (error) {
    res.status(500).json({
      error: 'Error retrieving chat history',
    });
  }
});

// Stream response (for real-time responses)
router.post('/stream', async (req, res) => {
  try {
    if (!req.body.question) {
      return res.status(400).json({
        error: 'Question is required',
      });
    }

    // Set headers for streaming
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Generate streaming response
    const stream = await generateResponse(req.body.question, true);

    stream.on('data', (chunk) => {
      res.write(`data: ${JSON.stringify(chunk)}\n\n`);
    });

    stream.on('end', () => {
      res.end();
    });

    // Handle client disconnect
    req.on('close', () => {
      stream.destroy();
    });
  } catch (error) {
    console.error('Stream route error:', error);
    res.status(500).json({
      error: 'Error processing streaming request',
    });
  }
});

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;
