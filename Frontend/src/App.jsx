import React, { useState, useCallback, useRef, useEffect } from 'react';
import axios from 'axios';
import Sidebar from './components/Sidebar';
import PromptInput from './components/PromptInput';
import OutputDisplay from './components/OutputDisplay';
import Login from './components/Login';
import SignUp from './components/Signup';
import HomePage from './components/HomePage';

import './styles/App.css';

const App = () => {
  const [output, setOutput] = useState('');
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const requestSource = useRef(null);

  // Handle submit request
  const handleSubmit = useCallback(async (query) => {
    if (requestSource.current) {
      requestSource.current.cancel('New request initiated');
    }

    requestSource.current = axios.CancelToken.source();
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post('http://localhost:5000/api/chat', { query }, {
        cancelToken: requestSource.current.token,
        timeout: 15000,
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
          { query, response: newResponse, timestamp: Date.now() },
        ].slice(-20);  // Keep the last 20 history items
      });

    } catch (err) {
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
      requestSource.current = null;
    }
  }, []);

  // Handle click on history item
  const handleHistoryItemClick = useCallback((query) => {
    const historyItem = history.find(item => item.query === query);
    if (historyItem?.response) {
      setOutput(historyItem.response);
    } else {
      handleSubmit(query);
    }
  }, [history, handleSubmit]);

  // Effect to clear error message after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
    setShowLogin(false);
    setShowSignUp(false);
  };

  return (
    <div className="app">
      {/* Always show auth buttons when not authenticated */}
      {!isAuthenticated && (
        <div className="auth-buttons">
          <button onClick={() => setShowLogin(true)} className="auth-button">
            Login
          </button>
          <button onClick={() => setShowSignUp(true)} className="auth-button">
            Sign Up
          </button>
        </div>
      )}

      {isAuthenticated ? (
        <>
          <Sidebar history={history} onHistoryItemClick={handleHistoryItemClick} isLoading={isLoading} />
          <div className="main-content">
            {error && (
              <div className="error-banner">
                {error}
                <button onClick={() => setError(null)}>Dismiss</button>
              </div>
            )}
            <OutputDisplay output={output} isLoading={isLoading} />
            <PromptInput onSubmit={handleSubmit} disabled={isLoading} />
          </div>
        </>
      ) : (
        <>
          {/* Show HomePage by default */}
          <HomePage />
          
          {/* Show auth modals when buttons are clicked */}
          {showLogin && (
            <div className="auth-modal">
              <Login 
                onLoginSuccess={handleAuthSuccess}
                onSignUpClick={() => {
                  setShowLogin(false);
                  setShowSignUp(true);
                }}
                onClose={() => setShowLogin(false)}
              />
            </div>
          )}
          
          {showSignUp && (
            <div className="auth-modal">
              <SignUp 
                onSignUpSuccess={handleAuthSuccess}
                onLoginClick={() => {
                  setShowSignUp(false);
                  setShowLogin(true);
                }}
                onClose={() => setShowSignUp(false)}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default React.memo(App);