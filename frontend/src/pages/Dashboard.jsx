import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [stats, setStats] = useState({
    predictions: 0,
    accuracy: 95,
    riskLevel: 'Low',
    earlyDetection: 87
  });
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    // Set greeting based on time
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');

    // Get user data
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    
    // Get prediction count
    let predictionCount = localStorage.getItem('totalPredictions');
    if (!predictionCount) {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const userId = user.email || user.id;
      predictionCount = localStorage.getItem(`${userId}_totalPredictions`);
    }
    
    setStats(prev => ({ 
      ...prev, 
      predictions: predictionCount ? parseInt(predictionCount) : 0 
    }));
    
    // Get last prediction result for risk level
    const lastResult = localStorage.getItem('predictionResult');
    if (lastResult) {
      const result = JSON.parse(lastResult);
      const risk = result.prediction === 1 ? 'High' : 'Low';
      setStats(prev => ({ ...prev, riskLevel: risk }));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const healthTips = [
    "Regular screening saves lives",
    "Maintain a healthy weight",
    "Exercise 30 minutes daily"
  ];

  return (
    <div className="dashboard-advanced">
      {/* Sidebar */}
      <div className={`sidebar-advanced ${sidebarOpen ? 'open' : 'collapsed'}`}>
        <div className="sidebar-header-advanced">
          <div className="logo">
            <span className="logo-icon">🩺</span>
            {sidebarOpen && <span className="logo-text">HealthAI</span>}
          </div>
          <button className="sidebar-toggle-advanced" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? '◀' : '▶'}
          </button>
        </div>

        <div className="sidebar-user">
          <div className="user-avatar">{user?.fullname?.charAt(0) || user?.username?.charAt(0) || 'U'}</div>
          {sidebarOpen && (
            <div className="user-info">
              <h4>{user?.fullname || user?.username || 'User'}</h4>
              <p>{user?.email || 'user@example.com'}</p>
            </div>
          )}
        </div>

        <nav className="sidebar-nav-advanced">
          <button onClick={() => navigate('/dashboard')} className="nav-item active">
            <span className="nav-icon">📊</span>
            {sidebarOpen && <span>Dashboard</span>}
          </button>
          <button onClick={() => navigate('/predict')} className="nav-item">
            <span className="nav-icon">🔮</span>
            {sidebarOpen && <span>Predict</span>}
          </button>
          <button onClick={() => navigate('/about')} className="nav-item">
            <span className="nav-icon">ℹ️</span>
            {sidebarOpen && <span>About</span>}
          </button>
          <button onClick={handleLogout} className="nav-item logout">
            <span className="nav-icon">🚪</span>
            {sidebarOpen && <span>Logout</span>}
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className={`main-advanced ${sidebarOpen ? 'shifted' : 'collapsed'}`}>
        {/* Top Bar */}
        <div className="top-bar">
          <div className="greeting">
            <h1>{greeting}, {user?.fullname?.split(' ')[0] || user?.username || 'Guest'}! 👋</h1>
            <p>Here's your health overview</p>
          </div>
          <div className="date-time">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid-advanced">
          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-info">
              <h3>{stats.predictions}</h3>
              <p>Total Predictions</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">🎯</div>
            <div className="stat-info">
              <h3>{stats.accuracy}%</h3>
              <p>Model Accuracy</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">⚠️</div>
            <div className="stat-info">
              <h3 className={stats.riskLevel === 'Low' ? 'risk-low' : 'risk-high'}>
                {stats.riskLevel}
              </h3>
              <p>Risk Level</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🏥</div>
            <div className="stat-info">
              <h3>{stats.earlyDetection}%</h3>
              <p>Early Detection</p>
            </div>
          </div>
        </div>

        {/* Main Action Card */}
        <div className="action-card" onClick={() => navigate('/predict')}>
          <div className="action-content">
            <div className="action-text">
              <h2>Start New Prediction</h2>
              <p>Get instant AI-powered breast cancer risk assessment</p>
              <button className="action-btn">
                Begin Assessment <span>→</span>
              </button>
            </div>
            <div className="action-icon">🩺</div>
          </div>
        </div>

        {/* Quick Health Tips */}
        <div className="health-section">
          <h3>💡 Health Tips</h3>
          <div className="tips-list">
            {healthTips.map((tip, index) => (
              <div key={index} className="tip-item">
                <span className="tip-icon">✓</span>
                <span>{tip}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Note */}
        <div className="footer-note-advanced">
          <p>⚠️ AI-powered prediction tool. Always consult a doctor.</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;