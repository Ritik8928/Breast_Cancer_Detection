import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import PatientForm from './Patientform';

const Predict = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1 = Patient Form, 2 = Prediction Form
  const [patientData, setPatientData] = useState(null);
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
  const [errors, setErrors] = useState({});

  // 🔥 Load patient data from backend when component mounts
  useEffect(() => {
    const loadPatientData = async () => {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (user?.email) {
        try {
          const response = await fetch(`https://flask-hello-world-a01be83f.containers.snapdeploy.dev/api/patient/get/${user.email}`);
          const result = await response.json();
          if (result.success && result.data) {
            setPatientData(result.data.patientData);
            localStorage.setItem('patientInfo', JSON.stringify(result.data.patientData));
          }
        } catch (error) {
          console.error("Error loading patient data:", error);
        }
      }
    };
    
    loadPatientData();
  }, []);

  // Handle patient form completion
  const handlePatientComplete = (data) => {
    setPatientData(data);
    setStep(2); // Move to prediction form
  };

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
    
    if (parseInt(formData.Regional_nodes_positive) > parseInt(formData.Regional_nodes_examined)) {
      newErrors.Regional_nodes_positive = 'Positive nodes cannot exceed examined nodes';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      const response = await axios.post('https://flask-hello-world-a01be83f.containers.snapdeploy.dev/api/predict/', formData);
      
      if (response.data.success) {
        // Save all data
        localStorage.setItem('predictionResult', JSON.stringify(response.data));
        localStorage.setItem('inputData', JSON.stringify(formData));
        localStorage.setItem('patientInfo', JSON.stringify(patientData));
        
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

  // Show Patient Form first (Step 1)
  if (step === 1) {
    return <PatientForm onComplete={handlePatientComplete} />;
  }

  // Show Prediction Form (Step 2)
  return (
    <div className="predict-container">
      <div className="form-card-advanced">
        <h2>🩺 Breast Cancer Prediction</h2>
        
        {/* Display Patient Summary */}
        {patientData && (
          <div className="patient-summary">
            <h3>👤 Patient: {patientData.patientName}</h3>
            <p>Age: {patientData.patientAge} | Contact: {patientData.contactNumber}</p>
            <p>Address: {patientData.address}, {patientData.city} - {patientData.pincode}</p>
          </div>
        )}
        
        <p>Fill in the medical parameters below</p>
        
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group-advanced">
              <label>Age at Diagnosis *</label>
              <input type="number" name="Age" value={formData.Age} onChange={handleChange} placeholder="Enter age at diagnosis" />
              {errors.Age && <span className="error-text-advanced">⚠️ {errors.Age}</span>}
            </div>
            
            <div className="form-group-advanced">
              <label>Tumour Size (mm) *</label>
              <input type="number" step="0.1" name="Tumour_Size" value={formData.Tumour_Size} onChange={handleChange} placeholder="Enter tumour size" />
              {errors.Tumour_Size && <span className="error-text-advanced">⚠️ {errors.Tumour_Size}</span>}
            </div>
            
            <div className="form-group-advanced">
              <label>Regional Nodes Examined *</label>
              <input type="number" name="Regional_nodes_examined" value={formData.Regional_nodes_examined} onChange={handleChange} placeholder="Number of nodes examined" />
              {errors.Regional_nodes_examined && <span className="error-text-advanced">⚠️ {errors.Regional_nodes_examined}</span>}
            </div>
            
            <div className="form-group-advanced">
              <label>Regional Nodes Positive *</label>
              <input type="number" name="Regional_nodes_positive" value={formData.Regional_nodes_positive} onChange={handleChange} placeholder="Number of positive nodes" />
              {errors.Regional_nodes_positive && <span className="error-text-advanced">⚠️ {errors.Regional_nodes_positive}</span>}
            </div>
            
            <div className="form-group-advanced">
              <label>Race *</label>
              <select name="Race" value={formData.Race} onChange={handleChange}>
                <option value="">Select Race</option>
                <option value="White">White</option>
                <option value="Black">Black</option>
                <option value="Asian">Asian</option>
                <option value="Other">Other</option>
              </select>
              {errors.Race && <span className="error-text-advanced">⚠️ {errors.Race}</span>}
            </div>
            
            <div className="form-group-advanced">
              <label>Marital Status *</label>
              <select name="Martial_Status" value={formData.Martial_Status} onChange={handleChange}>
                <option value="">Select Status</option>
                <option value="Married">Married</option>
                <option value="Single">Single</option>
                <option value="Divorced">Divorced</option>
                <option value="Widowed">Widowed</option>
              </select>
              {errors.Martial_Status && <span className="error-text-advanced">⚠️ {errors.Martial_Status}</span>}
            </div>
            
            <div className="form-group-advanced">
              <label>T Stage *</label>
              <select name="T_Stage" value={formData.T_Stage} onChange={handleChange}>
                <option value="">Select T Stage</option>
                <option value="Stage I">Stage I</option>
                <option value="Stage II">Stage II</option>
                <option value="Stage III">Stage III</option>
                <option value="Stage IV">Stage IV</option>
              </select>
              {errors.T_Stage && <span className="error-text-advanced">⚠️ {errors.T_Stage}</span>}
            </div>
            
            <div className="form-group-advanced">
              <label>N Stage *</label>
              <select name="N_Stage" value={formData.N_Stage} onChange={handleChange}>
                <option value="">Select N Stage</option>
                <option value="Stage I">Stage I</option>
                <option value="Stage II">Stage II</option>
                <option value="Stage III">Stage III</option>
                <option value="Stage IV">Stage IV</option>
              </select>
              {errors.N_Stage && <span className="error-text-advanced">⚠️ {errors.N_Stage}</span>}
            </div>
            
            <div className="form-group-advanced">
              <label>Sixth Stage *</label>
              <select name="Sixth_Stage" value={formData.Sixth_Stage} onChange={handleChange}>
                <option value="">Select Sixth Stage</option>
                <option value="Stage I">Stage I</option>
                <option value="Stage II">Stage II</option>
                <option value="Stage III">Stage III</option>
                <option value="Stage IV">Stage IV</option>
              </select>
              {errors.Sixth_Stage && <span className="error-text-advanced">⚠️ {errors.Sixth_Stage}</span>}
            </div>
            
            <div className="form-group-advanced">
              <label>Estrogen Status *</label>
              <div className="radio-group">
                <label><input type="radio" name="Estrogen_Status" value="Positive" onChange={handleChange} /> Positive</label>
                <label><input type="radio" name="Estrogen_Status" value="Negative" onChange={handleChange} /> Negative</label>
              </div>
              {errors.Estrogen_Status && <span className="error-text-advanced">⚠️ {errors.Estrogen_Status}</span>}
            </div>
            
            <div className="form-group-advanced">
              <label>Progesterone Status *</label>
              <div className="radio-group">
                <label><input type="radio" name="Progesterone_Status" value="Positive" onChange={handleChange} /> Positive</label>
                <label><input type="radio" name="Progesterone_Status" value="Negative" onChange={handleChange} /> Negative</label>
              </div>
              {errors.Progesterone_Status && <span className="error-text-advanced">⚠️ {errors.Progesterone_Status}</span>}
            </div>
          </div>
          
          <button type="submit" className="btn-submit-advanced" disabled={loading}>
            {loading ? <><span className="loading-spinner"></span> Predicting...</> : '🔮 Predict Now'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Predict;