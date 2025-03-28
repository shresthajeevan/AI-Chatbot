import React, { useState, useCallback, useRef, useEffect } from 'react';
import axios from 'axios';
import Sidebar from './components/Sidebar';
import PromptInput from './components/PromptInput';
import OutputDisplay from './components/OutputDisplay';
import './styles/App.css';

const App = () => {
  const [output, setOutput] = useState('');
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const requestSource = useRef(null);

  // Handle submit request
  const handleSubmit = useCallback(async (query) => {
    // Cancel previous request if exists
    if (requestSource.current) {
      requestSource.current.cancel('New request initiated');
    }

    requestSource.current = axios.CancelToken.source();
    setIsLoading(true);
    setError(null);

    try {
      // Make the API request
      const response = await axios.post('http://localhost:5000/api/chat', { query }, {
        cancelToken: requestSource.current.token,
        timeout: 15000,  // Timeout after 15 seconds
      });

      const newResponse = response.data?.response || 'No response from server';
      setOutput(newResponse);

      // Update history with the new query/response
      setHistory(prev => {
        const existingIndex = prev.findIndex(item => item.query === query);
        
        if (existingIndex >= 0) {
          const updated = [...prev];
          updated[existingIndex] = { 
            ...updated[existingIndex], 
            response: newResponse,
            timestamp: Date.now(),
          };
          return updated;
        }

        return [
          ...prev,
          {
            query,
            response: newResponse,
            timestamp: Date.now(),
          },
        ].slice(-20);  // Keep the last 20 history items
      });

    } catch (err) {
      // Handle error: Check if it's a cancellation error or any other error
      if (!axios.isCancel(err)) {
        const errorMessage = err.response?.data?.error?.message ||
                             err.response?.data?.error ||
                             err.message ||
                             'Request failed';
        setError(errorMessage);
        setOutput(`Error: ${errorMessage}`);
      }
    } finally {
      setIsLoading(false);
      requestSource.current = null;  // Reset cancel token source
    }
  }, []);

  // Handle click on history item
  const handleHistoryItemClick = useCallback((query) => {
    const historyItem = history.find(item => item.query === query);
    if (historyItem?.response) {
      setOutput(historyItem.response);  // Display cached response
    } else {
      handleSubmit(query);  // Fetch the response if not in history
    }
  }, [history, handleSubmit]);

  // Effect to clear error message after 5 seconds (optional)
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);  // Clear error after 5 seconds
      return () => clearTimeout(timer);  // Cleanup timer on unmount
    }
  }, [error]);

  return (
    <div className="app">
      <Sidebar 
        history={history} 
        onHistoryItemClick={handleHistoryItemClick} 
        isLoading={isLoading} 
      />
      
      <div className="main-content">
        {error && (
          <div className="error-banner">
            {error}
            <button onClick={() => setError(null)}>Dismiss</button>
          </div>
        )}
        
        {/* Display a loading state in OutputDisplay */}
        <OutputDisplay 
          output={output} 
          isLoading={isLoading} 
        />
        
        <PromptInput 
          onSubmit={handleSubmit} 
          disabled={isLoading} 
        />
      </div>
    </div>
  );
};

export default React.memo(App);
