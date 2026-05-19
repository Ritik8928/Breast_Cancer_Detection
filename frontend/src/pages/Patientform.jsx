import React, { useState, useEffect } from 'react';

const PatientForm = ({ onComplete }) => {
  // Get user data from registration
  const registeredUser = JSON.parse(localStorage.getItem('user') || '{}');
  
  const [formData, setFormData] = useState({
    patientName: registeredUser?.fullname || '',
    patientAge: '',
    patientDOB: '',
    patientGender: '',
    contactNumber: registeredUser?.phone || '',
    address: '',
    city: '',
    state: '',
    pincode: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Auto-fill from registration
    if (registeredUser?.phone) {
      setFormData(prev => ({ ...prev, contactNumber: registeredUser.phone }));
    }
    if (registeredUser?.fullname) {
      setFormData(prev => ({ ...prev, patientName: registeredUser.fullname }));
    }
  }, [registeredUser]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.patientName) newErrors.patientName = 'Patient name is required';
    if (!formData.patientAge) newErrors.patientAge = 'Age is required';
    if (formData.patientAge && (formData.patientAge < 0 || formData.patientAge > 120)) {
      newErrors.patientAge = 'Please enter valid age (0-120)';
    }
    if (!formData.address) newErrors.address = 'Address is required';
    if (!formData.city) newErrors.city = 'City is required';
    if (!formData.pincode) newErrors.pincode = 'Pincode is required';
    if (formData.pincode && !/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode = 'Enter valid 6-digit pincode';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 🔥 FIXED: Make handleSubmit async
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Save to localStorage
      localStorage.setItem('patientInfo', JSON.stringify(formData));
      
      // 🔥 Save to backend
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (user?.email) {
        try {
          const response = await fetch('https://flask-hello-world-a01be83f.containers.snapdeploy.dev/api/patient/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: user.email,
              patientData: formData
            })
          });
          const result = await response.json();
          if (result.success) {
            console.log("✅ Patient data saved to backend");
          } else {
            console.error("Failed to save:", result.error);
          }
        } catch (error) {
          console.error("Error saving patient data:", error);
        }
      }
      
      onComplete(formData);
    }
  };

  return (
    <div className="patient-form-container">
      <div className="form-card-advanced">
        <h2>📋 Patient Information</h2>
        <p>Please fill patient details before prediction</p>

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group-advanced">
              <label>Patient Full Name *</label>
              <input 
                type="text" 
                name="patientName" 
                value={formData.patientName} 
                onChange={handleChange} 
                placeholder="Enter full name"
              />
              {errors.patientName && <span className="error-text-advanced">⚠️ {errors.patientName}</span>}
            </div>

            <div className="form-group-advanced">
              <label>Age *</label>
              <input 
                type="number" 
                name="patientAge" 
                value={formData.patientAge} 
                onChange={handleChange} 
                placeholder="Enter age"
              />
              {errors.patientAge && <span className="error-text-advanced">⚠️ {errors.patientAge}</span>}
            </div>

            <div className="form-group-advanced">
              <label>Date of Birth</label>
              <input 
                type="date" 
                name="patientDOB" 
                value={formData.patientDOB} 
                onChange={handleChange} 
              />
            </div>

            <div className="form-group-advanced">
              <label>Gender</label>
              <select 
                name="patientGender" 
                value={formData.patientGender} 
                onChange={handleChange}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group-advanced">
              <label>Contact Number</label>
              <input 
                type="tel" 
                name="contactNumber" 
                value={formData.contactNumber} 
                onChange={handleChange} 
                placeholder="10-digit number"
              />
            </div>

            <div className="form-group-advanced full-width">
              <label>Address *</label>
              <input 
                type="text" 
                name="address" 
                value={formData.address} 
                onChange={handleChange} 
                placeholder="Street address"
              />
              {errors.address && <span className="error-text-advanced">⚠️ {errors.address}</span>}
            </div>

            <div className="form-group-advanced">
              <label>City *</label>
              <input 
                type="text" 
                name="city" 
                value={formData.city} 
                onChange={handleChange} 
                placeholder="City"
              />
              {errors.city && <span className="error-text-advanced">⚠️ {errors.city}</span>}
            </div>

            <div className="form-group-advanced">
              <label>State</label>
              <input 
                type="text" 
                name="state" 
                value={formData.state} 
                onChange={handleChange} 
                placeholder="State"
              />
            </div>

            <div className="form-group-advanced">
              <label>Pincode *</label>
              <input 
                type="text" 
                name="pincode" 
                value={formData.pincode} 
                onChange={handleChange} 
                placeholder="6-digit pincode"
              />
              {errors.pincode && <span className="error-text-advanced">⚠️ {errors.pincode}</span>}
            </div>
          </div>

          <button type="submit" className="btn-submit-advanced">
            Continue to Prediction →
          </button>
        </form>
      </div>
    </div>
  );
};

export default PatientForm;