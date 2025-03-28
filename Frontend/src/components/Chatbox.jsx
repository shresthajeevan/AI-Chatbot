import React, { useState } from 'react';
import axios from 'axios';
import './styles/chatbox.css'; // If the CSS file is in a 'styles' folder




const Chatbox = () => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const sendQuery = async () => {
    if (!query.trim()) {
      setError('Please enter a question');
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      const res = await axios.post('http://localhost:5000/api/chat', {
        contents: [{
          parts: [{ text: query }]
        }]
      }, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 10000 // 10 second timeout
      });

      setResponse(res.data?.response || 'No response generated');
    } catch (err) {
      console.error('API Error:', err);
      setError(err.response?.data?.error || 
              err.message || 
              'Failed to get response');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !isLoading) {
      sendQuery();
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-box">
        <h1>🌍 AI Country Chatbot (Gemini API)</h1>
        
        <div className="input-container">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask me anything..."
            disabled={isLoading}
            aria-busy={isLoading}
          />
          <button 
            onClick={sendQuery} 
            disabled={isLoading}
            aria-label={isLoading ? 'Processing' : 'Submit question'}
          >
            {isLoading ? '✈️ Sending...' : 'Ask'}
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="response-box">
          <h3>Response:</h3>
          {isLoading ? (
            <div className="loading-indicator">Thinking...</div>
          ) : (
            <p>{response || 'Type a query to get started!'}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chatbox;