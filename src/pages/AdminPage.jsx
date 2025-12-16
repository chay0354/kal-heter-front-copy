import React, { useState, useEffect } from 'react'
import '../components/PlanningRequest.css'

// Normalize API base URL - remove trailing slashes to prevent double slashes
const getApiBaseUrl = () => {
  const url = import.meta.env.VITE_API_BASE_URL;
  if (!url) {
    throw new Error('VITE_API_BASE_URL is not set');
  }
  // Remove all trailing slashes and whitespace
  const normalized = url.trim().replace(/\/+$/, '');
  console.log('[API URL Debug] Original:', url, 'Normalized:', normalized);
  return normalized;
};

const API_BASE_URL = getApiBaseUrl();

// Helper function to build API URLs safely (prevents double slashes)
const buildApiUrl = (path) => {
  // Ensure base has no trailing slash
  const base = API_BASE_URL.replace(/\/+$/, '');
  // Remove leading slashes from path and ensure it starts with /
  const cleanPath = path.replace(/^\/+/, '');
  // Combine with exactly one slash
  const finalUrl = `${base}/${cleanPath}`;
  console.log('[buildApiUrl] Base:', base, 'Path:', path, 'Final URL:', finalUrl);
  return finalUrl;
};

// Custom Status Dropdown Component
const StatusDropdown = ({ value, onChange, userId, onStatusChange, onClick }) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = React.useRef(null)

  const options = ['בטיפול', 'בקשה טופלה']

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleSelect = async (newStatus) => {
    setIsOpen(false)
    if (onStatusChange) {
      await onStatusChange(newStatus)
    }
    if (onChange) {
      onChange({ target: { value: newStatus } })
    }
  }

  return (
    <div 
      ref={dropdownRef}
      style={{ position: 'relative', width: '100px' }}
      onClick={(e) => {
        e.stopPropagation()
        if (onClick) onClick(e)
      }}
    >
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{
          padding: '6px 28px 6px 12px',
          borderRadius: '12px',
          fontSize: '0.875rem',
          fontWeight: '600',
          border: '1px solid #e5e7eb',
          background: 'white',
          color: '#2C3E50',
          cursor: 'pointer',
          textAlign: 'center',
          transition: 'all 0.2s ease',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          minHeight: '35px'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = '#667eea'
          e.currentTarget.style.boxShadow = '0 2px 6px rgba(102, 126, 234, 0.2)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = '#e5e7eb'
          e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)'
        }}
      >
        <span style={{ flex: 1, textAlign: 'center' }}>{value || 'בטיפול'}</span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            marginLeft: '8px',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease'
          }}
        >
          <path d="M6 9L1 4h10z" fill="#6b7280" />
        </svg>
      </div>
      
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            marginTop: '4px',
            background: 'white',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            border: '1px solid #e5e7eb',
            zIndex: 1000,
            overflow: 'hidden'
          }}
        >
          {options.map((option) => (
            <div
              key={option}
              onClick={() => handleSelect(option)}
              style={{
                padding: '10px 16px',
                fontSize: '0.875rem',
                fontWeight: value === option ? '600' : '500',
                color: value === option ? '#667eea' : '#2C3E50',
                background: value === option ? '#eef2ff' : 'white',
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'all 0.2s ease',
                borderBottom: option !== options[options.length - 1] ? '1px solid #f3f4f6' : 'none'
              }}
              onMouseEnter={(e) => {
                if (value !== option) {
                  e.currentTarget.style.background = '#f9fafb'
                }
              }}
              onMouseLeave={(e) => {
                if (value !== option) {
                  e.currentTarget.style.background = 'white'
                }
              }}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const AdminPage = () => {
  const [users, setUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [loadingDetails, setLoadingDetails] = useState(false)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const url = buildApiUrl('/api/admin/users');
      console.log('Fetching users from:', url)
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      console.log('Response status:', response.status, response.statusText)
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('Error response:', errorText)
        throw new Error(`Failed to fetch users: ${response.status} ${response.statusText}`)
      }
      
      const data = await response.json()
      console.log('Users data received:', data)
      setUsers(data.users || [])
      setError(null)
    } catch (err) {
      setError(err.message)
      console.error('Error fetching users:', err)
    } finally {
      setLoading(false)
    }
  }

          const fetchUserDetails = async (userId) => {
            try {
              setLoadingDetails(true)
              const response = await fetch(buildApiUrl(`/api/admin/users/${userId}`), {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                },
              })
              
              if (!response.ok) {
                throw new Error('Failed to fetch user details')
              }
              
              const userData = await response.json()
              console.log('Backend returned user data:', userData)
              console.log('Form submissions from backend:', userData.form_submissions)
              console.log('Form draft from backend:', userData.form_draft)
              console.log('Application data from backend:', userData.application_data)
              console.log('All user data keys:', Object.keys(userData))
              
              // Debug file URLs
              if (userData.form_draft) {
                console.log('Form draft file_urls:', userData.form_draft.file_urls)
                console.log('Form draft file_urls type:', typeof userData.form_draft.file_urls)
              }
              if (userData.form_submissions && userData.form_submissions.length > 0) {
                console.log('Form submission file_urls:', userData.form_submissions[0].file_urls)
                console.log('Form submission file_urls type:', typeof userData.form_submissions[0].file_urls)
              }
              
              setSelectedUser(userData)
            } catch (err) {
              console.error('Error fetching user details:', err)
              alert('שגיאה בטעינת פרטי המשתמש')
            } finally {
              setLoadingDetails(false)
            }
          }

  const handleUserClick = (user) => {
    fetchUserDetails(user.id)
  }

  const handleBackToList = () => {
    setSelectedUser(null)
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'לא זמין'
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('he-IL', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return dateString
    }
  }

  const handleDownloadFile = async (fileUrl, fileName) => {
    if (!fileUrl) {
      alert('אין קישור לקובץ להורדה')
      return
    }
    
    console.log('[Download] Starting download:', fileUrl, 'as:', fileName)
    
    try {
      // First, try to download directly from Supabase URL (if it's public)
      try {
        console.log('[Download] Attempting direct download from:', fileUrl)
        const response = await fetch(fileUrl, { 
          mode: 'cors',
          cache: 'no-cache'
        })
        
        if (response.ok) {
          console.log('[Download] Direct download successful')
          const blob = await response.blob()
          const url = window.URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = fileName || fileUrl.split('/').pop().split('?')[0] || 'download'
          document.body.appendChild(a)
          a.click()
          window.URL.revokeObjectURL(url)
          document.body.removeChild(a)
          console.log('[Download] File downloaded successfully via direct method')
          return
        } else {
          console.log('[Download] Direct download failed with status:', response.status)
        }
      } catch (directError) {
        console.log('[Download] Direct download error:', directError)
      }
      
      // If direct download fails, use our backend download endpoint
      const downloadUrl = buildApiUrl(`/api/admin/files/download?file_url=${encodeURIComponent(fileUrl)}`)
      console.log('[Download] Using backend download endpoint:', downloadUrl)
      
      const response = await fetch(downloadUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('[Download] Backend download failed:', response.status, errorText)
        throw new Error(`Download failed: ${response.status} ${response.statusText}`)
      }
      
      const blob = await response.blob()
      console.log('[Download] Received blob, size:', blob.size, 'bytes')
      
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = fileName || fileUrl.split('/').pop().split('?')[0] || 'download'
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      console.log('[Download] File downloaded successfully via backend')
    } catch (error) {
      console.error('[Download] Error downloading file:', error)
      alert(`שגיאה בהורדת הקובץ: ${error.message}\n\nנסה לפתוח את הקובץ בחלון חדש.`)
      // Fallback: open in new tab
      try {
        window.open(fileUrl, '_blank')
      } catch (openError) {
        console.error('[Download] Failed to open file in new tab:', openError)
        alert('לא ניתן להוריד או לפתוח את הקובץ. בדוק את הקישור.')
      }
    }
  }

  // Small helper used throughout the details view
  const FileLink = ({ url, label, fileName }) => {
    console.log('[FileLink] Rendering with url:', url, 'fileName:', fileName)
    if (!url || url === '' || url === null || url === undefined) {
      return <span className="no-file">לא נבחר קובץ</span>
    }
    
    // Ensure URL is a string
    const fileUrl = String(url).trim()
    if (!fileUrl || fileUrl === '') {
      return <span className="no-file">לא נבחר קובץ</span>
    }
    
    return (
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <a
          href={fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: '#667eea', textDecoration: 'underline' }}
          onClick={(e) => {
            console.log('[FileLink] Opening file:', fileUrl)
          }}
        >
          {label || 'צפה בקובץ'}
        </a>
        <button
          onClick={(e) => {
            e.preventDefault()
            console.log('[FileLink] Downloading file:', fileUrl, 'as:', fileName)
            handleDownloadFile(fileUrl, fileName)
          }}
          style={{
            padding: '4px 12px',
            background: '#667eea',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '0.875rem',
            fontWeight: '500'
          }}
        >
          הורד
        </button>
      </div>
    )
  }

  // If user is selected, show details view
  if (selectedUser) {
    const user = selectedUser
    // Prioritize draft if exists, otherwise use latest submission
    const hasDraft = !!user.form_draft
    const latestSubmission = user.form_submissions && user.form_submissions.length > 0 
      ? user.form_submissions[0]  // Already sorted desc by backend
      : null
    
    // Use draft if available, otherwise use latest submission
    const dataSource = hasDraft ? user.form_draft : latestSubmission
    
    // Use the exact same structure as SummaryPage.jsx
    // SummaryPage uses: formData.personalDetails, formData.propertyDetails, etc.
    // form_submissions/form_drafts have: personal_details, property_details, etc.
    const personalDetails = dataSource?.personal_details || {}
    const propertyDetails = dataSource?.property_details || {}
    const measurementDetails = dataSource?.measurement_details || {}
    const selectedHouse = dataSource?.selected_house || {}
    const fileUrls = dataSource?.file_urls || {}
    
    // Debug file URLs
    console.log('[AdminPage] Data source:', dataSource ? 'Found' : 'Not found')
    console.log('[AdminPage] File URLs:', fileUrls)
    console.log('[AdminPage] File URLs type:', typeof fileUrls)
    console.log('[AdminPage] File URLs keys:', fileUrls ? Object.keys(fileUrls) : 'No fileUrls')
    if (fileUrls) {
      console.log('[AdminPage] ID photo URL:', fileUrls.id_photo)
      console.log('[AdminPage] Property photos:', fileUrls.property_photos)
      console.log('[AdminPage] Tabu extract:', fileUrls.tabu_extract)
      console.log('[AdminPage] PDF file:', fileUrls.pdf_file)
      console.log('[AdminPage] DWF file:', fileUrls.dwf_file)
      console.log('[AdminPage] DWG file:', fileUrls.dwg_file)
    }
    
    // Get additional rights holders from personal details
    const additionalRightsHolders = personalDetails.additionalRightsHolders || []
    const additionalRightsHolderPhotos = fileUrls.additional_rights_holders_photos || []

  return (
      <div className="personal-details-page">
        <div className="personal-details-container">
          <div className="personal-details-content">
            {/* Header with Logo */}
            <div className="personal-details-header">
              <button 
                className="back-link"
                onClick={handleBackToList}
                type="button"
              >
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                חזרה לרשימת משתמשים
              </button>
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
              <div className="personal-details-card-content">
                <h2 className="form-title">פרטי משתמש</h2>

                {loadingDetails ? (
                  <div style={{ textAlign: 'center', padding: '40px' }}>
                    <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>טוען פרטים...</p>
                  </div>
                ) : (
                  <>
                    {/* User Basic Info Section */}
                    <div className="summary-section">
                      <div className="summary-section-header">
                        <h3 className="summary-section-title">פרטים אישיים</h3>
                      </div>
                      <div className="summary-details-grid">
                        <div className="summary-detail-item">
                          <span className="summary-label">אימייל:</span>
                          <span className="summary-value">{user.email || '-'}</span>
                        </div>
                        <div className="summary-detail-item">
                          <span className="summary-label">שם מלא:</span>
                          <span className="summary-value">{user.full_name || personalDetails.fullName || personalDetails.firstName + ' ' + personalDetails.lastName || '-'}</span>
                        </div>
                        <div className="summary-detail-item">
                          <span className="summary-label">טלפון:</span>
                          <span className="summary-value">{user.phone || personalDetails.phone || '-'}</span>
                        </div>
                        <div className="summary-detail-item">
                          <span className="summary-label">כתובת:</span>
                          <span className="summary-value">{user.address || '-'}</span>
                        </div>
                        <div className="summary-detail-item">
                          <span className="summary-label">מספר תעודת זהות:</span>
                          <span className="summary-value">{user.id_number || personalDetails.idNumber || '-'}</span>
                        </div>
                        <div className="summary-detail-item">
                          <span className="summary-label">סטטוס:</span>
                          <StatusDropdown
                            value={user.application_status || 'בטיפול'}
                            userId={user.id}
                            onStatusChange={async (newStatus) => {
                              try {
                                const response = await fetch(buildApiUrl(`/api/admin/users/${user.id}/status`), {
                                  method: 'PUT',
                                  headers: {
                                    'Content-Type': 'application/json',
                                  },
                                  body: JSON.stringify({ status: newStatus })
                                });
                                
                                if (!response.ok) {
                                  throw new Error('Failed to update status');
                                }
                                
                                // Refresh user data
                                fetchUserDetails(user.id);
                              } catch (error) {
                                console.error('Error updating status:', error);
                                alert('שגיאה בעדכון הסטטוס');
                              }
                            }}
                          />
                        </div>
                        <div className="summary-detail-item">
                          <span className="summary-label">תאריך הרשמה:</span>
                          <span className="summary-value">{formatDate(user.created_at)}</span>
                        </div>
                        <div className="summary-detail-item">
                          <span className="summary-label">כניסה אחרונה:</span>
                          <span className="summary-value">{formatDate(user.last_sign_in)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Personal Details from Form - Stage 1 */}
                    <div className="summary-section">
                      <div className="summary-section-header">
                        <h3 className="summary-section-title">שלב 1: פרטים אישיים בעל הנכס</h3>
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
                              {fileUrls.id_photo ? (
                                <FileLink url={fileUrls.id_photo} label="קובץ נבחר" fileName="id_photo" />
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
                              {fileUrls.tabu_extract ? (
                                <FileLink url={fileUrls.tabu_extract} label="קובץ נבחר" fileName="tabu_extract" />
                              ) : (
                                <span className="no-file">לא נבחר קובץ</span>
                              )}
                            </span>
                          </div>
                          <div className="summary-detail-item">
                            <span className="summary-label">אימייל:</span>
                            <span className="summary-value">{personalDetails.email || '-'}</span>
                          </div>
                          {/* Additional Rights Holders */}
                          {additionalRightsHolders.length > 0 && (
                            <>
                              <div className="summary-detail-item" style={{ gridColumn: '1 / -1', marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #e5e7eb' }}>
                                <span className="summary-label" style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '15px', display: 'block' }}>
                                  בעלי זכויות נוספים:
                                </span>
                              </div>
                              {additionalRightsHolders.map((holder, index) => (
                                <React.Fragment key={index}>
                                  <div className="summary-detail-item" style={{ gridColumn: '1 / -1', marginRight: '20px' }}>
                                    <span className="summary-label" style={{ fontWeight: '600' }}>
                                      בעל זכות {index + 1}:
                                    </span>
                                  </div>
                                  <div className="summary-detail-item">
                                    <span className="summary-label">שם פרטי:</span>
                                    <span className="summary-value">{holder.firstName || '-'}</span>
                                  </div>
                                  <div className="summary-detail-item">
                                    <span className="summary-label">שם משפחה:</span>
                                    <span className="summary-value">{holder.lastName || '-'}</span>
                                  </div>
                                  <div className="summary-detail-item">
                                    <span className="summary-label">מספר תעודת זהות:</span>
                                    <span className="summary-value">{holder.idNumber || '-'}</span>
                                  </div>
                                  <div className="summary-detail-item">
                                    <span className="summary-label">צילום תעודת זהות:</span>
                                    <span className="summary-value">
                                      {additionalRightsHolderPhotos[index] ? (
                                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                          <a href={additionalRightsHolderPhotos[index]} target="_blank" rel="noopener noreferrer" style={{ color: '#667eea' }}>
                                            צפה בקובץ
                                          </a>
                                          <button
                                            onClick={() => handleDownloadFile(additionalRightsHolderPhotos[index], `rights_holder_${index + 1}_id_photo`)}
                                            style={{
                                              padding: '4px 12px',
                                              background: '#667eea',
                                              color: 'white',
                                              border: 'none',
                                              borderRadius: '6px',
                                              cursor: 'pointer',
                                              fontSize: '0.875rem',
                                              fontWeight: '500'
                                            }}
                                          >
                                            הורד
                                          </button>
                                        </div>
                                      ) : (
                                        <span className="no-file">לא נבחר קובץ</span>
                                      )}
                                    </span>
                                  </div>
                                </React.Fragment>
                              ))}
                            </>
                          )}
                      </div>
                    </div>

                    {/* Property Details Section - Stage 2 */}
                    <div className="summary-section">
                      <div className="summary-section-header">
                        <h3 className="summary-section-title">שלב 2: פרטי הנכס</h3>
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
                            {fileUrls.property_photos && fileUrls.property_photos.length > 0 ? (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <span style={{ marginBottom: '4px' }}>{fileUrls.property_photos.length} קבצים נבחרו:</span>
                                {fileUrls.property_photos.map((photoUrl, idx) => (
                                  <div key={idx} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                    <a
                                      href={photoUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      style={{ color: '#667eea', fontSize: '0.9rem' }}
                                    >
                                      צילום {idx + 1}
                                    </a>
                                    <button
                                      onClick={() => handleDownloadFile(photoUrl, `property_photo_${idx + 1}`)}
                                      style={{
                                        padding: '4px 12px',
                                        background: '#667eea',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '6px',
                                        cursor: 'pointer',
                                        fontSize: '0.875rem',
                                        fontWeight: '500'
                                      }}
                                    >
                                      הורד
                                    </button>
                                  </div>
                                ))}
                              </div>
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

                    {/* Measurement Map Section - Stage 3 */}
                    <div className="summary-section">
                      <div className="summary-section-header">
                        <h3 className="summary-section-title">שלב 3: מפת מדידה</h3>
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
                            {fileUrls.dwg_file ? (
                              <FileLink url={fileUrls.dwg_file} label="קובץ נבחר" fileName="measurement_dwg" />
                            ) : (
                              <span className="no-file">לא נבחר קובץ</span>
                            )}
                          </span>
                        </div>
                        <div className="summary-detail-item">
                          <span className="summary-label">קובץ DWF:</span>
                          <span className="summary-value">
                            {fileUrls.dwf_file ? (
                              <FileLink url={fileUrls.dwf_file} label="קובץ נבחר" fileName="measurement_dwf" />
                            ) : (
                              <span className="no-file">לא נבחר קובץ</span>
                            )}
                          </span>
                        </div>
                        <div className="summary-detail-item">
                          <span className="summary-label">קובץ PDF:</span>
                          <span className="summary-value">
                            {fileUrls.pdf_file ? (
                              <FileLink url={fileUrls.pdf_file} label="קובץ נבחר" fileName="measurement_pdf" />
                            ) : (
                              <span className="no-file">לא נבחר קובץ</span>
                            )}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Application Data Section - Initial Form Data */}
                    {user.application_data && (
                      <div className="summary-section">
                        <div className="summary-section-header">
                          <h3 className="summary-section-title">נתוני בקשה ראשונית</h3>
                        </div>
                        <div className="summary-details-grid">
                          {user.application_data.gush && (
                            <div className="summary-detail-item">
                              <span className="summary-label">גוש:</span>
                              <span className="summary-value">{user.application_data.gush}</span>
                            </div>
                          )}
                          {user.application_data.helka && (
                            <div className="summary-detail-item">
                              <span className="summary-label">חלקה:</span>
                              <span className="summary-value">{user.application_data.helka}</span>
                            </div>
                          )}
                          {user.application_data.region && (
                            <div className="summary-detail-item">
                              <span className="summary-label">אזור:</span>
                              <span className="summary-value">{user.application_data.region}</span>
                            </div>
                          )}
                          {user.application_data.council && (
                            <div className="summary-detail-item">
                              <span className="summary-label">מועצה / עירייה:</span>
                              <span className="summary-value">{user.application_data.council}</span>
                            </div>
                          )}
                          {user.application_data.surveyMap && (
                            <div className="summary-detail-item">
                              <span className="summary-label">מפת מדידה:</span>
                              <span className="summary-value">{user.application_data.surveyMap}</span>
                            </div>
                          )}
                          <div className="summary-detail-item">
                            <span className="summary-label">רשות מקרקעי ישראל:</span>
                            <span className="summary-value">
                              {user.application_data.isIsraelLandAuthority ? 'כן' : 'לא'}
                            </span>
                          </div>
                          {user.application_data.selectedPlan && (
                            <div className="summary-detail-item" style={{ gridColumn: '1 / -1' }}>
                              <span className="summary-label">תוכנית נבחרת:</span>
                              <span className="summary-value">
                                {typeof user.application_data.selectedPlan === 'object' 
                                  ? JSON.stringify(user.application_data.selectedPlan, null, 2)
                                  : user.application_data.selectedPlan}
                              </span>
                            </div>
                          )}
                          {user.application_data.planningRequest && (
                            <div className="summary-detail-item" style={{ gridColumn: '1 / -1' }}>
                              <span className="summary-label">בקשת תכנון:</span>
                              <span className="summary-value">
                                <pre style={{ 
                                  background: '#f8f9fa', 
                                  padding: '12px', 
                                  borderRadius: '8px', 
                                  overflow: 'auto',
                                  fontSize: '0.875rem',
                                  whiteSpace: 'pre-wrap'
                                }}>
                                  {typeof user.application_data.planningRequest === 'object' 
                                    ? JSON.stringify(user.application_data.planningRequest, null, 2)
                                    : user.application_data.planningRequest}
                                </pre>
                              </span>
                            </div>
                          )}
                          {user.application_data.created_at && (
                            <div className="summary-detail-item">
                              <span className="summary-label">תאריך יצירה:</span>
                              <span className="summary-value">{formatDate(user.application_data.created_at)}</span>
                            </div>
                          )}
                          {user.application_data.updated_at && (
                            <div className="summary-detail-item">
                              <span className="summary-label">תאריך עדכון:</span>
                              <span className="summary-value">{formatDate(user.application_data.updated_at)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Files Section - Show all file URLs */}
                    <div className="summary-section" style={{ background: fileUrls && Object.keys(fileUrls).length > 0 ? '#f0f9ff' : '#fff3cd', border: `2px solid ${fileUrls && Object.keys(fileUrls).length > 0 ? '#3b82f6' : '#ffc107'}`, borderRadius: '8px', padding: '20px', marginTop: '20px' }}>
                      <div className="summary-section-header">
                        <h3 className="summary-section-title" style={{ color: fileUrls && Object.keys(fileUrls).length > 0 ? '#1e40af' : '#856404' }}>
                          {fileUrls && Object.keys(fileUrls).length > 0 ? '📁 כל הקבצים' : '⚠️ אין קבצים'}
                        </h3>
                      </div>
                      {fileUrls && Object.keys(fileUrls).length > 0 ? (
                        <div style={{ display: 'grid', gap: '12px' }}>
                          {Object.entries(fileUrls).map(([key, value]) => {
                            if (!value) return null
                            if (Array.isArray(value)) {
                              return (
                                <div key={key} style={{ padding: '10px', background: 'white', borderRadius: '6px', border: '1px solid #e5e7eb' }}>
                                  <strong style={{ display: 'block', marginBottom: '8px' }}>{key}:</strong> ({value.length} files)
                                  {value.map((url, idx) => (
                                    <div key={idx} style={{ marginTop: '8px', padding: '8px', background: '#f8f9fa', borderRadius: '4px' }}>
                                      <FileLink url={url} label={`${key} ${idx + 1}`} fileName={`${key}_${idx + 1}`} />
                                      <div style={{ fontSize: '0.75rem', color: '#666', marginTop: '4px', wordBreak: 'break-all' }}>{url}</div>
                                    </div>
                                  ))}
                                </div>
                              )
                            }
                            return (
                              <div key={key} style={{ padding: '10px', background: 'white', borderRadius: '6px', border: '1px solid #e5e7eb' }}>
                                <strong style={{ display: 'block', marginBottom: '8px' }}>{key}:</strong>
                                <div style={{ marginTop: '8px' }}>
                                  <FileLink url={value} label={key} fileName={key} />
                                  <div style={{ fontSize: '0.75rem', color: '#666', marginTop: '4px', wordBreak: 'break-all' }}>{value}</div>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      ) : (
                        <div style={{ padding: '20px', textAlign: 'center', color: '#856404' }}>
                          <p style={{ fontSize: '1.1rem', marginBottom: '10px' }}>לא נמצאו קבצים עבור בקשה זו</p>
                          <p style={{ fontSize: '0.9rem', color: '#666' }}>
                            הקבצים יופיעו כאן לאחר שהמשתמש יטען אותם בטופס
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Dream Home Section - Stage 4 */}
                    <div className="summary-section">
                      <div className="summary-section-header">
                        <h3 className="summary-section-title">שלב 4: בחירת בית חלומות</h3>
                      </div>
                      {selectedHouse && selectedHouse.id ? (
                        <div className="summary-house-card">
                          <img 
                            src={selectedHouse.image || 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=900&q=80'} 
                            alt={selectedHouse.title}
                            className="summary-house-image"
                          />
                          <div className="summary-house-details">
                            <h4 className="summary-house-title">{selectedHouse.title || selectedHouse.name || 'שם הדגם'}</h4>
                            {selectedHouse.desc && (
                              <p style={{ margin: '10px 0', color: '#6b7280' }}>{selectedHouse.desc}</p>
                            )}
                            {selectedHouse.tag && (
                              <span style={{ 
                                display: 'inline-block', 
                                padding: '4px 12px', 
                                background: '#667eea', 
                                color: 'white', 
                                borderRadius: '12px', 
                                fontSize: '0.875rem',
                                marginBottom: '10px'
                              }}>
                                {selectedHouse.tag}
                              </span>
                            )}
                            {selectedHouse.spec && selectedHouse.spec.length > 0 && (
                              <div className="summary-house-specs">
                                {selectedHouse.spec.map((item, i) => {
                                  // Handle both old format (string) and new format (object with icon and text)
                                  const specText = typeof item === 'string' ? item : item.text;
                                  const specIcon = typeof item === 'object' && item.icon ? item.icon : null;
                                  return (
                                    <div key={i} className="summary-house-spec-item">
                                      {specIcon && (
                                        <img className="summary-house-spec-icon" src={specIcon} alt={specText} />
                                      )}
                                      <span className="summary-house-spec">{specText}</span>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                            {selectedHouse.id && (
                              <div style={{ marginTop: '15px', fontSize: '0.9rem', color: '#6b7280' }}>
                                ID: {selectedHouse.id}
                              </div>
                            )}
                          </div>
                        </div>
                      ) : user.application_data?.selectedPlan ? (
                        <div className="summary-details-grid">
                          <div className="summary-detail-item" style={{ gridColumn: '1 / -1' }}>
                            <span className="summary-label">תוכנית נבחרת:</span>
                            <span className="summary-value">
                              {typeof user.application_data.selectedPlan === 'object' 
                                ? JSON.stringify(user.application_data.selectedPlan, null, 2)
                                : user.application_data.selectedPlan}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="summary-details-grid">
                          <div className="summary-detail-item">
                            <span className="summary-label">בית חלומות:</span>
                            <span className="summary-value">לא נבחר</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* All Submissions History */}
                    {user.form_submissions && user.form_submissions.length > 0 && (
                      <div className="summary-section">
                        <div className="summary-section-header">
                          <h3 className="summary-section-title">היסטוריית בקשות ({user.form_submissions.length})</h3>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                          {user.form_submissions.map((submission, idx) => (
                            <div key={submission.id || idx} style={{
                              padding: '16px',
                              border: '1px solid #e5e7eb',
                              borderRadius: '8px',
                              background: idx === 0 ? '#f8f9fa' : 'white'
                            }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                <strong style={{ fontSize: '1rem' }}>
                                  בקשה #{user.form_submissions.length - idx} {idx === 0 && '(האחרונה)'}
                                </strong>
                                <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                                  {formatDate(submission.created_at)}
                                </span>
                              </div>
                              <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>
                                <div>פרטים אישיים: {submission.personal_details?.firstName || submission.personal_details?.email || 'כן'}</div>
                                <div>פרטי נכס: {submission.property_details?.city || submission.property_details?.street || 'כן'}</div>
                                <div>מפת מדידה: {submission.measurement_details?.surveyorName || 'כן'}</div>
                                <div>בית חלומות: {submission.selected_house?.title || submission.selected_house?.id ? 'כן' : 'לא'}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // User list view
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
            <div className="personal-details-card-content">
              <h2 className="form-title">ניהול משתמשים</h2>
              <p style={{ fontSize: '1.1rem', color: '#6b7280', marginBottom: '30px', textAlign: 'right' }}>
                סה"כ משתמשים: <strong>{users.length}</strong>
              </p>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>טוען משתמשים...</p>
            </div>
          ) : error ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
                  <p style={{ fontSize: '1.2rem', color: '#e74c3c' }}>שגיאה: {error}</p>
              <button 
                onClick={fetchUsers}
                    className="submit-button"
                    style={{ maxWidth: '300px', margin: '20px auto 0' }}
                  >
                    <span>נסה שוב</span>
              </button>
            </div>
              ) : users.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                  <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>אין משתמשים במערכת</p>
              </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                  {users.map((user) => (
                    <div
                          key={user.id}
                      onClick={() => handleUserClick(user)}
                          style={{ 
                        background: 'white',
                        borderRadius: '16px',
                        padding: '24px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        border: '2px solid transparent'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-4px)'
                        e.currentTarget.style.boxShadow = '0 8px 24px rgba(102, 126, 234, 0.2)'
                        e.currentTarget.style.borderColor = '#667eea'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)'
                        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)'
                        e.currentTarget.style.borderColor = 'transparent'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                        <div style={{
                          width: '48px',
                          height: '48px',
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.95) 0%, rgba(118, 75, 162, 0.95) 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontSize: '1.2rem',
                          fontWeight: '600'
                        }}>
                          {user.full_name ? user.full_name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                        </div>
                        <div style={{ flex: 1 }}>
                          <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '600', color: '#2C3E50' }}>
                            {user.full_name || user.email}
                          </h3>
                          <p style={{ margin: '4px 0 0', fontSize: '0.9rem', color: '#6b7280' }}>
                            {user.email}
                          </p>
                        </div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.9rem' }}>
                        {user.phone && (
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: '#6b7280' }}>טלפון:</span>
                            <span style={{ color: '#2C3E50', fontWeight: '500' }}>{user.phone}</span>
                          </div>
                        )}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ color: '#6b7280' }}>סטטוס:</span>
                          <select
                            value={user.application_status || 'בטיפול'}
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent opening user details
                            }}
                            onChange={async (e) => {
                              e.stopPropagation(); // Prevent opening user details
                              const newStatus = e.target.value;
                              const oldStatus = user.application_status;
                              
                              // Optimistically update UI
                              setUsers(users.map(u => 
                                u.id === user.id 
                                  ? { ...u, application_status: newStatus }
                                  : u
                              ));
                              
                              try {
                                const response = await fetch(buildApiUrl(`/api/admin/users/${user.id}/status`), {
                                  method: 'PUT',
                                  headers: {
                                    'Content-Type': 'application/json',
                                  },
                                  body: JSON.stringify({ status: newStatus })
                                });
                                
                                if (!response.ok) {
                                  // Revert on error
                                  setUsers(users.map(u => 
                                    u.id === user.id 
                                      ? { ...u, application_status: oldStatus }
                                      : u
                                  ));
                                  throw new Error('Failed to update status');
                                }
                                
                                const result = await response.json();
                                console.log('[AdminPage] Status update result:', result);
                                
                                // Refresh users list to ensure we have the latest data
                                setTimeout(() => {
                                  fetchUsers();
                                }, 500);
                              } catch (error) {
                                console.error('Error updating status:', error);
                                alert('שגיאה בעדכון הסטטוס');
                              }
                            }}
                             style={{
                               padding: '6px 28px 6px 12px',
                               borderRadius: '12px',
                               fontSize: '0.875rem',
                               fontWeight: '600',
                               border: '1px solid #e5e7eb',
                               background: 'white',
                               color: '#2C3E50',
                               cursor: 'pointer',
                               textAlign: 'center',
                               textAlignLast: 'center',
                               appearance: 'none',
                               WebkitAppearance: 'none',
                               MozAppearance: 'none',
                               backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236b7280' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                               backgroundRepeat: 'no-repeat',
                               backgroundPosition: 'right 10px center',
                               backgroundSize: '12px',
                               width: '115px',
                               maxWidth: '115px',
                               transition: 'all 0.2s ease',
                               boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                             }}
                            onMouseEnter={(e) => {
                              e.target.style.borderColor = '#667eea';
                              e.target.style.boxShadow = '0 2px 6px rgba(102, 126, 234, 0.2)';
                            }}
                            onMouseLeave={(e) => {
                              e.target.style.borderColor = '#e5e7eb';
                              e.target.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
                            }}
                          >
                            <option 
                              value="בטיפול" 
                              style={{ 
                                textAlign: 'center',
                                padding: '8px 12px',
                                backgroundColor: '#fff',
                                color: '#2C3E50',
                                fontSize: '0.875rem',
                                fontWeight: '500'
                              }}
                            >
                              בטיפול
                            </option>
                            <option 
                              value="בקשה טופלה" 
                              style={{ 
                                textAlign: 'center',
                                padding: '8px 12px',
                                backgroundColor: '#fff',
                                color: '#2C3E50',
                                fontSize: '0.875rem',
                                fontWeight: '500'
                              }}
                            >
                              בקשה טופלה
                            </option>
                          </select>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: '#6b7280' }}>בקשות שהוגשו:</span>
                          <span style={{ color: '#2C3E50', fontWeight: '500' }}>
                            {user.submissions_count || 0}
                          </span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: '#6b7280' }}>תאריך הרשמה:</span>
                          <span style={{ color: '#2C3E50', fontWeight: '500', fontSize: '0.85rem' }}>
                            {formatDate(user.created_at)}
                          </span>
                        </div>
                      </div>
                      <div style={{
                        marginTop: '16px',
                        paddingTop: '16px',
                        borderTop: '1px solid #e5e7eb',
                        textAlign: 'center',
                        color: '#667eea',
                        fontWeight: '600',
                        fontSize: '0.9rem'
                      }}>
                        לחץ לצפייה בפרטים המלאים →
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {!loading && !error && users.length > 0 && (
              <div style={{ marginTop: '30px', textAlign: 'center' }}>
                <button 
                  onClick={fetchUsers}
                  className="submit-button"
                  style={{ maxWidth: '300px', margin: '0 auto' }}
                >
                  <span>רענן רשימה</span>
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '20px', height: '20px' }}>
                    <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" fill="currentColor"/>
                  </svg>
                </button>
              </div>
          )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminPage
