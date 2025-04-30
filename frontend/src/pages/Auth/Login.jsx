import { useState, useEffect } from 'react'
import { login } from '../../services/auth'
import './Login.css'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [animation, setAnimation] = useState(false)

  // Trigger animation on first render
  useEffect(() => {
    setAnimation(true)
  }, [])

  const handleSubmit = async (e) => {
    if (e) e.preventDefault()
    setIsLoading(true)
    setError('')
    
    try {
      // Call the actual login service
      let user = await login(email, password)
      
      // 🔧 Map role "user" → "ms"
      if (user.role === 'user') {
        user.role = 'ms'
        console.log("🛠️ Mapped 'user' → 'ms' in Login.jsx")
      }

      // Extract technician ID from email (e.g., pl001@gmail.com -> PL001)
      const emailPrefix = email.split('@')[0]
      const technicianId = emailPrefix.toUpperCase()
      
      // Add technician ID to user data
      user.technicianId = technicianId
      
      // Store in localStorage
      localStorage.setItem('fm_user', JSON.stringify(user))

      // 🔍 Debug logs
      console.log("🔐 Login successful:", user)
      console.log("🔐 Role after mapping:", user.role)
      console.log("🔐 Extracted technician ID:", technicianId)
      console.log("💾 Stored in localStorage:", localStorage.getItem('fm_user'))

      // 🧭 Reload app to re-evaluate layout logic in App.jsx
      console.log("🔄 Reloading to apply new layout...")
      window.location.href = '/'
    } catch (err) {
      setError(err?.response?.data?.message || 'Authentication failed. Please check your credentials.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={`login-container ${animation ? 'animate' : ''}`}>
      {/* Animated background elements */}
      <div className="background-elements">
        <div className="bg-circle top-left"></div>
        <div className="bg-circle bottom-right"></div>
        <div className="bg-circle top-right"></div>
        <div className="bg-circle bottom-left"></div>
      </div>
      
      <div className="login-wrapper">
        {/* Logo */}
        <div className="logo-container">
          <div className="logo">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 01-1 1v1h-3v-1H8v1H5v-1a1 1 0 01-1-1V4zm3 1h6v4H7V5zm6 6H7v2h6v-2z" clipRule="evenodd" />
              <path d="M7 15h6v2H7v-2z" />
            </svg>
          </div>
        </div>
        
        <div className="login-card">
          <div className="card-header">
            <div className="header-bg-elements">
              <div className="header-line top"></div>
              <div className="header-line bottom"></div>
            </div>
            
            <h1>FacilityAura</h1>
            <p>Facility Management System</p>
          </div>
          
          <div className="card-body">
            {error && (
              <div className="error-message">
                <p>{error}</p>
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <div className="input-container">
                  <div className="input-icon">
                    
                  </div>
                  <input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div className="form-group">
                <div className="label-row">
                  <label htmlFor="password">Password</label>
                </div>
                <div className="input-container">
                  <div className="input-icon">
                    
                  </div>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                        <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
              
              <div className="form-group">
                <button
                  type="submit"
                  className={`login-button ${isLoading ? 'loading' : ''}`}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="loading-content">
                      <svg className="spinner" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="spinner-track" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="spinner-path" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Authenticating...
                    </span>
                  ) : (
                    'Sign In'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
        
        <footer className="login-footer">
          <p>© 2025 FacilityAura. All rights reserved.</p>
        </footer>
      </div>
    </div>
  )
}