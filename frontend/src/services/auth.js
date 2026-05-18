import axios from 'axios';

// Production API URL (Render Backend)
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://breast-candetector.onrender.com/api';

// Register new user via backend
export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/register`, {
      fullname: userData.fullname,
      email: userData.email,
      username: userData.username,
      password: userData.password,
      phone: userData.phone || ''
    });
    
    return response.data;
  } catch (error) {
    console.error("Register error:", error);
    return { 
      success: false, 
      error: error.response?.data?.error || 'Registration failed' 
    };
  }
};

// Login user via backend
export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, {
      email,
      password
    });
    
    if (response.data.success) {
      localStorage.setItem('user', JSON.stringify(response.data.user));
      return { success: true, user: response.data.user };
    } else {
      return { success: false, error: response.data.error };
    }
  } catch (error) {
    console.error("Login error:", error);
    return { 
      success: false, 
      error: error.response?.data?.error || 'Login failed' 
    };
  }
};

// Logout user
export const logoutUser = () => {
  localStorage.removeItem('user');
  return { success: true };
};

// Get current logged in user
export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

// Check if user is logged in
export const isLoggedIn = () => {
  return getCurrentUser() !== null;
};

// Get current user ID
export const getCurrentUserId = () => {
  const user = getCurrentUser();
  if (user) {
    return user.id || user.email;
  }
  return null;
};

// Get user-specific storage key
const getUserStorageKey = (key) => {
  const userId = getCurrentUserId();
  return userId ? `${userId}_${key}` : key;
};

// Save user-specific data (local only)
export const saveUserData = (key, data) => {
  const storageKey = getUserStorageKey(key);
  localStorage.setItem(storageKey, JSON.stringify(data));
};

// Get user-specific data (local only)
export const getUserData = (key) => {
  const storageKey = getUserStorageKey(key);
  const data = localStorage.getItem(storageKey);
  return data ? JSON.parse(data) : null;
};

// Update prediction count for current user
export const updatePredictionCount = () => {
  const key = getUserStorageKey('totalPredictions');
  let count = localStorage.getItem(key);
  count = count ? parseInt(count) + 1 : 1;
  localStorage.setItem(key, count);
  return count;
};

// Get prediction count for current user
export const getPredictionCount = () => {
  const key = getUserStorageKey('totalPredictions');
  const count = localStorage.getItem(key);
  return count ? parseInt(count) : 0;
};