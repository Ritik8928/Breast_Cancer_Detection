import axios from 'axios';

const API_BASE_URL = 'https://flask-hello-world-a01be83f.containers.snapdeploy.dev/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Prediction API
export const predictCancer = async (formData) => {
  try {
    const response = await api.post('/predict/', formData);
    return response.data;
  } catch (error) {
    console.error('Prediction error:', error);
    return { success: false, error: error.message };
  }
};

// OTP API
export const sendOTP = async (email) => {
  try {
    const response = await api.post('/otp/send', { email });
    return response.data;
  } catch (error) {
    console.error('OTP send error:', error);
    return { success: false, error: error.message };
  }
};

export const verifyOTP = async (email, otp) => {
  try {
    const response = await api.post('/otp/verify', { email, otp });
    return response.data;
  } catch (error) {
    console.error('OTP verify error:', error);
    return { success: false, error: error.message };
  }
};

// Auth API
export const registerUser = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    console.error('Registration error:', error);
    return { success: false, error: error.message };
  }
};