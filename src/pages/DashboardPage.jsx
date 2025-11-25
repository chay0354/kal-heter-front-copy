import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { signOut } from '../services/auth'
import userDataService from '../services/userDataService'
import PlansGallery from '../components/PlansGallery'
import PlanningRequest from '../components/PlanningRequest'
import '../components/FormPage.css'

const DashboardPage = () => {
  const navigate = useNavigate()
  
  // Check if user has completed all data on mount
  useEffect(() => {
    const checkCompletion = async () => {
      const isCompleted = await userDataService.isCompleted()
      if (isCompleted) {
        navigate('/personal-area')
      } else {
        // Load existing data if available
        const savedData = await userDataService.getUserData()
        if (savedData && savedData.gush) {
          setFormData({
            gush: savedData.gush || '',
            helka: savedData.helka || '',
            surveyMap: savedData.surveyMap || null,
            region: savedData.region || '',
            council: savedData.council || '',
            isIsraelLandAuthority: savedData.isIsraelLandAuthority || false
          })
        }
      }
    }
    checkCompletion()
  }, [navigate])

  const [formData, setFormData] = useState({
    gush: '',
    helka: '',
    surveyMap: null,
    region: '',
    council: '',
    isIsraelLandAuthority: false
  })

  const [errors, setErrors] = useState({})
  const [showPlans, setShowPlans] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [showPlanningRequest, setShowPlanningRequest] = useState(false)

  const regions = [
    'צפון',
    'חיפה',
    'מרכז',
    'תל אביב',
    'ירושלים',
    'דרום',
    'יהודה ושומרון'
  ]

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData(prev => ({
        ...prev,
        surveyMap: file
      }))
      if (errors.surveyMap) {
        setErrors(prev => ({
          ...prev,
          surveyMap: ''
        }))
      }
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.gush.trim()) {
      newErrors.gush = 'נא להזין גוש'
    }
    
    if (!formData.helka.trim()) {
      newErrors.helka = 'נא להזין חלקה'
    }
    
    if (!formData.surveyMap) {
      newErrors.surveyMap = 'נא להעלות מפת מדידה'
    }
    
    if (!formData.region) {
      newErrors.region = 'נא לבחור אזור'
    }
    
    if (!formData.council.trim()) {
      newErrors.council = 'נא להזין רשות מקומית'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (validateForm()) {
      // Save form data to database before proceeding
      try {
        await userDataService.saveUserData(formData)
        setShowPlans(true)
      } catch (error) {
        console.error('Error saving form data:', error)
        alert('שגיאה בשמירת הנתונים. נסה שוב.')
      }
    }
  }

  const handleBackFromPlans = () => {
    setShowPlans(false)
  }

  const handleSelectPlan = async (plan) => {
    // Save form data with selected plan before proceeding
    const dataToSave = {
      ...formData,
      selectedPlan: plan
    }
    try {
      await userDataService.saveUserData(dataToSave)
      setSelectedPlan(plan)
      setShowPlans(false)
      setShowPlanningRequest(true)
    } catch (error) {
      console.error('Error saving plan selection:', error)
      alert('שגיאה בשמירת הנתונים. נסה שוב.')
    }
  }

  const handleBackFromPlanningRequest = () => {
    setShowPlanningRequest(false)
    setSelectedPlan(null)
  }

  const handleSignOut = () => {
    signOut()
    userDataService.clearUserData()
    navigate('/')
  }

  if (showPlanningRequest) {
    return (
      <div className="form-page">
        <div className="background-elements">
          <div className="bg-shape bg-shape-1"></div>
          <div className="bg-shape bg-shape-2"></div>
          <div className="bg-shape bg-shape-3"></div>
          <div className="bg-shape bg-shape-4"></div>
        </div>
        <PlanningRequest 
          selectedPlan={selectedPlan} 
          onBack={handleBackFromPlanningRequest}
        />
      </div>
    )
  }

  if (showPlans) {
    return (
      <div className="form-page">
        <div className="background-elements">
          <div className="bg-shape bg-shape-1"></div>
          <div className="bg-shape bg-shape-2"></div>
          <div className="bg-shape bg-shape-3"></div>
          <div className="bg-shape bg-shape-4"></div>
        </div>
        <PlansGallery onBack={handleBackFromPlans} onSelectPlan={handleSelectPlan} />
      </div>
    )
  }

  return (
    <div className="form-page">
      <div className="background-elements">
        <div className="bg-shape bg-shape-1"></div>
        <div className="bg-shape bg-shape-2"></div>
        <div className="bg-shape bg-shape-3"></div>
        <div className="bg-shape bg-shape-4"></div>
      </div>
      <div className="form-container">
        <div className="form-header">
          <div className="logo-section">
            <div className="logo-icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 21H21V19H3V21ZM5 17H19L18 15H6L5 17ZM6 13H18L17 11H7L6 13ZM7 9H17L16 7H8L7 9ZM8 5H16L15 3H9L8 5Z" fill="currentColor"/>
              </svg>
            </div>
            <h1 className="form-title">קל-היתר</h1>
            <p className="form-subtitle">מערכת להיתרי בנייה</p>
          </div>
          <button className="sign-out-button" onClick={handleSignOut}>
            התנתק
          </button>
        </div>

        <form onSubmit={handleSubmit} className="form-content">
          <div className="form-section">
            <h2 className="section-title">פרטי הנכס</h2>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="gush" className="form-label">
                  גוש <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="gush"
                  name="gush"
                  value={formData.gush}
                  onChange={handleInputChange}
                  className={`form-input ${errors.gush ? 'error' : ''}`}
                  placeholder="הזן מספר גוש"
                />
                {errors.gush && <span className="error-message">{errors.gush}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="helka" className="form-label">
                  חלקה <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="helka"
                  name="helka"
                  value={formData.helka}
                  onChange={handleInputChange}
                  className={`form-input ${errors.helka ? 'error' : ''}`}
                  placeholder="הזן מספר חלקה"
                />
                {errors.helka && <span className="error-message">{errors.helka}</span>}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="surveyMap" className="form-label">
                מפת מדידה <span className="required">*</span>
              </label>
              <div className="file-upload-container">
                <input
                  type="file"
                  id="surveyMap"
                  name="surveyMap"
                  accept=".pdf,.jpg,.jpeg,.png,.dwg,.dxf"
                  onChange={handleFileChange}
                  className="file-input"
                />
                <label htmlFor="surveyMap" className={`file-label ${errors.surveyMap ? 'error' : ''} ${formData.surveyMap ? 'has-file' : ''}`}>
                  <div className="file-icon">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.89 22 5.99 22H18C19.1 22 20 21.1 20 20V8L14 2ZM18 20H6V4H13V9H18V20Z" fill="currentColor"/>
                    </svg>
                  </div>
                  {formData.surveyMap ? (
                    <div className="file-info">
                      <span className="file-name">{formData.surveyMap.name}</span>
                      <span className="file-size">{(formData.surveyMap.size / 1024).toFixed(2)} KB</span>
                    </div>
                  ) : (
                    <div className="file-info">
                      <span className="file-placeholder">לחץ לבחירת קובץ או גרור לכאן</span>
                      <span className="file-hint">PDF, JPG, PNG, DWG, DXF</span>
                    </div>
                  )}
                </label>
              </div>
              {errors.surveyMap && <span className="error-message">{errors.surveyMap}</span>}
            </div>
          </div>

          <div className="form-section">
            <h2 className="section-title">מיקום</h2>
            
            <div className="form-group">
              <label htmlFor="region" className="form-label">
                אזור <span className="required">*</span>
              </label>
              <select
                id="region"
                name="region"
                value={formData.region}
                onChange={handleInputChange}
                className={`form-select ${errors.region ? 'error' : ''}`}
              >
                <option value="">בחר אזור</option>
                {regions.map(region => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>
              {errors.region && <span className="error-message">{errors.region}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="council" className="form-label">
                רשות מקומית <span className="required">*</span>
              </label>
              <input
                type="text"
                id="council"
                name="council"
                value={formData.council}
                onChange={handleInputChange}
                className={`form-input ${errors.council ? 'error' : ''}`}
                placeholder="הזן שם רשות מקומית"
              />
              {errors.council && <span className="error-message">{errors.council}</span>}
            </div>

            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="isIsraelLandAuthority"
                  checked={formData.isIsraelLandAuthority}
                  onChange={handleInputChange}
                />
                <span>רשות מקרקעי ישראל</span>
              </label>
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="submit-button">
              <span>המשך לבחירת תוכנית</span>
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default DashboardPage

