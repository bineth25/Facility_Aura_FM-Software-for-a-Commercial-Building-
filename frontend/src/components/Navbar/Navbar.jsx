// frontend/src/components/Navbar/Navbar.jsx
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { logout, getCurrentUser } from '../../services/auth'
import './Navbar.css'

const Navbar = () => {
  const navigate = useNavigate()
  const user = getCurrentUser()

  const handleSignOut = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <h2>Facilities Management</h2>
      </div>
      <div className="navbar-right">
        <span className="user-name">
          {user ? `${user.firstName} ${user.lastName}` : 'Guest'}
        </span>
        <button className="signout-button" onClick={handleSignOut}>
          Sign Out
        </button>
        
      </div>
    </nav>
  )
}

export default Navbar
