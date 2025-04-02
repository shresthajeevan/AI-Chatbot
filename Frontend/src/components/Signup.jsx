import React, { useState } from 'react';

const SignUpPage = ({ onLoginClick, onSignUpSuccess }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Check if all fields are filled
    if (!formData.email || !formData.password || !formData.confirmPassword) {
      return setError('All fields are required');
    }

    // Validate email (only for email field)
    if (formData.email && !formData.email.includes('@')) {
      return setError('Please enter a valid email address');
    }

    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }

    setIsLoading(true);
    
    try {
      const response = await fetch('http://localhost:5000/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      onSignUpSuccess(); // Trigger success callback
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  // Dynamic styles
  const themeStyles = {
    container: {
      background: isDarkMode
        ? 'linear-gradient(135deg, #1f1c3d, #302b63, #24243e)'
        : 'linear-gradient(135deg, #a1c4fd, #c2e9fb)',
      color: isDarkMode ? '#fff' : '#333',
    },
    card: {
      background: isDarkMode
        ? 'rgba(15, 12, 41, 0.85)'
        : 'rgba(255, 255, 255, 0.9)',
      boxShadow: isDarkMode
        ? '0 8px 32px rgba(0, 0, 0, 0.8)'
        : '0 8px 32px rgba(200, 200, 200, 0.5)',
    },
    input: {
      color: isDarkMode ? '#fff' : '#000',
      backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
    }
  };

  return (
    <div style={{ ...styles.container, ...themeStyles.container }}>
      {/* Theme Toggle */}
      <div style={styles.themeToggleContainer}>
        <button 
          onClick={toggleTheme} 
          style={{ 
            ...styles.themeToggleButton,
            backgroundColor: isDarkMode ? '#00d4ff' : '#9f86c0'
          }}
        >
          {isDarkMode ? '🌞 Light Mode' : '🌙 Dark Mode'}
        </button>
      </div>

      {/* Form Section */}
      <div style={styles.leftSection}>
        <div style={{ ...styles.glassCard, ...themeStyles.card }}>
          <h2 style={{ ...styles.heading, color: isDarkMode ? '#9f86c0' : '#007bff' }}>
            {isDarkMode ? 'Join the Future' : 'Welcome Aboard!'}
          </h2>
          
          {error && (
            <div style={styles.error}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#ff4d4d">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
              </svg>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={styles.form}>
            {['email', 'password', 'confirmPassword'].map((field) => (
              <div key={field} style={styles.inputGroup}>
                <label htmlFor={field} style={styles.label}>
                  {field === 'confirmPassword' ? 'Confirm Password' : field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
                <input
                  type={field === 'confirmPassword' || field === 'password' ? 'password' : 'email'}
                  id={field}
                  value={formData[field]}
                  onChange={handleChange}
                  style={{ ...styles.input, ...themeStyles.input }}
                  required
                />
              </div>
            ))}

            <button 
              type="submit" 
              style={styles.button}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <svg style={styles.spinner} viewBox="0 0 50 50">
                    <circle cx="25" cy="25" r="20" fill="none" strokeWidth="5"></circle>
                  </svg>
                  Signing Up...
                </>
              ) : 'Sign Up'}
            </button>
          </form>

          <div style={styles.footer}>
            <p style={styles.footerText}>
              Already have an account?{' '}
              <button 
                type="button" 
                onClick={onLoginClick} 
                style={styles.linkButton}
              >
                Login
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* Text Section */}
      <div style={styles.rightSection}>
        <div style={styles.textContainer}>
          <h3 style={{ ...styles.textTitle, color: isDarkMode ? '#9f86c0' : '#007bff', fontSize: '36px', marginLeft: '-20px' }}>
            {isDarkMode ? 'Revolutionize the Future' : 'AI is the Future'}
          </h3>
          <p style={{ ...styles.textDescription, color: isDarkMode ? '#ccc' : '#555', fontSize: '18px' }}>
            {isDarkMode
              ? 'Explore the limitless possibilities of artificial intelligence. Join us.'
              : 'Discover the potential of AI. Shape the future today.'}
          </p>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    height: '100vh',
    width: '100vw',
    overflow: 'hidden',
    fontFamily: "'Poppins', sans-serif",
    transition: 'all 0.5s ease',
  },
  themeToggleContainer: {
    position: 'absolute',
    top: '20px',
    right: '20px',
    zIndex: 1000,
  },
  themeToggleButton: {
    padding: '10px 20px',
    border: 'none',
    borderRadius: '30px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  leftSection: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
    marginLeft: '-90px',  // Shifting the card left
  },
  glassCard: {
    width: '100%',
    maxWidth: '450px',
    padding: '40px',
    borderRadius: '20px',
    backdropFilter: 'blur(10px)',
    transition: 'all 0.5s ease',
  },
  heading: {
    textAlign: 'center',
    fontSize: '2.2rem',
    marginBottom: '30px',
    fontWeight: '600',
  },
  error: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: '#ff4d4d',
    fontSize: '14px',
    marginBottom: '20px',
    padding: '10px',
    borderRadius: '8px',
    backgroundColor: 'rgba(255, 77, 77, 0.1)',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    fontSize: '14px',
    fontWeight: '500',
    marginBottom: '8px',
  },
  input: {
    padding: '12px',
    borderRadius: '8px',
    border: 'none',
    fontSize: '16px',
  },
  button: {
    padding: '14px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  spinner: {
    marginRight: '10px',
    animation: 'spin 1s linear infinite',
  },
  footer: {
    textAlign: 'center',
    marginTop: '20px',
  },
  footerText: {
    fontSize: '14px',
  },
  linkButton: {
    color: '#007bff',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  rightSection: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px',
  },
  textContainer: {
    marginTop: '20px',
    textAlign: 'center',
  },
  textTitle: {
    fontSize: '36px', // Increased font size
    fontWeight: '700',
    marginBottom: '15px',
    marginLeft: '-20px',  // Shift text left
  },
  textDescription: {
    fontSize: '18px', // Increased font size
    fontWeight: '400',
    color: '#999',
  },
};

export default SignUpPage;
