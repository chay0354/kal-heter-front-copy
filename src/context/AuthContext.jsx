import React, { createContext, useState, useEffect } from 'react'
import apiService from '../services/api'

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is already logged in
    const storedUser = apiService.getCurrentUserFromStorage()
    if (storedUser) {
      setUser(storedUser)
    }
    setLoading(false)
  }, [])

  const signIn = async (email, password) => {
    const data = await apiService.signIn(email, password)
    setUser(data.user)
    return data
  }

  const signUp = async (email, password, phone, fullName) => {
    const data = await apiService.signUp(email, password, phone, fullName)
    if (data.access_token) {
      setUser(data.user)
    }
    return data
  }

  const signOut = () => {
    apiService.logout()
    setUser(null)
  }

  const isAuthenticated = () => {
    return apiService.isAuthenticated()
  }

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      signIn,
      signUp,
      signOut,
      isAuthenticated
    }}>
      {children}
    </AuthContext.Provider>
  )
}


