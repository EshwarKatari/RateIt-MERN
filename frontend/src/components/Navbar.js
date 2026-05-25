import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="logo">
          <div className="logo-icon">⭐</div>
          <span className="logo-text">RateIt</span>
        </Link>
        <div className="nav-links">
          <NavLink to="/" end className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>
            Home
          </NavLink>
          <NavLink to="/companies" className={({ isActive }) => 'nav-link' + (isActive ? ' active' : '')}>
            Companies
          </NavLink>
          <button className="btn btn-primary btn-sm" onClick={() => navigate('/companies')}>
            + Add Company
          </button>
        </div>
      </div>
    </nav>
  );
}
