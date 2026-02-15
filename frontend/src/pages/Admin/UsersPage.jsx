// frontend/src/pages/Admin/UsersPage.jsx
import React, { useState, useEffect } from 'react'
import { getUsers, addUser, resetUserPassword } from '../../services/userService'
import './UsersPage.css'

export default function UsersPage() {
  const [users, setUsers] = useState([])
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'facility_manager'  // ✅ corrected
  })

  useEffect(() => loadUsers(), [])

  function loadUsers() {
    getUsers()
      .then(setUsers)
      .catch(() => alert('❌ Failed to load users'))
  }

  function handleChange(e) {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    try {
      await addUser(form)
      loadUsers()
      setForm({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        role: 'facility_manager'  // ✅ corrected
      })
    } catch (err) {
      alert(err.response?.data?.message || '❌ Failed to add user')
    }
  }

  async function handleResetPassword(userId, email) {
    const newPassword = prompt(`Enter a new password for ${email}:`)
    if (!newPassword) return
    try {
      await resetUserPassword(userId, newPassword)
      alert('✅ Password reset successfully')
    } catch (err) {
      alert(err.response?.data?.message || '❌ Failed to reset password')
    }
  }

  // Optional: convert role to label
  const displayRole = (role) => {
    switch (role) {
      case 'facility_manager': return 'Facility Manager'
      case 'user': return 'Maintenance Staff'
      case 'admin': return 'Admin'
      default: return role
    }
  }

  return (
    <div className="users-page">
      <div className="page-header">
        <div className="header-content">
          <h2 className="page-title">Users Management</h2>
          <p className="page-subtitle">Manage system users and their roles</p>
        </div>
      </div>

      <div className="users-content">
        <div className="add-user-card">
          <div className="card-header">
            <h3 className="card-title">Add New User</h3>
            <p className="card-description">Create a new user account with assigned role</p>
          </div>
          
          <form onSubmit={handleSubmit} className="add-user-form">
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="firstName">First Name <span className="required">*</span></label>
                <input
                  id="firstName"
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  placeholder="Enter first name"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="lastName">Last Name <span className="required">*</span></label>
                <input
                  id="lastName"
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  placeholder="Enter last name"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address <span className="required">*</span></label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="user@example.com"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password <span className="required">*</span></label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter secure password"
                  required
                />
              </div>

              <div className="form-group full-width">
                <label htmlFor="role">User Role <span className="required">*</span></label>
                <select id="role" name="role" value={form.role} onChange={handleChange}>
                  <option value="facility_manager">Facility Manager</option>
                  <option value="user">Maintenance Staff</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-primary">
                <span>Add User</span>
              </button>
            </div>
          </form>
        </div>

        <div className="users-list-card">
          <div className="card-header">
            <div>
              <h3 className="card-title">Existing Users</h3>
              <p className="card-description">Total users: {users.length}</p>
            </div>
          </div>

          <div className="table-container">
            <table className="users-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="empty-state">
                      <div className="empty-message">
                        <p>No users found</p>
                        <span>Add your first user using the form above</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  users.map(u => (
                    <tr key={u._id}>
                      <td>
                        <div className="user-name">
                          <span className="name-avatar">{u.firstName?.[0]}{u.lastName?.[0]}</span>
                          <span>{u.firstName} {u.lastName}</span>
                        </div>
                      </td>
                      <td className="email-cell">{u.email}</td>
                      <td>
                        <span className={`role-badge role-${u.role?.replace('_', '-')}`}>
                          {displayRole(u.role)}
                        </span>
                      </td>
                      <td>
                        <button
                          type="button"
                          className="btn-action"
                          onClick={() => handleResetPassword(u._id, u.email)}
                        >
                          Reset Password
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
