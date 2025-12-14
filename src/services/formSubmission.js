// Normalize API base URL - remove trailing slashes to prevent double slashes
const getApiBaseUrl = () => {
  const url = import.meta.env.VITE_API_BASE_URL || 'https://kal-heter-back.vercel.app';
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

export const saveFormDraft = async (formData) => {
  try {
    const token = localStorage.getItem('access_token')
    if (!token) {
      throw new Error('User not authenticated')
    }

    console.log('[saveFormDraft] Starting draft save with formData:', formData)
    console.log('[saveFormDraft] Files in formData:')
    console.log('  - idPhoto:', formData.personalDetails?.idPhoto ? formData.personalDetails.idPhoto.name : 'None')
    console.log('  - propertyPhotos:', formData.propertyDetails?.propertyPhotos?.length || 0)
    console.log('  - tabuExtract:', formData.propertyDetails?.tabuExtract ? formData.propertyDetails.tabuExtract.name : 'None')
    console.log('  - pdfFile:', formData.measurementDetails?.pdfFile ? formData.measurementDetails.pdfFile.name : 'None')
    console.log('  - dwfFile:', formData.measurementDetails?.dwfFile ? formData.measurementDetails.dwfFile.name : 'None')
    console.log('  - dwgFile:', formData.measurementDetails?.dwgFile ? formData.measurementDetails.dwgFile.name : 'None')

    // Create FormData for multipart/form-data
    const formDataToSend = new FormData()

    // Add JSON data as strings
    formDataToSend.append('personal_details', JSON.stringify(formData.personalDetails || {}))
    formDataToSend.append('property_details', JSON.stringify(formData.propertyDetails || {}))
    formDataToSend.append('measurement_details', JSON.stringify(formData.measurementDetails || {}))
    formDataToSend.append('selected_house', JSON.stringify(formData.selectedHouse || {}))

    // Add files
    let filesCount = 0
    if (formData.personalDetails?.idPhoto) {
      formDataToSend.append('id_photo', formData.personalDetails.idPhoto)
      filesCount++
      console.log('[saveFormDraft] Added id_photo:', formData.personalDetails.idPhoto.name || 'unnamed')
    }

    if (formData.propertyDetails?.propertyPhotos && formData.propertyDetails.propertyPhotos.length > 0) {
      formData.propertyDetails.propertyPhotos.forEach((photo, index) => {
        formDataToSend.append('property_photos', photo)
        filesCount++
        console.log(`[saveFormDraft] Added property_photo ${index}:`, photo.name || 'unnamed')
      })
    }

    if (formData.propertyDetails?.tabuExtract) {
      formDataToSend.append('tabu_extract', formData.propertyDetails.tabuExtract)
      filesCount++
      console.log('[saveFormDraft] Added tabu_extract:', formData.propertyDetails.tabuExtract.name || 'unnamed')
    }

    if (formData.measurementDetails?.pdfFile) {
      formDataToSend.append('pdf_file', formData.measurementDetails.pdfFile)
      filesCount++
      console.log('[saveFormDraft] Added pdf_file:', formData.measurementDetails.pdfFile.name || 'unnamed')
    }

    if (formData.measurementDetails?.dwfFile) {
      formDataToSend.append('dwf_file', formData.measurementDetails.dwfFile)
      filesCount++
      console.log('[saveFormDraft] Added dwf_file:', formData.measurementDetails.dwfFile.name || 'unnamed')
    }

    if (formData.measurementDetails?.dwgFile) {
      formDataToSend.append('dwg_file', formData.measurementDetails.dwgFile)
      filesCount++
      console.log('[saveFormDraft] Added dwg_file:', formData.measurementDetails.dwgFile.name || 'unnamed')
    }

    // Add additional rights holders photos
    if (formData.personalDetails?.additionalRightsHolders) {
      formData.personalDetails.additionalRightsHolders.forEach((holder, index) => {
        if (holder.idPhoto) {
          formDataToSend.append('additional_rights_holders_photos', holder.idPhoto)
          filesCount++
          console.log(`[saveFormDraft] Added additional_rights_holder_photo ${index}:`, holder.idPhoto.name || 'unnamed')
        }
      })
    }
    
    console.log(`[saveFormDraft] Total files added to FormData: ${filesCount}`)

    const response = await fetch(buildApiUrl('/api/form/save-draft'), {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formDataToSend
    })

    if (!response.ok) {
      let errorMessage = 'Failed to save form draft'
      try {
        const errorData = await response.json()
        console.error('Backend error response:', errorData)
        // Handle different error formats
        if (errorData.detail) {
          if (Array.isArray(errorData.detail)) {
            errorMessage = errorData.detail.map(err => err.msg || JSON.stringify(err)).join(', ')
          } else {
            errorMessage = errorData.detail
          }
        } else if (errorData.message) {
          errorMessage = errorData.message
        } else {
          errorMessage = JSON.stringify(errorData)
        }
      } catch (e) {
        const text = await response.text()
        console.error('Error response text:', text)
        errorMessage = text || `HTTP ${response.status}: ${response.statusText}`
      }
      throw new Error(errorMessage)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error saving form draft:', error)
    // Don't throw error - just log it, so the page can still load
    return null
  }
}

export const submitForm = async (formData) => {
  try {
    const token = localStorage.getItem('access_token')
    if (!token) {
      throw new Error('User not authenticated')
    }

    // Create FormData for multipart/form-data
    const formDataToSend = new FormData()

    // Add JSON data as strings
    formDataToSend.append('personal_details', JSON.stringify(formData.personalDetails || {}))
    formDataToSend.append('property_details', JSON.stringify(formData.propertyDetails || {}))
    formDataToSend.append('measurement_details', JSON.stringify(formData.measurementDetails || {}))
    formDataToSend.append('selected_house', JSON.stringify(formData.selectedHouse || {}))

    // Add files
    if (formData.personalDetails?.idPhoto) {
      formDataToSend.append('id_photo', formData.personalDetails.idPhoto)
    }

    if (formData.propertyDetails?.propertyPhotos && formData.propertyDetails.propertyPhotos.length > 0) {
      formData.propertyDetails.propertyPhotos.forEach((photo, index) => {
        formDataToSend.append('property_photos', photo)
      })
    }

    if (formData.propertyDetails?.tabuExtract) {
      formDataToSend.append('tabu_extract', formData.propertyDetails.tabuExtract)
    }

    if (formData.measurementDetails?.pdfFile) {
      formDataToSend.append('pdf_file', formData.measurementDetails.pdfFile)
    }

    if (formData.measurementDetails?.dwfFile) {
      formDataToSend.append('dwf_file', formData.measurementDetails.dwfFile)
    }

    if (formData.measurementDetails?.dwgFile) {
      formDataToSend.append('dwg_file', formData.measurementDetails.dwgFile)
    }

    // Add additional rights holders photos
    if (formData.personalDetails?.additionalRightsHolders) {
      formData.personalDetails.additionalRightsHolders.forEach((holder, index) => {
        if (holder.idPhoto) {
          formDataToSend.append('additional_rights_holders_photos', holder.idPhoto)
        }
      })
    }

    const response = await fetch(buildApiUrl('/api/form/submit'), {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formDataToSend
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.detail || 'Failed to submit form')
    }

    return data
  } catch (error) {
    throw new Error(error.message || 'An error occurred during form submission')
  }
}

