import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const user = localStorage.getItem('user');
  const isLoggedIn = !!user;

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-brand">
          🧬 Breast Cancer Detection
        </Link>
        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/predict">Predict</Link>
          {!isLoggedIn ? (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          ) : (
            <>
              <span style={{ color: 'white' }}>👤 {JSON.parse(user)?.username}</span>
              <button onClick={handleLogout} className="logout-btn">Logout</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;