import React from 'react'
import styles from './styles.module.css'
import StatusDropdown from '../StatusDropdown'
import BackArrowIcon from '../../../components/icons/BackArrowIcon'

const FileLink = ({ url, label, fileName, onDownload }) => {
  console.log('[FileLink] Rendering with url:', url, 'fileName:', fileName)
  if (!url || url === '' || url === null || url === undefined) {
    return <span className={styles['no-file']}>לא נבחר קובץ</span>
  }

  const fileUrl = String(url).trim()
  if (!fileUrl || fileUrl === '') {
    return <span className={styles['no-file']}>לא נבחר קובץ</span>
  }

  return (
    <div className={styles['file-link-row']}>
      <a
        href={fileUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={styles['file-view-link']}
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
        className={styles['download-btn']}
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

  const parseJsonField = (field) => {
    if (!field) return {}
    if (typeof field === 'string') {
      try { return JSON.parse(field) } catch { return {} }
    }
    return field
  }

  const personalDetails = parseJsonField(dataSource?.personal_details)
  const propertyDetails = parseJsonField(dataSource?.property_details)
  const measurementDetails = parseJsonField(dataSource?.measurement_details)
  const selectedHouse = parseJsonField(dataSource?.selected_house)
  const rawFileUrls = parseJsonField(dataSource?.file_urls)

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

  const hasFiles = fileUrls && Object.keys(fileUrls).length > 0

  return (
    <div className={styles['personal-details-page']}>
      <div className={styles['personal-details-container']}>
        <div className={styles['personal-details-content']}>
          {/* Header with Logo */}
          <div className={styles['personal-details-header']}>
            <button className={styles['back-link']} onClick={handleBackToList} type="button">
              <BackArrowIcon />
              חזרה לרשימת משתמשים
            </button>
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
            <div className={styles['personal-details-card-content']}>
              <h2 className={styles['form-title']}>פרטי משתמש</h2>

              {loadingDetails ? (
                <div className={styles['loading-state']}>
                  <p className={styles['loading-text']}>טוען פרטים...</p>
                </div>
              ) : (
                <>
                  {/* User Basic Info Section */}
                  <div className={styles['summary-section']}>
                    <div className={styles['summary-section-header']}>
                      <h3 className={styles['summary-section-title']}>פרטים אישיים</h3>
                    </div>
                    <div className={styles['summary-details-grid']}>
                      <div className={styles['summary-detail-item']}>
                        <span className={styles['summary-label']}>אימייל:</span>
                        <span className={styles['summary-value']}>
                          {user.email ? (
                            <a href={`mailto:${user.email}`} className={styles['email-link']}>
                              {user.email}
                            </a>
                          ) : '-'}
                        </span>
                      </div>
                      <div className={styles['summary-detail-item']}>
                        <span className={styles['summary-label']}>שם מלא:</span>
                        <span className={styles['summary-value']}>{user.full_name || personalDetails.fullName || personalDetails.firstName + ' ' + personalDetails.lastName || '-'}</span>
                      </div>
                      <div className={styles['summary-detail-item']}>
                        <span className={styles['summary-label']}>טלפון:</span>
                        <span className={styles['summary-value']}>{user.phone || personalDetails.phone || '-'}</span>
                      </div>
                      <div className={styles['summary-detail-item']}>
                        {/* placeholder detail item */}
                      </div>
                      <div className={styles['summary-detail-item']}>
                        <span className={styles['summary-label']}>מספר תעודת זהות:</span>
                        <span className={styles['summary-value']}>{personalDetails.idNumber || user.id_number || '-'}</span>
                      </div>
                      <div className={styles['summary-detail-item']}>
                        <span className={styles['summary-label']}>סטטוס:</span>
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
                      <div className={styles['summary-detail-item']}>
                        <span className={styles['summary-label']}>תאריך הרשמה:</span>
                        <span className={styles['summary-value']}>{formatDate(user.created_at)}</span>
                      </div>
                      <div className={styles['summary-detail-item']}>
                        <span className={styles['summary-label']}>כניסה אחרונה:</span>
                        <span className={styles['summary-value']}>{formatDate(user.last_sign_in)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Personal Details from Form - Stage 1 */}
                  <div className={styles['summary-section']}>
                    <div className={styles['summary-section-header']}>
                      <h3 className={styles['summary-section-title']}>שלב 1: פרטים אישיים בעל הנכס</h3>
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
                          {fileUrls.id_photo ? (
                            <FileLink url={fileUrls.id_photo} label="קובץ נבחר" fileName="id_photo" onDownload={handleDownloadFile} />
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
                          {fileUrls.tabu_extract ? (
                            <FileLink url={fileUrls.tabu_extract} label="קובץ נבחר" fileName="tabu_extract" onDownload={handleDownloadFile} />
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

                      {/* Additional Rights Holders */}
                      {additionalRightsHolders.length > 0 && (
                        <>
                          <div className={`${styles['summary-detail-item']} ${styles['rights-holders-header']}`}>
                            <span className={`${styles['summary-label']} ${styles['rights-holders-label']}`}>
                              בעלי זכויות נוספים:
                            </span>
                          </div>
                          {additionalRightsHolders.map((holder, index) => (
                            <React.Fragment key={index}>
                              <div className={`${styles['summary-detail-item']} ${styles['rights-holder-name']}`}>
                                <span className={`${styles['summary-label']} ${styles['rights-holder-name-label']}`}>
                                  בעל זכות {index + 1}:
                                </span>
                              </div>
                              <div className={styles['summary-detail-item']}>
                                <span className={styles['summary-label']}>שם פרטי:</span>
                                <span className={styles['summary-value']}>{holder.firstName || '-'}</span>
                              </div>
                              <div className={styles['summary-detail-item']}>
                                <span className={styles['summary-label']}>שם משפחה:</span>
                                <span className={styles['summary-value']}>{holder.lastName || '-'}</span>
                              </div>
                              <div className={styles['summary-detail-item']}>
                                <span className={styles['summary-label']}>מספר תעודת זהות:</span>
                                <span className={styles['summary-value']}>{holder.idNumber || '-'}</span>
                              </div>
                              <div className={styles['summary-detail-item']}>
                                <span className={styles['summary-label']}>צילום תעודת זהות:</span>
                                <span className={styles['summary-value']}>
                                  {additionalRightsHolderPhotos[index] ? (
                                    <div className={styles['file-link-row']}>
                                      <a
                                        href={additionalRightsHolderPhotos[index]}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={styles['file-view-link']}
                                      >
                                        צפה בקובץ
                                      </a>
                                      <button
                                        onClick={() => handleDownloadFile(additionalRightsHolderPhotos[index], `rights_holder_${index + 1}_id_photo`)}
                                        className={styles['download-btn']}
                                      >
                                        הורד
                                      </button>
                                    </div>
                                  ) : (
                                    <span className={styles['no-file']}>לא נבחר קובץ</span>
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
                  <div className={styles['summary-section']}>
                    <div className={styles['summary-section-header']}>
                      <h3 className={styles['summary-section-title']}>שלב 2: פרטי הנכס</h3>
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
                          {fileUrls.property_photos && fileUrls.property_photos.length > 0 ? (
                            <div className={styles['property-photos-list']}>
                              <span className={styles['property-photos-count']}>{fileUrls.property_photos.length} קבצים נבחרו:</span>
                              {fileUrls.property_photos.map((photoUrl, idx) => (
                                <div key={idx} className={styles['photo-row']}>
                                  <a
                                    href={photoUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={styles['photo-link']}
                                  >
                                    צילום {idx + 1}
                                  </a>
                                  <button
                                    onClick={() => handleDownloadFile(photoUrl, `property_photo_${idx + 1}`)}
                                    className={styles['download-btn']}
                                  >
                                    הורד
                                  </button>
                                </div>
                              ))}
                            </div>
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

                  {/* Measurement Map Section - Stage 3 */}
                  <div className={styles['summary-section']}>
                    <div className={styles['summary-section-header']}>
                      <h3 className={styles['summary-section-title']}>שלב 3: מפת מדידה</h3>
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
                        <span className={styles['summary-label']}>קובץ DWG:</span>
                        <span className={styles['summary-value']}>
                          {fileUrls.dwg_file ? (
                            <FileLink url={fileUrls.dwg_file} label="קובץ נבחר" fileName="measurement_dwg" onDownload={handleDownloadFile} />
                          ) : (
                            <span className={styles['no-file']}>לא נבחר קובץ</span>
                          )}
                        </span>
                      </div>
                      <div className={styles['summary-detail-item']}>
                        <span className={styles['summary-label']}>קובץ DWF:</span>
                        <span className={styles['summary-value']}>
                          {fileUrls.dwf_file ? (
                            <FileLink url={fileUrls.dwf_file} label="קובץ נבחר" fileName="measurement_dwf" onDownload={handleDownloadFile} />
                          ) : (
                            <span className={styles['no-file']}>לא נבחר קובץ</span>
                          )}
                        </span>
                      </div>
                      <div className={styles['summary-detail-item']}>
                        <span className={styles['summary-label']}>קובץ PDF:</span>
                        <span className={styles['summary-value']}>
                          {fileUrls.pdf_file ? (
                            <FileLink url={fileUrls.pdf_file} label="קובץ נבחר" fileName="measurement_pdf" onDownload={handleDownloadFile} />
                          ) : (
                            <span className={styles['no-file']}>לא נבחר קובץ</span>
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Application Data Section - Initial Form Data */}
                  {user.application_data && (
                    <div className={styles['summary-section']}>
                      <div className={styles['summary-section-header']}>
                        <h3 className={styles['summary-section-title']}>נתוני בקשה ראשונית</h3>
                      </div>
                      <div className={styles['summary-details-grid']}>
                        {user.application_data.gush && (
                          <div className={styles['summary-detail-item']}>
                            <span className={styles['summary-label']}>גוש:</span>
                            <span className={styles['summary-value']}>{user.application_data.gush}</span>
                          </div>
                        )}
                        {user.application_data.helka && (
                          <div className={styles['summary-detail-item']}>
                            <span className={styles['summary-label']}>חלקה:</span>
                            <span className={styles['summary-value']}>{user.application_data.helka}</span>
                          </div>
                        )}
                        {user.application_data.region && (
                          <div className={styles['summary-detail-item']}>
                            <span className={styles['summary-label']}>אזור:</span>
                            <span className={styles['summary-value']}>{user.application_data.region}</span>
                          </div>
                        )}
                        {user.application_data.council && (
                          <div className={styles['summary-detail-item']}>
                            <span className={styles['summary-label']}>מועצה / עירייה:</span>
                            <span className={styles['summary-value']}>{user.application_data.council}</span>
                          </div>
                        )}
                        {user.application_data.surveyMap && (
                          <div className={styles['summary-detail-item']}>
                            <span className={styles['summary-label']}>מפת מדידה:</span>
                            <span className={styles['summary-value']}>{user.application_data.surveyMap}</span>
                          </div>
                        )}
                        <div className={styles['summary-detail-item']}>
                          <span className={styles['summary-label']}>רשות מקרקעי ישראל:</span>
                          <span className={styles['summary-value']}>
                            {user.application_data.isIsraelLandAuthority ? 'כן' : 'לא'}
                          </span>
                        </div>
                        {user.application_data.selectedPlan && (
                          <div className={`${styles['summary-detail-item']} ${styles['full-width-item']}`}>
                            <span className={styles['summary-label']}>תוכנית נבחרת:</span>
                            <span className={styles['summary-value']}>
                              {typeof user.application_data.selectedPlan === 'object'
                                ? JSON.stringify(user.application_data.selectedPlan, null, 2)
                                : user.application_data.selectedPlan}
                            </span>
                          </div>
                        )}
                        {user.application_data.planningRequest && (
                          <div className={`${styles['summary-detail-item']} ${styles['full-width-item']}`}>
                            <span className={styles['summary-label']}>בקשת תכנון:</span>
                            <span className={styles['summary-value']}>
                              <pre className={styles['json-pre']}>
                                {typeof user.application_data.planningRequest === 'object'
                                  ? JSON.stringify(user.application_data.planningRequest, null, 2)
                                  : user.application_data.planningRequest}
                              </pre>
                            </span>
                          </div>
                        )}
                        {user.application_data.created_at && (
                          <div className={styles['summary-detail-item']}>
                            <span className={styles['summary-label']}>תאריך יצירה:</span>
                            <span className={styles['summary-value']}>{formatDate(user.application_data.created_at)}</span>
                          </div>
                        )}
                        {user.application_data.updated_at && (
                          <div className={styles['summary-detail-item']}>
                            <span className={styles['summary-label']}>תאריך עדכון:</span>
                            <span className={styles['summary-value']}>{formatDate(user.application_data.updated_at)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Files Section - Show all file URLs */}
                  <div className={hasFiles ? styles['files-section-has-files'] : styles['files-section-no-files']}>
                    <div className={styles['summary-section-header']}>
                      <h3 className={hasFiles ? styles['files-section-title-has-files'] : styles['files-section-title-no-files']}>
                        {hasFiles ? '📁 כל הקבצים' : '⚠️ אין קבצים'}
                      </h3>
                    </div>
                    {hasFiles ? (
                      <div className={styles['files-grid']}>
                        {Object.entries(fileUrls).map(([key, value]) => {
                          if (!value) return null
                          if (Array.isArray(value)) {
                            return (
                              <div key={key} className={styles['file-entry']}>
                                <strong className={styles['file-entry-label']}>{key}:</strong> ({value.length} files)
                                {value.map((url, idx) => (
                                  <div key={idx} className={styles['file-url-item']}>
                                    <FileLink url={url} label={`${key} ${idx + 1}`} fileName={`${key}_${idx + 1}`} onDownload={handleDownloadFile} />
                                    <div className={styles['file-url-text']}>{url}</div>
                                  </div>
                                ))}
                              </div>
                            )
                          }
                          return (
                            <div key={key} className={styles['file-entry']}>
                              <strong className={styles['file-entry-label']}>{key}:</strong>
                              <div className={styles['file-url-item']}>
                                <FileLink url={value} label={key} fileName={key} onDownload={handleDownloadFile} />
                                <div className={styles['file-url-text']}>{value}</div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    ) : (
                      <div className={styles['no-files-message']}>
                        <p className={styles['no-files-title']}>לא נמצאו קבצים עבור בקשה זו</p>
                        <p className={styles['no-files-subtitle']}>
                          הקבצים יופיעו כאן לאחר שהמשתמש יטען אותם בטופס
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Dream Home Section - Stage 4 */}
                  <div className={styles['summary-section']}>
                    <div className={styles['summary-section-header']}>
                      <h3 className={styles['summary-section-title']}>שלב 4: בחירת בית חלומות</h3>
                    </div>
                    {selectedHouse && selectedHouse.id ? (
                      <div className={styles['summary-house-card']}>
                        <img
                          src={selectedHouse.image || 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=900&q=80'}
                          alt={selectedHouse.title}
                          className={styles['summary-house-image']}
                        />
                        <div className={styles['summary-house-details']}>
                          <h4 className={styles['summary-house-title']}>{selectedHouse.title || selectedHouse.name || 'שם הדגם'}</h4>
                          {selectedHouse.desc && (
                            <p className={styles['house-desc']}>{selectedHouse.desc}</p>
                          )}
                          {selectedHouse.tag && (
                            <span className={styles['house-tag']}>
                              {selectedHouse.tag}
                            </span>
                          )}
                          {selectedHouse.spec && selectedHouse.spec.length > 0 && (
                            <div className={styles['summary-house-specs']}>
                              {selectedHouse.spec.map((item, i) => {
                                const specText = typeof item === 'string' ? item : item.text
                                const specIcon = typeof item === 'object' && item.icon ? item.icon : null
                                return (
                                  <div key={i} className={styles['summary-house-spec-item']}>
                                    {specIcon && (
                                      <img className={styles['summary-house-spec-icon']} src={specIcon} alt={specText} />
                                    )}
                                    <span className={styles['summary-house-spec']}>{specText}</span>
                                  </div>
                                )
                              })}
                            </div>
                          )}
                          {selectedHouse.id && (
                            <div className={styles['house-id']}>
                              ID: {selectedHouse.id}
                            </div>
                          )}
                        </div>
                      </div>
                    ) : user.application_data?.selectedPlan ? (
                      <div className={styles['summary-details-grid']}>
                        <div className={`${styles['summary-detail-item']} ${styles['full-width-item']}`}>
                          <span className={styles['summary-label']}>תוכנית נבחרת:</span>
                          <span className={styles['summary-value']}>
                            {typeof user.application_data.selectedPlan === 'object'
                              ? JSON.stringify(user.application_data.selectedPlan, null, 2)
                              : user.application_data.selectedPlan}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className={styles['summary-details-grid']}>
                        <div className={styles['summary-detail-item']}>
                          <span className={styles['summary-label']}>בית חלומות:</span>
                          <span className={styles['summary-value']}>לא נבחר</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Admin Notes Section */}
                  <div className={styles['admin-notes-section']}>
                    <h3 className={styles['admin-notes-title']}>הערות מנהל</h3>
                    <textarea
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      onBlur={() => {
                        if (user.id) {
                          saveAdminNotes(user.id, adminNotes)
                        }
                      }}
                      placeholder="הוסף הערות פרטיות (רק מנהל יכול לראות)"
                      className={styles['admin-notes-textarea']}
                      disabled={savingNotes}
                    />
                    {savingNotes && (
                      <p className={styles['admin-notes-saving']}>
                        שומר...
                      </p>
                    )}
                    <p className={styles['admin-notes-hint']}>
                      הערות אלה נראות רק למנהל
                    </p>
                  </div>

                  {/* All Submissions History */}
                  {user.form_submissions && user.form_submissions.length > 0 && (
                    <div className={styles['summary-section']}>
                      <div className={styles['summary-section-header']}>
                        <h3 className={styles['summary-section-title']}>היסטוריית בקשות ({user.form_submissions.length})</h3>
                      </div>
                      <div className={styles['submissions-list']}>
                        {user.form_submissions.map((submission, idx) => (
                          <div
                            key={submission.id || idx}
                            className={`${styles['submission-item']} ${idx === 0 ? styles['submission-item-latest'] : styles['submission-item-older']}`}
                          >
                            <div className={styles['submission-item-header']}>
                              <strong className={styles['submission-item-title']}>
                                בקשה #{user.form_submissions.length - idx} {idx === 0 && '(האחרונה)'}
                              </strong>
                              <span className={styles['submission-item-date']}>
                                {formatDate(submission.created_at)}
                              </span>
                            </div>
                            <div className={styles['submission-item-body']}>
                              {(() => {
                                const sp = parseJsonField(submission.personal_details)
                                const spr = parseJsonField(submission.property_details)
                                const sm = parseJsonField(submission.measurement_details)
                                const sh = parseJsonField(submission.selected_house)
                                return <>
                                  <div>פרטים אישיים: {sp.firstName || sp.email || 'כן'}</div>
                                  <div>פרטי נכס: {spr.city || spr.street || 'כן'}</div>
                                  <div>מפת מדידה: {sm.surveyorName || 'כן'}</div>
                                  <div>בית חלומות: {sh.title || sh.id ? 'כן' : 'לא'}</div>
                                </>
                              })()}
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
