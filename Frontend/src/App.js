import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import PromptInput from './components/PromptInput';
import OutputDisplay from './components/OutputDisplay';
import axios from 'axios';
import './styles/App.css';

const App = () => {
  const [output, setOutput] = useState('');
  const [history, setHistory] = useState([]);

  const handleSubmit = async (query) => {
    try {
      // Simulate an API call (replace with your actual API endpoint)
      const response = await axios.post('http://127.0.0.1:5000/api/chat', {
        query,
      });

      // Set the new output (old output is preserved in `displayedOutput`)
      setOutput(response.data.response);

      // Check if the query already exists in history
      if (!history.includes(query)) {
        setHistory([...history, query]); // Add query to history if it doesn't exist
      }
    } catch (error) {
      setOutput('An error occurred. Please try again.');
    }
  };

  const handleHistoryItemClick = (query) => {
    setOutput(''); // Clear existing output
    handleSubmit(query); // Re-run the query
  };

  return (
    <div className="app">
      <Sidebar history={history} onHistoryItemClick={handleHistoryItemClick} />
      <div className="main-content">
        <OutputDisplay output={output} />
        <PromptInput onSubmit={handleSubmit} />
      </div>
    </div>
  );
};

export default App;