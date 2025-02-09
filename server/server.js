const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fetch = require('node-fetch'); // Add this to your package.json if not present

const app = express();
const port =  4000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Dgraph GraphQL endpoint
const DGRAPH_ENDPOINT = 'http://13.235.80.128:8080/graphql';

// GraphQL proxy endpoint
app.post('/graphql', async (req, res) => {
  try {
    console.log(JSON.stringify(req.body));
    // Forward the request to Dgraph's GraphQL endpoint
    const response = await fetch(DGRAPH_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body)
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('GraphQL Request Error:', error);
    res.status(500).json({
      errors: [{
        message: error.message
      }]
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`GraphQL endpoint: http://localhost:${port}/graphql`);
});