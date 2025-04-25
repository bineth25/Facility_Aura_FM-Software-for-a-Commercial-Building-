// frontend/src/services/auth.js
import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // e.g. http://localhost:4000
})

// Set the token in axios header
export function setToken(token) {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`
  } else {
    delete api.defaults.headers.common['Authorization']
  }
}

// Login function - stores token and user in localStorage
export async function login(email, password) {
  try {
    const res = await api.post('/api/users/login', { email, password })
    const { token, user } = res.data

    // ✅ Debug logs
    console.log("💾 Saving user role:", user.role)

    // Store token and user data
    localStorage.setItem('fm_token', token)
    localStorage.setItem('fm_user', JSON.stringify(user))

    // Set the token for future API calls
    setToken(token)
    return user
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Login failed')
    }
    throw error
  }
}

// Logout function - clears localStorage and axios header
export function logout() {
  localStorage.removeItem('fm_token')
  localStorage.removeItem('fm_user')
  setToken(null)
}

// Check if token is expired
function isTokenExpired(token) {
  if (!token) return true
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const payload = JSON.parse(window.atob(base64))
    return payload.exp && payload.exp * 1000 < Date.now()
  } catch (e) {
    return true
  }
}

// Restore user from localStorage
export function getCurrentUser() {
  const token = localStorage.getItem('fm_token')
  const userJson = localStorage.getItem('fm_user')

  if (!token || !userJson || isTokenExpired(token)) {
    logout()
    return null
  }

  const parsedUser = JSON.parse(userJson)
  setToken(token)

  // ✅ Debug log
  console.log("🔁 Restored user from localStorage:", parsedUser)

  return parsedUser
}

// Initialize auth state on app start
const savedToken = localStorage.getItem('fm_token')
if (savedToken && !isTokenExpired(savedToken)) {
  setToken(savedToken)
} else if (savedToken) {
  logout()
}

// Add interceptor to handle 401 errors
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      logout()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
