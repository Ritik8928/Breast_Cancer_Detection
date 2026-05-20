import React from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  
  const stats = [
    { icon: "🎯", value: "95%", label: "Accuracy" },
    { icon: "📊", value: "11", label: "Parameters" },
    { icon: "⚡", value: "<5s", label: "Response" }
  ];

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <p>System Overview</p>
      </div>
      
      <div className="stats-grid">
        {stats.map((stat, i) => (
          <div key={i} className="stat-card">
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-value">{stat.value}</div>
            <div className="stat-label">{stat.label}</div>
          </div>
        ))}
      </div>
      
      <button onClick={() => navigate('/predict')} className="btn-predict">
        Start New Prediction
      </button>
    </div>
  );
};

export default Dashboard;