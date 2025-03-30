import React, { useState } from 'react';

const LoginPage = ({ onSignUpClick }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(true); // Theme Toggle

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Both fields are required');
      return;
    }

    try {
      // Sending login request to the backend
      const response = await fetch('http://localhost:5000/api/login', { // Make sure the correct endpoint is used
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Handle successful login
        console.log('Login successful');
        setError('');
        // Save token or user data to localStorage or context if needed
        localStorage.setItem('authToken', data.token);
        // Redirect to a protected route or home page
        window.location.href = '/dashboard';
      } else {
        setError(data.message || 'Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('An error occurred. Please try again later.');
    }
  };

  // Theme Toggle Handler
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div
      style={{
        ...styles.container,
        background: isDarkMode
          ? 'linear-gradient(to right, #0f0c29, #302b63, #24243e)'
          : 'linear-gradient(to right, #a1c4fd, #c2e9fb)',
        color: isDarkMode ? '#fff' : '#333',
      }}
    >
      {/* Theme Toggle Button */}
      <div style={styles.themeToggleContainer}>
        <button onClick={toggleTheme} style={styles.themeToggleButton}>
          {isDarkMode ? '🌞 Light Mode' : '🌙 Dark Mode'}
        </button>
      </div>

      {/* Left Section - Login Form */}
      <div style={styles.leftSection}>
        <div
          style={{
            ...styles.glassCard,
            background: isDarkMode
              ? 'rgba(15, 12, 41, 0.85)'
              : 'rgba(255, 255, 255, 0.9)',
            boxShadow: isDarkMode
              ? '0 8px 32px rgba(0, 0, 0, 0.8)'
              : '0 8px 32px rgba(200, 200, 200, 0.5)',
          }}
        >
          <h2
            style={{
              ...styles.heading,
              color: isDarkMode ? '#9f86c0' : '#007bff',
            }}
          >
            {isDarkMode ? 'Welcome Back!' : 'Login to Continue'}
          </h2>
          {error && <p style={styles.error}>{error}</p>}
          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.inputGroup}>
              <label htmlFor="email" style={styles.label}>
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  ...styles.input,
                  color: isDarkMode ? '#fff' : '#000', // Black text in light mode
                }}
                required
              />
            </div>

            <div style={styles.inputGroup}>
              <label htmlFor="password" style={styles.label}>
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  ...styles.input,
                  color: isDarkMode ? '#fff' : '#000', // Black text in light mode
                }}
                required
              />
            </div>

            <button type="submit" style={styles.button}>
              Login
            </button>

            <div style={styles.footer}>
              <p style={styles.footerText}>
                {'Don\'t have an account? '}
                <button
                  type="button"
                  onClick={onSignUpClick}
                  style={styles.linkButton}
                >
                  Sign Up
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* Right Section - AI-Related Images */}
      <div style={styles.rightSection}>
        <div style={styles.imageContainer}>
          <img
            src={
              isDarkMode
                ? 'https://images.unsplash.com/photo-1536898481282-0f120b5938a1?crop=entropy&cs=tinysrgb&fit=max&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDJ8fGFlfGltYWdlfGVufDB8fHx8fDE2NTc1MjM1Mjg&ixlib=rb-1.2.1&q=80&w=1080' // AI Concept for Dark Mode
                : 'https://images.unsplash.com/photo-1593642532973-d31b6557fa68?crop=entropy&cs=tinysrgb&fit=max&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDExfGFlfGltYWdlfGVufDB8fHx8fDE2NTc1MjM1Mjg&ixlib=rb-1.2.1&q=80&w=1080' // AI Concept for Light Mode
            }
            alt="AI Concept"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src =
                'https://via.placeholder.com/600x400?text=AI+Image+Fallback';
            }}
            style={styles.image}
          />
        </div>
        <div style={styles.textContainer}>
          <h3
            style={{
              ...styles.textTitle,
              color: isDarkMode ? '#9f86c0' : '#007bff',
            }}
          >
            {isDarkMode ? 'Revolutionize the Future' : 'AI is the Future'}
          </h3>
          <p style={styles.textDescription}>
            {isDarkMode
              ? 'Explore the limitless possibilities of artificial intelligence. Join us.'
              : 'Discover the potential of AI. Shape the future today.'}
          </p>
        </div>
      </div>
    </div>
  );
};

// 🎨 Updated Styles
const styles = {
  container: {
    display: 'flex',
    height: '100vh',
    width: '100vw',
    overflow: 'hidden',
    fontFamily: "'Poppins', sans-serif",
    transition: 'background 0.5s ease-in-out',
  },
  themeToggleContainer: {
    position: 'absolute',
    top: '20px',
    right: '20px',
    zIndex: 5,
  },
  themeToggleButton: {
    padding: '10px 20px',
    backgroundColor: '#00d4ff',
    color: '#1e1e2f',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
    transition: 'transform 0.2s ease-in-out',
  },
  leftSection: {
    width: '40%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  glassCard: {
    width: '90%',
    maxWidth: '400px',
    padding: '30px 40px',
    borderRadius: '16px',
    backdropFilter: 'blur(10px)',
    transition: 'background 0.5s ease-in-out, box-shadow 0.5s',
  },
  heading: {
    textAlign: 'center',
    fontSize: '2.5rem',
    marginBottom: '20px',
  },
  error: {
    color: '#ff4d4d',
    fontSize: '14px',
    marginBottom: '12px',
    textAlign: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '18px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    fontSize: '14px',
    color: '#ddd',
    marginBottom: '8px',
    fontWeight: '500',
  },
  input: {
    padding: '14px',
    borderRadius: '8px',
    border: '1px solid #444',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    fontSize: '16px',
    outline: 'none',
    transition: 'border-color 0.3s ease-in-out',
  },
  button: {
    padding: '15px',
    backgroundColor: '#00d4ff',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '16px',
    transition: 'transform 0.2s ease-in-out',
  },
  footer: {
    marginTop: '20px',
    textAlign: 'center',
  },
  footerText: {
    color: '#aaa',
    fontSize: '14px',
  },
  linkButton: {
    backgroundColor: 'transparent',
    color: '#00d4ff',
    border: 'none',
    cursor: 'pointer',
    textDecoration: 'underline',
  },
  rightSection: {
    width: '60%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    padding: '20px',
  },
  imageContainer: {
    marginBottom: '20px',
  },
  image: {
    width: '100%',
    maxWidth: '500px',
    borderRadius: '8px',
    objectFit: 'cover',
  },
  textContainer: {
    textAlign: 'center',
  },
  textTitle: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    marginBottom: '12px',
  },
  textDescription: {
    fontSize: '1.1rem',
    color: '#ccc',
  },
};

export default LoginPage;
