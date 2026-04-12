import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { api } from '../lib/api.js'

const AuthContext = createContext(null)

const TOKEN_KEY = 'sfici_token'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Hydrate session from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY)
    if (!token) {
      Promise.resolve().then(() => setLoading(false))
      return
    }

    let cancelled = false
    api
      .getMe()
      .then((u) => {
        if (!cancelled) setUser(u)
      })
      .catch(() => {
        // Token invalid or expired
        localStorage.removeItem(TOKEN_KEY)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  const login = useCallback(async (email, password) => {
    const { token, user: u } = await api.login(email, password)
    localStorage.setItem(TOKEN_KEY, token)
    setUser(u)
    return u
  }, [])

  const register = useCallback(async (data) => {
    const { token, user: u } = await api.register(data)
    localStorage.setItem(TOKEN_KEY, token)
    setUser(u)
    return u
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({
      user,
      loading,
      login,
      register,
      logout,
      isAuthenticated: Boolean(user),
      isAdmin: user?.role === 'admin',
      isClient: user?.role === 'client',
    }),
    [user, loading, login, register, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
