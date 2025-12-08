import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './PlanningRequest.css'

const PlanningRequest = ({ selectedPlan, onBack }) => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    idNumber: '',
    idPhoto: null,
    tabuExcerpt: null,
    contractNumber: '',
    additionalRightsHolders: []
  })

  const [errors, setErrors] = useState({})

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
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

  const handleRightsHolderChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      additionalRightsHolders: prev.additionalRightsHolders.map((holder, i) => 
        i === index ? { ...holder, [field]: value } : holder
      )
    }))
  }

  const handleRightsHolderFileChange = (index, file) => {
    setFormData(prev => ({
      ...prev,
      additionalRightsHolders: prev.additionalRightsHolders.map((holder, i) => 
        i === index ? { ...holder, idPhoto: file } : holder
      )
    }))
  }

  const handleContinue = () => {
    // Navigate to next step or submit
    console.log('Form data:', formData)
  }

  const handleBack = () => {
    if (onBack) {
      onBack()
    } else {
      navigate(-1)
    }
  }

  const steps = [
    { number: 1, label: 'פרטים אישיים', active: true },
    { number: 2, label: 'פרטי הנכס' },
    { number: 3, label: 'מפת מדידה' },
    { number: 4, label: 'בחירת בית חלומות' },
    { number: 5, label: 'סיכום ושליחה' }
  ]

  return (
    <div className="personal-details-page">
      <div className="personal-details-container">
        <div className="personal-details-content">
          {/* Header with Logo */}
          <div className="personal-details-header">
            <div className="logo-section">
              <div className="nav-logo-link">
                <span className="nav-logo-text">קל-היתר</span>
                <img 
                  className="nav-logo-icon" 
                  alt="קל-היתר לוגו" 
                  src="https://c.animaapp.com/VuAXsrkU/img/group-10-1@2x.png" 
                />
              </div>
            </div>
          </div>

          {/* Main Form Card */}
          <div className="personal-details-card">
            {/* Timeline Section at Top */}
            <div className="timeline-section">
              <div className="progress-indicator">
                {steps.map((step, index) => (
                  <div key={step.number} className={`progress-step ${step.active ? 'active' : ''}`}>
                    <div className={`progress-circle ${step.active ? 'active' : ''}`}></div>
                    <span className="progress-label">{step.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="personal-details-card-content">
              <h2 className="form-title">פרטים אישיים של בעל נכס</h2>

              {/* Personal Information - Two Columns */}
          <div className="form-row">
            <div className="form-column">
              <div className="form-group">
                <label className="form-label">שם פרטי</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="הקלד"
                />
              </div>
              <div className="form-group">
                <label className="form-label">טלפון</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="הקלד"
                />
              </div>
            </div>

            <div className="form-column">
              <div className="form-group">
                <label className="form-label">שם משפחה</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="הקלד"
                />
              </div>
              <div className="form-group">
                <label className="form-label">אימייל</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="הקלד"
                />
              </div>
            </div>
          </div>

          {/* ID Number and File Upload Row */}
          <div className="form-row">
            <div className="form-column">
              <div className="form-group">
                <label className="form-label">תעודת זהות</label>
                <input
                  type="text"
                  name="idNumber"
                  value={formData.idNumber}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="הקלד"
                />
              </div>
            </div>

            <div className="form-column">
              <div className="form-group id-photo-upload-group">
                <label className="form-label id-photo-label">צירוף צילום תעודת זהות</label>
                <input
                  type="file"
                  name="idPhoto"
                  onChange={handleFileChange}
                  accept=".pdf,.jpg,.jpeg,.png"
                  style={{ display: 'none' }}
                  id="idPhoto-input"
                />
                <label htmlFor="idPhoto-input" className="file-upload-button id-photo-upload-button">
                  <span className="file-upload-text">צירוף קובץ</span>
                </label>
                {formData.idPhoto && (
                  <span className="file-name">{formData.idPhoto.name}</span>
                )}
              </div>
            </div>
          </div>

          {/* Additional Rights Holders Section */}
          <div className="additional-rights-section">
            <p className="info-text">
              אם קיים בעל זכויות נוסף בנכס, חובה לצרף את פרטיו ואת מסמכי הזיהוי הרלוונטיים
            </p>
            <button 
              type="button"
              className="add-rights-holder-button"
              onClick={handleAddRightsHolder}
            >
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              הוספת בעל זכות נוסף בנכס
            </button>

            {formData.additionalRightsHolders.map((holder, index) => (
              <div key={index} className="rights-holder-form">
                <h3>בעל זכות נוסף {index + 1}</h3>
                <div className="form-row">
                  <div className="form-column">
                    <div className="form-group">
                      <label className="form-label">שם פרטי</label>
                      <input
                        type="text"
                        value={holder.firstName}
                        onChange={(e) => handleRightsHolderChange(index, 'firstName', e.target.value)}
                        className="form-input"
                        placeholder="הקלד"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">תעודת זהות</label>
                      <input
                        type="text"
                        value={holder.idNumber}
                        onChange={(e) => handleRightsHolderChange(index, 'idNumber', e.target.value)}
                        className="form-input"
                        placeholder="הקלד"
                      />
                    </div>
                  </div>
                  <div className="form-column">
                    <div className="form-group">
                      <label className="form-label">שם משפחה</label>
                      <input
                        type="text"
                        value={holder.lastName}
                        onChange={(e) => handleRightsHolderChange(index, 'lastName', e.target.value)}
                        className="form-input"
                        placeholder="הקלד"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">צילום תעודת זהות</label>
                      <label className="file-upload-label">
                        <input
                          type="file"
                          onChange={(e) => handleRightsHolderFileChange(index, e.target.files[0])}
                          accept=".pdf,.jpg,.jpeg,.png"
                          style={{ display: 'none' }}
                        />
                        <div className="file-upload-button">
                          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          <span>צירוף קובץ</span>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Tabu Excerpt */}
          <div className="form-group">
            <label className="form-label">נסח טאבו ממשרד המשפטים</label>
            <label className="file-upload-label">
              <input
                type="file"
                name="tabuExcerpt"
                onChange={handleFileChange}
                accept=".pdf,.jpg,.jpeg,.png"
                style={{ display: 'none' }}
              />
              <div className="file-upload-button">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>צירוף קובץ</span>
              </div>
              {formData.tabuExcerpt && (
                <span className="file-name">{formData.tabuExcerpt.name}</span>
              )}
            </label>
            <a 
              href="https://www.gov.il/he/departments/justice/govil-landing-page" 
              target="_blank" 
              rel="noopener noreferrer"
              className="info-link"
            >
              ניתן ללחוץ כאן כדי לעבור לאתר ולקבל את הנסח
            </a>
          </div>

          {/* Contract Number */}
          <div className="form-group">
            <label className="form-label">מספר חוזה ברשות מקרקעי ישראל</label>
            <input
              type="text"
              name="contractNumber"
              value={formData.contractNumber}
              onChange={handleInputChange}
              className="form-input"
              placeholder="הקלד"
            />
            <a 
              href="https://www.gov.il/he/departments/israel_land_authority/govil-landing-page" 
              target="_blank" 
              rel="noopener noreferrer"
              className="info-link"
            >
              ניתן ללחוץ כאן כדי לעבור לאתר ולקבל את מספר החוזה
            </a>
          </div>

          {/* Navigation Buttons */}
          <div className="form-actions">
            <button 
              type="button"
              className="back-button"
              onClick={handleBack}
            >
              חזרה למסך קודם
            </button>
            <button 
              type="button"
              className="continue-button"
              onClick={handleContinue}
            >
              המשך
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
