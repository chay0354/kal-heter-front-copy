const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

class UserDataService {
  // Get auth token
  getAuthToken() {
    return localStorage.getItem('access_token')
  }

  // Get current user from storage
  getCurrentUser() {
    try {
      const userStr = localStorage.getItem('user')
      return userStr ? JSON.parse(userStr) : null
    } catch (error) {
      return null
    }
  }

  // Save user application data to database
  async saveUserData(data) {
    try {
      const token = this.getAuthToken()
      if (!token) {
        throw new Error('No authentication token found')
      }

      // Convert File objects to file names for storage
      const dataToSave = { ...data }
      if (dataToSave.surveyMap && dataToSave.surveyMap instanceof File) {
        dataToSave.surveyMap = dataToSave.surveyMap.name
      }

      const response = await fetch(`${API_BASE_URL}/api/user/application-data`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(dataToSave),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail || 'Failed to save application data')
      }

      return await response.json()
    } catch (error) {
      console.error('Error saving user data:', error)
      throw error
    }
  }

  // Get user application data from database
  async getUserData() {
    try {
      const token = this.getAuthToken()
      if (!token) {
        return null
      }

      const response = await fetch(`${API_BASE_URL}/api/user/application-data`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        if (response.status === 404) {
          return null
        }
        const error = await response.json()
        throw new Error(error.detail || 'Failed to get application data')
      }

      const data = await response.json()
      return data || null
    } catch (error) {
      console.error('Error getting user data:', error)
      return null
    }
  }

  // Check if application is completed (from database)
  async isCompleted() {
    try {
      const token = this.getAuthToken()
      if (!token) {
        return false
      }

      const response = await fetch(`${API_BASE_URL}/api/user/completion-status`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        return false
      }

      const result = await response.json()
      return result.completed === true
    } catch (error) {
      console.error('Error checking completion status:', error)
      return false
    }
  }

  // Clear user data (on logout) - no need to clear from DB, just from local storage
  clearUserData() {
    // Data is stored in database, so we don't need to clear it
    // This method is kept for compatibility
  }
}

export default new UserDataService()

