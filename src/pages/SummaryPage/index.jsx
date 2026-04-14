import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './styles.module.css'
import { getFormData } from '../../services/formData'
import { submitForm, checkSubmissionStatus } from '../../services/formSubmission'
import { authenticatedFetch, getAccessToken } from '../../services/auth'
import CheckmarkIcon from '../../components/icons/CheckmarkIcon'
import EditIcon from '../../components/icons/EditIcon'
import ClockIcon from '../../components/icons/ClockIcon'

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
          // If localStorage is empty (e.g. new browser/device), load form data from backend
          if (!savedData || Object.keys(savedData).length === 0) {
            if (status.form_data) {
              setFormData({
                personalDetails: status.form_data.personal_details || {},
                propertyDetails: status.form_data.property_details || {},
                measurementDetails: status.form_data.measurement_details || {},
                selectedHouse: status.form_data.selected_house || {},
              })
            }
          }
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

  const isDone = applicationStatus === 'בקשה טופלה'

  return (
    <div className={styles['personal-details-page']}>
      <div className={styles['personal-details-container']}>
        <div className={styles['personal-details-content']}>
          {/* Header with Logo */}
          <div className={styles['personal-details-header']}>
            <div className={styles['logo-section']}>
              <div className={styles['nav-logo-link']}>
                <span className={styles['nav-logo-text']}>קל-היתר</span>
                <img
                  className={styles['nav-logo-icon']}
                  alt="קל-היתר לוגו"
                  src="https://c.animaapp.com/VuAXsrkU/img/group-10-1@2x.png"
                />
              </div>
            </div>
          </div>

          {/* Main Form Card */}
          <div className={styles['personal-details-card']}>
            {/* Timeline Section at Top */}
            <div className={styles['timeline-section']}>
              <div className={styles['progress-indicator']} style={{ '--progress-width': '100%' }}>
                {steps.map((step) => (
                  <div key={step.number} className={`${styles['progress-step']} ${styles.completed}`}>
                    <div className={`${styles['progress-circle']} ${styles.completed}`}>
                    </div>
                    <span className={styles['progress-label']}>{step.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles['personal-details-card-content']}>
              <h2 className={styles['form-title']}>סיכום ושליחת בקשה</h2>

              {/* Personal Details Section */}
              <div className={styles['summary-section']}>
                <div className={styles['summary-section-header']}>
                  <h3 className={styles['summary-section-title']}>פרטים אישיים בעל הנכס</h3>
                  {!hasSubmitted && (
                    <button
                      className={styles['edit-link']}
                      onClick={() => navigate('/dashboard')}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          navigate('/dashboard')
                        }
                      }}
                      type="button"
                      aria-label="עריכת פרטים אישיים"
                    >
                      <EditIcon />
                      עריכת פרטים
                    </button>
                  )}
                </div>
                <div className={styles['summary-details-grid']}>
                  <div className={styles['summary-detail-item']}>
                    <span className={styles['summary-label']}>שם פרטי:</span>
                    <span className={styles['summary-value']}>{personalDetails.firstName || '-'}</span>
                  </div>
                  <div className={styles['summary-detail-item']}>
                    <span className={styles['summary-label']}>שם משפחה:</span>
                    <span className={styles['summary-value']}>{personalDetails.lastName || '-'}</span>
                  </div>
                  <div className={styles['summary-detail-item']}>
                    <span className={styles['summary-label']}>טלפון:</span>
                    <span className={styles['summary-value']}>{personalDetails.phone || '-'}</span>
                  </div>
                  <div className={styles['summary-detail-item']}>
                    <span className={styles['summary-label']}>מספר תעודת זהות:</span>
                    <span className={styles['summary-value']}>{personalDetails.idNumber || '-'}</span>
                  </div>
                  <div className={styles['summary-detail-item']}>
                    <span className={styles['summary-label']}>צילום תעודת זהות:</span>
                    <span className={styles['summary-value']}>
                      {personalDetails.idPhoto ? (
                        <span>{personalDetails.idPhoto.name || 'קובץ נבחר'}</span>
                      ) : (
                        <span className={styles['no-file']}>לא נבחר קובץ</span>
                      )}
                    </span>
                  </div>
                  <div className={styles['summary-detail-item']}>
                    <span className={styles['summary-label']}>חוזה רשות מקרקעי ישראל:</span>
                    <span className={styles['summary-value']}>{propertyDetails.israelLandAuthorityContract || '-'}</span>
                  </div>
                  <div className={styles['summary-detail-item']}>
                    <span className={styles['summary-label']}>נסח טאבו:</span>
                    <span className={styles['summary-value']}>
                      {propertyDetails.tabuExtract ? (
                        <span>{propertyDetails.tabuExtract.name || 'קובץ נבחר'}</span>
                      ) : (
                        <span className={styles['no-file']}>לא נבחר קובץ</span>
                      )}
                    </span>
                  </div>
                  <div className={styles['summary-detail-item']}>
                    <span className={styles['summary-label']}>אימייל:</span>
                    <span className={styles['summary-value']}>
                      {personalDetails.email ? (
                        <a href={`mailto:${personalDetails.email}`} className={styles['email-link']}>
                          {personalDetails.email}
                        </a>
                      ) : '-'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Measurement Map Section */}
              <div className={styles['summary-section']}>
                <div className={styles['summary-section-header']}>
                  <h3 className={styles['summary-section-title']}>מפת מדידה</h3>
                  {!hasSubmitted && (
                    <button
                      className={styles['edit-link']}
                      onClick={() => navigate('/property-details-final')}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          navigate('/property-details-final')
                        }
                      }}
                      type="button"
                      aria-label="עריכת מפת מדידה"
                    >
                      <EditIcon />
                      עריכת פרטים
                    </button>
                  )}
                </div>
                <div className={styles['summary-details-grid']}>
                  <div className={styles['summary-detail-item']}>
                    <span className={styles['summary-label']}>שם המודד:</span>
                    <span className={styles['summary-value']}>{measurementDetails.surveyorName || '-'}</span>
                  </div>
                  <div className={styles['summary-detail-item']}>
                    <span className={styles['summary-label']}>תאריך מדידה:</span>
                    <span className={styles['summary-value']}>{measurementDetails.measurementDate ? formatDate(measurementDetails.measurementDate) : '-'}</span>
                  </div>
                  <div className={styles['summary-detail-item']}>
                    <span className={styles['summary-label']}>מספר מיפוי ישראל:</span>
                    <span className={styles['summary-value']}>{measurementDetails.israelMappingNumber || '-'}</span>
                  </div>
                  <div className={styles['summary-detail-item']}>
                    <span className={styles['summary-label']}>קובץ DWG:</span>
                    <span className={styles['summary-value']}>
                      {measurementDetails.dwgFile ? (
                        <span>{measurementDetails.dwgFile.name || 'קובץ נבחר'}</span>
                      ) : (
                        <span className={styles['no-file']}>לא נבחר קובץ</span>
                      )}
                    </span>
                  </div>
                  <div className={styles['summary-detail-item']}>
                    <span className={styles['summary-label']}>קובץ DWF:</span>
                    <span className={styles['summary-value']}>
                      {measurementDetails.dwfFile ? (
                        <span>{measurementDetails.dwfFile.name || 'קובץ נבחר'}</span>
                      ) : (
                        <span className={styles['no-file']}>לא נבחר קובץ</span>
                      )}
                    </span>
                  </div>
                  <div className={styles['summary-detail-item']}>
                    <span className={styles['summary-label']}>קובץ PDF:</span>
                    <span className={styles['summary-value']}>
                      {measurementDetails.pdfFile ? (
                        <span>{measurementDetails.pdfFile.name || 'קובץ נבחר'}</span>
                      ) : (
                        <span className={styles['no-file']}>לא נבחר קובץ</span>
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {/* Property Details Section */}
              <div className={styles['summary-section']}>
                <div className={styles['summary-section-header']}>
                  <h3 className={styles['summary-section-title']}>פרטי הנכס</h3>
                  {!hasSubmitted && (
                    <button
                      className={styles['edit-link']}
                      onClick={() => navigate('/property-details')}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          navigate('/property-details')
                        }
                      }}
                      type="button"
                      aria-label="עריכת פרטי הנכס"
                    >
                      <EditIcon />
                      עריכת פרטים
                    </button>
                  )}
                </div>
                <div className={styles['summary-details-grid']}>
                  <div className={styles['summary-detail-item']}>
                    <span className={styles['summary-label']}>עיר / מושב / קיבוץ:</span>
                    <span className={styles['summary-value']}>{propertyDetails.city || '-'}</span>
                  </div>
                  <div className={styles['summary-detail-item']}>
                    <span className={styles['summary-label']}>מועצה / עירייה:</span>
                    <span className={styles['summary-value']}>{propertyDetails.council || '-'}</span>
                  </div>
                  <div className={styles['summary-detail-item']}>
                    <span className={styles['summary-label']}>גוש:</span>
                    <span className={styles['summary-value']}>{propertyDetails.gush || '-'}</span>
                  </div>
                  <div className={styles['summary-detail-item']}>
                    <span className={styles['summary-label']}>חלקה:</span>
                    <span className={styles['summary-value']}>{propertyDetails.helka || '-'}</span>
                  </div>
                  <div className={styles['summary-detail-item']}>
                    <span className={styles['summary-label']}>רחוב:</span>
                    <span className={styles['summary-value']}>{propertyDetails.street || '-'}</span>
                  </div>
                  <div className={styles['summary-detail-item']}>
                    <span className={styles['summary-label']}>גודל נכס:</span>
                    <span className={styles['summary-value']}>{propertyDetails.propertySize ? `${propertyDetails.propertySize} מ"ר` : '-'}</span>
                  </div>
                  <div className={styles['summary-detail-item']}>
                    <span className={styles['summary-label']}>מגרש:</span>
                    <span className={styles['summary-value']}>{propertyDetails.lot || '-'}</span>
                  </div>
                  <div className={styles['summary-detail-item']}>
                    <span className={styles['summary-label']}>צילום נכס:</span>
                    <span className={styles['summary-value']}>
                      {propertyDetails.propertyPhotos && propertyDetails.propertyPhotos.length > 0 ? (
                        <span>{propertyDetails.propertyPhotos.length} קבצים נבחרו</span>
                      ) : (
                        <span className={styles['no-file']}>לא נבחרו קבצים</span>
                      )}
                    </span>
                  </div>
                  <div className={styles['summary-detail-item']}>
                    <span className={styles['summary-label']}>תאריך צילום:</span>
                    <span className={styles['summary-value']}>{propertyDetails.photoDate ? formatDate(propertyDetails.photoDate) : '-'}</span>
                  </div>
                </div>
              </div>

              {/* Dream Home Section */}
              <div className={styles['summary-section']}>
                <div className={styles['summary-section-header']}>
                  <h3 className={styles['summary-section-title']}>בית חלומות</h3>
                  {!hasSubmitted && (
                    <button
                      className={styles['edit-link']}
                      onClick={() => navigate('/home-catalog')}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          navigate('/home-catalog')
                        }
                      }}
                      type="button"
                      aria-label="עריכת בחירת בית"
                    >
                      <EditIcon />
                      עריכת פרטים
                    </button>
                  )}
                </div>
                {selectedHouse && selectedHouse.id && (
                  <div className={styles['summary-house-card']}>
                    <img
                      src={selectedHouse.image || 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=900&q=80'}
                      alt={selectedHouse.title}
                      className={styles['summary-house-image']}
                    />
                    <div className={styles['summary-house-details']}>
                      <h4 className={styles['summary-house-title']}>{selectedHouse.title || 'שם הדגם'}</h4>
                      <div className={styles['summary-house-specs']}>
                        {selectedHouse.spec && selectedHouse.spec.map((item, i) => {
                          // Handle both old format (string) and new format (object with icon and text)
                          const specText = typeof item === 'string' ? item : item.text;
                          return (
                            <span key={i} className={styles['summary-house-spec']}>{specText}</span>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Application Status Section - visible only after submit */}
              {hasSubmitted && (
                <div className={isDone ? styles['status-section-done'] : styles['status-section-pending']}>
                  <div className={styles['summary-section-header']}>
                    <h3 className={isDone ? styles['status-title-done'] : styles['status-title-pending']}>
                      סטטוס הבקשה
                    </h3>
                  </div>
                  {loadingStatus ? (
                    <div className={styles['status-loading-text']}>
                      <p>טוען סטטוס...</p>
                    </div>
                  ) : (
                    <div className={styles['status-box']}>
                      <div className={`${styles['status-badge']} ${isDone ? styles['status-badge-done'] : styles['status-badge-pending']}`}>
                        {isDone ? (
                          <CheckmarkIcon stroke="white" />
                        ) : (
                          <ClockIcon stroke="white" />
                        )}
                      </div>
                      <div className={styles['status-info']}>
                        <div className={styles['status-info-title']}>
                          {applicationStatus}
                        </div>
                        <div className={styles['status-info-subtitle']}>
                          {isDone
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
                <div className={showConfirmationError ? styles['confirmation-section-error'] : styles['confirmation-section']}>
                  <div className={styles['confirmation-inner']}>
                    <div className={styles['checkbox-wrapper']}>
                      <input
                        type="checkbox"
                        id="details-confirmation"
                        checked={detailsConfirmed}
                        onChange={handleCheckboxChange}
                        className={styles['terms-checkbox-hidden']}
                      />
                      <div className={`${styles['terms-checkbox-styled']} ${detailsConfirmed ? styles['terms-checkbox-styled-checked'] : styles['terms-checkbox-styled-unchecked']}`}>
                        {detailsConfirmed && (
                          <CheckmarkIcon className={styles['checkmark-svg']} stroke="#ffffff" strokeWidth={3.5} />
                        )}
                      </div>
                    </div>
                    <label
                      htmlFor="details-confirmation"
                      className={`${styles['confirmation-label']} ${detailsConfirmed ? styles['confirmation-label-checked'] : styles['confirmation-label-unchecked']}`}
                    >
                      הפרטים שהזנתי נכונים
                    </label>
                  </div>
                  {showConfirmationError && (
                    <div className={styles['confirmation-error']}>
                      יש לאשר שהפרטים נכונים לפני שליחה
                    </div>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className={styles['form-actions']}>
                {!hasSubmitted && (
                  <button
                    type="button"
                    className={styles['back-button']}
                    onClick={() => navigate('/home-catalog')}
                  >
                    חזרה למסך קודם
                  </button>
                )}
                {!hasSubmitted && (
                  <button
                    type="button"
                    className={`${styles['continue-button']} ${!detailsConfirmed ? styles['continue-button-disabled'] : ''}`}
                    onClick={handleSubmit}
                    disabled={submitting || hasSubmitted || !detailsConfirmed}
                    aria-disabled={!detailsConfirmed}
                  >
                    {submitting ? 'שולח...' : 'שליחת הבקשה'}
                  </button>
                )}
                {hasSubmitted && (
                  <div className={styles['submit-success-badge']}>
                    <CheckmarkIcon width={20} height={20} />
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
