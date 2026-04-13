import { useState, useEffect } from 'react'
import { buildApiUrl } from '../utils/api'

const useAdminUsers = () => {
  const [users, setUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [errorHelp, setErrorHelp] = useState(null)
  const [loadingDetails, setLoadingDetails] = useState(false)
  const [adminNotes, setAdminNotes] = useState('')
  const [savingNotes, setSavingNotes] = useState(false)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const url = buildApiUrl('/api/admin/users')
      console.log('Fetching users from:', url)

      const response = await fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      })

      console.log('Response status:', response.status, response.statusText)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Error response:', errorText)
        throw new Error(`Failed to fetch users: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      console.log('Users data received:', data)

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
        headers: { 'Content-Type': 'application/json' },
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

      if (userData.form_draft) {
        console.log('Form draft file_urls:', userData.form_draft.file_urls)
        console.log('Form draft file_urls type:', typeof userData.form_draft.file_urls)
      }
      if (userData.form_submissions && userData.form_submissions.length > 0) {
        console.log('Form submission file_urls:', userData.form_submissions[0].file_urls)
        console.log('Form submission file_urls type:', typeof userData.form_submissions[0].file_urls)
      }

      setSelectedUser(userData)
      setAdminNotes(userData.user_metadata?.notes || '')
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
        body: JSON.stringify({ notes }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Unknown error' }))
        throw new Error(errorData.detail || 'Failed to save notes')
      }

      setSelectedUser(prev => ({
        ...prev,
        user_metadata: { ...prev.user_metadata, notes },
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
      setUsers(prev => prev.filter(u => u.id !== user.id))
    } catch (err) {
      console.error('Error deleting user:', err)
      alert(`שגיאה במחיקת המשתמש: ${err.message}`)
    }
  }

  const handleStatusChange = async (user, newStatus) => {
    const oldStatus = user.application_status
    setUsers(prev => prev.map(u => u.id === user.id ? { ...u, application_status: newStatus } : u))
    try {
      const token = localStorage.getItem('access_token')
      const response = await fetch(buildApiUrl(`/api/admin/users/${user.id}/status`), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
        body: JSON.stringify({ status: newStatus }),
      })
      if (!response.ok) {
        setUsers(prev => prev.map(u => u.id === user.id ? { ...u, application_status: oldStatus } : u))
        const errorData = await response.json().catch(() => ({ detail: 'Unknown error' }))
        throw new Error(errorData.detail || 'Failed to update status')
      }
      const result = await response.json()
      console.log('[useAdminUsers] Status update result:', result)
      setTimeout(() => fetchUsers(), 500)
    } catch (err) {
      console.error('Error updating status:', err)
      alert(`שגיאה בעדכון הסטטוס: ${err.message}`)
    }
  }

  const clearSelectedUser = () => setSelectedUser(null)

  return {
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
  }
}

export default useAdminUsers
