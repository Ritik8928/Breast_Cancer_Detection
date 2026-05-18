import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Predict from './pages/Predict';
import About from './pages/About';
import Register from './pages/Register';
import Result from './pages/Result';
import ForgotPassword from './pages/ForgotPassword';
import './styles/App.css';

function App() {
  // Protected Route Component
  const ProtectedRoute = ({ children }) => {
    const user = localStorage.getItem('user');
    if (!user) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/predict" element={
            <ProtectedRoute>
              <Predict />
            </ProtectedRoute>
          } />
          <Route path="/result" element={   
            <ProtectedRoute>
              <Result />
            </ProtectedRoute>
          } />
          <Route path="/about" element={
            <ProtectedRoute>
              <About />
            </ProtectedRoute>
          } />
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;