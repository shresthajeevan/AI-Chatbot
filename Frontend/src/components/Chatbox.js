import React, { useState } from 'react';
import axios from 'axios';
import './Chatbox.css';

const Chatbox = () => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Hugging Face API key
  const HF_API_KEY = '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';  // Replace with your Hugging Face API key

  // Send Query to Hugging Face API
  const sendQuery = async () => {
    if (!query.trim()) return;

    setIsLoading(true); // Set loading to true

    try {
      // Hugging Face API endpoint for a model (adjust based on the model you're using)
      const endpoint = 'https://api-inference.huggingface.co/models/gpt2'; // Replace with the desired model endpoint

      const res = await axios.post(
        endpoint,
        {
          inputs: query, // Send the query as input to the model
        },
        {
          headers: {
            Authorization: `Bearer ${HF_API_KEY}`, // Bearer token for authorization
          },
        }
      );

      // Extract and set the response from Hugging Face API
      setResponse(res.data[0]?.generated_text || 'No response from model');
    } catch (error) {
      console.error('Error fetching data:', error);
      setResponse('Error fetching data. Please try again.');
    } finally {
      setIsLoading(false); // Set loading to false after the request is complete
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-box">
        <h1>🌍 AI Country Chatbot (Hugging Face API)</h1>
        <div className="input-container">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask me anything..."
          />
          <button onClick={sendQuery}>Ask</button>
        </div>
        <div className="response-box">
          <h3>Response:</h3>
          {isLoading ? <p>Loading...</p> : <p>{response || 'Type a query to get started!'}</p>}
        </div>
      </div>
    </div>
  );
};

export default Chatbox;
