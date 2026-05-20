import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const healthTips = [
    { icon: "🩺", tip: "Regular screening saves lives" },
    { icon: "🏃‍♀️", tip: "Exercise 30 minutes daily" },
    { icon: "🥗", tip: "Eat more fruits & vegetables" },
    { icon: "🚭", tip: "Avoid smoking and limit alcohol" },
    { icon: "⚖️", tip: "Maintain a healthy weight" },
    { icon: "😴", tip: "Get 7-8 hours of sleep" },
  ];

  const warningSigns = [
    "New lump in breast or armpit",
    "Change in breast size or shape",
    "Nipple discharge or inversion",
    "Skin dimpling or redness",
    "Persistent breast pain",
  ];

  const preventionTips = [
    "Monthly breast self-exam",
    "Annual mammogram after 40",
    "Healthy diet rich in antioxidants",
    "Regular physical activity",
    "Limit alcohol consumption",
  ];

  return (
    <div className="dashboard-modern">
      {/* Header with Title Center, Date/Time Right */}
      <div className="dashboard-header-modern">
        <div className="header-title">
          <h1 className="glow-text">Health Dashboard</h1>
          <p className="subtitle">Your breast cancer awareness center</p>
        </div>
        <div className="date-card glass">
          <div className="date-icon">📅</div>
          <div>
            <div className="date">{formatDate(currentTime)}</div>
            <div className="time">{formatTime(currentTime)}</div>
          </div>
        </div>
      </div>

      {/* Stats Grid - Centered */}
      <div className="stats-grid">
        <div className="stat-card glass">
          <div className="stat-icon">🎯</div>
          <div className="stat-value">95%</div>
          <div className="stat-label">Model Accuracy</div>
        </div>
        <div className="stat-card glass">
          <div className="stat-icon">⚡</div>
          <div className="stat-value">&lt;5s</div>
          <div className="stat-label">Response Time</div>
        </div>
        <div className="stat-card glass">
          <div className="stat-icon">💪</div>
          <div className="stat-value">90%</div>
          <div className="stat-label">Early Survival</div>
        </div>
        <div className="stat-card glass">
          <div className="stat-icon">📊</div>
          <div className="stat-value">1:8</div>
          <div className="stat-label">Women Affected</div>
        </div>
      </div>

      {/* Assessment Card - Centered */}
      <div className="assessment-card" onClick={() => navigate('/patient-form')}>
        <div className="assessment-content">
          <div className="assessment-text">
            <h2>Start Your Risk Assessment</h2>
            <p>Get instant AI-powered breast cancer risk prediction</p>
          </div>
          <button className="assessment-btn">Begin Assessment →</button>
        </div>
      </div>

      {/* Tabs - Centered */}
      <div className="tabs">
        <button className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
          📋 Overview
        </button>
        <button className={`tab-btn ${activeTab === 'tips' ? 'active' : ''}`} onClick={() => setActiveTab('tips')}>
          💡 Health Tips
        </button>
        <button className={`tab-btn ${activeTab === 'warning' ? 'active' : ''}`} onClick={() => setActiveTab('warning')}>
          ⚠️ Warning Signs
        </button>
        <button className={`tab-btn ${activeTab === 'prevention' ? 'active' : ''}`} onClick={() => setActiveTab('prevention')}>
          🛡️ Prevention
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'overview' && (
          <div className="info-grid">
            <div className="info-card glass">
              <div className="info-icon">🎗️</div>
              <h3>What is Breast Cancer?</h3>
              <p>Breast cancer is a disease where cells in the breast grow uncontrollably. It is the most common cancer among women worldwide.</p>
            </div>
            <div className="info-card glass">
              <div className="info-icon">🔍</div>
              <h3>Early Detection</h3>
              <p>Regular screening and self-examination can help detect breast cancer early when treatment is most effective.</p>
            </div>
            <div className="info-card glass">
              <div className="info-icon">🩺</div>
              <h3>Risk Factors</h3>
              <p>Age, family history, genetic mutations (BRCA1/BRCA2), dense breast tissue, and lifestyle factors.</p>
            </div>
            <div className="info-card glass">
              <div className="info-icon">💪</div>
              <h3>Survival Rate</h3>
              <p>When caught early, the 5-year survival rate for breast cancer is 99%.</p>
            </div>
          </div>
        )}

        {activeTab === 'tips' && (
          <div className="tips-grid">
            {healthTips.map((item, index) => (
              <div key={index} className="tip-card glass">
                <div className="tip-icon">{item.icon}</div>
                <div className="tip-text">{item.tip}</div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'warning' && (
          <div className="warning-grid">
            {warningSigns.map((sign, index) => (
              <div key={index} className="warning-card glass">
                <div className="warning-icon">⚠️</div>
                <div className="warning-text">{sign}</div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'prevention' && (
          <div className="prevention-grid">
            {preventionTips.map((tip, index) => (
              <div key={index} className="prevention-card glass">
                <div className="prevention-icon">✅</div>
                <div className="prevention-text">{tip}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="dashboard-footer">
        <p>⚠️ This is an AI-powered prediction tool. Always consult a doctor for medical advice.</p>
        <p>© 2024 ML Project Hub | Early Detection Saves Lives</p>
      </div>
    </div>
  );
};

export default Dashboard;