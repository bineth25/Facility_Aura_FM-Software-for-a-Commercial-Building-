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
      <h2>Users Management</h2>

      <form onSubmit={handleSubmit} className="add-user-form">
        <input
          name="firstName"
          value={form.firstName}
          onChange={handleChange}
          placeholder="First Name"
          required
        />
        <input
          name="lastName"
          value={form.lastName}
          onChange={handleChange}
          placeholder="Last Name"
          required
        />
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          required
        />
        <input
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Password"
          required
        />
        <select name="role" value={form.role} onChange={handleChange}>
          <option value="facility_manager">Facility Manager</option>
          <option value="user">Maintenance Staff</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit">Add User</button>
      </form>

      <table className="users-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u._id}>
              <td>{u.firstName} {u.lastName}</td>
              <td>{u.email}</td>
              <td>{displayRole(u.role)}</td>
              <td>
                <button
                  type="button"
                  className="pwd-reset-btn"
                  onClick={() => handleResetPassword(u._id, u.email)}
                >
                  Reset Password
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
