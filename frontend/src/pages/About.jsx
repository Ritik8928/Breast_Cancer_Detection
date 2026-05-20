import React from 'react';

const About = () => {
  return (
    <div className="about-container">
      <div className="about-card">
        <h1>About This Project</h1>
        <p>This AI-powered system helps detect breast cancer risk using machine learning.</p>
        
        <h3>Features</h3>
        <ul>
          <li>95% accurate ML model</li>
          <li>11 clinical parameters</li>
          <li>Instant results</li>
          <li>PDF report download</li>
        </ul>
        
        <h3>Technology</h3>
        <ul>
          <li>React Frontend</li>
          <li>Flask Backend</li>
          <li>Scikit-learn ML Model</li>
        </ul>
        
        <button onClick={() => window.location.href = '/'}>Back to Home</button>
      </div>
    </div>
  );
};

export default About;