import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const About = () => {
  const navigate = useNavigate();
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true);
  }, []);

  const stats = [
    { value: "95%", label: "Model Accuracy", icon: "🎯" },
    { value: "11", label: "Parameters Analyzed", icon: "📊" },
    { value: "< 5s", label: "Response Time", icon: "⚡" },
    { value: "24/7", label: "Availability", icon: "🕒" }
  ];

  const teamMembers = [
    { name: "AI Research Team", role: "ML Model Development", icon: "🧠" },
    { name: "Medical Advisory", role: "Clinical Validation", icon: "🩺" },
    { name: "Tech Team", role: "Platform Development", icon: "💻" }
  ];

  return (
    <div className="about-advanced-container">
      <div className="about-background-animation">
        <div className="about-circle c1"></div>
        <div className="about-circle c2"></div>
        <div className="about-circle c3"></div>
      </div>

      <div className={`about-content ${animate ? 'animate' : ''}`}>
        {/* Hero Section */}
        <div className="about-hero">
          <div className="about-hero-icon">🩺</div>
          <h1>About Breast Cancer Detection</h1>
          <p>Revolutionizing Breast Cancer Detection with Artificial Intelligence</p>
        </div>

        {/* Stats Section */}
        <div className="about-stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className="about-stat-card" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="about-stat-icon">{stat.icon}</div>
              <div className="about-stat-value">{stat.value}</div>
              <div className="about-stat-label">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Mission Section */}
        <div className="about-mission">
          <h2>🎯 Our Mission</h2>
          <p>
            To make breast cancer screening more accessible and accurate using cutting-edge technology, 
            ultimately contributing to early detection and better patient outcomes. We believe that 
            early detection saves lives, and our AI-powered tool is designed to assist healthcare 
            professionals in making informed decisions.
          </p>
        </div>

        {/* How It Works */}
        <div className="about-how-it-works">
          <h2>⚙️ How It Works</h2>
          <div className="about-steps">
            <div className="about-step">
              <div className="step-number">1</div>
              <div className="step-icon">📝</div>
              <h3>Input Parameters</h3>
              <p>Enter 11 clinical parameters including age, tumour size, and lymph node status</p>
            </div>
            <div className="about-step">
              <div className="step-number">2</div>
              <div className="step-icon">🤖</div>
              <h3>AI Analysis</h3>
              <p>Our ML model processes the data using advanced algorithms</p>
            </div>
            <div className="about-step">
              <div className="step-number">3</div>
              <div className="step-icon">📊</div>
              <h3>Instant Results</h3>
              <p>Get real-time prediction with confidence score</p>
            </div>
          </div>
        </div>

        {/* Technology Stack */}
        <div className="about-tech">
          <h2>🛠️ Technology Stack</h2>
          <div className="about-tech-grid">
            <div className="about-tech-item">
              <span className="tech-icon">🐍</span>
              <span>Python</span>
            </div>
            <div className="about-tech-item">
              <span className="tech-icon">⚛️</span>
              <span>React</span>
            </div>
            <div className="about-tech-item">
              <span className="tech-icon">🚀</span>
              <span>Flask</span>
            </div>
            <div className="about-tech-item">
              <span className="tech-icon">🤖</span>
              <span>Scikit-learn</span>
            </div>
            <div className="about-tech-item">
              <span className="tech-icon">📊</span>
              <span>Pandas</span>
            </div>
            <div className="about-tech-item">
              <span className="tech-icon">🔢</span>
              <span>NumPy</span>
            </div>
          </div>
        </div>

        {/* Parameters Section */}
        <div className="about-parameters">
          <h2>📋 Parameters Analyzed</h2>
          <div className="about-params-grid">
            <div className="about-param-category">
              <h3>Clinical Parameters</h3>
              <ul>
                <li>Age</li>
                <li>Tumour Size</li>
                <li>Regional Nodes Examined</li>
                <li>Regional Nodes Positive</li>
              </ul>
            </div>
            <div className="about-param-category">
              <h3>Demographic Parameters</h3>
              <ul>
                <li>Race</li>
                <li>Marital Status</li>
              </ul>
            </div>
            <div className="about-param-category">
              <h3>Pathological Parameters</h3>
              <ul>
                <li>T Stage</li>
                <li>N Stage</li>
                <li>Sixth Stage</li>
                <li>Estrogen Status</li>
                <li>Progesterone Status</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="about-team">
          <h2>👥 Our Team</h2>
          <div className="about-team-grid">
            {teamMembers.map((member, index) => (
              <div key={index} className="about-team-card">
                <div className="team-icon">{member.icon}</div>
                <h3>{member.name}</h3>
                <p>{member.role}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="about-action">
          <button onClick={() => navigate('/predict')} className="about-action-btn">
            Start Your Prediction <span>→</span>
          </button>
        </div>

         {/* Owner Section */}
        <div className="about-owner">
          <div className="owner-card">
            <div className="owner-avatar">👨‍💻</div>
            <h2>Ritik Vishwakarma</h2>
            <p className="owner-title">Founder & Developer</p>
            <p className="owner-desc">
              Passionate about using AI and machine learning to solve real-world healthcare problems. 
              This project aims to make breast cancer screening more accessible and accurate.
            </p>
          </div>
        </div>

        {/* Footer Note */}
        <div className="about-footer-note">
          <p>⚠️ This is an AI-powered prediction tool. Always consult a doctor for medical advice.</p>
        </div>
      </div>
    </div>
  );
};

export default About;