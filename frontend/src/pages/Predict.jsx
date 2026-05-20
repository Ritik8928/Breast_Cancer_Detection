import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { predictCancer } from '../services/api';

const Predict = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const result = await predictCancer(formData);
    
    if (result.success) {
      localStorage.setItem('predictionResult', JSON.stringify(result));
      navigate('/result');
    } else {
      alert('Prediction failed: ' + result.error);
    }
    setLoading(false);
  };

  return (
    <div className="predict-container">
      <div className="form-card">
        <h2>🩺 Medical Parameters</h2>
        <p>Enter the following clinical data</p>
        
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Age *</label>
              <input type="number" name="Age" onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Tumour Size (mm) *</label>
              <input type="number" step="0.1" name="Tumour_Size" onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Regional Nodes Examined *</label>
              <input type="number" name="Regional_nodes_examined" onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Regional Nodes Positive *</label>
              <input type="number" name="Regional_nodes_positive" onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Race *</label>
              <select name="Race" onChange={handleChange} required>
                <option value="">Select</option>
                <option value="White">White</option>
                <option value="Black">Black</option>
                <option value="Asian">Asian</option>
              </select>
            </div>
            <div className="form-group">
              <label>Marital Status *</label>
              <select name="Martial_Status" onChange={handleChange} required>
                <option value="">Select</option>
                <option value="Married">Married</option>
                <option value="Single">Single</option>
              </select>
            </div>
            <div className="form-group">
              <label>T Stage *</label>
              <select name="T_Stage" onChange={handleChange} required>
                <option value="">Select</option>
                <option value="Stage I">Stage I</option>
                <option value="Stage II">Stage II</option>
                <option value="Stage III">Stage III</option>
              </select>
            </div>
            <div className="form-group">
              <label>N Stage *</label>
              <select name="N_Stage" onChange={handleChange} required>
                <option value="">Select</option>
                <option value="Stage I">Stage I</option>
                <option value="Stage II">Stage II</option>
                <option value="Stage III">Stage III</option>
              </select>
            </div>
            <div className="form-group">
              <label>Sixth Stage *</label>
              <select name="Sixth_Stage" onChange={handleChange} required>
                <option value="">Select</option>
                <option value="Stage I">Stage I</option>
                <option value="Stage II">Stage II</option>
                <option value="Stage III">Stage III</option>
              </select>
            </div>
            <div className="form-group">
              <label>Estrogen Status *</label>
              <select name="Estrogen_Status" onChange={handleChange} required>
                <option value="">Select</option>
                <option value="Positive">Positive</option>
                <option value="Negative">Negative</option>
              </select>
            </div>
            <div className="form-group">
              <label>Progesterone Status *</label>
              <select name="Progesterone_Status" onChange={handleChange} required>
                <option value="">Select</option>
                <option value="Positive">Positive</option>
                <option value="Negative">Negative</option>
              </select>
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