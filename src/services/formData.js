// Utility to store and retrieve form data across pages
const FORM_DATA_KEY = 'kal_heter_form_data'

export const saveFormData = (data) => {
  try {
    const existingData = getFormData()
    const updatedData = { ...existingData, ...data }
    localStorage.setItem(FORM_DATA_KEY, JSON.stringify(updatedData))
  } catch (error) {
    console.error('Error saving form data:', error)
  }
}

export const getFormData = () => {
  try {
    const data = localStorage.getItem(FORM_DATA_KEY)
    return data ? JSON.parse(data) : {}
  } catch (error) {
    console.error('Error getting form data:', error)
    return {}
  }
}

export const clearFormData = () => {
  try {
    localStorage.removeItem(FORM_DATA_KEY)
  } catch (error) {
    console.error('Error clearing form data:', error)
  }
}

export const saveFileData = (key, file) => {
  try {
    // Store file metadata (we can't store the actual file in localStorage)
    const fileData = {
      name: file.name,
      size: file.size,
      type: file.type,
      lastModified: file.lastModified
    }
    const existingData = getFormData()
    existingData[key] = fileData
    saveFormData(existingData)
  } catch (error) {
    console.error('Error saving file data:', error)
  }
}

// Save file URL instead of file object
export const saveFileUrl = (key, url, metadata = {}) => {
  try {
    const fileData = {
      url: url,
      name: metadata.name || 'uploaded-file',
      size: metadata.size || 0,
      type: metadata.type || 'application/octet-stream',
      uploaded: true
    }
    const existingData = getFormData()
    // Navigate to nested key (e.g., "personalDetails.idPhoto" -> existingData.personalDetails.idPhoto)
    const keys = key.split('.')
    let current = existingData
    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) {
        current[keys[i]] = {}
      }
      current = current[keys[i]]
    }
    current[keys[keys.length - 1]] = fileData
    saveFormData(existingData)
  } catch (error) {
    console.error('Error saving file URL:', error)
  }
}

