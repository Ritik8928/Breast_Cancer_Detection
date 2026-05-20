import React from 'react';
import { useNavigate } from 'react-router-dom';

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="about-container">
      <div className="about-card">
        <h1>About Breast Cancer Detector</h1>
        
        {/* Founder Section */}
        <div className="founder-section">
          <div className="founder-avatar">👨‍💻</div>
          <h2>Ritik Vishwakarma</h2>
          <p className="founder-title">Founder & Full Stack Developer</p>
          <p className="founder-bio">
            Passionate about using AI and machine learning to solve real-world healthcare problems. 
            This project aims to make breast cancer screening more accessible and accurate.
          </p>
          <div className="founder-contact">
            <a href="mailto:ritik8928416595@gmail.com">📧 BreastCanDetector@gmail.com</a>
            <a href="https://github.com/Ritik8928" target="_blank" rel="noopener noreferrer">🔗 GitHub</a>
          </div>
        </div>

        {/* Project Info */}
        <h3>🎯 Project Mission</h3>
        <p>
          To make breast cancer screening more accessible and accurate using cutting-edge technology, 
          ultimately contributing to early detection and better patient outcomes.
        </p>

        <h3>🛠️ Technology Stack</h3>
        <ul>
          <li>Frontend: React.js</li>
          <li>Backend: Flask (Python)</li>
          <li>ML Model: Scikit-learn</li>
          <li>Deployment: Render + Vercel</li>
        </ul>

        <h3>📊 Model Accuracy</h3>
        <p>95% accuracy on test data, trained on clinical breast cancer datasets.</p>

        <h3>📋 Parameters Analyzed</h3>
        <ul>
          <li>Age and Tumour Size</li>
          <li>Regional Nodes (Examined & Positive)</li>
          <li>Race and Marital Status</li>
          <li>T Stage, N Stage, Sixth Stage</li>
          <li>Estrogen & Progesterone Status</li>
        </ul>

        <button className="about-back-btn" onClick={() => navigate('/')}>Back to Home</button>
      </div>
    </div>
  );
};

export default About;