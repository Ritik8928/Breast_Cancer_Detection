import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import html2pdf from 'html2pdf.js';

const Result = () => {
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [patientData, setPatientData] = useState(null);
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      // Get data from localStorage
      const storedResult = localStorage.getItem('predictionResult');
      const storedPatient = localStorage.getItem('patientInfo');
      
      console.log("Stored Result:", storedResult);
      console.log("Stored Patient:", storedPatient);
      
      if (storedResult) {
        setResult(JSON.parse(storedResult));
      }
      if (storedPatient) {  
        setPatientData(JSON.parse(storedPatient));
      }
      
      setLoading(false);
      
      if (!storedResult) {
        setTimeout(() => navigate('/predict'), 2000);
      }
    } catch (error) {
      console.error("Error:", error);
      setLoading(false);
    }
  }, [navigate]);

  const downloadPDF = () => {
    const element = document.getElementById('report-content');
    if (element) {
      html2pdf().from(element).save('breast-cancer-report.pdf');
    }
  };

  if (loading) {
    return (
      <div className="result-container">
        <div className="loading">Loading your result...</div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="result-container">
        <div className="result-card">
          <h2>No Result Found</h2>
          <p>Please make a prediction first.</p>
          <button onClick={() => navigate('/predict')} className="btn-new">
            Go to Prediction
          </button>
        </div>
      </div>
    );
  }

  const isPositive = result.prediction === 1;
  const confidence = (result.confidence * 100).toFixed(1);

  // Debug log
  console.log("Rendering result:", { isPositive, confidence });

  return (
    <div className="result-container">
      <div className={`result-card ${isPositive ? 'positive' : 'negative'}`}>
        <div className="result-icon">{isPositive ? '⚠️' : '✅'}</div>
        <h1>{isPositive ? 'High Risk Detected' : 'Low Risk Detected'}</h1>
        <p className="confidence-text">Confidence: {confidence}%</p>
        
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${confidence}%` }}></div>
        </div>
        
        <div id="report-content" style={{ display: 'none' }}>
          <h2>Breast Cancer Detection Report</h2>
          <p><strong>Patient Name:</strong> {patientData?.patientName || 'Not provided'}</p>
          <p><strong>Age:</strong> {patientData?.patientAge || 'Not provided'}</p>
          <p><strong>Contact:</strong> {patientData?.contactNumber || 'Not provided'}</p>
          <p><strong>Result:</strong> {isPositive ? 'High Risk' : 'Low Risk'}</p>
          <p><strong>Confidence:</strong> {confidence}%</p>
          <p><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
        </div>
        
        <div className="action-buttons">
          <button onClick={downloadPDF} className="btn-pdf">
            📄 Download PDF Report
          </button>
          <button onClick={() => navigate(-1)} className="btn-home">
            ← Back
          </button>
          <button onClick={() => navigate('/predict')} className="btn-new">
            🔄 New Prediction
          </button>
        </div>
      </div>
    </div>
  );
};

export default Result;