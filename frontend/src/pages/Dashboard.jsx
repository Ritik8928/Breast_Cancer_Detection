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

  const healthTips = [
    { tip: "Regular screening saves lives", icon: "🩺", color: "#622B14" },
    { tip: "Exercise 30 minutes daily", icon: "🏃‍♀️", color: "#995F2F" },
    { tip: "Maintain healthy weight", icon: "⚖️", color: "#978F66" },
    { tip: "Limit alcohol consumption", icon: "🍷", color: "#E4D6A9" },
    { tip: "Eat more fruits & vegetables", icon: "🥗", color: "#622B14" },
    { tip: "Don't smoke", icon: "🚭", color: "#995F2F" },
  ];

  const facts = [
    { fact: "1 in 8 women develop breast cancer", icon: "📊" },
    { fact: "Early detection saves lives", icon: "🎯" },
    { fact: "90% survival rate when caught early", icon: "💪" },
    { fact: "Men can also get breast cancer", icon: "👨" },
  ];

  const foods = [
    { name: "Broccoli", benefit: "Contains sulforaphane", icon: "🥦" },
    { name: "Turmeric", benefit: "Anti-inflammatory", icon: "🟡" },
    { name: "Green Tea", benefit: "Rich in antioxidants", icon: "🍵" },
    { name: "Berries", benefit: "High in flavonoids", icon: "🫐" },
    { name: "Walnuts", benefit: "Omega-3 fatty acids", icon: "🥜" },
    { name: "Spinach", benefit: "Rich in folate", icon: "🥬" },
  ];

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

  return (
    <div className="modern-dashboard">
      {/* Animated Background */}
      <div className="animated-bg">
        <div className="gradient-sphere"></div>
        <div className="gradient-sphere-2"></div>
      </div>

      {/* Main Content */}
      <div className="dashboard-content">
        {/* Header with Date & Time */}
        <div className="dashboard-header-modern">
          <div className="header-left">
            <h1 className="glow-text">Health Dashboard</h1>
            <p className="subtitle">Your personal breast cancer awareness center</p>
          </div>
          <div className="header-right">
            <div className="date-card glass">
              <div className="date-icon">📅</div>
              <div className="date-info">
                <div className="date">{formatDate(currentTime)}</div>
                <div className="time">{formatTime(currentTime)}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid-modern">
          <div className="stat-card-modern glass">
            <div className="stat-icon">🎯</div>
            <div className="stat-value">95%</div>
            <div className="stat-label">Model Accuracy</div>
          </div>
          <div className="stat-card-modern glass">
            <div className="stat-icon">⚡</div>
            <div className="stat-value">{new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening'}</div>
            <div className="stat-label">Time of Day</div>
          </div>
          <div className="stat-card-modern glass">
            <div className="stat-icon">💪</div>
            <div className="stat-value">90%</div>
            <div className="stat-label">Early Survival Rate</div>
          </div>
          <div className="stat-card-modern glass">
            <div className="stat-icon">📊</div>
            <div className="stat-value">1:8</div>
            <div className="stat-label">Women Affected</div>
          </div>
        </div>

        {/* Main Action Button */}
        <div className="action-card-modern" onClick={() => navigate('/patient-form')}>
          <div className="action-content">
            <div className="action-text">
              <h2>Start Your Risk Assessment</h2>
              <p>Get instant AI-powered breast cancer risk prediction</p>
            </div>
            <div className="action-button">
              <button className="glow-button">Begin Assessment →</button>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="tabs-modern">
          <button className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
            📋 Overview
          </button>
          <button className={`tab-btn ${activeTab === 'tips' ? 'active' : ''}`} onClick={() => setActiveTab('tips')}>
            💡 Health Tips
          </button>
          <button className={`tab-btn ${activeTab === 'nutrition' ? 'active' : ''}`} onClick={() => setActiveTab('nutrition')}>
            🥗 Nutrition Guide
          </button>
          <button className={`tab-btn ${activeTab === 'facts' ? 'active' : ''}`} onClick={() => setActiveTab('facts')}>
            📊 Key Facts
          </button>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === 'overview' && (
            <div className="overview-grid">
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
                <div className="info-icon">⚠️</div>
                <h3>Warning Signs</h3>
                <p>Lump in breast or armpit, change in breast shape, nipple discharge, skin dimpling, or redness.</p>
              </div>
              <div className="info-card glass">
                <div className="info-icon">🩺</div>
                <h3>Risk Factors</h3>
                <p>Age, family history, genetic mutations (BRCA1/BRCA2), dense breast tissue, and lifestyle factors.</p>
              </div>
            </div>
          )}

          {activeTab === 'tips' && (
            <div className="tips-grid">
              {healthTips.map((item, index) => (
                <div key={index} className="tip-card glass" style={{ '--hover-color': item.color }}>
                  <div className="tip-icon">{item.icon}</div>
                  <div className="tip-text">{item.tip}</div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'nutrition' && (
            <div className="nutrition-grid">
              <div className="nutrition-header glass">
                <h3>🥗 Foods That Help Reduce Risk</h3>
                <p>A healthy diet can lower your risk of breast cancer</p>
              </div>
              {foods.map((item, index) => (
                <div key={index} className="food-card glass">
                  <div className="food-icon">{item.icon}</div>
                  <div className="food-info">
                    <h4>{item.name}</h4>
                    <p>{item.benefit}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'facts' && (
            <div className="facts-grid">
              {facts.map((item, index) => (
                <div key={index} className="fact-card glass">
                  <div className="fact-icon">{item.icon}</div>
                  <div className="fact-text">{item.fact}</div>
                </div>
              ))}
              <div className="fact-card glass">
                <div className="fact-icon">📅</div>
                <div className="fact-text">Self-exam recommended monthly</div>
              </div>
              <div className="fact-card glass">
                <div className="fact-icon">🏥</div>
                <div className="fact-text">Mammogram every 1-2 years after 40</div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="dashboard-footer">
          <p>⚠️ This is an AI-powered prediction tool. Always consult a doctor for medical advice.</p>
          <p>© 2024 Breast Cancer Detection System | Early Detection Saves Lives</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;