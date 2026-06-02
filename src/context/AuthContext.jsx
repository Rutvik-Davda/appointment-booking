import { createContext, useContext, useEffect, useState } from 'react'
import { auth, firebaseReady } from '../firebase/config.js'
import { onAuthStateChanged } from 'firebase/auth'
import {
  firebaseRegister, firebaseLogin, firebaseLogout,
  firebaseResetPassword, getUserRole
} from '../utils/firebaseAuth.js'

const AuthContext = createContext()
export const useAuth = () => useContext(AuthContext)

const DEMO_KEY = 'mb_demo_user'

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (firebaseReady) {
      const unsub = onAuthStateChanged(auth, async (u) => {
        if (u) {
          const role = await getUserRole(u.uid)
          setUser({
            uid:         u.uid,
            email:       u.email,
            displayName: u.displayName || u.email.split('@')[0],
            role:        u.email === 'admin@medibook.com' ? 'admin' : role,
          })
        } else setUser(null)
        setLoading(false)
      })
      return unsub
    } else {
      // Demo mode (no Firebase)
      const saved = localStorage.getItem(DEMO_KEY)
      if (saved) {
        try { setUser(JSON.parse(saved)) } catch { localStorage.removeItem(DEMO_KEY) }
      }
      setLoading(false)
    }
  }, [])

  const register = async ({ name, email, password }) => {
    if (firebaseReady) {
      await firebaseRegister({ name, email, password })
    } else {
      const u = {
        uid: 'demo-' + Date.now(), email, displayName: name,
        role: email === 'admin@medibook.com' ? 'admin' : 'user'
      }
      localStorage.setItem(DEMO_KEY, JSON.stringify(u))
      setUser(u)
    }
  }

  const login = async ({ email, password }) => {
    if (firebaseReady) {
      await firebaseLogin({ email, password })
    } else {
      const u = {
        uid: 'demo-' + Date.now(), email,
        displayName: email.split('@')[0],
        role: email === 'admin@medibook.com' ? 'admin' : 'user'
      }
      localStorage.setItem(DEMO_KEY, JSON.stringify(u))
      setUser(u)
    }
  }

  const logout = async () => {
    if (firebaseReady) await firebaseLogout()
    else { localStorage.removeItem(DEMO_KEY); setUser(null) }
  }

  const resetPassword = async (email) => {
    if (firebaseReady) await firebaseResetPassword(email)
    else throw new Error('Reset password needs Firebase. See .env file.')
  }

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout, resetPassword }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}
