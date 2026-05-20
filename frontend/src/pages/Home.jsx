import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const [text, setText] = useState('');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const fullText = 'AI-Powered Early Detection';

  useEffect(() => {
    // Typing effect
    let i = 0;
    const typingInterval = setInterval(() => {
      setText(fullText.slice(0, i + 1));
      i++;
      if (i === fullText.length) clearInterval(typingInterval);
    }, 100);
    
    return () => clearInterval(typingInterval);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const features = [
    { icon: "🎯", title: "95% Accuracy", desc: "Trained on clinical datasets" },
    { icon: "⚡", title: "Instant Results", desc: "Get prediction in seconds" },
    { icon: "📄", title: "PDF Report", desc: "Download detailed analysis" },
    { icon: "🔒", title: "No Login", desc: "100% free to use" },
  ];

  return (
    <div className="home-modern">
      {/* Animated Background with Mouse Follow */}
      <div className="animated-bg">
        <div className="gradient-sphere" style={{ transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)` }}></div>
        <div className="gradient-sphere-2" style={{ transform: `translate(${-mousePosition.x * 0.01}px, ${-mousePosition.y * 0.01}px)` }}></div>
      </div>

      {/* Hero Section */}
      <div className="hero-section-main">
        <div className="hero-badge">
          <span className="badge-icon">🧬</span>
          <span>ML Project Hub</span>
        </div>
        
        <h1 className="hero-title-main">
          Breast Cancer<br />
          <span className="gradient-text">{text}</span>
          <span className="cursor">|</span>
        </h1>
        
        <p className="hero-subtitle-main">
          Advanced machine learning for accurate risk assessment<br />
          Early detection saves lives
        </p>
        
        <button className="hero-get-started" onClick={() => navigate('/patient-form')}>
          Get Started
          <span className="btn-arrow">→</span>
        </button>

        {/* Scroll Indicator */}
        <div className="scroll-indicator">
          <span>Scroll to explore</span>
          <div className="scroll-mouse">
            <div className="scroll-wheel"></div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="features-section">
        <h2 className="section-title-main">Why Choose Us</h2>
        <div className="features-grid-main">
          {features.map((feature, index) => (
            <div key={index} className="feature-card-main glass">
              <div className="feature-icon-main">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <div className="stats-section-main">
        <div className="stats-container">
          <div className="stat-item-main">
            <div className="stat-number">95%</div>
            <div className="stat-label-main">Accuracy</div>
          </div>
          <div className="stat-item-main">
            <div className="stat-number">10K+</div>
            <div className="stat-label-main">Patients</div>
          </div>
          <div className="stat-item-main">
            <div className="stat-number">&lt;5s</div>
            <div className="stat-label-main">Response</div>
          </div>
          <div className="stat-item-main">
            <div className="stat-number">24/7</div>
            <div className="stat-label-main">Available</div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="cta-section-main">
        <div className="cta-card-main">
          <h2>Ready to Check Your Risk?</h2>
          <p>Free, fast, and confidential assessment</p>
          <button className="cta-button-main" onClick={() => navigate('/patient-form')}>
            Get Started Now →
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;