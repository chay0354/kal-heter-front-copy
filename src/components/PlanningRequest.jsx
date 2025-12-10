import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './PlanningRequest.css'

const PlanningRequest = ({ selectedPlan, onBack, showFields = true, nextPath, hideSections = false, hideMeasurement = false }) => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    idNumber: '',
    idPhoto: null,
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

  const handleRightsHolderFileChange = (index, file) => {
    setFormData(prev => ({
      ...prev,
      additionalRightsHolders: prev.additionalRightsHolders.map((holder, i) => 
        i === index ? { ...holder, idPhoto: file } : holder
      )
    }))
  }

  const handleContinue = () => {
    // Navigate to configured next step
    if (nextPath) {
      navigate(nextPath)
      return
    }
    navigate(showFields ? '/property-details' : '/measurement-map')
  }

  const handleBack = () => {
    if (onBack) {
      onBack()
    } else {
      navigate(-1)
    }
  }

  // Steps: 1 personal, 2 property, 3 measurement, 4 dream house, 5 summary
  let activeStep = 1
  if (!showFields && !hideSections) {
    activeStep = 2
  } else if (!showFields && hideSections && !hideMeasurement) {
    activeStep = 3
  } else if (!showFields && hideSections && hideMeasurement) {
    activeStep = 4
  }

  const dreamCards = Array.from({ length: 6 }).map((_, idx) => ({
    id: idx + 1,
    tag: 'קל״צ',
    title: 'שם הדגם',
    desc: 'Lorem ipsum mi diam morbi ut morbi arcu augue sed et cursus elit tristique vestibulum eget sap.',
    spec: ['250 מ״ר', 'חניה 3', 'חדרי שינה 3', '2 מפלסים'],
    image: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=900&q=80'
  }))
  const steps = [
    { number: 1, label: 'פרטים אישיים' },
    { number: 2, label: 'פרטי הנכס' },
    { number: 3, label: 'מפת מדידה' },
    { number: 4, label: 'בחירת בית חלומות' },
    { number: 5, label: 'סיכום ושליחה' }
  ].map(step => ({
    ...step,
    status: activeStep === step.number ? 'active' : activeStep > step.number ? 'completed' : ''
  }))
  const progressWidth = ((activeStep - 1) / (steps.length - 1)) * 100

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
              <div className="progress-indicator" style={{ '--progress-width': `${progressWidth}%` }}>
                {steps.map((step, index) => (
                  <div key={step.number} className={`progress-step ${step.status}`}>
                    <div className={`progress-circle ${step.status}`}></div>
                    <span className="progress-label">{step.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className={`personal-details-card-content ${hideSections ? 'measurement-only' : ''}`}>
              {showFields && (
                <h2 className="form-title">פרטים אישיים של בעל נכס</h2>
              )}

          {!showFields && !hideSections && (
            <div className="location-section">
              <h2 className="location-title">מיקום</h2>
              <div className="location-row">
                <div className="location-field">
                  <label className="location-label">מועצה / עירייה</label>
                  <input className="location-input" placeholder="הקלד" type="text" />
                </div>
                <div className="location-field">
                  <label className="location-label">עיר / מושב / קיבוץ</label>
                  <input className="location-input" placeholder="הקלד" type="text" />
                </div>
                <div className="location-field">
                  <label className="location-label">רחוב</label>
                  <input className="location-input" placeholder="הקלד" type="text" />
                  <p className="location-hint inline-hint">
                    ניתן לנעוץ כתובת מדויקת <a href="#" className="location-link">כאן</a>
                  </p>
                </div>
              </div>
              <div className="location-divider" aria-hidden="true"></div>

              <div className="property-section">
                <h2 className="property-title">פרטי הנכס</h2>
                <div className="property-row">
                  <div className="property-field">
                    <label className="property-label">גודל הנכס במ"ר</label>
                    <input className="property-input" placeholder="הקלד" type="text" />
                  </div>
                  <div className="property-field">
                    <label className="property-label">מגרש</label>
                    <input className="property-input" placeholder="הקלד" type="text" />
                  </div>
                  <div className="property-field">
                    <label className="property-label">חלקה</label>
                    <input className="property-input" placeholder="הקלד" type="text" />
                  </div>
                  <div className="property-field">
                    <label className="property-label">גוש</label>
                    <input className="property-input" placeholder="הקלד" type="text" />
                  </div>
                </div>

                <div className="property-link-row">
                  <a href="#" className="property-link">בדיקת מיקום במפ"י</a>
                </div>

                <div className="property-row property-row-secondary">
                  <div className="property-field">
                    <label className="property-label">תאריך הצילום</label>
                    <div className="property-input date-input">
                      <span className="date-placeholder">בחר תאריך</span>
                      <img className="date-icon-img" src="/icons/Calendar.png" alt="calendar" />
                    </div>
                  </div>
                  <div className="property-field upload-field">
                    <label className="property-label">צירוף צילום הנכס</label>
                    <div className="property-upload-box">
                      <span className="upload-placeholder">צירוף קובץ</span>
                      <img className="upload-icon-img" src="/icons/Paperclip.png" alt="paperclip" />
                    </div>
                    <p className="property-upload-note">חובה לצרף לפחות 3 צילומים</p>
                  </div>
                </div>
              </div>

              <div className="location-divider" aria-hidden="true"></div>

              <div className="registry-section">
                <div className="registry-row">
                  <div className="registry-field upload">
                    <label className="registry-label">נסח טאבו ממשרד המשפטים</label>
                    <div className="registry-upload-box">
                      <img className="registry-upload-icon" src="/icons/Paperclip.png" alt="paperclip" />
                      <span className="registry-upload-placeholder">צירוף קובץ</span>
                    </div>
                    <p className="registry-hint">
                      ניתן ללחוץ <a href="#" className="registry-link">כאן</a> כדי לעבור לאתר ולקבל את נסח
                    </p>
                  </div>
                  <div className="registry-field">
                    <label className="registry-label">מספר חוזה ברשות מקרקעי ישראל</label>
                    <input className="registry-input" placeholder="הקלד" type="text" />
                    <p className="registry-hint">
                      ניתן ללחוץ <a href="#" className="registry-link">כאן</a> כדי לעבור לאתר ולקבל את מספר החוזה
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Measurement step (fieldless measurement page) */}
          {!showFields && hideSections && !hideMeasurement && (
            <div className="measurement-section">
              <h2 className="measurement-title">מפת מדידה</h2>
              <div className="measurement-row">
                <div className="measurement-field">
                  <label className="measurement-label">שם המודד</label>
                  <input className="measurement-input" placeholder="הקלד" type="text" />
                </div>
                <div className="measurement-field">
                  <label className="measurement-label">תאריך מדידה</label>
                  <div className="measurement-input has-icon">
                    <span className="measurement-placeholder">בחר תאריך</span>
                    <img className="measurement-icon" src="/icons/Calendar.png" alt="calendar" />
                  </div>
                </div>
              </div>

              <div className="measurement-upload-grid">
                <div className="measurement-upload-card">
                  <div className="measurement-upload-header">
                    <span className="measurement-info">i</span>
                    <span className="measurement-upload-label">קובץ PDF</span>
                  </div>
                  <div className="measurement-upload-box">
                    <span className="measurement-upload-placeholder">צירוף קובץ</span>
                    <img className="measurement-upload-icon" src="/icons/Paperclip.png" alt="paperclip" />
                  </div>
                </div>

                <div className="measurement-upload-card">
                  <div className="measurement-upload-header">
                    <span className="measurement-info">i</span>
                    <span className="measurement-upload-label">קובץ DWF</span>
                  </div>
                  <div className="measurement-upload-box">
                    <span className="measurement-upload-placeholder">צירוף קובץ</span>
                    <img className="measurement-upload-icon" src="/icons/Paperclip.png" alt="paperclip" />
                  </div>
                </div>

                <div className="measurement-upload-card">
                  <div className="measurement-upload-header">
                    <span className="measurement-info">i</span>
                    <span className="measurement-upload-label">קובץ DWG</span>
                  </div>
                  <div className="measurement-upload-box">
                    <span className="measurement-upload-placeholder">צירוף קובץ</span>
                    <img className="measurement-upload-icon" src="/icons/Paperclip.png" alt="paperclip" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Home catalog step (no fields) */}
          {!showFields && hideSections && hideMeasurement && (
            <div className="dream-section">
              <div className="dream-header">
                <h2 className="dream-title">בחירת בית החלומות</h2>
                <div className="dream-search">
                  <input
                    className="dream-search-input"
                    placeholder="חיפוש לפי קטגוריה / שם דגם"
                    type="text"
                  />
                  <img className="dream-search-icon-img" src="/icons/Buttons.png" alt="search" />
                </div>
              </div>
              <div className="dream-cards-scroll">
                <div className="dream-cards-grid">
                  {dreamCards.map(card => (
                    <div key={card.id} className="dream-card">
                      <div className="dream-card-image-wrapper">
                        <img className="dream-card-image" src={card.image} alt={card.title} />
                        <div className="dream-card-tag">{card.tag}</div>
                      </div>
                      <div className="dream-card-body">
                        <h3 className="dream-card-title">{card.title}</h3>
                        <p className="dream-card-desc">{card.desc}</p>
                        <a className="dream-card-link" href="#!">צפייה בתוכניות הארכיטקטוניות</a>
                        <div className="dream-card-specs">
                          {card.spec.map((item, i) => (
                            <span key={i} className="dream-card-spec">{item}</span>
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
                    <button
                      type="button"
                      className="remove-rights-holder"
                      onClick={() => handleRemoveRightsHolder(index)}
                      aria-label="סגירת בעל זכות נוסף"
                    >
                      ✕
                    </button>
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
                          <input
                            id={`rightsHolder-idPhoto-${index}`}
                            type="file"
                            onChange={(e) => handleRightsHolderFileChange(index, e.target.files[0])}
                            accept=".pdf,.jpg,.jpeg,.png"
                            style={{ display: 'none' }}
                          />
                          <label
                            htmlFor={`rightsHolder-idPhoto-${index}`}
                            className="file-upload-button id-photo-upload-button"
                          >
                            <span className="file-upload-text">צירוף קובץ</span>
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
            <button 
              type="button"
              className="link-button"
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
