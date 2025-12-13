import React, { useState, useEffect } from 'react'
import '../components/PlanningRequest.css'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://kal-heter-back.vercel.app'

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
      const response = await fetch(`${API_BASE_URL}/api/admin/users`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (!response.ok) {
        throw new Error('Failed to fetch users')
      }
      
      const data = await response.json()
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
      const response = await fetch(`${API_BASE_URL}/api/admin/users/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (!response.ok) {
        throw new Error('Failed to fetch user details')
      }
      
      const userData = await response.json()
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

  // If user is selected, show details view
  if (selectedUser) {
    const user = selectedUser
    // Get data from form submissions (most recent)
    const latestSubmission = user.form_submissions && user.form_submissions.length > 0 
      ? user.form_submissions[user.form_submissions.length - 1]
      : null
    
    const personalDetails = latestSubmission?.personal_details || {}
    const propertyDetails = latestSubmission?.property_details || {}
    const measurementDetails = latestSubmission?.measurement_details || {}
    const selectedHouse = latestSubmission?.selected_house || {}
    const fileUrls = latestSubmission?.file_urls || {}
    
    // Get planning request from application_data
    const planningRequest = user.application_data?.planningRequest || {}
    
    // Get additional rights holders
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
                          <span className="summary-value">{user.full_name || personalDetails.fullName || '-'}</span>
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
                          <span className="summary-label">אימייל מאומת:</span>
                          <span className="summary-value">
                            {user.email_confirmed ? '✓ כן' : '✗ לא'}
                          </span>
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
                            <span className="summary-value">{personalDetails.phone || user.phone || '-'}</span>
                          </div>
                          <div className="summary-detail-item">
                            <span className="summary-label">מספר תעודת זהות:</span>
                            <span className="summary-value">{personalDetails.idNumber || user.id_number || '-'}</span>
                          </div>
                          <div className="summary-detail-item">
                            <span className="summary-label">צילום תעודת זהות:</span>
                            <span className="summary-value">
                              {fileUrls.id_photo ? (
                                <a href={fileUrls.id_photo} target="_blank" rel="noopener noreferrer" style={{ color: '#667eea' }}>
                                  צפה בקובץ
                                </a>
                              ) : (
                                <span className="no-file">לא נבחר קובץ</span>
                              )}
                            </span>
                          </div>
                          <div className="summary-detail-item">
                            <span className="summary-label">אימייל:</span>
                            <span className="summary-value">{personalDetails.email || user.email || '-'}</span>
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
                                        <a href={additionalRightsHolderPhotos[index]} target="_blank" rel="noopener noreferrer" style={{ color: '#667eea' }}>
                                          צפה בקובץ
                                        </a>
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
                    </div>

                    {/* Property Details Section - Stage 2 */}
                    <div className="summary-section">
                      <div className="summary-section-header">
                        <h3 className="summary-section-title">שלב 2: פרטי הנכס</h3>
                      </div>
                      <div className="summary-details-grid">
                          {/* From application_data (initial form) */}
                          {user.application_data?.region && (
                            <div className="summary-detail-item">
                              <span className="summary-label">אזור:</span>
                              <span className="summary-value">{user.application_data.region}</span>
                            </div>
                          )}
                          {(user.application_data?.council || propertyDetails.council) && (
                            <div className="summary-detail-item">
                              <span className="summary-label">מועצה / עירייה:</span>
                              <span className="summary-value">{propertyDetails.council || user.application_data?.council || '-'}</span>
                            </div>
                          )}
                          {(user.application_data?.gush || propertyDetails.gush) && (
                            <div className="summary-detail-item">
                              <span className="summary-label">גוש:</span>
                              <span className="summary-value">{propertyDetails.gush || user.application_data?.gush || '-'}</span>
                            </div>
                          )}
                          {(user.application_data?.helka || propertyDetails.helka) && (
                            <div className="summary-detail-item">
                              <span className="summary-label">חלקה:</span>
                              <span className="summary-value">{propertyDetails.helka || user.application_data?.helka || '-'}</span>
                            </div>
                          )}
                          {propertyDetails.city && (
                            <div className="summary-detail-item">
                              <span className="summary-label">עיר / מושב / קיבוץ:</span>
                              <span className="summary-value">{propertyDetails.city}</span>
                            </div>
                          )}
                          {propertyDetails.street && (
                            <div className="summary-detail-item">
                              <span className="summary-label">רחוב:</span>
                              <span className="summary-value">{propertyDetails.street}</span>
                            </div>
                          )}
                          {propertyDetails.propertySize && (
                            <div className="summary-detail-item">
                              <span className="summary-label">גודל נכס:</span>
                              <span className="summary-value">{propertyDetails.propertySize} מ"ר</span>
                            </div>
                          )}
                          {propertyDetails.lot && (
                            <div className="summary-detail-item">
                              <span className="summary-label">מגרש:</span>
                              <span className="summary-value">{propertyDetails.lot}</span>
                            </div>
                          )}
                          <div className="summary-detail-item">
                            <span className="summary-label">צילום נכס:</span>
                            <span className="summary-value">
                              {fileUrls.property_photos && fileUrls.property_photos.length > 0 ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                  {fileUrls.property_photos.map((url, idx) => (
                                    <a key={idx} href={url} target="_blank" rel="noopener noreferrer" style={{ color: '#667eea' }}>
                                      צילום {idx + 1}
                                    </a>
                                  ))}
                                </div>
                              ) : (
                                <span className="no-file">לא נבחרו קבצים</span>
                              )}
                            </span>
                          </div>
                          {propertyDetails.photoDate && (
                            <div className="summary-detail-item">
                              <span className="summary-label">תאריך צילום:</span>
                              <span className="summary-value">{formatDate(propertyDetails.photoDate)}</span>
                            </div>
                          )}
                          <div className="summary-detail-item">
                            <span className="summary-label">נסח טאבו:</span>
                            <span className="summary-value">
                              {fileUrls.tabu_extract ? (
                                <a href={fileUrls.tabu_extract} target="_blank" rel="noopener noreferrer" style={{ color: '#667eea' }}>
                                  צפה בקובץ
                                </a>
                              ) : (
                                <span className="no-file">לא נבחר קובץ</span>
                              )}
                            </span>
                          </div>
                          {(propertyDetails.israelLandAuthorityContract || user.application_data?.isIsraelLandAuthority !== undefined) && (
                            <div className="summary-detail-item">
                              <span className="summary-label">חוזה רשות מקרקעי ישראל:</span>
                              <span className="summary-value">
                                {propertyDetails.israelLandAuthorityContract || (user.application_data?.isIsraelLandAuthority ? 'כן' : 'לא')}
                              </span>
                            </div>
                          )}
                          {user.application_data?.surveyMap && (
                            <div className="summary-detail-item">
                              <span className="summary-label">מפת מדידה ראשונית:</span>
                              <span className="summary-value">{user.application_data.surveyMap}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Measurement Map Section - Stage 3 */}
                    <div className="summary-section">
                      <div className="summary-section-header">
                        <h3 className="summary-section-title">שלב 3: מפת מדידה</h3>
                      </div>
                      <div className="summary-details-grid">
                          {measurementDetails.surveyorName && (
                            <div className="summary-detail-item">
                              <span className="summary-label">שם המודד:</span>
                              <span className="summary-value">{measurementDetails.surveyorName}</span>
                            </div>
                          )}
                          {measurementDetails.measurementDate && (
                            <div className="summary-detail-item">
                              <span className="summary-label">תאריך מדידה:</span>
                              <span className="summary-value">{formatDate(measurementDetails.measurementDate)}</span>
                            </div>
                          )}
                          <div className="summary-detail-item">
                            <span className="summary-label">קובץ DWG:</span>
                            <span className="summary-value">
                              {fileUrls.dwg_file ? (
                                <a href={fileUrls.dwg_file} target="_blank" rel="noopener noreferrer" style={{ color: '#667eea' }}>
                                  צפה בקובץ
                                </a>
                              ) : (
                                <span className="no-file">לא נבחר קובץ</span>
                              )}
                            </span>
                          </div>
                          <div className="summary-detail-item">
                            <span className="summary-label">קובץ DWF:</span>
                            <span className="summary-value">
                              {fileUrls.dwf_file ? (
                                <a href={fileUrls.dwf_file} target="_blank" rel="noopener noreferrer" style={{ color: '#667eea' }}>
                                  צפה בקובץ
                                </a>
                              ) : (
                                <span className="no-file">לא נבחר קובץ</span>
                              )}
                            </span>
                          </div>
                          <div className="summary-detail-item">
                            <span className="summary-label">קובץ PDF:</span>
                            <span className="summary-value">
                              {fileUrls.pdf_file ? (
                                <a href={fileUrls.pdf_file} target="_blank" rel="noopener noreferrer" style={{ color: '#667eea' }}>
                                  צפה בקובץ
                                </a>
                              ) : (
                                <span className="no-file">לא נבחר קובץ</span>
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
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
                                  {selectedHouse.spec.map((item, i) => (
                                    <span key={i} className="summary-house-spec">{item}</span>
                                  ))}
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

                    {/* Planning Request Section - Stage 5 */}
                    <div className="summary-section">
                      <div className="summary-section-header">
                        <h3 className="summary-section-title">שלב 5: בקשת תכנון</h3>
                      </div>
                      <div className="summary-details-grid">
                          {planningRequest.idNumber && (
                            <div className="summary-detail-item">
                              <span className="summary-label">מספר תעודת זהות:</span>
                              <span className="summary-value">{planningRequest.idNumber}</span>
                            </div>
                          )}
                          {planningRequest.fullName && (
                            <div className="summary-detail-item">
                              <span className="summary-label">שם מלא:</span>
                              <span className="summary-value">{planningRequest.fullName}</span>
                            </div>
                          )}
                          {planningRequest.requestorType && (
                            <div className="summary-detail-item">
                              <span className="summary-label">סוג מבקש:</span>
                              <span className="summary-value">{planningRequest.requestorType}</span>
                            </div>
                          )}
                          {planningRequest.contactMethods && (
                            <div className="summary-detail-item">
                              <span className="summary-label">אמצעי קשר:</span>
                              <span className="summary-value">
                                {Array.isArray(planningRequest.contactMethods) 
                                  ? planningRequest.contactMethods.join(', ')
                                  : planningRequest.contactMethods}
                              </span>
                            </div>
                          )}
                          {planningRequest.propertyRights && (
                            <div className="summary-detail-item">
                              <span className="summary-label">זכויות בנכס:</span>
                              <span className="summary-value">{planningRequest.propertyRights}</span>
                            </div>
                          )}
                          {planningRequest.gush && (
                            <div className="summary-detail-item">
                              <span className="summary-label">גוש:</span>
                              <span className="summary-value">{planningRequest.gush}</span>
                            </div>
                          )}
                          {planningRequest.helka && (
                            <div className="summary-detail-item">
                              <span className="summary-label">חלקה:</span>
                              <span className="summary-value">{planningRequest.helka}</span>
                            </div>
                          )}
                          {planningRequest.plotArea && (
                            <div className="summary-detail-item">
                              <span className="summary-label">שטח מגרש:</span>
                              <span className="summary-value">{planningRequest.plotArea}</span>
                            </div>
                          )}
                          {planningRequest.constructionType && (
                            <div className="summary-detail-item">
                              <span className="summary-label">סוג בנייה:</span>
                              <span className="summary-value">{planningRequest.constructionType}</span>
                            </div>
                          )}
                          {planningRequest.propertyUsage && (
                            <div className="summary-detail-item">
                              <span className="summary-label">שימוש בנכס:</span>
                              <span className="summary-value">{planningRequest.propertyUsage}</span>
                            </div>
                          )}
                          {planningRequest.situationMap && (
                            <div className="summary-detail-item">
                              <span className="summary-label">מפת מצב:</span>
                              <span className="summary-value">
                                {typeof planningRequest.situationMap === 'string' && planningRequest.situationMap.startsWith('http') ? (
                                  <a href={planningRequest.situationMap} target="_blank" rel="noopener noreferrer" style={{ color: '#667eea' }}>
                                    צפה במפה
                                  </a>
                                ) : (
                                  planningRequest.situationMap
                                )}
                              </span>
                            </div>
                          )}
                          {planningRequest.plotPhoto && (
                            <div className="summary-detail-item">
                              <span className="summary-label">צילום מגרש:</span>
                              <span className="summary-value">
                                {typeof planningRequest.plotPhoto === 'string' && planningRequest.plotPhoto.startsWith('http') ? (
                                  <a href={planningRequest.plotPhoto} target="_blank" rel="noopener noreferrer" style={{ color: '#667eea' }}>
                                    צפה בתמונה
                                  </a>
                                ) : (
                                  planningRequest.plotPhoto
                                )}
                              </span>
                            </div>
                          )}
                          {/* Display any other planning request fields */}
                          {Object.keys(planningRequest).filter(key => 
                            !['idNumber', 'fullName', 'requestorType', 'contactMethods', 'propertyRights', 
                              'gush', 'helka', 'plotArea', 'constructionType', 'propertyUsage', 
                              'situationMap', 'plotPhoto'].includes(key)
                          ).map(key => (
                            <div key={key} className="summary-detail-item">
                              <span className="summary-label">{key}:</span>
                              <span className="summary-value">
                                {typeof planningRequest[key] === 'object' 
                                  ? JSON.stringify(planningRequest[key])
                                  : String(planningRequest[key] || '-')}
                              </span>
                            </div>
                          ))}
                        </div>
                        {Object.keys(planningRequest).length === 0 && (
                          <div className="summary-detail-item">
                            <span className="summary-label">בקשת תכנון:</span>
                            <span className="summary-value">לא הושלמה</span>
                          </div>
                        )}
                      </div>
                    </div>
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
                          <span style={{ color: '#6b7280' }}>אימייל מאומת:</span>
                            <span style={{
                              padding: '4px 12px',
                              borderRadius: '12px',
                              fontSize: '0.875rem',
                              fontWeight: '600',
                              background: user.email_confirmed ? 'rgba(46, 213, 115, 0.2)' : 'rgba(231, 76, 60, 0.2)',
                              color: user.email_confirmed ? '#2ed573' : '#e74c3c'
                            }}>
                              {user.email_confirmed ? '✓ מאומת' : '✗ לא מאומת'}
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
