import React from 'react';
import { Bot, Clock, Zap, Settings } from 'lucide-react';
import './HomePage.css';

function HomePage({ onLoginClick, onSignUpClick }) {
  return (
    <div className="app-container">
      {/* Navigation */}
      <nav className="nav">
        <div className="nav-brand">
          <div className="logo">
            <Bot />
            AI Assistant
          </div>
        </div>

        {/* Auth Buttons */}
      </nav>

      {/* Hero Section */}
      <main className="main-content">
        <h1 className="hero-title">
          The Smartest AI Assistant,
          <br />
          Ready to Chat!
        </h1>
        <p className="hero-description">
          Simplify tasks, automate routines, and enjoy personalized interactions—all in one chat.
        </p>

        {/* Features Section */}
        <section className="features" id="features">
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon-text">
                <div className="feature-icon">
                  <Clock />
                </div>
                <h4 className="feature-title">24/7 Availability</h4>
              </div>
              <p className="feature-description">
                Always online for instant assistance, enhancing productivity and ensuring support whenever you need it.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon-text">
                <div className="feature-icon">
                  <Zap />
                </div>
                <h4 className="feature-title">Instant Responses</h4>
              </div>
              <p className="feature-description">
                Get answers in seconds, reducing wait times and improving overall efficiency in your interactions.
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon-text">
                <div className="feature-icon">
                  <Settings />
                </div>
                <h4 className="feature-title">Interactions</h4>
              </div>
              <p className="feature-description">
                Adapts to your preferences, delivering tailored experiences that meet your unique needs and expectations.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default HomePage;