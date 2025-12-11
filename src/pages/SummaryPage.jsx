import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../components/PlanningRequest.css'
import { getFormData, clearFormData } from '../services/formData'
import { submitForm } from '../services/formSubmission'

const SummaryPage = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({})
  const [confirmed, setConfirmed] = useState(false)

  useEffect(() => {
    const savedData = getFormData()
    setFormData(savedData)
  }, [])

  const steps = [
    { number: 1, label: 'פרטים אישיים' },
    { number: 2, label: 'פרטי הנכס' },
    { number: 3, label: 'מפת מדידה' },
    { number: 4, label: 'בחירת בית חלומות' },
    { number: 5, label: 'סיכום ושליחה' }
  ]

  const personalDetails = formData.personalDetails || {}
  const propertyDetails = formData.propertyDetails || {}
  const measurementDetails = formData.measurementDetails || {}
  const selectedHouse = formData.selectedHouse || {}

  const handleSubmit = async () => {
    if (!confirmed) {
      alert('אנא אשר/י שכל הפרטים נכונים')
      return
    }

    try {
      // Show loading state
      const submitButton = document.querySelector('.submit-button-summary')
      if (submitButton) {
        submitButton.disabled = true
        submitButton.textContent = 'שולח...'
      }

      // Submit form to backend
      await submitForm(formData)
      
      // Clear form data from localStorage after successful submission
      clearFormData()
      
      alert('הבקשה נשלחה בהצלחה!')
      // Navigate to success page or dashboard
      navigate('/dashboard')
    } catch (error) {
      console.error('Error submitting form:', error)
      alert(`שגיאה בשליחת הבקשה: ${error.message}`)
      
      // Re-enable button
      const submitButton = document.querySelector('.submit-button-summary')
      if (submitButton) {
        submitButton.disabled = false
        submitButton.textContent = 'שליחת הבקשה'
      }
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return ''
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('he-IL', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      })
    } catch {
      return dateString
    }
  }

  return (
    <div className="personal-details-page">
      <div className="personal-details-container">
        <div className="personal-details-content">
          {/* Header with Logo */}
          <div className="personal-details-header">
            <button 
              className="back-link"
              onClick={() => navigate(-1)}
              type="button"
            >
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              חזרה למסך הקודם
            </button>
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
              <div className="progress-indicator" style={{ '--progress-width': '100%' }}>
                {steps.map((step) => (
                  <div key={step.number} className={`progress-step completed`}>
                    <div className={`progress-circle completed`}>
                      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <span className="progress-label">{step.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="personal-details-card-content">
              <h2 className="form-title">סיכום ושליחת בקשה</h2>

              {/* Personal Details Section */}
              <div className="summary-section">
                <div className="summary-section-header">
                  <h3 className="summary-section-title">פרטים אישיים בעל הנכס</h3>
                  <button 
                    className="edit-link"
                    onClick={() => navigate('/property-details')}
                    type="button"
                  >
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M18.5 2.5C18.8978 2.10218 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.10218 21.5 2.5C21.8978 2.89782 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.10218 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    עריכת פרטים
                  </button>
                </div>
                <div className="summary-details-grid">
                  <div className="summary-detail-item">
                    <span className="summary-label">שם פרטי:</span>
                    <span className="summary-value">{personalDetails.firstName || '-'}</span>
                  </div>
                  <div className="summary-detail-item">
                    <span className="summary-label">שם משפחה:</span>
                    <span className="summary-value">{personalDetails.lastName || '-'}</span>
                  </div>
                  <div className="summary-detail-item">
                    <span className="summary-label">טלפון:</span>
                    <span className="summary-value">{personalDetails.phone || '-'}</span>
                  </div>
                  <div className="summary-detail-item">
                    <span className="summary-label">מספר תעודת זהות:</span>
                    <span className="summary-value">{personalDetails.idNumber || '-'}</span>
                  </div>
                  <div className="summary-detail-item">
                    <span className="summary-label">צילום תעודת זהות:</span>
                    <span className="summary-value">
                      {personalDetails.idPhoto ? (
                        <span>{personalDetails.idPhoto.name || 'קובץ נבחר'}</span>
                      ) : (
                        <span className="no-file">לא נבחר קובץ</span>
                      )}
                    </span>
                  </div>
                  <div className="summary-detail-item">
                    <span className="summary-label">חוזה רשות מקרקעי ישראל:</span>
                    <span className="summary-value">{propertyDetails.israelLandAuthorityContract || '-'}</span>
                  </div>
                  <div className="summary-detail-item">
                    <span className="summary-label">נסח טאבו:</span>
                    <span className="summary-value">
                      {propertyDetails.tabuExtract ? (
                        <span>{propertyDetails.tabuExtract.name || 'קובץ נבחר'}</span>
                      ) : (
                        <span className="no-file">לא נבחר קובץ</span>
                      )}
                    </span>
                  </div>
                  <div className="summary-detail-item">
                    <span className="summary-label">אימייל:</span>
                    <span className="summary-value">{personalDetails.email || '-'}</span>
                  </div>
                </div>
              </div>

              {/* Property Details Section */}
              <div className="summary-section">
                <div className="summary-section-header">
                  <h3 className="summary-section-title">פרטי הנכס</h3>
                  <button 
                    className="edit-link"
                    onClick={() => navigate('/property-details')}
                    type="button"
                  >
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M18.5 2.5C18.8978 2.10218 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.10218 21.5 2.5C21.8978 2.89782 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.10218 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    עריכת פרטים
                  </button>
                </div>
                <div className="summary-details-grid">
                  <div className="summary-detail-item">
                    <span className="summary-label">עיר / מושב / קיבוץ:</span>
                    <span className="summary-value">{propertyDetails.city || '-'}</span>
                  </div>
                  <div className="summary-detail-item">
                    <span className="summary-label">מועצה / עירייה:</span>
                    <span className="summary-value">{propertyDetails.council || '-'}</span>
                  </div>
                  <div className="summary-detail-item">
                    <span className="summary-label">גוש:</span>
                    <span className="summary-value">{propertyDetails.gush || '-'}</span>
                  </div>
                  <div className="summary-detail-item">
                    <span className="summary-label">חלקה:</span>
                    <span className="summary-value">{propertyDetails.helka || '-'}</span>
                  </div>
                  <div className="summary-detail-item">
                    <span className="summary-label">רחוב:</span>
                    <span className="summary-value">{propertyDetails.street || '-'}</span>
                  </div>
                  <div className="summary-detail-item">
                    <span className="summary-label">גודל נכס:</span>
                    <span className="summary-value">{propertyDetails.propertySize ? `${propertyDetails.propertySize} מ"ר` : '-'}</span>
                  </div>
                  <div className="summary-detail-item">
                    <span className="summary-label">מגרש:</span>
                    <span className="summary-value">{propertyDetails.lot || '-'}</span>
                  </div>
                  <div className="summary-detail-item">
                    <span className="summary-label">צילום נכס:</span>
                    <span className="summary-value">
                      {propertyDetails.propertyPhotos && propertyDetails.propertyPhotos.length > 0 ? (
                        <span>{propertyDetails.propertyPhotos.length} קבצים נבחרו</span>
                      ) : (
                        <span className="no-file">לא נבחרו קבצים</span>
                      )}
                    </span>
                  </div>
                  <div className="summary-detail-item">
                    <span className="summary-label">תאריך צילום:</span>
                    <span className="summary-value">{propertyDetails.photoDate ? formatDate(propertyDetails.photoDate) : '-'}</span>
                  </div>
                </div>
              </div>

              {/* Measurement Map Section */}
              <div className="summary-section">
                <div className="summary-section-header">
                  <h3 className="summary-section-title">מפת מדידה</h3>
                  <button 
                    className="edit-link"
                    onClick={() => navigate('/property-details-final')}
                    type="button"
                  >
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M18.5 2.5C18.8978 2.10218 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.10218 21.5 2.5C21.8978 2.89782 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.10218 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    עריכת פרטים
                  </button>
                </div>
                <div className="summary-details-grid">
                  <div className="summary-detail-item">
                    <span className="summary-label">שם המודד:</span>
                    <span className="summary-value">{measurementDetails.surveyorName || '-'}</span>
                  </div>
                  <div className="summary-detail-item">
                    <span className="summary-label">תאריך מדידה:</span>
                    <span className="summary-value">{measurementDetails.measurementDate ? formatDate(measurementDetails.measurementDate) : '-'}</span>
                  </div>
                  <div className="summary-detail-item">
                    <span className="summary-label">קובץ DWG:</span>
                    <span className="summary-value">
                      {measurementDetails.dwgFile ? (
                        <span>{measurementDetails.dwgFile.name || 'קובץ נבחר'}</span>
                      ) : (
                        <span className="no-file">לא נבחר קובץ</span>
                      )}
                    </span>
                  </div>
                  <div className="summary-detail-item">
                    <span className="summary-label">קובץ DWF:</span>
                    <span className="summary-value">
                      {measurementDetails.dwfFile ? (
                        <span>{measurementDetails.dwfFile.name || 'קובץ נבחר'}</span>
                      ) : (
                        <span className="no-file">לא נבחר קובץ</span>
                      )}
                    </span>
                  </div>
                  <div className="summary-detail-item">
                    <span className="summary-label">קובץ PDF:</span>
                    <span className="summary-value">
                      {measurementDetails.pdfFile ? (
                        <span>{measurementDetails.pdfFile.name || 'קובץ נבחר'}</span>
                      ) : (
                        <span className="no-file">לא נבחר קובץ</span>
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {/* Dream Home Section */}
              <div className="summary-section">
                <div className="summary-section-header">
                  <h3 className="summary-section-title">בית חלומות</h3>
                  <button 
                    className="edit-link"
                    onClick={() => navigate('/home-catalog')}
                    type="button"
                  >
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M18.5 2.5C18.8978 2.10218 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.10218 21.5 2.5C21.8978 2.89782 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.10218 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    עריכת פרטים
                  </button>
                </div>
                {selectedHouse && selectedHouse.id && (
                  <div className="summary-house-card">
                    <img 
                      src={selectedHouse.image || 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=900&q=80'} 
                      alt={selectedHouse.title}
                      className="summary-house-image"
                    />
                    <div className="summary-house-details">
                      <h4 className="summary-house-title">{selectedHouse.title || 'שם הדגם'}</h4>
                      <div className="summary-house-specs">
                        {selectedHouse.spec && selectedHouse.spec.map((item, i) => (
                          <span key={i} className="summary-house-spec">{item}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="form-actions">
                <button 
                  type="button"
                  className="back-button"
                  onClick={() => navigate(-1)}
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

export default SummaryPage

