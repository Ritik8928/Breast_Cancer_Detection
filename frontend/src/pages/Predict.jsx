import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Predict = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [patientInfo, setPatientInfo] = useState(null);
  const [formData, setFormData] = useState({
    Age: '',
    Tumour_Size: '',
    Regional_nodes_examined: '',
    Regional_nodes_positive: '',
    Race: '',
    Martial_Status: '',
    T_Stage: '',
    N_Stage: '',
    Sixth_Stage: '',
    Estrogen_Status: '',
    Progesterone_Status: ''
  });
  const [errors, setErrors] = useState({});

  // Load patient info on component mount
  useEffect(() => {
    const patient = localStorage.getItem('patientInfo');
    if (patient) {
      const patientData = JSON.parse(patient);
      setPatientInfo(patientData);
      // Auto-fill age from patient form
      setFormData(prev => ({
        ...prev,
        Age: patientData.patientAge || ''
      }));
    } else {
      // No patient info, go back to patient form
      navigate('/patient-form');
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.Age) newErrors.Age = 'Age is required';
    if (!formData.Tumour_Size) newErrors.Tumour_Size = 'Tumour Size is required';
    if (!formData.Regional_nodes_examined) newErrors.Regional_nodes_examined = 'Regional nodes examined is required';
    if (!formData.Regional_nodes_positive) newErrors.Regional_nodes_positive = 'Regional nodes positive is required';
    if (!formData.Race) newErrors.Race = 'Race is required';
    if (!formData.Martial_Status) newErrors.Martial_Status = 'Marital Status is required';
    if (!formData.T_Stage) newErrors.T_Stage = 'T Stage is required';
    if (!formData.N_Stage) newErrors.N_Stage = 'N Stage is required';
    if (!formData.Sixth_Stage) newErrors.Sixth_Stage = 'Sixth Stage is required';
    if (!formData.Estrogen_Status) newErrors.Estrogen_Status = 'Estrogen Status is required';
    if (!formData.Progesterone_Status) newErrors.Progesterone_Status = 'Progesterone Status is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      const response = await axios.post('https://breast-cancer-detection-gthe.onrender.com/api/predict/', formData);
      
      if (response.data.success) {
        localStorage.setItem('predictionResult', JSON.stringify(response.data));
        localStorage.setItem('inputData', JSON.stringify(formData));
        navigate('/result');
      } else {
        alert('Prediction failed: ' + response.data.error);
        setLoading(false);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Prediction failed: ' + (error.response?.data?.error || error.message));
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <div className="form-card">
        <h2>🩺 Medical Parameters</h2>
        
        {/* Patient Summary */}
        {patientInfo && (
          <div className="patient-summary">
            <p><strong>Patient:</strong> {patientInfo.patientName} | <strong>Age:</strong> {patientInfo.patientAge} | <strong>Contact:</strong> {patientInfo.contactNumber}</p>
          </div>
        )}
        
        <p>Enter the following clinical data</p>
        
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Age at Diagnosis *</label>
              <input 
                type="number" 
                name="Age" 
                value={formData.Age} 
                onChange={handleChange} 
                required 
              />
              {errors.Age && <span className="error-text">{errors.Age}</span>}
            </div>
            
            <div className="form-group">
              <label>Tumour Size (mm) *</label>
              <input 
                type="number" 
                step="0.1" 
                name="Tumour_Size" 
                value={formData.Tumour_Size} 
                onChange={handleChange} 
                required 
              />
              {errors.Tumour_Size && <span className="error-text">{errors.Tumour_Size}</span>}
            </div>
            
            <div className="form-group">
              <label>Regional Nodes Examined *</label>
              <input 
                type="number" 
                name="Regional_nodes_examined" 
                value={formData.Regional_nodes_examined} 
                onChange={handleChange} 
                required 
              />
              {errors.Regional_nodes_examined && <span className="error-text">{errors.Regional_nodes_examined}</span>}
            </div>
            
            <div className="form-group">
              <label>Regional Nodes Positive *</label>
              <input 
                type="number" 
                name="Regional_nodes_positive" 
                value={formData.Regional_nodes_positive} 
                onChange={handleChange} 
                required 
              />
              {errors.Regional_nodes_positive && <span className="error-text">{errors.Regional_nodes_positive}</span>}
            </div>
            
            <div className="form-group">
              <label>Race *</label>
              <select name="Race" value={formData.Race} onChange={handleChange} required>
                <option value="">Select Race</option>
                <option value="White">White</option>
                <option value="Black">Black</option>
                <option value="Asian">Asian</option>
                <option value="Other">Other</option>
              </select>
              {errors.Race && <span className="error-text">{errors.Race}</span>}
            </div>
            
            <div className="form-group">
              <label>Marital Status *</label>
              <select name="Martial_Status" value={formData.Martial_Status} onChange={handleChange} required>
                <option value="">Select Status</option>
                <option value="Married">Married</option>
                <option value="Single">Single</option>
                <option value="Divorced">Divorced</option>
                <option value="Widowed">Widowed</option>
              </select>
              {errors.Martial_Status && <span className="error-text">{errors.Martial_Status}</span>}
            </div>
            
            <div className="form-group">
              <label>T Stage *</label>
              <select name="T_Stage" value={formData.T_Stage} onChange={handleChange} required>
                <option value="">Select T Stage</option>
                <option value="Stage I">Stage I</option>
                <option value="Stage II">Stage II</option>
                <option value="Stage III">Stage III</option>
                <option value="Stage IV">Stage IV</option>
              </select>
              {errors.T_Stage && <span className="error-text">{errors.T_Stage}</span>}
            </div>
            
            <div className="form-group">
              <label>N Stage *</label>
              <select name="N_Stage" value={formData.N_Stage} onChange={handleChange} required>
                <option value="">Select N Stage</option>
                <option value="Stage I">Stage I</option>
                <option value="Stage II">Stage II</option>
                <option value="Stage III">Stage III</option>
                <option value="Stage IV">Stage IV</option>
              </select>
              {errors.N_Stage && <span className="error-text">{errors.N_Stage}</span>}
            </div>
            
            <div className="form-group">
              <label>Sixth Stage *</label>
              <select name="Sixth_Stage" value={formData.Sixth_Stage} onChange={handleChange} required>
                <option value="">Select Sixth Stage</option>
                <option value="Stage I">Stage I</option>
                <option value="Stage II">Stage II</option>
                <option value="Stage III">Stage III</option>
                <option value="Stage IV">Stage IV</option>
              </select>
              {errors.Sixth_Stage && <span className="error-text">{errors.Sixth_Stage}</span>}
            </div>
            
            <div className="form-group">
              <label>Estrogen Status *</label>
              <select name="Estrogen_Status" value={formData.Estrogen_Status} onChange={handleChange} required>
                <option value="">Select Status</option>
                <option value="Positive">Positive</option>
                <option value="Negative">Negative</option>
              </select>
              {errors.Estrogen_Status && <span className="error-text">{errors.Estrogen_Status}</span>}
            </div>
            
            <div className="form-group">
              <label>Progesterone Status *</label>
              <select name="Progesterone_Status" value={formData.Progesterone_Status} onChange={handleChange} required>
                <option value="">Select Status</option>
                <option value="Positive">Positive</option>
                <option value="Negative">Negative</option>
              </select>
              {errors.Progesterone_Status && <span className="error-text">{errors.Progesterone_Status}</span>}
            </div>
          </div>
          
          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? 'Predicting...' : '🔮 Predict Now'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Predict;