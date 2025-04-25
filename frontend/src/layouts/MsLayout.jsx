// frontend/src/layouts/MsLayout.jsx
import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from '../components/Navbar/Navbar'
import { getCurrentUser } from '../services/auth'

// Placeholder MS page (you can replace with real ones)
import AlertsPage from '../pages/Maintenance/AlertsPage'
// import AlertDetail from '../pages/Maintenance/AlertDetail'

export default function MsLayout() {
  const user = getCurrentUser()

  // 🔐 Role-based access control
  if (!user || user.role !== 'ms') {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="ms-container">
      <div className="main-content">
        <Navbar />
        <div className="dashboard-content">
          <Routes>
            <Route path="/alerts" element={<AlertsPage />} />
            {/* <Route path="/alerts/:id" element={<AlertDetail />} /> */}
            <Route path="*" element={<Navigate to="/alerts" replace />} />
          </Routes>
        </div>
      </div>
    </div>
  )
}
