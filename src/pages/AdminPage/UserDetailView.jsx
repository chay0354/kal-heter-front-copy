import React from 'react'
import StatusDropdown from './StatusDropdown'

const FileLink = ({ url, label, fileName, onDownload }) => {
  console.log('[FileLink] Rendering with url:', url, 'fileName:', fileName)
  if (!url || url === '' || url === null || url === undefined) {
    return <span className="no-file">לא נבחר קובץ</span>
  }

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
        onClick={() => {
          console.log('[FileLink] Opening file:', fileUrl)
        }}
      >
        {label || 'צפה בקובץ'}
      </a>
      <button
        onClick={(e) => {
          e.preventDefault()
          console.log('[FileLink] Downloading file:', fileUrl, 'as:', fileName)
          onDownload(fileUrl, fileName)
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

const UserDetailView = ({
  user,
  loadingDetails,
  adminNotes,
  setAdminNotes,
  savingNotes,
  handleBackToList,
  handleDownloadFile,
  buildApiUrl,
  fetchUserDetails,
  saveAdminNotes,
  formatDate,
}) => {
  const hasDraft = !!user.form_draft
  const latestSubmission = user.form_submissions && user.form_submissions.length > 0
    ? user.form_submissions[0]
    : null

  const dataSource = hasDraft ? user.form_draft : latestSubmission

  const personalDetails = dataSource?.personal_details || {}
  const propertyDetails = dataSource?.property_details || {}
  const measurementDetails = dataSource?.measurement_details || {}
  const selectedHouse = dataSource?.selected_house || {}
  const rawFileUrls = dataSource?.file_urls || {}

  // Extract URL from a field that may be a string URL or a pre-uploaded object { url, uploaded }
  const extractUrl = (field) => {
    if (!field) return null
    if (typeof field === 'string' && field.startsWith('http')) return field
    if (typeof field === 'object' && field.url) return field.url
    return null
  }

  // Merge explicit file_urls with URLs embedded in detail objects (from pre-upload flow)
  const fileUrls = {
    ...rawFileUrls,
    id_photo: rawFileUrls.id_photo || extractUrl(personalDetails.idPhoto),
    tabu_extract: rawFileUrls.tabu_extract || extractUrl(propertyDetails.tabuExtract),
    plot_photo: rawFileUrls.plot_photo || extractUrl(propertyDetails.plotPhoto),
    pdf_file: rawFileUrls.pdf_file || extractUrl(measurementDetails.pdfFile),
    dwf_file: rawFileUrls.dwf_file || extractUrl(measurementDetails.dwfFile),
    dwg_file: rawFileUrls.dwg_file || extractUrl(measurementDetails.dwgFile),
    property_photos: rawFileUrls.property_photos ||
      (Array.isArray(propertyDetails.propertyPhotos)
        ? propertyDetails.propertyPhotos.map(p => extractUrl(p)).filter(Boolean)
        : []),
    additional_rights_holders_photos: rawFileUrls.additional_rights_holders_photos ||
      (Array.isArray(personalDetails.additionalRightsHolders)
        ? personalDetails.additionalRightsHolders.map(h => extractUrl(h.idPhoto)).filter(Boolean)
        : []),
  }

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
                        <span className="summary-value">
                          {user.email ? (
                            <a href={`mailto:${user.email}`} style={{ color: '#0f4eb3', textDecoration: 'underline' }}>
                              {user.email}
                            </a>
                          ) : '-'}
                        </span>
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
                              const token = localStorage.getItem('access_token')
                              const response = await fetch(buildApiUrl(`/api/admin/users/${user.id}/status`), {
                                method: 'PUT',
                                headers: {
                                  'Content-Type': 'application/json',
                                  'Authorization': token ? `Bearer ${token}` : '',
                                },
                                body: JSON.stringify({ status: newStatus })
                              })

                              if (!response.ok) {
                                const errorData = await response.json().catch(() => ({ detail: 'Unknown error' }))
                                throw new Error(errorData.detail || 'Failed to update status')
                              }

                              fetchUserDetails(user.id)
                            } catch (error) {
                              console.error('Error updating status:', error)
                              alert(`שגיאה בעדכון הסטטוס: ${error.message}`)
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
                            <FileLink url={fileUrls.id_photo} label="קובץ נבחר" fileName="id_photo" onDownload={handleDownloadFile} />
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
                            <FileLink url={fileUrls.tabu_extract} label="קובץ נבחר" fileName="tabu_extract" onDownload={handleDownloadFile} />
                          ) : (
                            <span className="no-file">לא נבחר קובץ</span>
                          )}
                        </span>
                      </div>
                      <div className="summary-detail-item">
                        <span className="summary-label">אימייל:</span>
                        <span className="summary-value">
                          {personalDetails.email ? (
                            <a href={`mailto:${personalDetails.email}`} style={{ color: '#0f4eb3', textDecoration: 'underline' }}>
                              {personalDetails.email}
                            </a>
                          ) : '-'}
                        </span>
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
                            <FileLink url={fileUrls.dwg_file} label="קובץ נבחר" fileName="measurement_dwg" onDownload={handleDownloadFile} />
                          ) : (
                            <span className="no-file">לא נבחר קובץ</span>
                          )}
                        </span>
                      </div>
                      <div className="summary-detail-item">
                        <span className="summary-label">קובץ DWF:</span>
                        <span className="summary-value">
                          {fileUrls.dwf_file ? (
                            <FileLink url={fileUrls.dwf_file} label="קובץ נבחר" fileName="measurement_dwf" onDownload={handleDownloadFile} />
                          ) : (
                            <span className="no-file">לא נבחר קובץ</span>
                          )}
                        </span>
                      </div>
                      <div className="summary-detail-item">
                        <span className="summary-label">קובץ PDF:</span>
                        <span className="summary-value">
                          {fileUrls.pdf_file ? (
                            <FileLink url={fileUrls.pdf_file} label="קובץ נבחר" fileName="measurement_pdf" onDownload={handleDownloadFile} />
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
                                    <FileLink url={url} label={`${key} ${idx + 1}`} fileName={`${key}_${idx + 1}`} onDownload={handleDownloadFile} />
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
                                <FileLink url={value} label={key} fileName={key} onDownload={handleDownloadFile} />
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
                                const specText = typeof item === 'string' ? item : item.text
                                const specIcon = typeof item === 'object' && item.icon ? item.icon : null
                                return (
                                  <div key={i} className="summary-house-spec-item">
                                    {specIcon && (
                                      <img className="summary-house-spec-icon" src={specIcon} alt={specText} />
                                    )}
                                    <span className="summary-house-spec">{specText}</span>
                                  </div>
                                )
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

                  {/* Admin Notes Section */}
                  <div className="summary-section" style={{
                    background: '#f8f9fa',
                    border: '2px solid #e5e7eb',
                    borderRadius: '12px',
                    padding: '24px'
                  }}>
                    <div className="summary-section-header">
                      <h3 className="summary-section-title" style={{ marginBottom: '16px' }}>הערות מנהל</h3>
                    </div>
                    <textarea
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      onBlur={() => {
                        if (user.id) {
                          saveAdminNotes(user.id, adminNotes)
                        }
                      }}
                      placeholder="הוסף הערות פרטיות (רק מנהל יכול לראות)"
                      style={{
                        width: '100%',
                        minHeight: '120px',
                        padding: '12px',
                        borderRadius: '8px',
                        border: '1px solid #d1d5db',
                        fontSize: '14px',
                        fontFamily: 'Tel_Aviv-ModernistRegular, Tel Aviv, Helvetica, sans-serif',
                        resize: 'vertical',
                        direction: 'rtl',
                        textAlign: 'right'
                      }}
                      disabled={savingNotes}
                    />
                    {savingNotes && (
                      <p style={{ marginTop: '8px', fontSize: '12px', color: '#6b7280', textAlign: 'right' }}>
                        שומר...
                      </p>
                    )}
                    <p style={{ marginTop: '8px', fontSize: '12px', color: '#6b7280', textAlign: 'right' }}>
                      הערות אלה נראות רק למנהל
                    </p>
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

export default UserDetailView
