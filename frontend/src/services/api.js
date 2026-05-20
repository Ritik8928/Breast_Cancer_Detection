import axios from 'axios';

const API_BASE_URL = 'https://breast-cancer-detection-gthe.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

export const predictCancer = async (formData) => {
  try {
    const response = await api.post('/predict/', formData);
    return response.data;
  } catch (error) {
    console.error('Prediction error:', error);
    return { success: false, error: error.message };
  }
};