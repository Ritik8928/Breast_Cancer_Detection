import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Result = () => {
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [userData, setUserData] = useState(null);
  const [inputData, setInputData] = useState(null);
  const [patientData, setPatientData] = useState(null);  // ← ADD THIS
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    try {
      // Safe way to get data from localStorage
      const storedResult = localStorage.getItem('predictionResult');
      const storedUser = localStorage.getItem('user');
      const storedInput = localStorage.getItem('inputData');
      const storedPatient = localStorage.getItem('patientInfo');  // ← ADD THIS
      
      console.log("Stored result:", storedResult);
      
      if (storedResult && storedResult !== 'undefined') {
        setResult(JSON.parse(storedResult));
        setTimeout(() => setAnimate(true), 100);
      } else {
        navigate('/predict');
        return;
      }
      
      if (storedUser && storedUser !== 'undefined') {
        setUserData(JSON.parse(storedUser));
      }
      
      if (storedInput && storedInput !== 'undefined') {
        setInputData(JSON.parse(storedInput));
      }
      
      if (storedPatient && storedPatient !== 'undefined') {  // ← ADD THIS
        setPatientData(JSON.parse(storedPatient));
      }
    } catch (error) {
      console.error("Error loading result:", error);
      navigate('/predict');
    }
  }, [navigate]);

  const handlePrint = () => {
    window.print();
  };

  if (!result) {
    return (
      <div className="result-loading">
        <div className="loading-spinner-large"></div>
        <p>Loading your result...</p>
      </div>
    );
  }

  const isPositive = result.prediction === 1;
  const confidence = (result.confidence * 100).toFixed(1);

  const recommendations = isPositive ? [
    "Consult with an oncologist immediately",
    "Schedule a mammogram screening",
    "Discuss biopsy options with your doctor",
    "Maintain a healthy lifestyle",
    "Join a support group for emotional support"
  ] : [
    "Continue regular self-examinations",
    "Schedule annual mammograms",
    "Maintain a healthy diet and exercise",
    "Limit alcohol consumption",
    "Stay aware of any changes in your body"
  ];

  const featureLabels = {
    Age: 'Age',
    Tumour_Size: 'Tumour Size (mm)',
    Regional_nodes_examined: 'Regional Nodes Examined',
    Regional_nodes_positive: 'Regional Nodes Positive',
    Race: 'Race',
    Martial_Status: 'Marital Status',
    T_Stage: 'T Stage',
    N_Stage: 'N Stage',
    Sixth_Stage: 'Sixth Stage',
    Estrogen_Status: 'Estrogen Status',
    Progesterone_Status: 'Progesterone Status'
  };

  return (
    <>
      <style>
        {`
          @media print {
            body * { visibility: hidden; }
            .print-report, .print-report * { visibility: visible; }
            .print-report { position: absolute; top: 0; left: 0; width: 100%; padding: 20px; }
            .no-print { display: none !important; }
          }
        `}
      </style>

      {/* Screen View */}
      <div className="result-advanced-container no-print">
        <div className="result-background-animation">
          <div className="circle circle-1"></div>
          <div className="circle circle-2"></div>
          <div className="circle circle-3"></div>
        </div>

        <div className={`result-card-advanced ${isPositive ? 'positive' : 'negative'} ${animate ? 'animate' : ''}`}>
          <div className="result-header-icon">
            <div className="icon-pulse">{isPositive ? '⚠️' : '✅'}</div>
          </div>

          <h1 className="result-title">
            {isPositive ? 'High Risk Detected' : 'Low Risk Detected'}
          </h1>
          
          <p className="result-subtitle">
            {isPositive 
              ? 'Further medical evaluation recommended'
              : 'Continue with regular checkups'}
          </p>

          <div className="confidence-circle">
            <svg className="confidence-svg" viewBox="0 0 120 120">
              <circle className="confidence-bg" cx="60" cy="60" r="54" />
              <circle 
                className="confidence-fill" 
                cx="60" 
                cy="60" 
                r="54" 
                style={{ 
                  strokeDasharray: `${339.292 * (confidence / 100)} 339.292`,
                  stroke: isPositive ? '#ffd700' : '#90ee90'
                }} 
              />
            </svg>
            <div className="confidence-text-wrapper">
              <div className="confidence-percentage">{confidence}%</div>
              <div className="confidence-label">Confidence</div>
            </div>
          </div>

          <div className="result-message">
            <p>{isPositive 
              ? 'Based on the analysis of your medical parameters, we recommend consulting with a healthcare professional for a comprehensive evaluation.' 
              : 'Based on the analysis of your medical parameters, your risk assessment shows positive indicators. Continue maintaining a healthy lifestyle.'}
            </p>
          </div>

          <div className="recommendations-section">
            <h3>
              <span className="recommendation-icon">📋</span> 
              {isPositive ? 'Recommended Actions' : 'Preventive Measures'}
            </h3>
            <ul className="recommendations-list">
              {recommendations.map((rec, index) => (
                <li key={index} className="recommendation-item" style={{ animationDelay: `${index * 0.1}s` }}>
                  <span className="rec-check">{isPositive ? '⚠️' : '✓'}</span>
                  {rec}
                </li>
              ))}
            </ul>
          </div>

          <div className="result-action-buttons">
            <button onClick={() => navigate('/predict')} className="action-btn primary">
              <span>🔄</span> New Prediction
            </button>
            <button onClick={handlePrint} className="action-btn secondary">
              <span>🖨️</span> Print Report
            </button>
            <button onClick={() => navigate('/dashboard')} className="action-btn tertiary">
              <span>🏠</span> Dashboard
            </button>
          </div>

          <div className="result-footer-note">
            <p>⚠️ This is an AI-powered prediction. Always consult a doctor for medical advice.</p>
          </div>
        </div>
      </div>

      {/* Print Report View - Single Page Stylish */}
      <div className="print-report" style={{ display: 'none' }}>
        <div className="print-report-container">
          {/* Header */}
          <div className="print-header">
            <div className="print-logo">🏥</div>
            <h1>Breast Cancer Detection Report</h1>
            <p className="print-subtitle">AI-Powered Risk Assessment | Breast Cancer Detection</p>
            <div className="print-divider"></div>
          </div>

          {/* Report ID and Date */}
          <div className="print-meta">
            <div>Report ID: <strong>ML-{Date.now()}-{Math.random().toString(36).substr(2, 6).toUpperCase()}</strong></div>
            <div>Date: <strong>{new Date().toLocaleDateString()}</strong></div>
          </div>

          {/* Patient Information Card */}
          <div className="print-card">
            <div className="print-card-header">
              <span className="print-card-icon">👤</span>
              <h3>Patient Information</h3>
            </div>
            <table className="print-info-table">
              <tbody>
                <tr>
                  <td className="print-label">Full Name:</td>
                  <td className="print-value"><strong>{patientData?.patientName || 'Not provided'}</strong></td>
                  <td className="print-label">Age:</td>
                  <td className="print-value">{patientData?.patientAge || 'Not provided'} years</td>
                </tr>
                <tr>
                  <td className="print-label">Date of Birth:</td>
                  <td className="print-value">{patientData?.patientDOB || 'Not provided'}</td>
                  <td className="print-label">Gender:</td>
                  <td className="print-value">{patientData?.patientGender || 'Not provided'}</td>
                </tr>
                <tr>
                  <td className="print-label">Contact:</td>
                  <td className="print-value">{patientData?.contactNumber || 'Not provided'}</td>
                  <td className="print-label">Address:</td>
                  <td className="print-value">{patientData?.address ? `${patientData.address}, ${patientData.city}${patientData.state ? `, ${patientData.state}` : ''} - ${patientData.pincode}` : 'Not provided'}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Clinical Parameters Card */}
          <div className="print-card">
            <div className="print-card-header">
              <span className="print-card-icon">🔬</span>
              <h3>Clinical Parameters</h3>
            </div>
            <div className="print-params-grid">
              {inputData && Object.entries(inputData).map(([key, value]) => (
                <div className="print-param-item" key={key}>
                  <span className="print-param-label">{featureLabels[key] || key}:</span>
                  <span className="print-param-value">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Prediction Result Card */}
          <div className={`print-result-card ${isPositive ? 'print-positive' : 'print-negative'}`}>
            <div className="print-result-icon">{isPositive ? '⚠️' : '✅'}</div>
            <div className="print-result-content">
              <h2>{isPositive ? 'High Risk Detected' : 'Low Risk Detected'}</h2>
              <p>Confidence Level: <strong>{confidence}%</strong></p>
              <div className="print-confidence-bar">
                <div className="print-confidence-fill" style={{ width: `${confidence}%` }}></div>
              </div>
            </div>
          </div>

          {/* Recommendations Card */}
          <div className="print-card">
            <div className="print-card-header">
              <span className="print-card-icon">📋</span>
              <h3>{isPositive ? 'Recommended Actions' : 'Preventive Measures'}</h3>
            </div>
            <ul className="print-recommendations">
              {recommendations.map((rec, index) => (
                <li key={index}>{rec}</li>
              ))}
            </ul>
          </div>

          {/* Footer */}
          <div className="print-footer">
            <p>⚠️ This is an AI-powered prediction tool. Please consult a healthcare professional for medical advice.</p>
            <p>© 2024 ML Project Hub - Breast Cancer Detection System</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Result;