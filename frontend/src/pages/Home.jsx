import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <div className="hero-section">
        <h1>🩺 Breast Cancer Prediction</h1>
        <p>AI-powered early detection for better outcomes</p>
        <button onClick={() => navigate('/patient-form')} className="btn-primary">
          Start Prediction →
        </button>
      </div>
      
      <div className="features">
        <div className="feature-card">
          <div className="feature-icon">🎯</div>
          <h3>95% Accuracy</h3>
          <p>Advanced ML model trained on medical data</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">⚡</div>
          <h3>Real-time Results</h3>
          <p>Instant prediction with confidence score</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">📊</div>
          <h3>PDF Report</h3>
          <p>Download detailed medical report</p>
        </div>
      </div>
    </div>
  );
};

export default Home;