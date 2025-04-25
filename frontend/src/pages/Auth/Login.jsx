import { useState } from 'react'
import { login } from '../../services/auth'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async e => {
    e.preventDefault()
    try {
      let user = await login(email, password)

      // 🔧 Map role "user" → "ms"
      if (user.role === 'user') {
        user.role = 'ms'
        console.log("🛠️ Mapped 'user' → 'ms' in Login.jsx")
        localStorage.setItem('fm_user', JSON.stringify(user))
      }

      // 🔍 Debug logs
      console.log("🔐 Login successful:", user)
      console.log("🔐 Role after mapping:", user.role)
      console.log("💾 Stored in localStorage:", localStorage.getItem('fm_user'))

      // 🧭 Reload app to re-evaluate layout logic in App.jsx
      console.log("🔄 Reloading to apply new layout...")
      window.location.href = '/'
    } catch (err) {
      alert(err.response?.data?.message || 'Login failed')
    }
  }

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit}>
        <h2>Sign In</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  )
}
