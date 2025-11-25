const USER_DATA_KEY = 'user_application_data'
const COMPLETION_STATUS_KEY = 'application_completed'

class UserDataService {
  // Save user application data
  saveUserData(data) {
    try {
      const user = this.getCurrentUser()
      if (user && user.id) {
        const key = `${USER_DATA_KEY}_${user.id}`
        localStorage.setItem(key, JSON.stringify(data))
        return true
      }
      return false
    } catch (error) {
      console.error('Error saving user data:', error)
      return false
    }
  }

  // Get user application data
  getUserData() {
    try {
      const user = this.getCurrentUser()
      if (user && user.id) {
        const key = `${USER_DATA_KEY}_${user.id}`
        const data = localStorage.getItem(key)
        return data ? JSON.parse(data) : null
      }
      return null
    } catch (error) {
      console.error('Error getting user data:', error)
      return null
    }
  }

  // Mark application as completed
  markAsCompleted() {
    try {
      const user = this.getCurrentUser()
      if (user && user.id) {
        const key = `${COMPLETION_STATUS_KEY}_${user.id}`
        localStorage.setItem(key, 'true')
        return true
      }
      return false
    } catch (error) {
      console.error('Error marking as completed:', error)
      return false
    }
  }

  // Check if application is completed
  isCompleted() {
    try {
      const user = this.getCurrentUser()
      if (user && user.id) {
        const key = `${COMPLETION_STATUS_KEY}_${user.id}`
        return localStorage.getItem(key) === 'true'
      }
      return false
    } catch (error) {
      console.error('Error checking completion status:', error)
      return false
    }
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

  // Clear user data (on logout)
  clearUserData() {
    try {
      const user = this.getCurrentUser()
      if (user && user.id) {
        const dataKey = `${USER_DATA_KEY}_${user.id}`
        const completionKey = `${COMPLETION_STATUS_KEY}_${user.id}`
        localStorage.removeItem(dataKey)
        localStorage.removeItem(completionKey)
      }
    } catch (error) {
      console.error('Error clearing user data:', error)
    }
  }
}

export default new UserDataService()

