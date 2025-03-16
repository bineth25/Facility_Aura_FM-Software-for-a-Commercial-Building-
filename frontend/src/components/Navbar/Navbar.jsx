import React from 'react'
import './Navbar.css'

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <h2>Facilities Management</h2>
      </div>
      <div className="navbar-right">
        <span className="user-name">Demo User</span>
        <div className="profile">
          <img
            src="https://via.placeholder.com/35"
            alt="User"
            className="profile-pic"
          />
        </div>
      </div>
    </nav>
  )
}

export default Navbar