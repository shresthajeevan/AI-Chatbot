import React from 'react';

const HomePage = () => {
  return (
    <div className="home-page">
      <div className="hero-section">
        <h1>Welcome to Our AI Platform</h1>
        <p>Experience the power of AI with our cutting-edge technology</p>
      </div>
      
      <div className="features">
        <div className="feature-card">
          <h3>Smart AI Assistant</h3>
          <p>Get instant answers to your questions</p>
        </div>
        <div className="feature-card">
          <h3>Personalized Experience</h3>
          <p>Your interactions shape your experience</p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;