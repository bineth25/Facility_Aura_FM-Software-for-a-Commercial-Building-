import React from 'react'
import { Routes, Route, Navigate, Link } from 'react-router-dom'
import Navbar from '../components/Navbar/Navbar'
import { getCurrentUser } from '../services/auth'

// Admin pages
import UsersPage from '../pages/Admin/UsersPage'

export default function AdminLayout() {
  const user = getCurrentUser()

  // 🚫 Block non-admin users
  if (!user || user.role !== 'admin') {
    console.warn('🚫 Access denied to AdminLayout:', user?.email)
    return <Navigate to="/login" replace />
  }

  return (
    <div className="admin-container">
      {/* Top bar with sign-out etc. */}
      <Navbar />

      <div className="main-content">
        <div className="dashboard-content">
          <Routes>
            <Route path="users" element={<UsersPage />} />
            {/* Fallback to Users page */}
            <Route path="*" element={<Navigate to="users" replace />} />
          </Routes>
        </div>
      </div>
    </div>
  )
}
