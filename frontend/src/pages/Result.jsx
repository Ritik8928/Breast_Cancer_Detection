import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import html2pdf from 'html2pdf.js';

const Result = () => {
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [patientData, setPatientData] = useState(null);

  useEffect(() => {
    const storedResult = localStorage.getItem('predictionResult');
    const storedPatient = localStorage.getItem('patientInfo');
    
    if (storedResult) {
      setResult(JSON.parse(storedResult));
    }
    if (storedPatient) {
      setPatientData(JSON.parse(storedPatient));
    }
    
    if (!storedResult) {
      navigate('/');
    }
  }, [navigate]);

  const downloadPDF = () => {
    const element = document.getElementById('report-content');
    html2pdf().from(element).save('breast-cancer-report.pdf');
  };

  if (!result) return <div className="loading">Loading...</div>;

  const isPositive = result.prediction === 1;
  const confidence = (result.confidence * 100).toFixed(1);

  return (
    <div className="result-container">
      <div className={`result-card ${isPositive ? 'positive' : 'negative'}`}>
        <div className="result-icon">{isPositive ? '⚠️' : '✅'}</div>
        <h1>{isPositive ? 'High Risk Detected' : 'Low Risk Detected'}</h1>
        <p>Confidence: {confidence}%</p>
        
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${confidence}%` }}></div>
        </div>
        
        <div id="report-content" style={{ display: 'none' }}>
          <h2>Breast Cancer Detection Report</h2>
          <p><strong>Patient:</strong> {patientData?.patientName}</p>
          <p><strong>Age:</strong> {patientData?.patientAge}</p>
          <p><strong>Result:</strong> {isPositive ? 'High Risk' : 'Low Risk'}</p>
          <p><strong>Confidence:</strong> {confidence}%</p>
        </div>
        
        <div className="action-buttons">
          <button onClick={downloadPDF} className="btn-pdf">📄 Download PDF Report</button>
          <button onClick={() => navigate('/')} className="btn-home">🏠 Back to Home</button>
          <button onClick={() => navigate('/predict')} className="btn-new">🔄 New Prediction</button>
        </div>
      </div>
    </div>
  );
};

export default Result;