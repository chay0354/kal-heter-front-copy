import React, { useState } from 'react'
import styles from './styles.module.css'
import StatusDropdown from './StatusDropdown'
import UserDetailView from './UserDetailView'
import useAdminUsers from '../../hooks/useAdminUsers'
import { buildApiUrl } from '../../utils/api'
import GridViewIcon from '../../components/icons/GridViewIcon'
import TableViewIcon from '../../components/icons/TableViewIcon'
import RefreshIcon from '../../components/icons/RefreshIcon'

const ADMIN_PASSWORD = '4765'

const AdminPage = () => {
  const [viewMode, setViewMode] = useState('card')
  const [authorized, setAuthorized] = useState(false)

  React.useEffect(() => {
    const input = window.prompt('הכנס סיסמת מנהל:')
    if (input === ADMIN_PASSWORD) {
      setAuthorized(true)
    } else {
      window.alert('סיסמה שגויה. אין גישה לדף זה.')
      window.history.back()
    }
  }, [])

  const {
    users,
    selectedUser,
    loading,
    error,
    errorHelp,
    loadingDetails,
    adminNotes,
    setAdminNotes,
    savingNotes,
    fetchUsers,
    fetchUserDetails,
    saveAdminNotes,
    handleDeleteUser,
    handleStatusChange,
    clearSelectedUser,
  } = useAdminUsers()

  const formatDate = (dateString) => {
    if (!dateString) return 'לא זמין'
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('he-IL', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
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
      try {
        console.log('[Download] Attempting direct download from:', fileUrl)
        const response = await fetch(fileUrl, { mode: 'cors', cache: 'no-cache' })
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

      const downloadUrl = buildApiUrl(`/api/admin/files/download?file_url=${encodeURIComponent(fileUrl)}`)
      console.log('[Download] Using backend download endpoint:', downloadUrl)

      const response = await fetch(downloadUrl, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
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
      try {
        window.open(fileUrl, '_blank')
      } catch (openError) {
        console.error('[Download] Failed to open file in new tab:', openError)
        alert('לא ניתן להוריד או לפתוח את הקובץ. בדוק את הקישור.')
      }
    }
  }

  if (!authorized) return null

  if (selectedUser) {
    return (
      <UserDetailView
        user={selectedUser}
        loadingDetails={loadingDetails}
        adminNotes={adminNotes}
        setAdminNotes={setAdminNotes}
        savingNotes={savingNotes}
        handleBackToList={clearSelectedUser}
        handleDownloadFile={handleDownloadFile}
        buildApiUrl={buildApiUrl}
        fetchUserDetails={fetchUserDetails}
        saveAdminNotes={saveAdminNotes}
        formatDate={formatDate}
      />
    )
  }

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
            <div className={styles['personal-details-card-content']}>
              <h2 className={styles['form-title']}>ניהול משתמשים</h2>

              {/* Toolbar */}
              <div className={styles.toolbar}>
                <p className={styles['user-count']}>
                  סה"כ משתמשים: <strong>{users.length}</strong>
                </p>
                <div className={styles['view-mode-buttons']}>
                  <button
                    onClick={() => setViewMode('card')}
                    title="תצוגת כרטיסים"
                    className={`${styles['view-btn']}${viewMode === 'card' ? ` ${styles.active}` : ''}`}
                  >
                    <GridViewIcon width={16} height={16} />
                    כרטיסים
                  </button>
                  <button
                    onClick={() => setViewMode('table')}
                    title="תצוגת טבלה"
                    className={`${styles['view-btn']}${viewMode === 'table' ? ` ${styles.active}` : ''}`}
                  >
                    <TableViewIcon width={16} height={16} />
                    טבלה
                  </button>
                </div>
              </div>

              {loading ? (
                <div className={styles['state-center']}>
                  <p className={styles['loading-text']}>טוען משתמשים...</p>
                </div>
              ) : error ? (
                <div className={styles['error-state']}>
                  <p className={styles['error-text']}>שגיאה: {error}</p>
                  {errorHelp && (
                    <div className={styles['error-help-box']}>
                      <p className={styles['error-help-text']}>{errorHelp}</p>
                    </div>
                  )}
                  <button
                    onClick={fetchUsers}
                    className={`submit-button ${styles['retry-btn']}`}
                  >
                    <span>נסה שוב</span>
                  </button>
                </div>
              ) : users.length === 0 ? (
                <div className={styles['state-center']}>
                  <p className={styles['empty-text']}>אין משתמשים במערכת</p>
                </div>
              ) : viewMode === 'table' ? (
                <div className={styles['table-scroll']}>
                  <table className={styles['users-table']}>
                    <thead>
                      <tr>
                        {['שם / אימייל', 'טלפון', 'סטטוס', 'בקשות', 'תאריך הרשמה', ''].map((col) => (
                          <th key={col}>{col}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user.id}>
                          <td>
                            <div className={styles['td-name']}>{user.full_name || '-'}</div>
                            <div className={styles['td-email']}>
                              {user.email ? (
                                <a href={`mailto:${user.email}`} className={styles['email-link']}>{user.email}</a>
                              ) : '-'}
                            </div>
                          </td>
                          <td>{user.phone || '-'}</td>
                          <td>
                            <StatusDropdown
                              value={user.application_status || 'בטיפול'}
                              onClick={(e) => e.stopPropagation()}
                              onChange={(e) => { handleStatusChange(user, e.target.value) }}
                            />
                          </td>
                          <td className={styles['td-submissions']}>{user.submissions_count || 0}</td>
                          <td className={styles['td-date']}>{formatDate(user.created_at)}</td>
                          <td className={styles['td-actions']}>
                            <div className={styles['actions-group']}>
                              <button
                                onClick={() => fetchUserDetails(user.id)}
                                className={styles['btn-view']}
                              >
                                צפה בפרטים
                              </button>
                              <button
                                onClick={(e) => { e.stopPropagation(); handleDeleteUser(user) }}
                                className={styles['btn-delete']}
                              >
                                מחק
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className={styles['cards-grid']}>
                  {users.map((user) => (
                    <div
                      key={user.id}
                      onClick={() => fetchUserDetails(user.id)}
                      className={styles.card}
                    >
                      <div className={styles['card-header']}>
                        <div className={styles['card-avatar']}>
                          {user.full_name ? user.full_name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                        </div>
                        <div className={styles['card-identity']}>
                          <h3 className={styles['card-name']}>
                            {user.full_name || user.email}
                          </h3>
                          <p className={styles['card-email-row']}>
                            {user.email ? (
                              <a href={`mailto:${user.email}`} className={styles['email-link']}>
                                {user.email}
                              </a>
                            ) : '-'}
                          </p>
                        </div>
                      </div>
                      <div className={styles['card-fields']}>
                        {user.phone && (
                          <div className={styles['card-field-row']}>
                            <span className={styles['card-field-label']}>טלפון:</span>
                            <span className={styles['card-field-value']}>{user.phone}</span>
                          </div>
                        )}
                        <div className={styles['card-field-row']}>
                          <span className={styles['card-field-label']}>סטטוס:</span>
                          <StatusDropdown
                            value={user.application_status || 'בטיפול'}
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) => { handleStatusChange(user, e.target.value) }}
                          />
                        </div>
                        <div className={styles['card-field-row']}>
                          <span className={styles['card-field-label']}>בקשות שהוגשו:</span>
                          <span className={styles['card-field-value']}>{user.submissions_count || 0}</span>
                        </div>
                        <div className={styles['card-field-row']}>
                          <span className={styles['card-field-label']}>תאריך הרשמה:</span>
                          <span className={styles['card-field-value-small']}>{formatDate(user.created_at)}</span>
                        </div>
                      </div>
                      <div className={styles['card-footer']}>
                        <span className={styles['card-cta']}>
                          לחץ לצפייה בפרטים המלאים →
                        </span>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDeleteUser(user) }}
                          className={styles['btn-delete-card']}
                        >
                          מחק
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {!loading && !error && users.length > 0 && (
                <div className={styles['refresh-section']}>
                  <button
                    onClick={fetchUsers}
                    className={`submit-button ${styles['refresh-btn']}`}
                  >
                    <span>רענן רשימה</span>
                    <RefreshIcon width={20} height={20} />
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
