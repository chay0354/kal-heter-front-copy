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

// Helper function to check if something is actually a File instance
const isFile = (obj) => {
  if (!obj) return false;
  // Check for File instance
  if (obj instanceof File) return true;
  // Check for Blob (File extends Blob)
  if (obj instanceof Blob) return true;
  // Check constructor name
  if (obj.constructor && obj.constructor.name === 'File') return true;
  // Check for file-like object with required properties
  if (typeof obj === 'object' && obj.name !== undefined && obj.size !== undefined && obj.type !== undefined) {
    // Make sure it's not an empty object or metadata object
    if (Object.keys(obj).length <= 3 && obj.name && obj.size !== undefined) {
      // This might be a metadata object, not a real File
      return false;
    }
    // Check if it has File-like methods
    if (typeof obj.stream === 'function' || typeof obj.arrayBuffer === 'function' || typeof obj.text === 'function') {
      return true;
    }
  }
  return false;
};

// Upload a single file immediately and return the URL
export const uploadFileImmediately = async (file, fileType = 'id_photo') => {
  try {
    const token = localStorage.getItem('access_token')
    if (!token) {
      throw new Error('User not authenticated')
    }

    if (!file || !isFile(file)) {
      throw new Error('Invalid file object')
    }

    console.log(`[uploadFileImmediately] Uploading ${fileType}:`, file.name, 'size:', file.size)

    // Create FormData with minimal data (just the file)
    const formData = new FormData()
    formData.append(fileType, file)
    
    // Add minimal required fields (empty objects are fine for draft)
    formData.append('personal_details', JSON.stringify({}))
    formData.append('property_details', JSON.stringify({}))
    formData.append('measurement_details', JSON.stringify({}))
    formData.append('selected_house', JSON.stringify({}))

    const response = await authenticatedFetch(buildApiUrl('/api/form/save-draft'), {
      method: 'POST',
      body: formData
    })

    if (!response.ok) {
      let errorMessage = 'Failed to upload file'
      try {
        const errorData = await response.json()
        errorMessage = errorData.detail || errorMessage
      } catch (e) {
        errorMessage = `HTTP ${response.status}: ${response.statusText}`
      }
      throw new Error(errorMessage)
    }

    const data = await response.json()
    
    // Wait a moment for the database to sync
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Fetch the submission to get the file URL
    const submissionId = data.id
    try {
      const submissionResponse = await fetch(buildApiUrl(`/api/admin/users/${data.user_id}`), {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (submissionResponse.ok) {
        const userData = await submissionResponse.json()
        const formDraft = userData.form_draft
        
        if (formDraft && formDraft.file_urls) {
          const fileUrls = formDraft.file_urls
          // Try to find the file URL by type
          const fileUrl = fileUrls[fileType] || 
                         fileUrls.id_photo || 
                         fileUrls.pdf_file || 
                         fileUrls.dwf_file || 
                         fileUrls.dwg_file || 
                         fileUrls.tabu_extract ||
                         (fileUrls.property_photos && fileUrls.property_photos[0]) ||
                         (fileUrls.additional_rights_holders_photos && fileUrls.additional_rights_holders_photos[0])
          
          if (fileUrl) {
            console.log(`[uploadFileImmediately] ✓ File uploaded successfully: ${fileUrl}`)
            return fileUrl
          }
        }
      }
    } catch (fetchError) {
      console.warn(`[uploadFileImmediately] Could not fetch submission:`, fetchError)
    }
    
    // Fallback: return null but log success
    console.warn(`[uploadFileImmediately] Could not get file URL from submission, but upload succeeded. Submission ID: ${submissionId}`)
    return null
    
  } catch (error) {
    console.error(`[uploadFileImmediately] Error uploading file:`, error)
    throw error
  }
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

    // Add files - check if they are File instances OR already uploaded URLs
    let filesCount = 0
    const idPhoto = formData.personalDetails?.idPhoto
    if (idPhoto) {
      if (isFile(idPhoto)) {
        // It's a File object - upload it
        formDataToSend.append('id_photo', idPhoto)
        filesCount++
        console.log('[saveFormDraft] ✓ Added id_photo (File):', idPhoto.name || 'unnamed', 'size:', idPhoto.size, 'type:', idPhoto.type)
      } else if (idPhoto.url && idPhoto.uploaded) {
        // It's already uploaded - URL is in personal_details JSON, no need to append file
        console.log('[saveFormDraft] ✓ id_photo already uploaded, URL in personal_details:', idPhoto.url)
      } else {
        console.warn('[saveFormDraft] ✗ Skipping id_photo - not a File instance or uploaded URL:', {
          type: typeof idPhoto,
          isObject: typeof idPhoto === 'object',
          constructor: idPhoto?.constructor?.name,
          keys: idPhoto && typeof idPhoto === 'object' ? Object.keys(idPhoto) : 'N/A',
          value: idPhoto
        })
      }
    } else {
      console.log('[saveFormDraft] No id_photo in formData.personalDetails')
    }

    if (formData.propertyDetails?.propertyPhotos && Array.isArray(formData.propertyDetails.propertyPhotos) && formData.propertyDetails.propertyPhotos.length > 0) {
      formData.propertyDetails.propertyPhotos.forEach((photo, index) => {
        if (isFile(photo)) {
          formDataToSend.append('property_photos', photo)
          filesCount++
          console.log(`[saveFormDraft] Added property_photo ${index}:`, photo.name || 'unnamed')
        } else {
          console.log(`[saveFormDraft] Skipping property_photo ${index} - not a File instance:`, typeof photo, photo)
        }
      })
    }

    if (formData.propertyDetails?.tabuExtract) {
      if (isFile(formData.propertyDetails.tabuExtract)) {
        formDataToSend.append('tabu_extract', formData.propertyDetails.tabuExtract)
        filesCount++
        console.log('[saveFormDraft] ✓ Added tabu_extract (File):', formData.propertyDetails.tabuExtract.name || 'unnamed')
      } else if (formData.propertyDetails.tabuExtract.url && formData.propertyDetails.tabuExtract.uploaded) {
        console.log('[saveFormDraft] ✓ tabu_extract already uploaded, URL in property_details:', formData.propertyDetails.tabuExtract.url)
      } else {
        console.log('[saveFormDraft] ✗ Skipping tabu_extract - not a File instance or uploaded URL:', typeof formData.propertyDetails.tabuExtract, formData.propertyDetails.tabuExtract)
      }
    }

    if (formData.measurementDetails?.pdfFile) {
      if (isFile(formData.measurementDetails.pdfFile)) {
        formDataToSend.append('pdf_file', formData.measurementDetails.pdfFile)
        filesCount++
        console.log('[saveFormDraft] ✓ Added pdf_file (File):', formData.measurementDetails.pdfFile.name || 'unnamed')
      } else if (formData.measurementDetails.pdfFile.url && formData.measurementDetails.pdfFile.uploaded) {
        console.log('[saveFormDraft] ✓ pdf_file already uploaded, URL in measurement_details:', formData.measurementDetails.pdfFile.url)
      } else {
        console.log('[saveFormDraft] ✗ Skipping pdf_file - not a File instance or uploaded URL:', typeof formData.measurementDetails.pdfFile, formData.measurementDetails.pdfFile)
      }
    }

    if (formData.measurementDetails?.dwfFile) {
      if (isFile(formData.measurementDetails.dwfFile)) {
        formDataToSend.append('dwf_file', formData.measurementDetails.dwfFile)
        filesCount++
        console.log('[saveFormDraft] ✓ Added dwf_file (File):', formData.measurementDetails.dwfFile.name || 'unnamed')
      } else if (formData.measurementDetails.dwfFile.url && formData.measurementDetails.dwfFile.uploaded) {
        console.log('[saveFormDraft] ✓ dwf_file already uploaded, URL in measurement_details:', formData.measurementDetails.dwfFile.url)
      } else {
        console.log('[saveFormDraft] ✗ Skipping dwf_file - not a File instance or uploaded URL:', typeof formData.measurementDetails.dwfFile, formData.measurementDetails.dwfFile)
      }
    }

    if (formData.measurementDetails?.dwgFile) {
      if (isFile(formData.measurementDetails.dwgFile)) {
        formDataToSend.append('dwg_file', formData.measurementDetails.dwgFile)
        filesCount++
        console.log('[saveFormDraft] ✓ Added dwg_file (File):', formData.measurementDetails.dwgFile.name || 'unnamed')
      } else if (formData.measurementDetails.dwgFile.url && formData.measurementDetails.dwgFile.uploaded) {
        console.log('[saveFormDraft] ✓ dwg_file already uploaded, URL in measurement_details:', formData.measurementDetails.dwgFile.url)
      } else {
        console.log('[saveFormDraft] ✗ Skipping dwg_file - not a File instance or uploaded URL:', typeof formData.measurementDetails.dwgFile, formData.measurementDetails.dwgFile)
      }
    }

    // Add additional rights holders photos
    if (formData.personalDetails?.additionalRightsHolders) {
      formData.personalDetails.additionalRightsHolders.forEach((holder, index) => {
        if (holder.idPhoto) {
          if (isFile(holder.idPhoto)) {
            formDataToSend.append('additional_rights_holders_photos', holder.idPhoto)
            filesCount++
            console.log(`[saveFormDraft] ✓ Added additional_rights_holder_photo ${index} (File):`, holder.idPhoto.name || 'unnamed')
          } else if (holder.idPhoto.url && holder.idPhoto.uploaded) {
            console.log(`[saveFormDraft] ✓ additional_rights_holder_photo ${index} already uploaded, URL in personal_details:`, holder.idPhoto.url)
          } else {
            console.log(`[saveFormDraft] ✗ Skipping additional_rights_holder_photo ${index} - not a File instance or uploaded URL:`, typeof holder.idPhoto, holder.idPhoto)
          }
        }
      })
    }
    
    console.log(`[saveFormDraft] Total files added to FormData: ${filesCount}`)

    const response = await authenticatedFetch(buildApiUrl('/api/form/save-draft'), {
      method: 'POST',
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

    // Add files - only add if they are actual File instances
    if (formData.personalDetails?.idPhoto && isFile(formData.personalDetails.idPhoto)) {
      formDataToSend.append('id_photo', formData.personalDetails.idPhoto)
    }

    if (formData.propertyDetails?.propertyPhotos && Array.isArray(formData.propertyDetails.propertyPhotos) && formData.propertyDetails.propertyPhotos.length > 0) {
      formData.propertyDetails.propertyPhotos.forEach((photo, index) => {
        if (isFile(photo)) {
          formDataToSend.append('property_photos', photo)
        }
      })
    }

    if (formData.propertyDetails?.tabuExtract && isFile(formData.propertyDetails.tabuExtract)) {
      formDataToSend.append('tabu_extract', formData.propertyDetails.tabuExtract)
    }

    if (formData.measurementDetails?.pdfFile && isFile(formData.measurementDetails.pdfFile)) {
      formDataToSend.append('pdf_file', formData.measurementDetails.pdfFile)
    }

    if (formData.measurementDetails?.dwfFile && isFile(formData.measurementDetails.dwfFile)) {
      formDataToSend.append('dwf_file', formData.measurementDetails.dwfFile)
    }

    if (formData.measurementDetails?.dwgFile && isFile(formData.measurementDetails.dwgFile)) {
      formDataToSend.append('dwg_file', formData.measurementDetails.dwgFile)
    }

    // Add additional rights holders photos
    if (formData.personalDetails?.additionalRightsHolders) {
      formData.personalDetails.additionalRightsHolders.forEach((holder, index) => {
        if (holder.idPhoto && isFile(holder.idPhoto)) {
          formDataToSend.append('additional_rights_holders_photos', holder.idPhoto)
        }
      })
    }

    const response = await authenticatedFetch(buildApiUrl('/api/form/submit'), {
      method: 'POST',
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

