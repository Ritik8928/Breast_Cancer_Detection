import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Patientform = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    patientName: '',
    patientAge: '',
    contactNumber: '',
    address: ''
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.patientName) newErrors.patientName = 'Full name is required';
    if (!formData.patientAge) newErrors.patientAge = 'Age is required';
    if (!formData.contactNumber) newErrors.contactNumber = 'Contact number is required';
    if (!formData.address) newErrors.address = 'Address is required';
    
    if (formData.contactNumber && !/^\d{10}$/.test(formData.contactNumber)) {
      newErrors.contactNumber = 'Enter valid 10-digit number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Save patient data to localStorage for predict form
      localStorage.setItem('patientInfo', JSON.stringify(formData));
      navigate('/predict');
    }
  };

  return (
    <div className="form-container">
      <div className="form-card">
        <h2>📋 Patient Information</h2>
        <p>Please enter patient details</p>
        
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Full Name *</label>
              <input 
                type="text" 
                name="patientName" 
                value={formData.patientName} 
                onChange={handleChange} 
                required 
              />
              {errors.patientName && <span className="error-text">{errors.patientName}</span>}
            </div>
            
            <div className="form-group">
              <label>Age *</label>
              <input 
                type="number" 
                name="patientAge" 
                value={formData.patientAge} 
                onChange={handleChange} 
                required 
              />
              {errors.patientAge && <span className="error-text">{errors.patientAge}</span>}
            </div>
            
            
            <div className="form-group">
              <label>Contact Number *</label>
              <input 
                type="tel" 
                name="contactNumber" 
                value={formData.contactNumber} 
                onChange={handleChange} 
                required 
              />
              {errors.contactNumber && <span className="error-text">{errors.contactNumber}</span>}
            </div>
            
            <div className="form-group full-width">
              <label>Address *</label>
              <textarea 
                name="address" 
                value={formData.address} 
                onChange={handleChange} 
                rows="2" 
                required
              ></textarea>
              {errors.address && <span className="error-text">{errors.address}</span>}
            </div>
          </div>
          
          <button type="submit" className="btn-submit">
            Continue to Prediction →
          </button>
        </form>
      </div>
    </div>
  );
};

export default Patientform;