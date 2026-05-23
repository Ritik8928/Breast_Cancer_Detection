import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import html2pdf from 'html2pdf.js';

const Result = () => {
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [patientData, setPatientData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPDF, setShowPDF] = useState(false);

  useEffect(() => {
    try {
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
    setShowPDF(true);
    // Wait for the PDF content to render
    setTimeout(() => {
      const element = document.getElementById('report-content');
      if (element) {
        const opt = {
          margin: [0.5, 0.5, 0.5, 0.5],
          filename: `breast-cancer-report-${new Date().toISOString().slice(0, 19)}.pdf`,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2, letterRendering: true },
          jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
        };
        html2pdf().set(opt).from(element).save().then(() => {
          setShowPDF(false);
        });
      }
    }, 100);
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
        
        {/* PDF Content - Positioned off-screen when not generating */}
        <div 
          id="report-content" 
          style={{ 
            position: 'fixed', 
            left: showPDF ? '0' : '-9999px',
            top: showPDF ? '0' : '-9999px',
            width: '800px',
            background: 'white',
            padding: '40px',
            fontFamily: 'Arial, sans-serif',
            zIndex: showPDF ? 9999 : -1
          }}
        >
          <div style={{ textAlign: 'center', borderBottom: '2px solid #622B14', paddingBottom: '20px', marginBottom: '20px' }}>
            <h1 style={{ color: '#622B14', margin: 0 }}>Breast Cancer Detection Report</h1>
            <p style={{ color: '#666' }}>AI-Powered Risk Assessment</p>
          </div>
          
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ color: '#995F2F' }}>Patient Information</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <tbody>
                <tr>
                  <td style={{ padding: '8px', fontWeight: 'bold', width: '30%' }}>Patient Name:</td>
                  <td style={{ padding: '8px' }}>{patientData?.patientName || 'Not provided'}</td>
                </tr>
                <tr>
                  <td style={{ padding: '8px', fontWeight: 'bold' }}>Age:</td>
                  <td style={{ padding: '8px' }}>{patientData?.patientAge || 'Not provided'}</td>
                </tr>
                <tr>
                  <td style={{ padding: '8px', fontWeight: 'bold' }}>Contact Number:</td>
                  <td style={{ padding: '8px' }}>{patientData?.contactNumber || 'Not provided'}</td>
                </tr>
                <tr>
                  <td style={{ padding: '8px', fontWeight: 'bold' }}>Address:</td>
                  <td style={{ padding: '8px' }}>{patientData?.address || 'Not provided'}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ color: '#995F2F' }}>Prediction Result</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <tbody>
                <tr>
                  <td style={{ padding: '8px', fontWeight: 'bold', width: '30%' }}>Risk Assessment:</td>
                  <td style={{ padding: '8px', color: isPositive ? '#c92a2a' : '#2b8a3e', fontWeight: 'bold' }}>
                    {isPositive ? 'HIGH RISK' : 'LOW RISK'}
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: '8px', fontWeight: 'bold' }}>Confidence Level:</td>
                  <td style={{ padding: '8px' }}>{confidence}%</td>
                </tr>
                <tr>
                  <td style={{ padding: '8px', fontWeight: 'bold' }}>Report Date:</td>
                  <td style={{ padding: '8px' }}>{new Date().toLocaleDateString()}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ color: '#995F2F' }}>Recommendations</h3>
            <ul style={{ marginLeft: '20px' }}>
              {isPositive ? (
                <>
                  <li>Consult with an oncologist immediately</li>
                  <li>Schedule a mammogram screening</li>
                  <li>Discuss biopsy options with your doctor</li>
                  <li>Maintain a healthy lifestyle</li>
                </>
              ) : (
                <>
                  <li>Continue regular self-examinations</li>
                  <li>Schedule annual mammograms</li>
                  <li>Maintain a healthy diet and exercise</li>
                  <li>Limit alcohol consumption</li>
                </>
              )}
            </ul>
          </div>

          <div style={{ textAlign: 'center', marginTop: '30px', paddingTop: '20px', borderTop: '1px solid #ddd', fontSize: '10px', color: '#999' }}>
            <p>This report is generated by ML Project Hub - AI Breast Cancer Detection System</p>
            <p>⚠️ This is an AI-powered prediction tool. Please consult a healthcare professional for medical advice.</p>
          </div>
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