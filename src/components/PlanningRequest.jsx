import React, { useState } from 'react'
import './PlanningRequest.css'
import ProfessionalsSelection from './ProfessionalsSelection'

const PlanningRequest = ({ selectedPlan, onBack }) => {
  const [currentStep, setCurrentStep] = useState(1)
  const [showProfessionals, setShowProfessionals] = useState(false)
  const [formData, setFormData] = useState({
    // שלב 1
    idNumber: '',
    idAttachment: null,
    fullName: '',
    requestorType: '',
    contactMethods: [],
    propertyRights: '',
    requestNumber: '',
    
    // שלב 2
    gush: '',
    helka: '',
    alternativeIdentification: '',
    plotArea: '',
    isIsraelLandAuthority: false,
    
    // שלב 3
    requestType: 'בית חדש',
    constructionType: '',
    propertyFeatures: [],
    length: '',
    width: '',
    
    // שלב 4
    propertyUsage: '',
    situationMap: null,
    plotPhoto: null
  })

  const [errors, setErrors] = useState({})

  const requestorTypes = ['פרטי', 'תאגיד', 'חברה בע"מ', 'רשות מקומית']
  const constructionTypes = ['בנייה חדשה', 'הריסה', 'תיקונים', 'אחר']
  const propertyFeaturesOptions = ['חניה מקורה', 'פאנלים סולאריים', 'מעלית', 'מרפסת', 'גינה', 'בריכה', 'מחסן', 'חדר כושר']
  const contactMethodsOptions = ['אימייל', 'טלפון']

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleFileChange = (e) => {
    const { name } = e.target
    const file = e.target.files[0]
    if (file) {
      setFormData(prev => ({
        ...prev,
        [name]: file
      }))
      if (errors[name]) {
        setErrors(prev => ({
          ...prev,
          [name]: ''
        }))
      }
    }
  }

  const handleFeatureToggle = (feature) => {
    setFormData(prev => ({
      ...prev,
      propertyFeatures: prev.propertyFeatures.includes(feature)
        ? prev.propertyFeatures.filter(f => f !== feature)
        : [...prev.propertyFeatures, feature]
    }))
  }

  const handleContactMethodToggle = (method) => {
    setFormData(prev => ({
      ...prev,
      contactMethods: prev.contactMethods.includes(method)
        ? prev.contactMethods.filter(m => m !== method)
        : [...prev.contactMethods, method]
    }))
    if (errors.contactMethods) {
      setErrors(prev => ({
        ...prev,
        contactMethods: ''
      }))
    }
  }

  const validateStep = (step) => {
    const newErrors = {}
    
    if (step === 1) {
      if (!formData.idNumber.trim()) newErrors.idNumber = 'נא להזין תז'
      if (!formData.fullName.trim()) newErrors.fullName = 'נא להזין שם מלא'
      if (!formData.requestorType) newErrors.requestorType = 'נא לבחור סוג מבקש'
      if (formData.contactMethods.length === 0) newErrors.contactMethods = 'נא לבחור דרכי התקשרות'
      if (!formData.propertyRights.trim()) newErrors.propertyRights = 'נא להזין זכות לזכות המקרקעין'
    }
    
    if (step === 2) {
      if (!formData.gush.trim()) newErrors.gush = 'נא להזין גוש'
      if (!formData.helka.trim()) newErrors.helka = 'נא להזין חלקה'
      if (!formData.plotArea.trim()) newErrors.plotArea = 'נא להזין שטח מגרש'
    }
    
    if (step === 3) {
      if (!formData.constructionType) newErrors.constructionType = 'נא לבחור סוג בנייה'
    }
    
    if (step === 4) {
      if (!formData.propertyUsage.trim()) newErrors.propertyUsage = 'נא להזין שימוש לנכס'
      if (!formData.situationMap) newErrors.situationMap = 'נא להעלות מפה מצבית'
      if (!formData.plotPhoto) newErrors.plotPhoto = 'נא להעלות צילום מגרש'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 5) {
        setCurrentStep(currentStep + 1)
      }
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = () => {
    if (validateStep(5)) {
      console.log('Form submitted:', { ...formData, selectedPlan })
      alert('הבקשה נשלחה בהצלחה!')
    }
  }

  const renderStep1 = () => (
    <div className="step-content">
      <h2 className="step-title">שלב 1: בעלי עניין</h2>
      
      <div className="form-group">
        <label className="form-label">
          תז ונספח של מבקש הבקשה <span className="required">*</span>
        </label>
        <div className="file-upload-row">
          <input
            type="text"
            name="idNumber"
            value={formData.idNumber}
            onChange={handleInputChange}
            className={`form-input ${errors.idNumber ? 'error' : ''}`}
            placeholder="הזן תז"
            style={{ flex: 1, color: '#2C3E50', backgroundColor: 'white' }}
          />
          <label className="file-upload-button">
            <input
              type="file"
              name="idAttachment"
              onChange={handleFileChange}
              accept=".pdf,.jpg,.jpeg,.png"
              style={{ display: 'none' }}
            />
            <span>העלה נספח</span>
          </label>
        </div>
        {errors.idNumber && <span className="error-message">{errors.idNumber}</span>}
      </div>

      <div className="form-group">
        <label className="form-label">
          שם מלא <span className="required">*</span>
        </label>
        <input
          type="text"
          name="fullName"
          value={formData.fullName}
          onChange={handleInputChange}
          className={`form-input ${errors.fullName ? 'error' : ''}`}
          placeholder="הזן שם מלא"
          style={{ color: '#2C3E50', backgroundColor: 'white' }}
        />
        {errors.fullName && <span className="error-message">{errors.fullName}</span>}
      </div>

      <div className="form-group">
        <label className="form-label">
          סוג מבקש <span className="required">*</span>
        </label>
        <select
          name="requestorType"
          value={formData.requestorType}
          onChange={handleInputChange}
          className={`form-select ${errors.requestorType ? 'error' : ''}`}
          style={{ color: '#2C3E50', backgroundColor: 'white' }}
        >
          <option value="">בחר סוג מבקש</option>
          {requestorTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
        {errors.requestorType && <span className="error-message">{errors.requestorType}</span>}
      </div>

      <div className="form-group">
        <label className="form-label">
          דרכי התקשרות <span className="required">*</span>
        </label>
        <div className={`features-grid ${errors.contactMethods ? 'error' : ''}`}>
          {contactMethodsOptions.map(method => (
            <label key={method} className="feature-checkbox">
              <input
                type="checkbox"
                checked={formData.contactMethods.includes(method)}
                onChange={() => handleContactMethodToggle(method)}
              />
              <span>{method}</span>
            </label>
          ))}
        </div>
        {errors.contactMethods && <span className="error-message">{errors.contactMethods}</span>}
      </div>

      <div className="form-group">
        <label className="form-label">
          זכות לזכות המקרקעין <span className="required">*</span>
        </label>
        <input
          type="text"
          name="propertyRights"
          value={formData.propertyRights}
          onChange={handleInputChange}
          className={`form-input ${errors.propertyRights ? 'error' : ''}`}
          placeholder="הזן פרטי זכות"
          style={{ color: '#2C3E50', backgroundColor: 'white' }}
        />
        {errors.propertyRights && <span className="error-message">{errors.propertyRights}</span>}
      </div>

      <div className="form-group">
        <label className="form-label">
          מספר בקשה מידע מרשיוי זמין
        </label>
        <input
          type="text"
          name="requestNumber"
          value={formData.requestNumber}
          onChange={handleInputChange}
          className="form-input"
          placeholder="הזן מספר בקשה (אופציונלי)"
          style={{ color: '#2C3E50', backgroundColor: 'white' }}
        />
      </div>
    </div>
  )

  const renderStep2 = () => (
    <div className="step-content">
      <h2 className="step-title">שלב 2: פרטי מקרקעין</h2>
      
      <div className="professionals-link-section">
        <button 
          className="professionals-link-button"
          onClick={() => setShowProfessionals(true)}
        >
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88M13 7C13 9.20914 11.2091 11 9 11C6.79086 11 5 9.20914 5 7C5 4.79086 6.79086 3 9 3C11.2091 3 13 4.79086 13 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          בחירת מודדים
        </button>
      </div>
      
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">
            גוש <span className="required">*</span>
          </label>
          <input
            type="text"
            name="gush"
            value={formData.gush}
            onChange={handleInputChange}
            className={`form-input ${errors.gush ? 'error' : ''}`}
            placeholder="הזן גוש"
            style={{ color: '#2C3E50', backgroundColor: 'white' }}
          />
          {errors.gush && <span className="error-message">{errors.gush}</span>}
        </div>

        <div className="form-group">
          <label className="form-label">
            חלקה <span className="required">*</span>
          </label>
          <input
            type="text"
            name="helka"
            value={formData.helka}
            onChange={handleInputChange}
            className={`form-input ${errors.helka ? 'error' : ''}`}
            placeholder="הזן חלקה"
            style={{ color: '#2C3E50', backgroundColor: 'white' }}
          />
          {errors.helka && <span className="error-message">{errors.helka}</span>}
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">
          שטח מגרש <span className="required">*</span>
        </label>
        <input
          type="text"
          name="plotArea"
          value={formData.plotArea}
          onChange={handleInputChange}
          className={`form-input ${errors.plotArea ? 'error' : ''}`}
          placeholder="הזן שטח במטרים רבועים"
          style={{ color: '#2C3E50', backgroundColor: 'white' }}
        />
        {errors.plotArea && <span className="error-message">{errors.plotArea}</span>}
      </div>
    </div>
  )

  const renderStep3 = () => (
    <div className="step-content">
      <h2 className="step-title">שלב 3: תיאור הבקשה</h2>
      
      <div className="form-group">
        <label className="form-label">
          מהות בקשה
        </label>
        <input
          type="text"
          name="requestType"
          value={`בית חדש${formData.propertyFeatures.length > 0 ? ' + ' + formData.propertyFeatures.join(' + ') : ''}`}
          className="form-input"
          disabled
          style={{ color: '#2C3E50', backgroundColor: 'white' }}
        />
      </div>

      <div className="form-group">
        <label className="form-label">
          סוג בנייה <span className="required">*</span>
        </label>
        <select
          name="constructionType"
          value={formData.constructionType}
          onChange={handleInputChange}
          className={`form-select ${errors.constructionType ? 'error' : ''}`}
          style={{ color: '#2C3E50', backgroundColor: 'white' }}
        >
          <option value="">בחר סוג בנייה</option>
          {constructionTypes.map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
        {errors.constructionType && <span className="error-message">{errors.constructionType}</span>}
      </div>

      <div className="form-group">
        <label className="form-label">
          דברים שהנכס יכלול
        </label>
        <div className="features-grid">
          {propertyFeaturesOptions.map(feature => (
            <label key={feature} className="feature-checkbox">
              <input
                type="checkbox"
                checked={formData.propertyFeatures.includes(feature)}
                onChange={() => handleFeatureToggle(feature)}
              />
              <span>{feature}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  )

  const renderStep4 = () => (
    <div className="step-content">
      <h2 className="step-title">שלב 4: צירוף מסמכים</h2>
      
      <div className="form-group">
        <label className="form-label">
          שימוש לנכס <span className="required">*</span>
        </label>
        <input
          type="text"
          name="propertyUsage"
          value={formData.propertyUsage}
          onChange={handleInputChange}
          className={`form-input ${errors.propertyUsage ? 'error' : ''}`}
          placeholder="הזן שימוש לנכס"
          style={{ color: '#2C3E50', backgroundColor: 'white' }}
        />
        {errors.propertyUsage && <span className="error-message">{errors.propertyUsage}</span>}
      </div>

      <div className="form-group">
        <label className="form-label">
          מפה מצבית <span className="required">*</span>
        </label>
        <label className="file-upload-area">
          <input
            type="file"
            name="situationMap"
            onChange={handleFileChange}
            accept=".pdf,.jpg,.jpeg,.png,.dwg,.dxf"
            style={{ display: 'none' }}
          />
          <div className="file-upload-content">
            {formData.situationMap ? (
              <>
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.89 22 5.99 22H18C19.1 22 20 21.1 20 20V8L14 2ZM18 20H6V4H13V9H18V20Z" fill="currentColor"/>
                </svg>
                <span>{formData.situationMap.name}</span>
              </>
            ) : (
              <>
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.89 22 5.99 22H18C19.1 22 20 21.1 20 20V8L14 2ZM18 20H6V4H13V9H18V20Z" fill="currentColor"/>
                </svg>
                <span>לחץ להעלאת מפה מצבית</span>
              </>
            )}
          </div>
        </label>
        {errors.situationMap && <span className="error-message">{errors.situationMap}</span>}
      </div>

      <div className="form-group">
        <label className="form-label">
          צילום של מגרש/תמונה מתצ"א <span className="required">*</span>
        </label>
        <label className="file-upload-area">
          <input
            type="file"
            name="plotPhoto"
            onChange={handleFileChange}
            accept=".jpg,.jpeg,.png"
            style={{ display: 'none' }}
          />
          <div className="file-upload-content">
            {formData.plotPhoto ? (
              <>
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 19V5C21 3.9 20.1 3 19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19ZM8.5 13.5L11 16.51L14.5 12L19 18H5L8.5 13.5Z" fill="currentColor"/>
                </svg>
                <span>{formData.plotPhoto.name}</span>
              </>
            ) : (
              <>
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 19V5C21 3.9 20.1 3 19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19ZM8.5 13.5L11 16.51L14.5 12L19 18H5L8.5 13.5Z" fill="currentColor"/>
                </svg>
                <span>לחץ להעלאת צילום מגרש/תמונה מתצ"א</span>
              </>
            )}
          </div>
        </label>
        {errors.plotPhoto && <span className="error-message">{errors.plotPhoto}</span>}
      </div>
    </div>
  )

  const renderStep5 = () => (
    <div className="step-content">
      <h2 className="step-title">שלב 5: מידע נוסף ותשלום</h2>
      
      <div className="summary-section">
        <h3>תוכנית נבחרת</h3>
        <div className="summary-item">
          <strong>{selectedPlan?.name}</strong>
          <p>{selectedPlan?.description}</p>
        </div>
      </div>

      <div className="summary-section">
        <h3>פרטי מבקש הבקשה</h3>
        <div className="summary-grid">
          <div className="summary-item">
            <span className="summary-label">תז:</span>
            <span>{formData.idNumber || '-'}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">שם מלא:</span>
            <span>{formData.fullName || '-'}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">סוג מבקש:</span>
            <span>{formData.requestorType || '-'}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">דרכי התקשרות:</span>
            <span>{formData.contactMethods.length > 0 ? formData.contactMethods.join(', ') : '-'}</span>
          </div>
        </div>
      </div>

      <div className="summary-section">
        <h3>פרטי המגרש</h3>
        <div className="summary-grid">
          <div className="summary-item">
            <span className="summary-label">גוש:</span>
            <span>{formData.gush || '-'}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">חלקה:</span>
            <span>{formData.helka || '-'}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">שטח מגרש:</span>
            <span>{formData.plotArea || '-'} מ"ר</span>
          </div>
        </div>
      </div>

      <div className="summary-section">
        <h3>פרטי הבנייה</h3>
        <div className="summary-grid">
          <div className="summary-item">
            <span className="summary-label">סוג בנייה:</span>
            <span>{formData.constructionType || '-'}</span>
          </div>
          <div className="summary-item">
            <span className="summary-label">תכונות:</span>
            <span>{formData.propertyFeatures.length > 0 ? formData.propertyFeatures.join(', ') : '-'}</span>
          </div>
        </div>
      </div>
    </div>
  )

  if (showProfessionals) {
    return (
      <ProfessionalsSelection onBack={() => setShowProfessionals(false)} />
    )
  }

  return (
    <div className="planning-request">
      <div className="request-container">
        <div className="request-header">
          <button onClick={onBack} className="back-button">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            חזרה
          </button>
          <h1 className="request-title">בקשה למידע תכנוני</h1>
          <div className="steps-indicator">
            {[
              { number: 1, label: 'בעלי עניין' },
              { number: 2, label: 'פרטי מקרקעין' },
              { number: 3, label: 'תיאור הבקשה' },
              { number: 4, label: 'צירוף מסמכים' },
              { number: 5, label: 'מידע נוסף ותשלום' }
            ].map(step => (
              <div
                key={step.number}
                className={`step-indicator ${currentStep === step.number ? 'active' : ''} ${currentStep > step.number ? 'completed' : ''}`}
              >
                <span className="step-number">{step.number}</span>
                <span className="step-label">{step.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="request-content">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
          {currentStep === 4 && renderStep4()}
          {currentStep === 5 && renderStep5()}
        </div>

        <div className="request-actions">
          {currentStep > 1 && (
            <button onClick={handlePrevious} className="action-button secondary">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              קודם
            </button>
          )}
          {currentStep < 5 ? (
            <button onClick={handleNext} className="action-button primary">
              הבא
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          ) : (
            <button onClick={handleSubmit} className="action-button primary submit">
              שלח בקשה
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 12V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V12M16 6L12 2M12 2L8 6M12 2V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          )}
        </div>

        <div className="request-footer">
          <a 
            href="https://www.gov.il/he/departments/israel_land_authority/govil-landing-page" 
            target="_blank" 
            rel="noopener noreferrer"
            className="footer-link"
          >
            מקרקעי ישראל - אתר רשמי
          </a>
        </div>
      </div>
    </div>
  )
}

export default PlanningRequest

