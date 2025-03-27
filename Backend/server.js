const express = require('express');
const axios = require('axios');
const cors = require('cors'); // Import the CORS package
const app = express();

app.use(cors());  // Enable CORS for all routes
app.use(express.json());

// Set your actual Gemini API key here
const GEMINI_API_KEY = 'YOUR_API_KEY';  // Replace with your actual API key
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent?key=${GEMINI_API_KEY}`;

app.post('/api/chat', async (req, res) => {
  try {
    // Extract the query from the request body
    const { query } = req.body;  // Expecting { query: "your question" }

    // Validate the query to make sure it's a string
    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: 'Query must be a string' });
    }

    // Prepare the payload to send to the Gemini API
    const payload = {
      contents: [{
        role: "user",
        parts: [{ text: query }]
      }]
    };

    // Make a POST request to the Gemini API
    const response = await axios.post(GEMINI_API_URL, payload, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 15000  // 15-second timeout
    });

    // Extract the response text from Gemini's API response
    const responseText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text 
                          || 'No response generated';

    // Return the response from Gemini API
    return res.json({ response: responseText });

  } catch (error) {
    console.error('API Error:', error.response?.data || error.message);

    // Handle errors from the API or other internal errors
    if (error.response) {
      return res.status(error.response.status).json({
        error: 'Gemini API Error',
        details: error.response.data
      });
    }

    return res.status(500).json({
      error: 'Internal server error',
      details: error.message
    });
  }
});

// Set the port to listen on (default 5000 or custom port from environment)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
