// Store users in localStorage (instead of database)
const USERS_KEY = 'ml_project_users';
const CURRENT_USER_KEY = 'ml_project_current_user';

// Get all users from localStorage
const getUsers = () => {
  const users = localStorage.getItem(USERS_KEY);
  return users ? JSON.parse(users) : [];
};

// Save users to localStorage
const saveUsers = (users) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

// Register new user
export const registerUser = (userData) => {
  return new Promise((resolve) => {
    const users = getUsers();
    
    // Check if email already exists
    const existingUser = users.find(u => u.email === userData.email);
    if (existingUser) {
      resolve({ success: false, error: 'Email already registered!' });
      return;
    }
    
    // Check if username already exists
    const existingUsername = users.find(u => u.username === userData.username);
    if (existingUsername) {
      resolve({ success: false, error: 'Username already taken!' });
      return;
    }
    
    // Add new user
    const newUser = {
      id: Date.now(),
      fullname: userData.fullname,
      email: userData.email,
      username: userData.username,
      password: userData.password, // In real app, hash this!
      registeredAt: new Date().toISOString()
    };
    
    users.push(newUser);
    saveUsers(users);
    
    resolve({ success: true, message: 'Registration successful!' });
  });
};

// Login user
export const loginUser = (email, password) => {
  return new Promise((resolve) => {
    const users = getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
      const { password, ...userWithoutPassword } = user;
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPassword));
      resolve({ success: true, user: userWithoutPassword });
    } else {
      resolve({ success: false, error: 'Invalid email or password!' });
    }
  });
};

// Logout user
export const logoutUser = () => {
  localStorage.removeItem(CURRENT_USER_KEY);
  return { success: true };
};

// Get current logged in user
export const getCurrentUser = () => {
  const user = localStorage.getItem(CURRENT_USER_KEY);
  return user ? JSON.parse(user) : null;
};

// Check if user is logged in
export const isLoggedIn = () => {
  return getCurrentUser() !== null;
};

// Get current user ID
export const getCurrentUserId = () => {
  const user = localStorage.getItem('CURRENT_USER_KEY');
  if (user) {
    const userData = JSON.parse(user);
    return userData.id || userData.email; // Use email or ID as unique key
  }
  return null;
};

// Get user-specific storage key
const getUserStorageKey = (key) => {
  const userId = getCurrentUserId();
  return userId ? `${userId}_${key}` : key;
};

// Save user-specific data
export const saveUserData = (key, data) => {
  const storageKey = getUserStorageKey(key);
  localStorage.setItem(storageKey, JSON.stringify(data));
};

// Get user-specific data
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