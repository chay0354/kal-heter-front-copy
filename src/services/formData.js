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

