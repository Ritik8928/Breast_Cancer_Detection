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

  useEffect(() => {
    const patient = localStorage.getItem('patientInfo');
    if (patient) {
      const patientData = JSON.parse(patient);
      setPatientInfo(patientData);
      // Age auto-fill from patient form
      setFormData(prev => ({ ...prev, Age: patientData.patientAge || '' }));
    } else {
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
    if (!formData.Tumour_Size) newErrors.Tumour_Size = 'Tumour size is required';
    if (!formData.Regional_nodes_examined) newErrors.Regional_nodes_examined = 'Nodes examined is required';
    if (!formData.Regional_nodes_positive) newErrors.Regional_nodes_positive = 'Positive nodes is required';
    if (!formData.Race) newErrors.Race = 'Race is required';
    if (!formData.Martial_Status) newErrors.Martial_Status = 'Marital status is required';
    if (!formData.T_Stage) newErrors.T_Stage = 'T Stage is required';
    if (!formData.N_Stage) newErrors.N_Stage = 'N Stage is required';
    if (!formData.Sixth_Stage) newErrors.Sixth_Stage = 'Sixth Stage is required';
    if (!formData.Estrogen_Status) newErrors.Estrogen_Status = 'Estrogen status is required';
    if (!formData.Progesterone_Status) newErrors.Progesterone_Status = 'Progesterone status is required';
    
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
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Prediction failed: ' + (error.response?.data?.error || error.message));
    }
    
    setLoading(false);
  };

  return (
    <div className="form-container">
      <div className="form-card">
        <h2>🩺 Medical Information</h2>
        
        {patientInfo && (
          <div className="patient-summary">
            <p>👤 Patient: {patientInfo.patientName} | 📅 Age: {patientInfo.patientAge} | 📞 {patientInfo.contactNumber}</p>
          </div>
        )}
        
        <p>Please provide the following medical information</p>
        
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            
            {/* Age - READONLY (Auto-filled from patient form) */}
            <div className="form-group">
              <label>Age</label>
              <input 
                type="number" 
                name="Age" 
                value={formData.Age} 
                onChange={handleChange} 
                readOnly 
                disabled
                style={{ backgroundColor: '#f5f5f5', cursor: 'not-allowed' }}
                required 
              />
              <small>Retrieved from patient information</small>
              {errors.Age && <span className="error-text">{errors.Age}</span>}
            </div>
            
            {/* Tumour Size */}
            <div className="form-group">
              <label>Tumour Size (mm)</label>
              <input type="number" step="0.1" name="Tumour_Size" value={formData.Tumour_Size} onChange={handleChange} required />
              <small>Size in mm</small>
              {errors.Tumour_Size && <span className="error-text">{errors.Tumour_Size}</span>}
            </div>
            
            {/* Nodes Examined */}
            <div className="form-group">
              <label>Lymph Nodes Checked</label>
              <input type="number" name="Regional_nodes_examined" value={formData.Regional_nodes_examined} onChange={handleChange} required />
              <small>Total nodes checked</small>
              {errors.Regional_nodes_examined && <span className="error-text">{errors.Regional_nodes_examined}</span>}
            </div>
            
            {/* Positive Nodes */}
            <div className="form-group">
              <label>Cancer in Nodes</label>
              <input type="number" name="Regional_nodes_positive" value={formData.Regional_nodes_positive} onChange={handleChange} required />
              <small>Cancer-positive nodes</small>
              {errors.Regional_nodes_positive && <span className="error-text">{errors.Regional_nodes_positive}</span>}
            </div>
            
            {/* Race */}
            <div className="form-group">
              <label>Ethnicity</label>
              <select name="Race" value={formData.Race} onChange={handleChange} required>
                <option value="">Select your background</option>
                <option value="White">White / Caucasian</option>
                <option value="Black">Black / African American</option>
                <option value="Asian">Asian / Indian</option>
                <option value="Other">Prefer not to say</option>
              </select>
              {errors.Race && <span className="error-text">{errors.Race}</span>}
            </div>
            
            {/* Marital Status */}
            <div className="form-group">
              <label>Marital Status</label>
              <select name="Martial_Status" value={formData.Martial_Status} onChange={handleChange} required>
                <option value="">Select Status</option>
                <option value="Married">Married</option>
                <option value="Single">Single</option>
                <option value="Divorced">Divorced</option>
                <option value="Widowed">Widowed</option>
              </select>
              {errors.Martial_Status && <span className="error-text">{errors.Martial_Status}</span>}
            </div>
            
            {/* T Stage */}
            <div className="form-group">
              <label>Tumour Stage (T)</label>
              <select name="T_Stage" value={formData.T_Stage} onChange={handleChange} required>
                <option value="">Select Stage</option>
                <option value="Stage I">Stage I - Early</option>
                <option value="Stage II">Stage II - Moderate</option>
                <option value="Stage III">Stage III - Advanced</option>
                <option value="Stage IV">Stage IV - Very Advanced</option>
              </select>
              <small>Tumour size & spread</small>
              {errors.T_Stage && <span className="error-text">{errors.T_Stage}</span>}
            </div>
            
            {/* N Stage */}
            <div className="form-group">
              <label>Nodes Stage (N)</label>
              <select name="N_Stage" value={formData.N_Stage} onChange={handleChange} required>
                <option value="">Select Stage</option>
                <option value="Stage I">Stage I - Few nodes affected</option>
                <option value="Stage II">Stage II - More nodes affected</option>
                <option value="Stage III">Stage III - Many nodes affected</option>
                <option value="Stage IV">Stage IV - Severe node involvement</option>
              </select>
              <small>Lymph node spread</small>
              {errors.N_Stage && <span className="error-text">{errors.N_Stage}</span>}
            </div>
            
            {/* Sixth Stage */}
            <div className="form-group">
              <label>Overall Stage (6th)</label>
              <select name="Sixth_Stage" value={formData.Sixth_Stage} onChange={handleChange} required>
                <option value="">Select Stage</option>
                <option value="Stage I">Stage I - Early detection</option>
                <option value="Stage II">Stage II - Moderate</option>
                <option value="Stage III">Stage III - Advanced</option>
                <option value="Stage IV">Stage IV - Metastatic</option>
              </select>
              <small>Overall cancer stage classification</small>
              {errors.Sixth_Stage && <span className="error-text">{errors.Sixth_Stage}</span>}
            </div>
            
            {/* Estrogen Status */}
            <div className="form-group">
              <label>Estrogen Receptor (ER)</label>
              <select name="Estrogen_Status" value={formData.Estrogen_Status} onChange={handleChange} required>
                <option value="">Select Status</option>
                <option value="Positive">Positive - Hormone sensitive</option>
                <option value="Negative">Negative - Not hormone sensitive</option>
              </select>
              <small>ER status</small>
              {errors.Estrogen_Status && <span className="error-text">{errors.Estrogen_Status}</span>}
            </div>
            
            {/* Progesterone Status */}
            <div className="form-group">
              <label>Progesterone Receptor (PR)</label>
              <select name="Progesterone_Status" value={formData.Progesterone_Status} onChange={handleChange} required>
                <option value="">Select Status</option>
                <option value="Positive">Positive - Hormone sensitive</option>
                <option value="Negative">Negative - Not hormone sensitive</option>
              </select>
              <small>PR status</small>
              {errors.Progesterone_Status && <span className="error-text">{errors.Progesterone_Status}</span>}
            </div>
          </div>
          
          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? 'Analyzing...' : 'Get Result'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Predict;