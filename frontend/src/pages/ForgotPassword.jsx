import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [timer, setTimer] = useState(0);
  const [timerInterval, setTimerInterval] = useState(null);

  const clearTimer = () => {
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
    setTimer(0);
  };

  const startTimer = () => {
    clearTimer();
    let timeLeft = 300;
    setTimer(timeLeft);
    
    const interval = setInterval(() => {
      timeLeft--;
      setTimer(timeLeft);
      if (timeLeft <= 0) {
        clearInterval(interval);
        setTimerInterval(null);
      }
    }, 1000);
    
    setTimerInterval(interval);
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email');
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      // ✅ FIXED: Render URL
      const response = await fetch('https://breast-candetector.onrender.com/api/forgot-password/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setStep(2);
        startTimer();
        setSuccess('OTP sent to your email!');
      } else {
        setError(data.error || 'Email not found');
      }
    } catch (err) {
      setError('Server error. Please try again.');
    }
    
    setLoading(false);
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      setError('Please enter 6-digit OTP');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // ✅ FIXED: Render URL
      const response = await fetch('https://breast-candetector.onrender.com/api/forgot-password/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        clearTimer();
        setStep(3);
        setSuccess('OTP verified! Set new password');
      } else {
        setError(data.error || 'Invalid OTP');
      }
    } catch (err) {
      setError('Server error. Please try again.');
    }
    
    setLoading(false);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // ✅ FIXED: Render URL
      const response = await fetch('https://breast-candetector.onrender.com/api/forgot-password/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, newPassword }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        alert('Password reset successful! Please login with new password.');
        navigate('/login');
      } else {
        setError(data.error || 'Failed to reset password');
      }
    } catch (err) {
      setError('Server error. Please try again.');
    }
    
    setLoading(false);
  };

  const handleBack = () => {
    clearTimer();
    setStep(1);
    setSuccess('');
    setError('');
    setOtp('');
    setTimer(0);
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
        <h2>Forgot Password</h2>
        
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        
        {step === 1 && (
          <form onSubmit={handleSendOTP}>
            <div className="input-group">
              <label>Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your registered email"
              />
            </div>
            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </button>
          </form>
        )}
        
        {step === 2 && (
          <form onSubmit={handleVerifyOTP}>
            <div className="input-group">
              <label>Enter OTP sent to {email}</label>
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
                <small className="otp-timer" style={{ color: 'red' }}>OTP Expired! Please go back and request again.</small>
              )}
            </div>
            <button type="submit" className="login-btn" disabled={loading || timer === 0}>
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
            <button 
              type="button" 
              onClick={handleBack} 
              className="login-btn" 
              style={{ marginTop: '10px', background: '#6c757d' }}
            >
              Back
            </button>
          </form>
        )}
        
        {step === 3 && (
          <form onSubmit={handleResetPassword}>
            <div className="input-group">
              <label>New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                placeholder="Enter new password (min 6 characters)"
              />
            </div>
            <div className="input-group">
              <label>Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Confirm new password"
              />
            </div>
            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
            <button 
              type="button" 
              onClick={() => {
                setStep(1);
                setSuccess('');
                setError('');
                setNewPassword('');
                setConfirmPassword('');
              }} 
              className="login-btn" 
              style={{ marginTop: '10px', background: '#6c757d' }}
            >
              Back
            </button>
          </form>
        )}
        
        <div className="register-link">
          <p>
            Remember your password?{' '}
            <Link to="/login">Back to Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;