import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div>
      <div className="hero-section">
        <div className="container">
          <h1>Welcome to Breast Cancer Detection</h1>
          <p>Advanced Machine Learning for Breast Cancer Prediction</p>
          <button onClick={() => navigate('/login')} className="btn-custom">
            Get Started →
          </button>
        </div>
      </div>

      <div className="container">
        <div className="features">
          <div className="feature-card">
            <div className="feature-icon">🎯</div>
            <h3>Accurate Predictions</h3>
            <p>Our ML models achieve high accuracy in breast cancer detection using advanced algorithms.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Real-time Results</h3>
            <p>Get instant predictions with detailed analysis and confidence scores.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔬</div>
            <h3>Medical Grade</h3>
            <p>Built with medical datasets and validated by healthcare professionals.</p>
          </div>
        </div>
      </div>

      <div className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <div>
              <div className="stat-number">95%</div>
              <p>Accuracy Rate</p>
            </div>
            <div>
              <div className="stat-number">10K+</div>
              <p>Patients Analyzed</p>
            </div>
            <div>
              <div className="stat-number">24/7</div>
              <p>Available</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;