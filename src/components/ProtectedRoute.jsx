import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return <div>טוען...</div>
  }

  if (!isAuthenticated()) {
    return <Navigate to="/" replace />
  }

  return children
}

export default ProtectedRoute


