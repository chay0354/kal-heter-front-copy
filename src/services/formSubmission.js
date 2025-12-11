const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

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

    const response = await fetch(`${API_BASE_URL}/api/form/submit`, {
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

