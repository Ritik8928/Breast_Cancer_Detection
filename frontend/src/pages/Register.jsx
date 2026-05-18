import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Form, 2: OTP
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(0);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    username: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const validateForm = () => {
    if (!formData.fullname) {
      setError('Full name is required');
      return false;
    }
    if (!formData.email) {
      setError('Email is required');
      return false;
    }
    if (!formData.username) {
      setError('Username is required');
      return false;
    }
    if (!formData.password) {
      setError('Password is required');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return false;
    }
    if (formData.phone && !/^\d{10}$/.test(formData.phone)) {
      setError('Please enter a valid 10-digit phone number');
      return false;
    }
    return true;
  };

  // Send OTP
  const handleSendOTP = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('https://breast-candetector.onrender.com/api/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setStep(2);
        startTimer();
        alert('OTP sent to your email!');
      } else {
        setError(data.error || 'Failed to send OTP');
      }
    } catch (err) {
      setError('Server error. Make sure backend is running.');
    }
    
    setLoading(false);
  };

  // Verify OTP and Register
  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      setError('Please enter 6-digit OTP');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Verify OTP
      const verifyResponse = await fetch('https://breast-candetector.onrender.com/api/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: formData.email, 
          otp: otp 
        }),
      });
      
      const verifyData = await verifyResponse.json();
      
      if (!verifyData.success) {
        setError(verifyData.error);
        setLoading(false);
        return;
      }
      
      // Register user
      const registerResponse = await fetch('https://breast-candetector.onrender.com/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: Date.now().toString(), // ← unique ID
        fullname: formData.fullname,
        email: formData.email,
        username: formData.username,
        phone: formData.phone,
        password: formData.password,
      }),
    });
      const registerData = await registerResponse.json();
      
      if (registerData.success) {
        alert('Registration successful! Please login.');
        navigate('/login');
      } else {
        setError(registerData.error || 'Registration failed');
      }
    } catch (err) {
      setError('Server error. Please try again.');
    }
    
    setLoading(false);
  };

  const startTimer = () => {
    let timeLeft = 300; // 5 minutes
    const interval = setInterval(() => {
      timeLeft--;
      setTimer(timeLeft);
      if (timeLeft <= 0) {
        clearInterval(interval);
        setTimer(0);
      }
    }, 1000);
  };

  const formatTime = (seconds) => {
    if (seconds <= 0) return 'Expired';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Create an Account</h2>
        <p>{step === 1 ? 'Fill your details' : 'Verify your email'}</p>
        
        {error && <div className="error-message">{error}</div>}
        
        {step === 1 ? (
          // Step 1: Registration Form
          <form onSubmit={(e) => { e.preventDefault(); handleSendOTP(); }}>
            <div className="input-group">
              <label>Full Name *</label>
              <input
                type="text"
                name="fullname"
                value={formData.fullname}
                onChange={handleChange}
                required
                placeholder="Enter your full name"
              />
            </div>

            <div className="input-group">
              <label>Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter your email"
              />
            </div>

            <div className="input-group">
              <label>Username *</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                placeholder="Choose a username"
              />
            </div>

            <div className="input-group">
              <label>Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter 10-digit mobile number"
              />
            </div>

            <div className="input-group">
              <label>Password *</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Create a password (min 8 characters)"
              />
            </div>

            <div className="input-group">
              <label>Confirm Password *</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="Confirm your password"
              />
            </div>

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </button>
          </form>
        ) : (
          // Step 2: OTP Verification
          <div>
            <div className="input-group">
              <label>Enter OTP sent to {formData.email}</label>
              <input
                type="text"
                maxLength="6"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter 6-digit OTP"
              />
              {timer > 0 && (
                <small className="otp-timer">OTP valid for: {formatTime(timer)}</small>
              )}
              {timer === 0 && (
                <small className="otp-expired">OTP expired. Please request again.</small>
              )}
            </div>

            <button onClick={handleVerifyOTP} className="login-btn" disabled={loading || timer === 0}>
              {loading ? 'Verifying...' : 'Verify & Register'}
            </button>

            <button 
              onClick={() => setStep(1)} 
              className="login-btn" 
              style={{ marginTop: '10px', background: '#6c757d' }}
            >
              Back
            </button>
          </div>
        )}

        <div className="register-link">
          <p>
            Already have an account?{' '}
            <Link to="/login">Login Here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;