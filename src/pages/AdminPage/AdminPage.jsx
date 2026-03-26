import React, { useState, useEffect } from 'react'
import '../../components/PlanningRequest.css'
import StatusDropdown from './StatusDropdown'
import UserDetailView from './UserDetailView'

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


const AdminPage = () => {
  const [users, setUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [errorHelp, setErrorHelp] = useState(null)
  const [loadingDetails, setLoadingDetails] = useState(false)
  const [adminNotes, setAdminNotes] = useState('')
  const [savingNotes, setSavingNotes] = useState(false)
  const [viewMode, setViewMode] = useState('card')

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
      
      // Check if the response contains an error message (even with 200 OK status)
      if (data.error) {
        const errorMessage = data.message || data.error || 'Unknown error occurred'
        setError(errorMessage)
        setErrorHelp(data.help || null)
        setUsers([])
        console.error('Backend returned error:', data)
      } else {
        setUsers(data.users || [])
        setError(null)
        setErrorHelp(null)
      }
    } catch (err) {
      setError(err.message)
      setErrorHelp(null)
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
              // Load admin notes from user metadata
              const notes = userData.user_metadata?.notes || ''
              setAdminNotes(notes)
            } catch (err) {
              console.error('Error fetching user details:', err)
              alert('שגיאה בטעינת פרטי המשתמש')
            } finally {
              setLoadingDetails(false)
            }
          }
          
          const saveAdminNotes = async (userId, notes) => {
            try {
              setSavingNotes(true)
              const token = localStorage.getItem('access_token')
              const response = await fetch(buildApiUrl(`/api/admin/users/${userId}/notes`), {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': token ? `Bearer ${token}` : '',
                },
                body: JSON.stringify({ notes })
              })
              
              if (!response.ok) {
                const errorData = await response.json().catch(() => ({ detail: 'Unknown error' }))
                throw new Error(errorData.detail || 'Failed to save notes')
              }
              
              // Update local state
              setSelectedUser(prev => ({
                ...prev,
                user_metadata: {
                  ...prev.user_metadata,
                  notes: notes
                }
              }))
            } catch (err) {
              console.error('Error saving notes:', err)
              alert('שגיאה בשמירת הערות: ' + err.message)
            } finally {
              setSavingNotes(false)
            }
          }

  const handleDeleteUser = async (user) => {
    if (!window.confirm(`האם אתה בטוח שברצונך למחוק את המשתמש ${user.full_name || user.email}?`)) return
    try {
      const token = localStorage.getItem('access_token')
      const response = await fetch(buildApiUrl(`/api/admin/users/${user.id}`), {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
      })
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Unknown error' }))
        throw new Error(errorData.detail || 'Failed to delete user')
      }
      setUsers(users.filter(u => u.id !== user.id))
    } catch (err) {
      console.error('Error deleting user:', err)
      alert(`שגיאה במחיקת המשתמש: ${err.message}`)
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

  // If user is selected, show details view
  if (selectedUser) {
    return (
      <UserDetailView
        user={selectedUser}
        loadingDetails={loadingDetails}
        adminNotes={adminNotes}
        setAdminNotes={setAdminNotes}
        savingNotes={savingNotes}
        handleBackToList={handleBackToList}
        handleDownloadFile={handleDownloadFile}
        buildApiUrl={buildApiUrl}
        fetchUserDetails={fetchUserDetails}
        saveAdminNotes={saveAdminNotes}
        formatDate={formatDate}
      />
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
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '30px' }}>
                <p style={{ fontSize: '1.1rem', color: '#6b7280', margin: 0 }}>
                  סה"כ משתמשים: <strong>{users.length}</strong>
                </p>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => setViewMode('card')}
                    title="תצוגת כרטיסים"
                    style={{
                      padding: '8px 14px',
                      borderRadius: '10px',
                      border: '1.5px solid',
                      borderColor: viewMode === 'card' ? '#667eea' : '#e5e7eb',
                      background: viewMode === 'card' ? '#eef2ff' : 'white',
                      color: viewMode === 'card' ? '#667eea' : '#6b7280',
                      cursor: 'pointer',
                      fontWeight: '600',
                      fontSize: '0.85rem',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <rect x="3" y="3" width="8" height="8" rx="2" fill="currentColor"/>
                      <rect x="13" y="3" width="8" height="8" rx="2" fill="currentColor"/>
                      <rect x="3" y="13" width="8" height="8" rx="2" fill="currentColor"/>
                      <rect x="13" y="13" width="8" height="8" rx="2" fill="currentColor"/>
                    </svg>
                    כרטיסים
                  </button>
                  <button
                    onClick={() => setViewMode('table')}
                    title="תצוגת טבלה"
                    style={{
                      padding: '8px 14px',
                      borderRadius: '10px',
                      border: '1.5px solid',
                      borderColor: viewMode === 'table' ? '#667eea' : '#e5e7eb',
                      background: viewMode === 'table' ? '#eef2ff' : 'white',
                      color: viewMode === 'table' ? '#667eea' : '#6b7280',
                      cursor: 'pointer',
                      fontWeight: '600',
                      fontSize: '0.85rem',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <rect x="3" y="3" width="18" height="4" rx="1" fill="currentColor"/>
                      <rect x="3" y="10" width="18" height="4" rx="1" fill="currentColor"/>
                      <rect x="3" y="17" width="18" height="4" rx="1" fill="currentColor"/>
                    </svg>
                    טבלה
                  </button>
                </div>
              </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>טוען משתמשים...</p>
            </div>
          ) : error ? (
            <div style={{ textAlign: 'center', padding: '40px', direction: 'rtl' }}>
              <p style={{ fontSize: '1.2rem', color: '#e74c3c', marginBottom: '15px' }}>שגיאה: {error}</p>
              {errorHelp && (
                <div style={{ 
                  background: '#fff3cd', 
                  border: '1px solid #ffc107', 
                  borderRadius: '8px', 
                  padding: '15px', 
                  margin: '20px auto', 
                  maxWidth: '600px',
                  textAlign: 'right'
                }}>
                  <p style={{ fontSize: '1rem', color: '#856404', margin: '0', lineHeight: '1.6' }}>{errorHelp}</p>
                </div>
              )}
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
              ) : viewMode === 'table' ? (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.95rem', direction: 'rtl' }}>
                    <thead>
                      <tr style={{ background: 'linear-gradient(135deg, rgba(102,126,234,0.1) 0%, rgba(118,75,162,0.1) 100%)', borderBottom: '2px solid #e5e7eb' }}>
                        {['שם / אימייל', 'טלפון', 'סטטוס', 'בקשות', 'תאריך הרשמה', ''].map((col) => (
                          <th key={col} style={{ padding: '12px 16px', textAlign: 'right', fontWeight: '700', color: '#2C3E50', whiteSpace: 'nowrap' }}>{col}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user, idx) => (
                        <tr
                          key={user.id}
                          style={{ background: idx % 2 === 0 ? 'white' : '#f9fafb', borderBottom: '1px solid #e5e7eb', transition: 'background 0.15s' }}
                          onMouseEnter={(e) => { e.currentTarget.style.background = '#eef2ff' }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = idx % 2 === 0 ? 'white' : '#f9fafb' }}
                        >
                          <td style={{ padding: '12px 16px' }}>
                            <div style={{ fontWeight: '600', color: '#2C3E50' }}>{user.full_name || '-'}</div>
                            <div style={{ fontSize: '0.85rem', color: '#6b7280' }}>
                              {user.email ? (
                                <a href={`mailto:${user.email}`} style={{ color: '#0f4eb3', textDecoration: 'underline' }}>{user.email}</a>
                              ) : '-'}
                            </div>
                          </td>
                          <td style={{ padding: '12px 16px', color: '#2C3E50' }}>{user.phone || '-'}</td>
                          <td style={{ padding: '12px 16px' }}>
                            <select
                              value={user.application_status || 'בטיפול'}
                              onClick={(e) => e.stopPropagation()}
                              onChange={async (e) => {
                                e.stopPropagation()
                                const newStatus = e.target.value
                                const oldStatus = user.application_status
                                setUsers(users.map(u => u.id === user.id ? { ...u, application_status: newStatus } : u))
                                try {
                                  const token = localStorage.getItem('access_token')
                                  const response = await fetch(buildApiUrl(`/api/admin/users/${user.id}/status`), {
                                    method: 'PUT',
                                    headers: { 'Content-Type': 'application/json', 'Authorization': token ? `Bearer ${token}` : '' },
                                    body: JSON.stringify({ status: newStatus })
                                  })
                                  if (!response.ok) {
                                    setUsers(users.map(u => u.id === user.id ? { ...u, application_status: oldStatus } : u))
                                    const errorData = await response.json().catch(() => ({ detail: 'Unknown error' }))
                                    throw new Error(errorData.detail || 'Failed to update status')
                                  }
                                  setTimeout(() => fetchUsers(), 500)
                                } catch (error) {
                                  console.error('Error updating status:', error)
                                  alert(`שגיאה בעדכון הסטטוס: ${error.message}`)
                                }
                              }}
                              style={{
                                padding: '5px 24px 5px 10px',
                                borderRadius: '10px',
                                fontSize: '0.85rem',
                                fontWeight: '600',
                                border: '1px solid #e5e7eb',
                                background: 'white',
                                color: '#2C3E50',
                                cursor: 'pointer',
                                appearance: 'none',
                                WebkitAppearance: 'none',
                                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236b7280' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
                                backgroundRepeat: 'no-repeat',
                                backgroundPosition: 'left 8px center',
                                backgroundSize: '10px'
                              }}
                            >
                              <option value="בטיפול">בטיפול</option>
                              <option value="בקשה טופלה">בקשה טופלה</option>
                            </select>
                          </td>
                          <td style={{ padding: '12px 16px', color: '#2C3E50', textAlign: 'center' }}>{user.submissions_count || 0}</td>
                          <td style={{ padding: '12px 16px', color: '#2C3E50', fontSize: '0.85rem', whiteSpace: 'nowrap' }}>{formatDate(user.created_at)}</td>
                          <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                              <button
                                onClick={() => handleUserClick(user)}
                                style={{
                                  padding: '6px 16px',
                                  background: 'linear-gradient(135deg, rgba(102,126,234,0.95) 0%, rgba(118,75,162,0.95) 100%)',
                                  color: 'white',
                                  border: 'none',
                                  borderRadius: '8px',
                                  cursor: 'pointer',
                                  fontWeight: '600',
                                  fontSize: '0.85rem',
                                  whiteSpace: 'nowrap'
                                }}
                              >
                                צפה בפרטים
                              </button>
                              <button
                                onClick={(e) => { e.stopPropagation(); handleDeleteUser(user) }}
                                style={{
                                  padding: '6px 12px',
                                  background: '#fee2e2',
                                  color: '#dc2626',
                                  border: '1px solid #fecaca',
                                  borderRadius: '8px',
                                  cursor: 'pointer',
                                  fontWeight: '600',
                                  fontSize: '0.85rem',
                                  whiteSpace: 'nowrap'
                                }}
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
                            {user.email ? (
                              <a href={`mailto:${user.email}`} style={{ color: '#0f4eb3', textDecoration: 'underline' }}>
                                {user.email}
                              </a>
                            ) : '-'}
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
                                const token = localStorage.getItem('access_token');
                                const response = await fetch(buildApiUrl(`/api/admin/users/${user.id}/status`), {
                                  method: 'PUT',
                                  headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': token ? `Bearer ${token}` : '',
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
                                  const errorData = await response.json().catch(() => ({ detail: 'Unknown error' }));
                                  throw new Error(errorData.detail || 'Failed to update status');
                                }
                                
                                const result = await response.json();
                                console.log('[AdminPage] Status update result:', result);
                                
                                // Refresh users list to ensure we have the latest data
                                setTimeout(() => {
                                  fetchUsers();
                                }, 500);
                              } catch (error) {
                                console.error('Error updating status:', error);
                                alert(`שגיאה בעדכון הסטטוס: ${error.message}`);
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
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <span style={{ color: '#667eea', fontWeight: '600', fontSize: '0.9rem' }}>
                          לחץ לצפייה בפרטים המלאים →
                        </span>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleDeleteUser(user) }}
                          style={{
                            padding: '6px 14px',
                            background: '#fee2e2',
                            color: '#dc2626',
                            border: '1px solid #fecaca',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontWeight: '600',
                            fontSize: '0.85rem'
                          }}
                        >
                          מחק
                        </button>
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