import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PatientForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    patientName: '',
    patientAge: '',
    patientGender: '',
    contactNumber: '',
    address: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem('patientInfo', JSON.stringify(formData));
    navigate('/predict');
  };

  return (
    <div className="patient-form-container">
      <div className="form-card">
        <h2>📋 Patient Information</h2>
        <p>Please enter patient details</p>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name *</label>
            <input type="text" name="patientName" onChange={handleChange} required />
          </div>
          
          <div className="form-group">
            <label>Age *</label>
            <input type="number" name="patientAge" onChange={handleChange} required />
          </div>
          
          <div className="form-group">
            <label>Gender</label>
            <select name="patientGender" onChange={handleChange}>
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
          
          <div className="form-group">
            <label>Contact Number</label>
            <input type="tel" name="contactNumber" onChange={handleChange} />
          </div>
          
          <div className="form-group">
            <label>Address</label>
            <textarea name="address" onChange={handleChange} rows="2"></textarea>
          </div>
          
          <button type="submit" className="btn-submit">
            Continue to Prediction →
          </button>
        </form>
      </div>
    </div>
  );
};

export default PatientForm;