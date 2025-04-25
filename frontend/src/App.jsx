// frontend/src/App.jsx
import React, { useEffect, useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { getCurrentUser, setToken } from './services/auth'

// public
import Login from './pages/Auth/Login'

// role layouts
import FmLayout from './layouts/FmLayout'
import AdminLayout from './layouts/AdminLayout'
import MsLayout from './layouts/MsLayout'

const APP_VERSION = __APP_VERSION__ // 👈 Uses value from vite.config.js

export default function App() {
  const [user, setUser] = useState(undefined)

  useEffect(() => {
    const storedVersion = localStorage.getItem('app_version')
    if (storedVersion !== APP_VERSION) {
      console.warn(`🔁 App version changed (${storedVersion} → ${APP_VERSION}), clearing localStorage`)
      localStorage.clear()
      localStorage.setItem('app_version', APP_VERSION)
      window.location.reload()
      return
    }

    let currentUser = getCurrentUser()

    // ✅ Map role "user" → "ms" and persist updated user
    if (currentUser?.role === 'user') {
      console.log('🛠️ Mapping role "user" → "ms"')
      currentUser.role = 'ms'
      localStorage.setItem('fm_user', JSON.stringify(currentUser)) // Update stored role
    }

    console.log('🧠 App.jsx → Restored user:', currentUser)
    setUser(currentUser)
  }, [])

  if (user === undefined) {
    return <div>Loading…</div>
  }

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/*"
        element={
          !user
            ? <Navigate to="/login" replace />
            : user.role === 'admin'
              ? <AdminLayout />
              : user.role === 'facility_manager'
                ? <FmLayout />
              : user.role === 'ms'
                ? <MsLayout />
              : <Navigate to="/login" replace />
        }
      />
    </Routes>
  )
}
