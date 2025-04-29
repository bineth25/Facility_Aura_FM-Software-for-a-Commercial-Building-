import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from '../components/Navbar/Navbar'
import Sidebar from '../components/msm_Sidebar/msm_Sidebar'
import { getCurrentUser } from '../services/auth'
import Dashboard from '../pages/Maintenance/Dashboard/Dashboard';
import Tasks from '../pages/Maintenance/Tasks/Tasks';
import Complete from '../pages/Maintenance/Complete/Complete';

export default function MsLayout() {
  const user = getCurrentUser()

  // 🔐 Role-based access control
  if (!user || user.role !== 'ms') {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="ms-container" style={{ display: 'flex' }}>
      <Sidebar />
      <div className="main-content" style={{ flex: 1 }}>
        <Navbar />
        <div className="dashboard-content">
          <Routes>
            <Route path="/Dashboard" element={<Dashboard />} />
            <Route path="/Tasks" element={<Tasks />} />
            <Route path="/Complete" element={<Complete />} />
            <Route path="*" element={<Navigate to="/Dashboard" replace />} />
          </Routes>
        </div>
      </div>
    </div>
  )
}