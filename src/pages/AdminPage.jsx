import React, { useState, useEffect } from 'react'
import '../components/FormPage.css'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

const AdminPage = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_BASE_URL}/api/admin/users`)
      
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

  return (
    <div className="form-page">
      <div className="background-elements">
        <div className="bg-shape bg-shape-1"></div>
        <div className="bg-shape bg-shape-2"></div>
        <div className="bg-shape bg-shape-3"></div>
        <div className="bg-shape bg-shape-4"></div>
      </div>
      <div className="form-container" style={{ maxWidth: '1400px' }}>
        <div className="form-header">
          <div className="logo-section">
            <div className="logo-icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" fill="currentColor"/>
              </svg>
            </div>
            <h1 className="form-title">ניהול משתמשים</h1>
            <p className="form-subtitle">רשימת כל המשתמשים במערכת</p>
          </div>
        </div>

        <div className="form-content" style={{ padding: '50px 40px', overflowX: 'auto' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>טוען משתמשים...</p>
            </div>
          ) : error ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <p style={{ fontSize: '1.2rem', color: 'var(--accent-color)' }}>שגיאה: {error}</p>
              <button 
                onClick={fetchUsers}
                style={{
                  marginTop: '20px',
                  padding: '12px 24px',
                  background: 'var(--gradient-primary)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '1rem'
                }}
              >
                נסה שוב
              </button>
            </div>
          ) : (
            <>
              <div style={{ marginBottom: '30px', textAlign: 'center' }}>
                <p style={{ fontSize: '1.1rem', color: 'var(--text-primary)' }}>
                  סה"כ משתמשים: <strong>{users.length}</strong>
                </p>
              </div>
              
              <div style={{ overflowX: 'auto', width: '100%' }}>
                <table style={{ 
                  width: '100%', 
                  minWidth: '1200px',
                  borderCollapse: 'collapse',
                  background: 'white',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}>
                  <thead>
                    <tr style={{ 
                      background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.95) 0%, rgba(118, 75, 162, 0.95) 100%)',
                      color: 'white'
                    }}>
                      <th style={{ padding: '16px', textAlign: 'right', fontWeight: '600', whiteSpace: 'nowrap' }}>אימייל</th>
                      <th style={{ padding: '16px', textAlign: 'right', fontWeight: '600', whiteSpace: 'nowrap' }}>שם מלא</th>
                      <th style={{ padding: '16px', textAlign: 'right', fontWeight: '600', whiteSpace: 'nowrap' }}>טלפון</th>
                      <th style={{ padding: '16px', textAlign: 'right', fontWeight: '600', whiteSpace: 'nowrap' }}>כתובת</th>
                      <th style={{ padding: '16px', textAlign: 'right', fontWeight: '600', whiteSpace: 'nowrap' }}>תעודת זהות</th>
                      <th style={{ padding: '16px', textAlign: 'center', fontWeight: '600', whiteSpace: 'nowrap' }}>אימייל מאומת</th>
                      <th style={{ padding: '16px', textAlign: 'right', fontWeight: '600', whiteSpace: 'nowrap' }}>תאריך הרשמה</th>
                      <th style={{ padding: '16px', textAlign: 'right', fontWeight: '600', whiteSpace: 'nowrap' }}>כניסה אחרונה</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.length === 0 ? (
                      <tr>
                        <td colSpan="8" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                          אין משתמשים במערכת
                        </td>
                      </tr>
                    ) : (
                      users.map((user, index) => (
                        <tr 
                          key={user.id}
                          style={{ 
                            borderBottom: '1px solid var(--border-color)',
                            background: index % 2 === 0 ? 'white' : 'rgba(248, 249, 250, 0.5)'
                          }}
                        >
                          <td style={{ padding: '16px', textAlign: 'right', whiteSpace: 'nowrap' }}>{user.email || '-'}</td>
                          <td style={{ padding: '16px', textAlign: 'right', whiteSpace: 'nowrap' }}>{user.full_name || '-'}</td>
                          <td style={{ padding: '16px', textAlign: 'right', whiteSpace: 'nowrap' }}>{user.phone || '-'}</td>
                          <td style={{ padding: '16px', textAlign: 'right', whiteSpace: 'nowrap' }}>{user.address || '-'}</td>
                          <td style={{ padding: '16px', textAlign: 'right', whiteSpace: 'nowrap' }}>{user.id_number || '-'}</td>
                          <td style={{ padding: '16px', textAlign: 'center' }}>
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
                          </td>
                          <td style={{ padding: '16px', textAlign: 'right', fontSize: '0.9rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                            {formatDate(user.created_at)}
                          </td>
                          <td style={{ padding: '16px', textAlign: 'right', fontSize: '0.9rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
                            {formatDate(user.last_sign_in)}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              
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
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminPage

