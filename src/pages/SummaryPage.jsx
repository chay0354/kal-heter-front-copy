import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../components/PlanningRequest.css'
import { getFormData, clearFormData } from '../services/formData'
import { submitForm, checkSubmissionStatus } from '../services/formSubmission'
import { authenticatedFetch, getAccessToken } from '../services/auth'

// Helper function to build API URLs
const getApiBaseUrl = () => {
  const url = import.meta.env.VITE_API_BASE_URL;
  if (!url) {
    throw new Error('VITE_API_BASE_URL is not set');
  }
  const normalized = url.trim().replace(/\/+$/, '');
  return normalized;
};

const buildApiUrl = (path) => {
  const base = getApiBaseUrl().replace(/\/+$/, '');
  const cleanPath = path.replace(/^\/+/, '');
  return `${base}/${cleanPath}`;
};

const SummaryPage = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({})
  const [applicationStatus, setApplicationStatus] = useState('בטיפול')
  const [loadingStatus, setLoadingStatus] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const [detailsConfirmed, setDetailsConfirmed] = useState(false)
  const [showConfirmationError, setShowConfirmationError] = useState(false)

  useEffect(() => {
    const savedData = getFormData()
    setFormData(savedData)
    
    // Check if user has already submitted on page load
    const checkIfSubmitted = async () => {
      try {
        const status = await checkSubmissionStatus()
        if (status.has_submitted) {
          setHasSubmitted(true)
          setLoadingStatus(true)
        }
      } catch (error) {
        console.error('Error checking submission status:', error)
        // Don't set hasSubmitted on error - allow user to try
      }
    }
    
    checkIfSubmitted()
  }, [])

  // Fetch application status
  useEffect(() => {
    if (!hasSubmitted) return

    const fetchApplicationStatus = async () => {
      try {
        const token = getAccessToken()
        if (!token) {
          setApplicationStatus('בטיפול')
          setLoadingStatus(false)
          return
        }

        // Get user's status from /api/auth/user endpoint
        try {
          // Add cache-busting to ensure we get fresh data
          const cacheBuster = `?t=${Date.now()}`
          const response = await authenticatedFetch(buildApiUrl(`/api/auth/user${cacheBuster}`), {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Cache-Control': 'no-cache, no-store, must-revalidate',
              'Pragma': 'no-cache',
            },
            cache: 'no-store'
          }).catch(async (fetchError) => {
            // If authenticatedFetch throws (e.g., session expired), still try to show status
            console.error('[SummaryPage] authenticatedFetch error:', fetchError)
            // Return a mock response so we can still show the status section
            return { ok: false, status: 401, text: async () => fetchError.message }
          })

          if (response && response.ok) {
            const userData = await response.json()
            console.log('[SummaryPage] User data received:', userData)
            console.log('[SummaryPage] application_status from backend:', userData.application_status)
            // application_status is now returned from the backend
            const status = userData.application_status || 'בטיפול'
            console.log('[SummaryPage] Setting application status to:', status)
            setApplicationStatus(status)
          } else {
            const errorText = response ? await response.text().catch(() => 'Unknown error') : 'No response'
            console.error('[SummaryPage] Failed to fetch user data, status:', response?.status || 'unknown', 'error:', errorText)
            // Still show status as 'בטיפול' even if fetch fails
            setApplicationStatus('בטיפול')
          }
        } catch (err) {
          console.error('[SummaryPage] Error fetching application status:', err)
          // Always set a status so the section is visible
          setApplicationStatus('בטיפול')
        }
      } catch (error) {
        console.error('Error fetching application status:', error)
        setApplicationStatus('בטיפול')
      } finally {
        setLoadingStatus(false)
      }
    }

    fetchApplicationStatus()
    
    // Refresh status periodically to catch admin updates
    const intervalId = setInterval(() => {
      console.log('[SummaryPage] Refreshing status...')
      fetchApplicationStatus()
    }, 10000)
    
    // Also refresh when page becomes visible
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        console.log('[SummaryPage] Page visible, refreshing status...')
        fetchApplicationStatus()
      }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)
    
    // Also refresh when window gains focus
    const handleFocus = () => {
      console.log('[SummaryPage] Window focused, refreshing status...')
      fetchApplicationStatus()
    }
    window.addEventListener('focus', handleFocus)
    
    return () => {
      clearInterval(intervalId)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('focus', handleFocus)
    }
  }, [hasSubmitted])

  const steps = [
    { number: 1, label: 'פרטים אישיים' },
    { number: 2, label: 'פרטי הנכס' },
    { number: 3, label: 'מפת מדידה' },
    { number: 4, label: 'בחירת בית חלומות' },
    { number: 5, label: 'סיכום ושליחה' }
  ]

  const personalDetails = formData.personalDetails || {}
  const propertyDetails = formData.propertyDetails || {}
  const measurementDetails = formData.measurementDetails || {}
  const selectedHouse = formData.selectedHouse || {}

  const handleSubmit = async (e) => {
    // Prevent any form submission if button is disabled
    if (submitting || hasSubmitted || !detailsConfirmed) {
      if (!detailsConfirmed) {
        setShowConfirmationError(true)
        // Hide error after 3 seconds
        setTimeout(() => setShowConfirmationError(false), 3000)
      }
      return
    }
    
    // Double check - ensure details are confirmed
    if (!detailsConfirmed) {
      setShowConfirmationError(true)
      setTimeout(() => setShowConfirmationError(false), 3000)
      return
    }

    try {
      setSubmitting(true)
      setShowConfirmationError(false)

      // Submit form to backend
      await submitForm(formData)
      
      // Clear form data from localStorage after successful submission
      clearFormData()
      
      setHasSubmitted(true)
      setLoadingStatus(true)
    } catch (error) {
      console.error('Error submitting form:', error)
      alert(`שגיאה בשליחת הבקשה: ${error?.message || 'שגיאה בשליחת הבקשה'}`)
    } finally {
      setSubmitting(false)
    }
  }
  
  const handleCheckboxChange = (e) => {
    const isChecked = e.target.checked
    setDetailsConfirmed(isChecked)
    // Clear error when checkbox is checked
    if (isChecked) {
      setShowConfirmationError(false)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return ''
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('he-IL', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      })
    } catch {
      return dateString
    }
  }

  return (
    <div className="personal-details-page">
      <div className="personal-details-container">
        <div className="personal-details-content">
          {/* Header with Logo */}
          <div className="personal-details-header">
            <div className="logo-section">
              <div className="nav-logo-link">
                <span className="nav-logo-text">קל-היתר</span>
                <img 
                  className="nav-logo-icon" 
                  alt="קל-היתר לוגו" 
                  src="https://c.animaapp.com/VuAXsrkU/img/group-10-1@2x.png" 
                />
              </div>
            </div>
          </div>

          {/* Main Form Card */}
          <div className="personal-details-card">
            {/* Timeline Section at Top */}
            <div className="timeline-section">
              <div className="progress-indicator" style={{ '--progress-width': '100%' }}>
                {steps.map((step) => (
                  <div key={step.number} className={`progress-step completed`}>
                    <div className={`progress-circle completed`}>
                      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <span className="progress-label">{step.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="personal-details-card-content">
              <h2 className="form-title">סיכום ושליחת בקשה</h2>

              {/* Personal Details Section */}
              <div className="summary-section">
                <div className="summary-section-header">
                  <h3 className="summary-section-title">פרטים אישיים בעל הנכס</h3>
                  {!hasSubmitted && (
                    <button 
                      className="edit-link"
                      onClick={() => navigate('/property-details')}
                      type="button"
                    >
                      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M18.5 2.5C18.8978 2.10218 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.10218 21.5 2.5C21.8978 2.89782 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.10218 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      עריכת פרטים
                    </button>
                  )}
                </div>
                <div className="summary-details-grid">
                  <div className="summary-detail-item">
                    <span className="summary-label">שם פרטי:</span>
                    <span className="summary-value">{personalDetails.firstName || '-'}</span>
                  </div>
                  <div className="summary-detail-item">
                    <span className="summary-label">שם משפחה:</span>
                    <span className="summary-value">{personalDetails.lastName || '-'}</span>
                  </div>
                  <div className="summary-detail-item">
                    <span className="summary-label">טלפון:</span>
                    <span className="summary-value">{personalDetails.phone || '-'}</span>
                  </div>
                  <div className="summary-detail-item">
                    <span className="summary-label">מספר תעודת זהות:</span>
                    <span className="summary-value">{personalDetails.idNumber || '-'}</span>
                  </div>
                  <div className="summary-detail-item">
                    <span className="summary-label">צילום תעודת זהות:</span>
                    <span className="summary-value">
                      {personalDetails.idPhoto ? (
                        <span>{personalDetails.idPhoto.name || 'קובץ נבחר'}</span>
                      ) : (
                        <span className="no-file">לא נבחר קובץ</span>
                      )}
                    </span>
                  </div>
                  <div className="summary-detail-item">
                    <span className="summary-label">חוזה רשות מקרקעי ישראל:</span>
                    <span className="summary-value">{propertyDetails.israelLandAuthorityContract || '-'}</span>
                  </div>
                  <div className="summary-detail-item">
                    <span className="summary-label">נסח טאבו:</span>
                    <span className="summary-value">
                      {propertyDetails.tabuExtract ? (
                        <span>{propertyDetails.tabuExtract.name || 'קובץ נבחר'}</span>
                      ) : (
                        <span className="no-file">לא נבחר קובץ</span>
                      )}
                    </span>
                  </div>
                  <div className="summary-detail-item">
                    <span className="summary-label">אימייל:</span>
                    <span className="summary-value">{personalDetails.email || '-'}</span>
                  </div>
                </div>
              </div>

              {/* Property Details Section */}
              <div className="summary-section">
                <div className="summary-section-header">
                  <h3 className="summary-section-title">פרטי הנכס</h3>
                  {!hasSubmitted && (
                    <button 
                      className="edit-link"
                      onClick={() => navigate('/property-details')}
                      type="button"
                    >
                      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M18.5 2.5C18.8978 2.10218 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.10218 21.5 2.5C21.8978 2.89782 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.10218 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      עריכת פרטים
                    </button>
                  )}
                </div>
                <div className="summary-details-grid">
                  <div className="summary-detail-item">
                    <span className="summary-label">עיר / מושב / קיבוץ:</span>
                    <span className="summary-value">{propertyDetails.city || '-'}</span>
                  </div>
                  <div className="summary-detail-item">
                    <span className="summary-label">מועצה / עירייה:</span>
                    <span className="summary-value">{propertyDetails.council || '-'}</span>
                  </div>
                  <div className="summary-detail-item">
                    <span className="summary-label">גוש:</span>
                    <span className="summary-value">{propertyDetails.gush || '-'}</span>
                  </div>
                  <div className="summary-detail-item">
                    <span className="summary-label">חלקה:</span>
                    <span className="summary-value">{propertyDetails.helka || '-'}</span>
                  </div>
                  <div className="summary-detail-item">
                    <span className="summary-label">רחוב:</span>
                    <span className="summary-value">{propertyDetails.street || '-'}</span>
                  </div>
                  <div className="summary-detail-item">
                    <span className="summary-label">גודל נכס:</span>
                    <span className="summary-value">{propertyDetails.propertySize ? `${propertyDetails.propertySize} מ"ר` : '-'}</span>
                  </div>
                  <div className="summary-detail-item">
                    <span className="summary-label">מגרש:</span>
                    <span className="summary-value">{propertyDetails.lot || '-'}</span>
                  </div>
                  <div className="summary-detail-item">
                    <span className="summary-label">צילום נכס:</span>
                    <span className="summary-value">
                      {propertyDetails.propertyPhotos && propertyDetails.propertyPhotos.length > 0 ? (
                        <span>{propertyDetails.propertyPhotos.length} קבצים נבחרו</span>
                      ) : (
                        <span className="no-file">לא נבחרו קבצים</span>
                      )}
                    </span>
                  </div>
                  <div className="summary-detail-item">
                    <span className="summary-label">תאריך צילום:</span>
                    <span className="summary-value">{propertyDetails.photoDate ? formatDate(propertyDetails.photoDate) : '-'}</span>
                  </div>
                </div>
              </div>

              {/* Measurement Map Section */}
              <div className="summary-section">
                <div className="summary-section-header">
                  <h3 className="summary-section-title">מפת מדידה</h3>
                  {!hasSubmitted && (
                    <button 
                      className="edit-link"
                      onClick={() => navigate('/property-details-final')}
                      type="button"
                    >
                      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M18.5 2.5C18.8978 2.10218 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.10218 21.5 2.5C21.8978 2.89782 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.10218 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      עריכת פרטים
                    </button>
                  )}
                </div>
                <div className="summary-details-grid">
                  <div className="summary-detail-item">
                    <span className="summary-label">שם המודד:</span>
                    <span className="summary-value">{measurementDetails.surveyorName || '-'}</span>
                  </div>
                  <div className="summary-detail-item">
                    <span className="summary-label">תאריך מדידה:</span>
                    <span className="summary-value">{measurementDetails.measurementDate ? formatDate(measurementDetails.measurementDate) : '-'}</span>
                  </div>
                  <div className="summary-detail-item">
                    <span className="summary-label">קובץ DWG:</span>
                    <span className="summary-value">
                      {measurementDetails.dwgFile ? (
                        <span>{measurementDetails.dwgFile.name || 'קובץ נבחר'}</span>
                      ) : (
                        <span className="no-file">לא נבחר קובץ</span>
                      )}
                    </span>
                  </div>
                  <div className="summary-detail-item">
                    <span className="summary-label">קובץ DWF:</span>
                    <span className="summary-value">
                      {measurementDetails.dwfFile ? (
                        <span>{measurementDetails.dwfFile.name || 'קובץ נבחר'}</span>
                      ) : (
                        <span className="no-file">לא נבחר קובץ</span>
                      )}
                    </span>
                  </div>
                  <div className="summary-detail-item">
                    <span className="summary-label">קובץ PDF:</span>
                    <span className="summary-value">
                      {measurementDetails.pdfFile ? (
                        <span>{measurementDetails.pdfFile.name || 'קובץ נבחר'}</span>
                      ) : (
                        <span className="no-file">לא נבחר קובץ</span>
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {/* Dream Home Section */}
              <div className="summary-section">
                <div className="summary-section-header">
                  <h3 className="summary-section-title">בית חלומות</h3>
                  {!hasSubmitted && (
                    <button 
                      className="edit-link"
                      onClick={() => navigate('/home-catalog')}
                      type="button"
                    >
                      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M18.5 2.5C18.8978 2.10218 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.10218 21.5 2.5C21.8978 2.89782 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.10218 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      עריכת פרטים
                    </button>
                  )}
                </div>
                {selectedHouse && selectedHouse.id && (
                  <div className="summary-house-card">
                    <img 
                      src={selectedHouse.image || 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=900&q=80'} 
                      alt={selectedHouse.title}
                      className="summary-house-image"
                    />
                    <div className="summary-house-details">
                      <h4 className="summary-house-title">{selectedHouse.title || 'שם הדגם'}</h4>
                      <div className="summary-house-specs">
                        {selectedHouse.spec && selectedHouse.spec.map((item, i) => {
                          // Handle both old format (string) and new format (object with icon and text)
                          const specText = typeof item === 'string' ? item : item.text;
                          return (
                            <span key={i} className="summary-house-spec">{specText}</span>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Application Status Section - visible only after submit */}
              {hasSubmitted && (
                <div className="summary-section" style={{
                  background: applicationStatus === 'בקשה טופלה' ? '#f0fdf4' : '#fef3c7',
                  border: `2px solid ${applicationStatus === 'בקשה טופלה' ? '#10b981' : '#f59e0b'}`,
                  borderRadius: '12px',
                  padding: '24px',
                  marginTop: '20px'
                }}>
                  <div className="summary-section-header">
                    <h3 className="summary-section-title" style={{
                      color: applicationStatus === 'בקשה טופלה' ? '#065f46' : '#92400e',
                      marginBottom: '16px'
                    }}>
                      סטטוס הבקשה
                    </h3>
                  </div>
                  {loadingStatus ? (
                    <div style={{ textAlign: 'center', padding: '20px' }}>
                      <p style={{ color: '#6b7280' }}>טוען סטטוס...</p>
                    </div>
                  ) : (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      padding: '16px',
                      background: 'white',
                      borderRadius: '8px',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}>
                      <div style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '50%',
                        background: applicationStatus === 'בקשה טופלה'
                          ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                          : 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        {applicationStatus === 'בקשה טופלה' ? (
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20 6L9 17L4 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        ) : (
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2"/>
                            <path d="M12 6V12L16 14" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                          </svg>
                        )}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{
                          fontSize: '1.1rem',
                          fontWeight: '600',
                          color: '#2C3E50',
                          marginBottom: '4px'
                        }}>
                          {applicationStatus}
                        </div>
                        <div style={{
                          fontSize: '0.875rem',
                          color: '#6b7280'
                        }}>
                          {applicationStatus === 'בקשה טופלה'
                            ? 'הבקשה שלך טופלה בהצלחה'
                            : 'הבקשה שלך נמצאת כעת בטיפול'}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Confirmation Checkbox */}
              {!hasSubmitted && (
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  padding: '20px',
                  background: showConfirmationError ? '#fef2f2' : '#f9fafb',
                  border: showConfirmationError ? '2px solid #ef4444' : 'none',
                  borderRadius: '12px',
                  marginBottom: '20px',
                  direction: 'rtl'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    position: 'relative'
                  }}>
                    <div style={{ position: 'relative', display: 'inline-block', width: '22px', height: '22px', flexShrink: 0 }}>
                      <input
                        type="checkbox"
                        id="details-confirmation"
                        checked={detailsConfirmed}
                        onChange={handleCheckboxChange}
                        style={{
                          width: '22px',
                          height: '22px',
                          minWidth: '22px',
                          minHeight: '22px',
                          maxWidth: '22px',
                          maxHeight: '22px',
                          cursor: 'pointer',
                          backgroundColor: detailsConfirmed ? '#0f4eb3' : 'white',
                          border: detailsConfirmed ? '2px solid #0f4eb3' : '2px solid #d1d5db',
                          borderRadius: '4px',
                          appearance: 'none',
                          WebkitAppearance: 'none',
                          MozAppearance: 'none',
                          transition: 'all 0.2s ease',
                          margin: 0,
                          padding: 0,
                          position: 'relative',
                          zIndex: 1,
                          boxSizing: 'border-box',
                          display: 'block'
                        }}
                      />
                      {detailsConfirmed && (
                        <svg
                          style={{
                            position: 'absolute',
                            left: '50%',
                            top: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: '14px',
                            height: '14px',
                            pointerEvents: 'none',
                            zIndex: 10,
                            display: 'block'
                          }}
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M20 6L9 17L4 12"
                            stroke="#ffffff"
                            strokeWidth="3.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </div>
                    <label
                      htmlFor="details-confirmation"
                      style={{
                        fontFamily: 'Tel_Aviv-ModernistRegular, Tel Aviv, Helvetica, sans-serif',
                        fontSize: '16px',
                        color: '#374151',
                        cursor: 'pointer',
                        userSelect: 'none',
                        fontWeight: detailsConfirmed ? '500' : '400'
                      }}
                    >
                      הפרטים שהזנתי נכונים
                    </label>
                  </div>
                  {showConfirmationError && (
                    <div style={{
                      color: '#ef4444',
                      fontSize: '14px',
                      fontFamily: 'Tel_Aviv-ModernistRegular, Tel Aviv, Helvetica, sans-serif',
                      paddingRight: '32px',
                      marginTop: '4px'
                    }}>
                      יש לאשר שהפרטים נכונים לפני שליחה
                    </div>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="form-actions" style={{ position: 'relative', display: 'flex', gap: '20px', alignItems: 'center', justifyContent: 'flex-start', flexDirection: 'row-reverse' }}>
                {!hasSubmitted && (
                  <button 
                    type="button"
                    className="back-button"
                    onClick={() => navigate('/home-catalog')}
                    style={{
                      position: 'relative',
                      top: 'auto',
                      left: 'auto',
                      right: 'auto',
                      bottom: 'auto',
                      margin: 0,
                      padding: '14px 32px',
                      background: '#9ca3af',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontFamily: 'Tel_Aviv-ModernistBold, Tel Aviv, Helvetica, sans-serif',
                      fontSize: '16px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      display: 'inline-block',
                      visibility: 'visible',
                      opacity: 1
                    }}
                  >
                    חזרה למסך קודם
                  </button>
                )}
                {!hasSubmitted && (
                  <button
                    type="button"
                    className="continue-button"
                    onClick={handleSubmit}
                    disabled={submitting || hasSubmitted || !detailsConfirmed}
                    style={{
                      opacity: !detailsConfirmed ? 0.5 : 1,
                      cursor: !detailsConfirmed ? 'not-allowed' : 'pointer',
                      pointerEvents: !detailsConfirmed ? 'none' : 'auto'
                    }}
                    aria-disabled={!detailsConfirmed}
                  >
                    {submitting ? 'שולח...' : 'שליחת הבקשה'}
                  </button>
                )}
                {hasSubmitted && (
                  <div style={{
                    padding: '12px 24px',
                    background: '#10b981',
                    color: 'white',
                    borderRadius: '8px',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    הבקשה נשלחה
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SummaryPage

