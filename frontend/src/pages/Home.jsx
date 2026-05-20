import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const [text, setText] = useState('');
  const fullText = 'AI-Powered Early Detection';

  useEffect(() => {
    let i = 0;
    const typingInterval = setInterval(() => {
      setText(fullText.slice(0, i + 1));
      i++;
      if (i === fullText.length) clearInterval(typingInterval);
    }, 100);
    return () => clearInterval(typingInterval);
  }, []);

  const handleGetStarted = () => {
    navigate('/patient-form');
  };

  const features = [
    { icon: "🎯", title: "95% Accuracy", desc: "Trained on clinical datasets" },
    { icon: "⚡", title: "Instant Results", desc: "Get prediction in seconds" },
    { icon: "📄", title: "PDF Report", desc: "Download detailed analysis" },
    { icon: "🔒", title: "No Login", desc: "100% free to use" },
  ];

  return (
    <div className="home-modern">
      {/* Hero Section */}
      <div className="hero-modern">
        <div className="hero-badge">
          <span className="badge-icon">🧬</span>
          <span>ML Project Hub</span>
        </div>
        
        <h1 className="hero-title">
          Breast Cancer<br />
          <span className="typing-text">{text}</span>
          <span className="cursor">|</span>
        </h1>
        
        <p className="hero-subtitle">
          Advanced machine learning for accurate risk assessment<br />
          Early detection saves lives
        </p>
        
        <div className="hero-buttons">
          <button className="hero-button primary" onClick={handleGetStarted}>
            Get Started
          </button>
          <button className="hero-button secondary" onClick={() => navigate('/dashboard')}>
            Learn More
          </button>
        </div>

        {/* Stats */}
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

      {/* Features Section */}
      <div className="features-modern">
        {features.map((feature, index) => (
          <div key={index} className="feature-modern glass">
            <div className="feature-modern-icon">{feature.icon}</div>
            <h3>{feature.title}</h3>
            <p>{feature.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;