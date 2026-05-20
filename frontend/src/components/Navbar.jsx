import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-brand">
          🩺 ML Project Hub
        </Link>
        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/about">About</Link>
          <Link to="/patient-form">Patient</Link>
          <Link to="/predict">Predict</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;