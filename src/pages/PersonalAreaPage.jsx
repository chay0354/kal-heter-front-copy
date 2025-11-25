import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { signOut } from '../services/auth'
import userDataService from '../services/userDataService'
import '../components/FormPage.css'
import './PersonalAreaPage.css'

const PersonalAreaPage = () => {
  const navigate = useNavigate()
  const [userData, setUserData] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editedData, setEditedData] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const data = userDataService.getUserData()
    if (data) {
      setUserData(data)
      setEditedData(data)
    }
    setLoading(false)
  }, [])

  const handleEdit = () => {
    setIsEditing(true)
    // Deep clone the user data to avoid reference issues
    setEditedData(JSON.parse(JSON.stringify(userData)))
  }

  const handleCancel = () => {
    setIsEditing(false)
    // Reset edited data to original user data
    setEditedData(JSON.parse(JSON.stringify(userData)))
  }

  const handleSave = () => {
    // Deep clone before saving to ensure we save a clean copy
    const dataToSave = JSON.parse(JSON.stringify(editedData))
    userDataService.saveUserData(dataToSave)
    setUserData(dataToSave)
    setIsEditing(false)
    alert('הנתונים נשמרו בהצלחה!')
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setEditedData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }


  const handleSignOut = () => {
    signOut()
    userDataService.clearUserData()
    navigate('/')
  }

  if (loading) {
    return (
      <div className="form-page">
        <div className="loading-container">
          <p>טוען נתונים...</p>
        </div>
      </div>
    )
  }

  if (!userData) {
    return (
      <div className="form-page">
        <div className="form-container">
          <div className="no-data-message">
            <h2>אין נתונים זמינים</h2>
            <p>עדיין לא מילאת את כל הפרטים</p>
            <button onClick={() => navigate('/dashboard')} className="submit-button">
              התחל תהליך
            </button>
          </div>
        </div>
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
            <h1 className="form-title">איזור אישי</h1>
            <p className="form-subtitle">צפייה ועריכה של הנתונים שלך</p>
          </div>
          <div className="header-actions">
            {!isEditing && (
              <button 
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  handleEdit()
                }} 
                className="edit-button"
                type="button"
              >
                ערוך
              </button>
            )}
            <button 
              className="sign-out-button" 
              onClick={handleSignOut}
              type="button"
            >
              התנתק
            </button>
          </div>
        </div>

        <div className="personal-area-content">
          {/* Property Details Section */}
          <div className="data-section">
            <h2 className="section-title">פרטי הנכס</h2>
            <div className="data-grid">
              <div className="data-item">
                <label>גוש:</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="gush"
                    value={editedData.gush || ''}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                ) : (
                  <span>{userData.gush || '-'}</span>
                )}
              </div>
              <div className="data-item">
                <label>חלקה:</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="helka"
                    value={editedData.helka || ''}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                ) : (
                  <span>{userData.helka || '-'}</span>
                )}
              </div>
              <div className="data-item">
                <label>אזור:</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="region"
                    value={editedData.region || ''}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                ) : (
                  <span>{userData.region || '-'}</span>
                )}
              </div>
              <div className="data-item">
                <label>רשות מקומית:</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="council"
                    value={editedData.council || ''}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                ) : (
                  <span>{userData.council || '-'}</span>
                )}
              </div>
              <div className="data-item">
                <label>רשות מקרקעי ישראל:</label>
                {isEditing ? (
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="isIsraelLandAuthority"
                      checked={editedData.isIsraelLandAuthority || false}
                      onChange={handleInputChange}
                    />
                    <span>רשות מקרקעי ישראל</span>
                  </label>
                ) : (
                  <span>{userData.isIsraelLandAuthority ? 'כן' : 'לא'}</span>
                )}
              </div>
              {userData.surveyMap && (
                <div className="data-item full-width">
                  <label>מפת מדידה:</label>
                  <span>{typeof userData.surveyMap === 'string' ? userData.surveyMap : userData.surveyMap?.name || 'קובץ הועלה'}</span>
                </div>
              )}
            </div>
          </div>

          {/* Planning Request Details */}
          {userData.planningRequest && (
            <>
              <div className="data-section">
                <h2 className="section-title">פרטי מבקש הבקשה</h2>
                <div className="data-grid">
                  <div className="data-item">
                    <label>תז:</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="planningRequest.idNumber"
                        value={editedData.planningRequest?.idNumber || ''}
                        onChange={(e) => setEditedData(prev => ({
                          ...prev,
                          planningRequest: { ...prev.planningRequest, idNumber: e.target.value }
                        }))}
                        className="form-input"
                      />
                    ) : (
                      <span>{userData.planningRequest?.idNumber || '-'}</span>
                    )}
                  </div>
                  <div className="data-item">
                    <label>שם מלא:</label>
                    {isEditing ? (
                      <input
                        type="text"
                        name="planningRequest.fullName"
                        value={editedData.planningRequest?.fullName || ''}
                        onChange={(e) => setEditedData(prev => ({
                          ...prev,
                          planningRequest: { ...prev.planningRequest, fullName: e.target.value }
                        }))}
                        className="form-input"
                      />
                    ) : (
                      <span>{userData.planningRequest?.fullName || '-'}</span>
                    )}
                  </div>
                  <div className="data-item">
                    <label>סוג מבקש:</label>
                    <span>{userData.planningRequest?.requestorType || '-'}</span>
                  </div>
                  <div className="data-item">
                    <label>דרכי התקשרות:</label>
                    <span>{userData.planningRequest?.contactMethods?.join(', ') || '-'}</span>
                  </div>
                  <div className="data-item">
                    <label>זכות לזכות המקרקעין:</label>
                    <span>{userData.planningRequest?.propertyRights || '-'}</span>
                  </div>
                </div>
              </div>

              <div className="data-section">
                <h2 className="section-title">פרטי המגרש</h2>
                <div className="data-grid">
                  <div className="data-item">
                    <label>גוש:</label>
                    <span>{userData.planningRequest?.gush || '-'}</span>
                  </div>
                  <div className="data-item">
                    <label>חלקה:</label>
                    <span>{userData.planningRequest?.helka || '-'}</span>
                  </div>
                  <div className="data-item">
                    <label>שטח מגרש:</label>
                    <span>{userData.planningRequest?.plotArea || '-'} מ"ר</span>
                  </div>
                </div>
              </div>

              <div className="data-section">
                <h2 className="section-title">פרטי הבנייה</h2>
                <div className="data-grid">
                  <div className="data-item">
                    <label>סוג בנייה:</label>
                    <span>{userData.planningRequest?.constructionType || '-'}</span>
                  </div>
                  <div className="data-item">
                    <label>תכונות:</label>
                    <span>{userData.planningRequest?.propertyFeatures?.join(', ') || '-'}</span>
                  </div>
                  <div className="data-item">
                    <label>שימוש לנכס:</label>
                    <span>{userData.planningRequest?.propertyUsage || '-'}</span>
                  </div>
                </div>
              </div>

              {userData.selectedPlan && (
                <div className="data-section">
                  <h2 className="section-title">תוכנית נבחרת</h2>
                  <div className="plan-card">
                    <h3>{userData.selectedPlan.name}</h3>
                    <p>{userData.selectedPlan.description}</p>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Action Buttons */}
          {isEditing && (
            <div className="action-buttons">
              <button onClick={handleSave} className="submit-button">
                שמור שינויים
              </button>
              <button onClick={handleCancel} className="secondary-button">
                ביטול
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PersonalAreaPage

