import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import styles from './styles.module.css'
import { saveFormData, getFormData, saveFileData, saveFileUrl } from '../../services/formData'
import { uploadFileImmediately } from '../../services/formSubmission'
import PlusIcon from '../icons/PlusIcon'

const PlanningRequest = ({ selectedPlan, onBack, showFields = true, nextPath, hideSections = false, hideMeasurement = false }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    idNumber: '',
    idPhoto: null,
    additionalRightsHolders: []
  })

  const [propertyData, setPropertyData] = useState({
    council: '',
    city: '',
    street: '',
    propertySize: '',
    lot: '',
    helka: '',
    gush: '',
    photoDate: '',
    propertyPhotos: [],
    plotPhoto: null,
    tabuExtract: null,
    israelLandAuthorityContract: ''
  })

  const [measurementData, setMeasurementData] = useState({
    surveyorName: '',
    measurementDate: '',
    israelMappingNumber: '',
    pdfFile: null,
    dwfFile: null,
    dwgFile: null
  })

  const [errors, setErrors] = useState({})

  // Load form data from localStorage on mount
  useEffect(() => {
    const savedData = getFormData()
    if (savedData.personalDetails) {
      setFormData(savedData.personalDetails)
    }
    if (savedData.propertyDetails) {
      setPropertyData(savedData.propertyDetails)
    }
    if (savedData.measurementDetails) {
      setMeasurementData(savedData.measurementDetails)
    }
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    const updatedData = {
      ...formData,
      [name]: value
    }
    setFormData(updatedData)
    saveFormData({ personalDetails: updatedData })
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleFileChange = async (e) => {
    const { name } = e.target
    const file = e.target.files[0]
    if (file) {
      // Update UI immediately
      const updatedData = {
        ...formData,
        [name]: file
      }
      setFormData(updatedData)

      // Upload file immediately
      try {
        console.log(`[handleFileChange] Uploading ${name} immediately...`)
        const fileUrl = await uploadFileImmediately(file, name === 'idPhoto' ? 'id_photo' : name)

        if (fileUrl) {
          // Store the URL instead of the file object
          saveFileUrl(`personalDetails.${name}`, fileUrl, {
            name: file.name,
            size: file.size,
            type: file.type
          })

          // Update form data with URL object
          const urlData = {
            ...formData,
            [name]: { url: fileUrl, name: file.name, size: file.size, type: file.type, uploaded: true }
          }
          setFormData(urlData)
          saveFormData({ personalDetails: urlData })

          console.log(`[handleFileChange] ✓ File uploaded and URL saved: ${fileUrl}`)
        } else {
          // Fallback: keep file in state but warn
          console.warn(`[handleFileChange] File uploaded but URL not retrieved, keeping file in state`)
          saveFileData(`personalDetails.${name}`, file)
          saveFormData({ personalDetails: updatedData })
        }
      } catch (error) {
        console.error(`[handleFileChange] Error uploading file:`, error)
        // Keep file in state even if upload fails (user can retry later)
        saveFileData(`personalDetails.${name}`, file)
        saveFormData({ personalDetails: updatedData })
      }

      if (errors[name]) {
        setErrors(prev => ({
          ...prev,
          [name]: ''
        }))
      }
    }
  }

  const handleAddRightsHolder = () => {
    setFormData(prev => ({
      ...prev,
      additionalRightsHolders: [...prev.additionalRightsHolders, {
        firstName: '',
        lastName: '',
        idNumber: '',
        idPhoto: null
      }]
    }))
  }

  const handleRemoveRightsHolder = (index) => {
    setFormData(prev => ({
      ...prev,
      additionalRightsHolders: prev.additionalRightsHolders.filter((_, i) => i !== index)
    }))
  }

  const handleRightsHolderChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      additionalRightsHolders: prev.additionalRightsHolders.map((holder, i) =>
        i === index ? { ...holder, [field]: value } : holder
      )
    }))
  }

  const handleRightsHolderFileChange = async (index, file) => {
    if (!file) return

    // Update UI immediately
    const updatedData = {
      ...formData,
      additionalRightsHolders: formData.additionalRightsHolders.map((holder, i) =>
        i === index ? { ...holder, idPhoto: file } : holder
      )
    }
    setFormData(updatedData)

    // Upload file immediately
    try {
      console.log(`[handleRightsHolderFileChange] Uploading rights holder ${index} photo immediately...`)
      const fileUrl = await uploadFileImmediately(file, 'additional_rights_holders_photos')

      if (fileUrl) {
        // Store the URL instead of the file object
        const urlData = {
          ...formData,
          additionalRightsHolders: formData.additionalRightsHolders.map((holder, i) =>
            i === index ? { ...holder, idPhoto: { url: fileUrl, name: file.name, size: file.size, type: file.type, uploaded: true } } : holder
          )
        }
        setFormData(urlData)
        saveFormData({ personalDetails: urlData })

        console.log(`[handleRightsHolderFileChange] ✓ File uploaded and URL saved: ${fileUrl}`)
      } else {
        // Fallback: keep file in state
        saveFormData({ personalDetails: updatedData })
      }
    } catch (error) {
      console.error(`[handleRightsHolderFileChange] Error uploading file:`, error)
      // Keep file in state even if upload fails
      saveFormData({ personalDetails: updatedData })
    }
  }

  const handlePropertyChange = (field, value) => {
    const updatedData = {
      ...propertyData,
      [field]: value
    }
    setPropertyData(updatedData)
    saveFormData({ propertyDetails: updatedData })
  }

  const handleMeasurementChange = (field, value) => {
    const updatedData = {
      ...measurementData,
      [field]: value
    }
    setMeasurementData(updatedData)
    saveFormData({ measurementDetails: updatedData })
  }

  const handlePropertyFileChange = async (field, file) => {
    if (!file) return

    // Update UI immediately
    const updatedData = {
      ...propertyData,
      [field]: file
    }
    setPropertyData(updatedData)

    // Map field names to backend field names
    const fieldMap = {
      'tabuExtract': 'tabu_extract',
      'propertyPhotos': 'property_photos',
      'plotPhoto': 'plot_photo'
    }
    const backendField = fieldMap[field] || field

    // Upload file immediately
    try {
      console.log(`[handlePropertyFileChange] Uploading ${field} immediately...`)
      const fileUrl = await uploadFileImmediately(file, backendField)

      if (fileUrl) {
        // Store the URL instead of the file object
        saveFileUrl(`propertyDetails.${field}`, fileUrl, {
          name: file.name,
          size: file.size,
          type: file.type
        })

        // Update form data with URL object
        const urlData = {
          ...propertyData,
          [field]: { url: fileUrl, name: file.name, size: file.size, type: file.type, uploaded: true }
        }
        setPropertyData(urlData)
        saveFormData({ propertyDetails: urlData })

        console.log(`[handlePropertyFileChange] ✓ File uploaded and URL saved: ${fileUrl}`)
      } else {
        // Fallback: keep file in state
        saveFileData(`propertyDetails.${field}`, file)
        saveFormData({ propertyDetails: updatedData })
      }
    } catch (error) {
      console.error(`[handlePropertyFileChange] Error uploading file:`, error)
      // Keep file in state even if upload fails
      saveFileData(`propertyDetails.${field}`, file)
      saveFormData({ propertyDetails: updatedData })
    }
  }

  const handleMeasurementFileChange = async (field, file) => {
    if (!file) return

    // Update UI immediately
    const updatedData = {
      ...measurementData,
      [field]: file
    }
    setMeasurementData(updatedData)

    // Map field names to backend field names
    const fieldMap = {
      'pdfFile': 'pdf_file',
      'dwfFile': 'dwf_file',
      'dwgFile': 'dwg_file'
    }
    const backendField = fieldMap[field] || field

    // Upload file immediately
    try {
      console.log(`[handleMeasurementFileChange] Uploading ${field} immediately...`)
      const fileUrl = await uploadFileImmediately(file, backendField)

      if (fileUrl) {
        // Store the URL instead of the file object
        saveFileUrl(`measurementDetails.${field}`, fileUrl, {
          name: file.name,
          size: file.size,
          type: file.type
        })

        // Update form data with URL object
        const urlData = {
          ...measurementData,
          [field]: { url: fileUrl, name: file.name, size: file.size, type: file.type, uploaded: true }
        }
        setMeasurementData(urlData)
        saveFormData({ measurementDetails: urlData })

        console.log(`[handleMeasurementFileChange] ✓ File uploaded and URL saved: ${fileUrl}`)
      } else {
        // Fallback: keep file in state
        saveFileData(`measurementDetails.${field}`, file)
        saveFormData({ measurementDetails: updatedData })
      }
    } catch (error) {
      console.error(`[handleMeasurementFileChange] Error uploading file:`, error)
      // Keep file in state even if upload fails
      saveFileData(`measurementDetails.${field}`, file)
      saveFormData({ measurementDetails: updatedData })
    }
  }

  const handleContinue = () => {
    // Validate mandatory fields for step 1 (personal details)
    if (showFields) {
      if (!formData.idPhoto) {
        setErrors(prev => ({ ...prev, idPhoto: 'יש לצרף צילום תעודת זהות' }))
        return
      }
    }

    // Navigate to configured next step
    if (nextPath) {
      navigate(nextPath)
      return
    }
    navigate(showFields ? '/property-details-final' : '/measurement-map')
  }

  const handleBack = () => {
    if (onBack) {
      onBack()
      return
    }

    // Navigate to previous step in form process based on current route
    const currentPath = location.pathname

    // Define the form flow steps
    const formSteps = {
      '/dashboard': null, // First step, no back
      '/property-details-final': '/dashboard',
      '/property-details': '/property-details-final',
      '/home-catalog': '/property-details',
      '/summary': '/home-catalog'
    }

    // Get the previous step for current path
    const previousStep = formSteps[currentPath]

    if (previousStep) {
      navigate(previousStep)
    } else {
      // Fallback: if we're on dashboard or unknown route, go to dashboard
      // Or if we're on a route not in the form flow, use browser history
      if (currentPath === '/dashboard') {
        navigate('/dashboard')
      } else {
        navigate(-1) // Fallback to browser history
      }
    }
  }

  // Steps: 1 personal, 2 measurement, 3 property, 4 dream house, 5 summary
  let activeStep = 1
  if (!showFields && hideSections && !hideMeasurement) {
    activeStep = 2  // Measurement Map
  } else if (!showFields && !hideSections) {
    activeStep = 3  // Property Details
  } else if (!showFields && hideSections && hideMeasurement) {
    activeStep = 4  // Dream Home
  }

  const dreamCards = Array.from({ length: 6 }).map((_, idx) => ({
    id: idx + 1,
    tag: 'קל״צ',
    title: idx === 0 ? 'האחוזה של חיים' : 'שם הדגם',
    desc: 'Lorem ipsum mi diam morbi ut morbi arcu augue sed et cursus elit tristique vestibulum eget sap.',
    spec: [
      { icon: '/icons/Ruler Angular.png', text: '250 מ״ר' },
      { icon: '/icons/car.png', text: '3 חניות' },
      { icon: '/icons/Bed.png', text: '3 חדרי שינה' },
      { icon: '/icons/Server.png', text: '2 מפלסים' }
    ],
    image: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=900&q=80'
  }))

  const handleHouseSelect = (house) => {
    saveFormData({ selectedHouse: house })
    navigate('/summary')
  }
  const steps = [
    { number: 1, label: 'פרטים אישיים' },
    { number: 2, label: 'מפת מדידה' },
    { number: 3, label: 'פרטי הנכס' },
    { number: 4, label: 'בחירת בית חלומות' },
    { number: 5, label: 'סיכום ושליחה' }
  ].map(step => ({
    ...step,
    status: activeStep === step.number ? 'active' : activeStep > step.number ? 'completed' : ''
  }))
  const progressWidth = ((activeStep - 1) / (steps.length - 1)) * 100

  return (
    <div className={styles['personal-details-page']}>
      <div className={styles['personal-details-container']}>
        <div className={styles['personal-details-content']}>
          {/* Header with Logo */}
          <div className={styles['personal-details-header']}>
            <div className={styles['logo-section']}>
              <div className={styles['nav-logo-link']}>
                <span className={styles['nav-logo-text']}>קל-היתר</span>
                <img
                  className={styles['nav-logo-icon']}
                  alt="קל-היתר לוגו"
                  src="https://c.animaapp.com/VuAXsrkU/img/group-10-1@2x.png"
                />
              </div>
            </div>
          </div>

          {/* Main Form Card */}
          <div className={styles['personal-details-card']}>
            {/* Timeline Section at Top */}
            <div className={styles['timeline-section']}>
              <div className={styles['progress-indicator']} style={{ '--progress-width': `${progressWidth}%` }}>
                {steps.map((step, index) => (
                  <div key={step.number} className={`${styles['progress-step']} ${step.status ? styles[step.status] : ''}`}>
                    <div className={`${styles['progress-circle']} ${step.status ? styles[step.status] : ''}`}></div>
                    <span className={styles['progress-label']}>{step.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className={`${styles['personal-details-card-content']} ${hideSections ? styles['measurement-only'] : ''}`}>
              {showFields && (
                <h2 className={styles['form-title']}>פרטים אישיים של בעל נכס</h2>
              )}

          {!showFields && !hideSections && (
            <div className={styles['location-section']}>
              <h2 className={styles['location-title']}>מיקום</h2>
              <div className={styles['location-row']}>
                <div className={styles['location-field']}>
                  <label className={styles['location-label']}>מועצה / עירייה</label>
                  <input
                    className={styles['location-input']}
                    placeholder="הקלד"
                    type="text"
                    value={propertyData.council}
                    onChange={(e) => handlePropertyChange('council', e.target.value)}
                  />
                </div>
                <div className={styles['location-field']}>
                  <label className={styles['location-label']}>עיר / מושב / קיבוץ</label>
                  <input
                    className={styles['location-input']}
                    placeholder="הקלד"
                    type="text"
                    value={propertyData.city}
                    onChange={(e) => handlePropertyChange('city', e.target.value)}
                  />
                </div>
                <div className={styles['location-field']}>
                  <label className={styles['location-label']}>רחוב</label>
                  <input
                    className={styles['location-input']}
                    placeholder="הקלד"
                    type="text"
                    value={propertyData.street}
                    onChange={(e) => handlePropertyChange('street', e.target.value)}
                  />
                  {/* <p className={styles['location-hint']} inline-hint">
                    ניתן לנעוץ כתובת מדויקת <a href="#" className={styles['location-link']}>כאן</a>
                  </p> */}
                </div>
              </div>
              <div className={styles['location-divider']} aria-hidden="true"></div>

              <div className={styles['property-section']}>
                <h2 className={styles['property-title']}>פרטי הנכס</h2>
                <div className={`${styles['property-row']} ${styles['property-row-primary']}`}>
                  <div className={styles['property-field']}>
                    <label className={styles['property-label']}>גוש</label>
                    <input
                      className={styles['property-input']}
                      placeholder="הקלד"
                      type="text"
                      value={propertyData.gush}
                      onChange={(e) => handlePropertyChange('gush', e.target.value)}
                    />
                  </div>
                  <div className={styles['property-field']}>
                    <label className={styles['property-label']}>חלקה</label>
                    <input
                      className={styles['property-input']}
                      placeholder="הקלד"
                      type="text"
                      value={propertyData.helka}
                      onChange={(e) => handlePropertyChange('helka', e.target.value)}
                    />
                  </div>
                  <div className={styles['property-field']}>
                    <label className={styles['property-label']}>מגרש</label>
                    <input
                      className={styles['property-input']}
                      placeholder="הקלד"
                      type="text"
                      value={propertyData.lot}
                      onChange={(e) => handlePropertyChange('lot', e.target.value)}
                    />
                  </div>
                  <div className={styles['property-field']}>
                    <label className={styles['property-label']}>גודל הנכס במ"ר</label>
                    <input
                      className={styles['property-input']}
                      placeholder="הקלד"
                      type="text"
                      value={propertyData.propertySize}
                      onChange={(e) => handlePropertyChange('propertySize', e.target.value)}
                    />
                  </div>
                </div>

                <div className={styles['property-link-row']}>
                  <a href="https://www.gov.il/he/departments/survey_of_israel/govil-landing-page" target="_blank" className={styles['property-link']}>בדיקת מיקום במפ"י</a>
                </div>

                <div className={`${styles['property-row']} ${styles['property-row-secondary']}`}>
                  <div className={styles['property-field']}>
                    <label className={styles['property-label']}>תאריך הצילום</label>
                    <input
                      className={`${styles['property-input']} ${styles['date-input']} ${styles['textarea-styled']}`}
                      type="date"
                      value={propertyData.photoDate}
                      onChange={(e) => handlePropertyChange('photoDate', e.target.value)}
                    />
                  </div>
                  <div className={`${styles['property-field']} ${styles['upload-field']}`}>
                    <label className={styles['property-label']}>צירוף צילום הנכס</label>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => {
                        const files = Array.from(e.target.files)
                        handlePropertyChange('propertyPhotos', files)
                      }}
                      className={styles['hidden-input']}
                      id="property-photos-input"
                    />
                    <label htmlFor="property-photos-input" className={`${styles['property-upload-box']} ${styles['cursor-pointer']}`}>
                      <span className={styles['upload-placeholder']}>
                        {propertyData.propertyPhotos && propertyData.propertyPhotos.length > 0
                          ? `${propertyData.propertyPhotos.length} קבצים נבחרו`
                          : 'צירוף קובץ'}
                      </span>
                      <img className={styles['upload-icon-img']} src="/icons/Paperclip.png" alt="paperclip" />
                    </label>
                    <p className={styles['property-upload-note']}>חובה לצרף לפחות 3 צילומים</p>
                  </div>
                  <div className={`${styles['property-field']} ${styles['upload-field']}`}>
                    <label className={styles['property-label']}>צילום המגרש</label>
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.pdf"
                      onChange={(e) => handlePropertyFileChange('plotPhoto', e.target.files[0])}
                      className={styles['hidden-input']}
                      id="plot-photo-input"
                    />
                    <label htmlFor="plot-photo-input" className={`${styles['property-upload-box']} ${styles['cursor-pointer']}`}>
                      <span className={styles['upload-placeholder']}>
                        {propertyData.plotPhoto ? (propertyData.plotPhoto.name || 'קובץ נבחר') : 'צירוף קובץ'}
                      </span>
                      <img className={styles['upload-icon-img']} src="/icons/Paperclip.png" alt="paperclip" />
                    </label>
                  </div>
                </div>
              </div>

              <div className={styles['location-divider']} aria-hidden="true"></div>

              <div className={styles['registry-section']}>
                <div className={styles['registry-row']}>
                  <div className={`${styles['registry-field']} ${styles.upload}`}>
                    <label className={styles['registry-label']}>נסח טאבו ממשרד המשפטים</label>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handlePropertyFileChange('tabuExtract', e.target.files[0])}
                      className={styles['hidden-input']}
                      id="tabu-extract-input"
                    />
                    <label htmlFor="tabu-extract-input" className={`${styles['registry-upload-box']} ${styles['cursor-pointer']}`}>
                      <img className={styles['registry-upload-icon']} src="/icons/Paperclip.png" alt="paperclip" />
                      <span className={styles['registry-upload-placeholder']}>
                        {propertyData.tabuExtract ? propertyData.tabuExtract.name : 'צירוף קובץ'}
                      </span>
                    </label>
                    <p className={styles['registry-hint']}>
                      ניתן ללחוץ <a href="#" className={styles['registry-link']}>כאן</a> כדי לעבור לאתר ולקבל את נסח
                    </p>
                  </div>
                  <div className={styles['registry-field']}>
                    <label className={styles['registry-label']}>מספר חוזה ברשות מקרקעי ישראל</label>
                    <input
                      className={styles['registry-input']}
                      placeholder="הקלד"
                      type="text"
                      value={propertyData.israelLandAuthorityContract}
                      onChange={(e) => handlePropertyChange('israelLandAuthorityContract', e.target.value)}
                    />
                    <p className={styles['registry-hint']}>
                      ניתן ללחוץ <a href="#" className={styles['registry-link']}>כאן</a> כדי לעבור לאתר ולקבל את מספר החוזה
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Measurement step (fieldless measurement page) */}
          {!showFields && hideSections && !hideMeasurement && (
            <div className={styles['measurement-section']}>
              <h2 className={styles['measurement-title']}>מפת מדידה</h2>
              <div className={styles['measurement-row']}>
                <div className={styles['measurement-field']}>
                  <label className={styles['measurement-label']}>שם המודד</label>
                  <input
                    className={styles['measurement-input']}
                    placeholder="הקלד"
                    type="text"
                    value={measurementData.surveyorName}
                    onChange={(e) => handleMeasurementChange('surveyorName', e.target.value)}
                  />
                </div>
                <div className={styles['measurement-field']}>
                  <label className={styles['measurement-label']}>תאריך מדידה</label>
                  <input
                    className={`${styles['measurement-input']} ${styles['has-icon']} ${styles['textarea-styled']}`}
                    type="date"
                    value={measurementData.measurementDate}
                    onChange={(e) => handleMeasurementChange('measurementDate', e.target.value)}
                  />
                </div>
                <div className={styles['measurement-field']}>
                  <label className={styles['measurement-label']}>מספר מיפוי ישראל</label>
                  <input
                    className={styles['measurement-input']}
                    placeholder="הקלד"
                    type="text"
                    value={measurementData.israelMappingNumber}
                    onChange={(e) => handleMeasurementChange('israelMappingNumber', e.target.value)}
                  />
                </div>
              </div>

              <div className={styles['measurement-upload-grid']}>
                <div className={styles['measurement-upload-card']}>
                  <div className={styles['measurement-upload-header']}>
                    <span className={styles['measurement-info']}>i</span>
                    <span className={styles['measurement-upload-label']}>קובץ PDF</span>
                  </div>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => handleMeasurementFileChange('pdfFile', e.target.files[0])}
                    className={styles['hidden-input']}
                    id="pdf-file-input"
                  />
                  <label htmlFor="pdf-file-input" className={`${styles['measurement-upload-box']} ${styles['cursor-pointer']}`}>
                    <span className={styles['measurement-upload-placeholder']}>
                      {measurementData.pdfFile ? measurementData.pdfFile.name : 'צירוף קובץ'}
                    </span>
                    <img className={styles['measurement-upload-icon']} src="/icons/Paperclip.png" alt="paperclip" />
                  </label>
                </div>

                <div className={styles['measurement-upload-card']}>
                  <div className={styles['measurement-upload-header']}>
                    <span className={styles['measurement-info']}>i</span>
                    <span className={styles['measurement-upload-label']}>קובץ DWF</span>
                  </div>
                  <input
                    type="file"
                    accept=".dwf"
                    onChange={(e) => handleMeasurementFileChange('dwfFile', e.target.files[0])}
                    className={styles['hidden-input']}
                    id="dwf-file-input"
                  />
                  <label htmlFor="dwf-file-input" className={`${styles['measurement-upload-box']} ${styles['cursor-pointer']}`}>
                    <span className={styles['measurement-upload-placeholder']}>
                      {measurementData.dwfFile ? measurementData.dwfFile.name : 'צירוף קובץ'}
                    </span>
                    <img className={styles['measurement-upload-icon']} src="/icons/Paperclip.png" alt="paperclip" />
                  </label>
                </div>

                <div className={styles['measurement-upload-card']}>
                  <div className={styles['measurement-upload-header']}>
                    <span className={styles['measurement-info']}>i</span>
                    <span className={styles['measurement-upload-label']}>קובץ DWG</span>
                  </div>
                  <input
                    type="file"
                    accept=".dwg"
                    onChange={(e) => handleMeasurementFileChange('dwgFile', e.target.files[0])}
                    className={styles['hidden-input']}
                    id="dwg-file-input"
                  />
                  <label htmlFor="dwg-file-input" className={`${styles['measurement-upload-box']} ${styles['cursor-pointer']}`}>
                    <span className={styles['measurement-upload-placeholder']}>
                      {measurementData.dwgFile ? measurementData.dwgFile.name : 'צירוף קובץ'}
                    </span>
                    <img className={styles['measurement-upload-icon']} src="/icons/Paperclip.png" alt="paperclip" />
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Home catalog step (no fields) */}
          {!showFields && hideSections && hideMeasurement && (
            <div className={styles['dream-section']}>
              <div className={styles['dream-header']}>
                <h2 className={styles['dream-title']}>בחירת בית החלומות</h2>
              </div>
              <div className={styles['dream-cards-scroll']}>
                <div className={styles['dream-cards-grid']}>
                  {dreamCards.map(card => (
                    <div
                      key={card.id}
                      className={`${styles['dream-card']} ${styles['cursor-pointer']}`}
                      onClick={() => handleHouseSelect(card)}
                    >
                      <div className={styles['dream-card-image-wrapper']}>
                        <img className={styles['dream-card-image']} src={card.image} alt={card.title} />
                        <div className={styles['dream-card-tag']}>{card.tag}</div>
                      </div>
                      <div className={styles['dream-card-body']}>
                        <h3 className={styles['dream-card-title']}>{card.title}</h3>
                        <p className={styles['dream-card-desc']}>{card.desc}</p>
                        <a
                          className={styles['dream-card-link']}
                          href="#!"
                          onClick={(e) => {
                            e.stopPropagation()
                            // Handle view architectural plans
                          }}
                        >
                          צפייה בתוכניות הארכיטקטוניות
                        </a>
                        <div className={styles['dream-card-specs']}>
                          {card.spec.map((item, i) => (
                            <div key={i} className={styles['dream-card-spec-item']}>
                              <img
                                className={styles['dream-card-spec-icon']}
                                src={item.icon}
                                alt={item.text}
                                onLoad={() => console.log('Icon loaded successfully:', item.icon)}
                                onError={(e) => {
                                  console.error('Failed to load icon:', item.icon);
                                  console.error('Trying alternative path...');
                                  // Try without URL encoding
                                  const altPath = item.icon.replace('%20', ' ');
                                  e.target.src = altPath;
                                }}
                              />
                              <span className={styles['dream-card-spec-text']}>{item.text}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {showFields && (
            <>
              {/* Personal Information - Two Columns */}
              <div className={styles['form-row']}>
                <div className={styles['form-column']}>
                  <div className={styles['form-group']}>
                    <label className={styles['form-label']}>שם פרטי</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className={styles['form-input']}
                      placeholder="הקלד"
                    />
                  </div>
                  <div className={styles['form-group']}>
                    <label className={styles['form-label']}>טלפון</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={styles['form-input']}
                      placeholder="הקלד"
                    />
                  </div>
                </div>

                <div className={styles['form-column']}>
                  <div className={styles['form-group']}>
                    <label className={styles['form-label']}>שם משפחה</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className={styles['form-input']}
                      placeholder="הקלד"
                    />
                  </div>
                  <div className={styles['form-group']}>
                    <label className={styles['form-label']}>אימייל</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={styles['form-input']}
                      placeholder="הקלד"
                    />
                  </div>
                </div>
              </div>

              {/* ID Number and File Upload Row */}
              <div className={styles['form-row']}>
                <div className={styles['form-column']}>
                  <div className={styles['form-group']}>
                    <label className={styles['form-label']}>תעודת זהות</label>
                    <input
                      type="text"
                      name="idNumber"
                      value={formData.idNumber}
                      onChange={handleInputChange}
                      className={styles['form-input']}
                      placeholder="הקלד"
                    />
                  </div>
                </div>

                <div className={styles['form-column']}>
                  <div className={`${styles['form-group']} ${styles['id-photo-upload-group']}`}>
                    <label className={`${styles['form-label']} ${styles['id-photo-label']}`}>צירוף צילום תעודת זהות</label>
                    <input
                      type="file"
                      name="idPhoto"
                      onChange={handleFileChange}
                      accept=".pdf,.jpg,.jpeg,.png"
                      className={styles['hidden-input']}
                      id="idPhoto-input"
                    />
                    <label htmlFor="idPhoto-input" className={`${styles['file-upload-button']} ${styles['id-photo-upload-button']}`}>
                      <span className={styles['file-upload-text']}>צירוף קובץ</span>
                    </label>
                    {formData.idPhoto && (
                      <span className={styles['file-name']}>{formData.idPhoto.name}</span>
                    )}
                    {errors.idPhoto && (
                      <span className={styles['error-message']}>{errors.idPhoto}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Additional Rights Holders Section */}
              <div className={styles['additional-rights-section']}>
                <button
                  type="button"
                  className={styles['add-rights-holder-button']}
                  onClick={handleAddRightsHolder}
                >
                  <PlusIcon />
                  הוספת בעל זכות נוסף בנכס
                </button>

                {formData.additionalRightsHolders.map((holder, index) => (
                  <div key={index} className={styles['rights-holder-form']}>
                    <button
                      type="button"
                      className={styles['remove-rights-holder']}
                      onClick={() => handleRemoveRightsHolder(index)}
                      aria-label="סגירת בעל זכות נוסף"
                    >
                      ✕
                    </button>
                    <h3>בעל זכות נוסף {index + 1}</h3>
                    <div className={styles['form-row']}>
                      <div className={styles['form-column']}>
                        <div className={styles['form-group']}>
                          <label className={styles['form-label']}>שם פרטי</label>
                          <input
                            type="text"
                            value={holder.firstName}
                            onChange={(e) => handleRightsHolderChange(index, 'firstName', e.target.value)}
                            className={styles['form-input']}
                            placeholder="הקלד"
                          />
                        </div>
                        <div className={styles['form-group']}>
                          <label className={styles['form-label']}>תעודת זהות</label>
                          <input
                            type="text"
                            value={holder.idNumber}
                            onChange={(e) => handleRightsHolderChange(index, 'idNumber', e.target.value)}
                            className={styles['form-input']}
                            placeholder="הקלד"
                          />
                        </div>
                      </div>
                      <div className={styles['form-column']}>
                        <div className={styles['form-group']}>
                          <label className={styles['form-label']}>שם משפחה</label>
                          <input
                            type="text"
                            value={holder.lastName}
                            onChange={(e) => handleRightsHolderChange(index, 'lastName', e.target.value)}
                            className={styles['form-input']}
                            placeholder="הקלד"
                          />
                        </div>
                        <div className={styles['form-group']}>
                          <label className={styles['form-label']}>צילום תעודת זהות</label>
                          <input
                            id={`rightsHolder-idPhoto-${index}`}
                            type="file"
                            onChange={(e) => handleRightsHolderFileChange(index, e.target.files[0])}
                            accept=".pdf,.jpg,.jpeg,.png"
                            className={styles['hidden-input']}
                          />
                          <label
                            htmlFor={`rightsHolder-idPhoto-${index}`}
                            className={`${styles['file-upload-button']} ${styles['id-photo-upload-button']}`}
                          >
                            <span className={styles['file-upload-text']}>צירוף קובץ</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Navigation Buttons */}
          <div className={styles['form-actions']}>
            <button
              type="button"
              className={styles['back-button']}
              onClick={handleBack}
            >
              חזרה למסך קודם
            </button>
            <button
              type="button"
              className={styles['continue-button']}
              onClick={handleContinue}
            >
              המשך
            </button>
            <button
              type="button"
              className={styles['link-button']}
              onClick={handleBack}
            >
              חזרה למסך קודם
            </button>
          </div>
            </div>
        </div>
        </div>
      </div>
    </div>
  )
}

export default PlanningRequest
