import React, { useState, useEffect } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { isAuthenticated } from '../services/auth'
import { checkSubmissionStatus } from '../services/formSubmission'

function ProtectedRoute({ children }) {
  const location = useLocation()
  const [isChecking, setIsChecking] = useState(true)
  const [hasSubmitted, setHasSubmitted] = useState(false)

  // Don't redirect if already on summary page
  const isSummaryPage = location.pathname === '/summary'

  useEffect(() => {
    const checkStatus = async () => {
      if (!isAuthenticated()) {
        setIsChecking(false)
        return
      }

      // Only check submission status if not on summary page
      if (!isSummaryPage) {
        try {
          const status = await checkSubmissionStatus()
          setHasSubmitted(status.has_submitted || false)
        } catch (error) {
          console.error('Error checking submission status:', error)
          setHasSubmitted(false)
        }
      }
      setIsChecking(false)
    }

    checkStatus()
  }, [isSummaryPage])

  if (!isAuthenticated()) {
    return <Navigate to="/auth?mode=signin" replace />
  }

  // If checking, show loading or children (to avoid flash)
  if (isChecking) {
    return children
  }

  // If user has already submitted and is not on summary page, redirect to summary
  if (hasSubmitted && !isSummaryPage) {
    return <Navigate to="/summary" replace />
  }

  return children
}

export default ProtectedRoute







