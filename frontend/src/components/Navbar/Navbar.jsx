import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout, getCurrentUser } from '../../services/auth';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleSignOut = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const closeDropdown = () => {
    setDropdownOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <h2>Facility Management System </h2>
        </div>
        <div className="navbar-profile">
          <div className="profile-container" onClick={toggleDropdown}>
            <div className="profile-image">
              {user?.firstName?.charAt(0) || 'G'}
            </div>
            <span className="profile-name">
              {user ? `${user.firstName} ${user.lastName}` : 'Guest'}
            </span>
            <span className="dropdown-arrow">▼</span>
          </div>
          
          {dropdownOpen && (
            <div className="profile-dropdown">
              <div className="dropdown-item signout" onClick={handleSignOut}>
                Sign Out
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;