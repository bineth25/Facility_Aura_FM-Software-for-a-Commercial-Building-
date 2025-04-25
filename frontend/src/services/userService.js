// frontend/src/services/userService.js
// Reuse the same axios instance (with auth header) from auth.js
import api from './auth'

/**
 * Login (optional duplication—most components should import login from auth.js)
 * Stores the token under “fm_token” so auth.js will pick it up automatically.
 */
export const login = async (email, password) => {
  const { data } = await api.post('/api/users/login', { email, password })
  localStorage.setItem('fm_token', data.token)
  return data.user
}

/**
 * Register a new user (unprotected)
 */
export const register = async (userData) => {
  const { data } = await api.post('/api/users/register', userData)
  return data
}

/**
 * Add a user (admin only—auth.js already injects the Bearer token)
 */
export const addUser = async (userData) => {
  const { data } = await api.post('/api/users/addUser', userData)
  return data
}

/**
 * Fetch all users (protected endpoint, token header is applied by auth.js)
 */
export const getUsers = async () => {
  const { data } = await api.get('/api/users')
  return data.users
}

/**
 * Reset a user's password (admin only)
 */
export const resetUserPassword = async (userId, newPassword) => {
  const { data } = await api.put(`/api/users/${userId}`, { password: newPassword })
  return data
}

export default api
