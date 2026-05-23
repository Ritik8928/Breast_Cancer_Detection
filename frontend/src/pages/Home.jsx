import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const [text, setText] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const fullText = 'AI-Powered Early Detection';

  useEffect(() => {
    let i = 0;
    const typingInterval = setInterval(() => {
      setText(fullText.slice(0, i + 1));
      i++;
      if (i === fullText.length) {
        clearInterval(typingInterval);
        // Typing complete, hide cursor after 500ms
        setTimeout(() => {
          setShowCursor(false);
        }, 500);
      }
    }, 100);
    return () => clearInterval(typingInterval);
  }, []);

  return (
    <div className="home-modern">
      <div className="hero-modern">
        <div className="hero-badge">
          <span className="badge-icon">🧬</span>
          <span>BreastAI Care</span>
        </div>
        
        <h1 className="hero-title">
          Breast Cancer <br />
          <span className="typing-text">{text}</span>
          {showCursor && <span className="cursor">|</span>}
        </h1>
        
        <p className="hero-subtitle">
          Take control of your breast health journey
        </p>
        
        <div className="hero-buttons">
          <button className="hero-button primary" onClick={() => navigate('/patient-form')}>
            Get Started
          </button>
          <button className="hero-button secondary" onClick={() => navigate('/dashboard')}>
            Learn More
          </button>
        </div>

        <div className="hero-stats">
          <div className="hero-stat">
            <div className="hero-stat-icon">🎯</div>
            <div>
              <div className="hero-stat-value">95%</div>
              <div className="hero-stat-label">Accuracy</div>
            </div>
          </div>
          <div className="hero-stat">
            <div className="hero-stat-icon">⚡</div>
            <div>
              <div className="hero-stat-value">&lt;5s</div>
              <div className="hero-stat-label">Response</div>
            </div>
          </div>
          <div className="hero-stat">
            <div className="hero-stat-icon">📄</div>
            <div>
              <div className="hero-stat-value">PDF</div>
              <div className="hero-stat-label">Report</div>
            </div>
          </div>
        </div>
      </div>

      <div className="features-modern">
          <div className="feature-modern glass">
            <div className="feature-modern-icon">🎯</div>
            <h3>95% Accuracy</h3>
            <p>Clinically validated AI model</p>
          </div>
          <div className="feature-modern glass">
            <div className="feature-modern-icon">⚡</div>
            <h3>Real-time Results</h3>
            <p>Instant risk assessment</p>
          </div>
          <div className="feature-modern glass">
            <div className="feature-modern-icon">📄</div>
            <h3>Comprehensive Reports</h3>
            <p>Downloadable PDF with insights</p>
          </div>
          <div className="feature-modern glass">
            <div className="feature-modern-icon">🔒</div>
            <h3>Free Access</h3>
            <p>No registration required</p>
          </div>
          <div className="feature-modern glass">
            <div className="feature-modern-icon">🩺</div>
            <h3>Medical Grade</h3>
            <p>Research-backed methodology</p>
          </div>
          <div className="feature-modern glass">
            <div className="feature-modern-icon">🔬</div>
            <h3>11 Parameters</h3>
            <p>Comprehensive analysis</p>
          </div>
      </div>
    </div>
  );
};

export default Home;