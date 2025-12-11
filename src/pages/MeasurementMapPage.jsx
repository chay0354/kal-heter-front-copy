import React from 'react'
import { useNavigate } from 'react-router-dom'
import './MeasurementMapPage.css'

function MeasurementMapPage() {
  const navigate = useNavigate()

  const handleYes = () => {
    // Navigate to process explanation page
    navigate('/process-explanation')
  }

  const handleNo = () => {
    navigate('/surveyors-list')
  }

  return (
    <div className="measurement-map-page">
      <div className="measurement-map-container">
        <div 
          className="measurement-map-content"
          style={{
            backgroundImage: "url('/eef4e7b9c078d09a23b8f5bf3ffc49e51fb0dee3.png')",
            backgroundPosition: 'center center',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat'
          }}
        >
          <button 
            className="back-to-home-button"
            onClick={() => navigate('/')}
            type="button"
          >
            <svg 
              className="back-arrow-icon" 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                d="M15 18L9 12L15 6" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
            <span className="back-to-home-text">חזרה למסך הבית</span>
          </button>

          <div className="logo-section">
            <div className="nav-logo-link">
              <span className="nav-logo-text">קל-היתר</span>
              <img className="nav-logo-icon" alt="קל-היתר לוגו" src="https://c.animaapp.com/VuAXsrkU/img/group-10-1@2x.png" />
            </div>
            <p className="auth-subtitle">המערכת שתלווה אתכם צעד אחר צעד עד לקבלת היתר הבנייה בצורה פשוטה, ברורה ונגישה.</p>
          </div>

          <div className="measurement-map-card">
            <h2 className="measurement-map-question">
              האם יש ברשותך מפת מדידה מחצי שנה אחרונה?
            </h2>
            <p className="measurement-map-explanation">
              מפת מדידה עדכנית היא מסמך חובה לצורך פתיחת בקשה למידע תכנוני. אם אין לכם - ניתן לקבל דרך מודד מוסמך.
            </p>
            <div className="measurement-map-buttons">
              <button 
                type="button"
                className="measurement-map-button measurement-map-button-no"
                onClick={handleNo}
              >
                לא, אני צריך מפת מדידה
              </button>
              <button 
                type="button"
                className="measurement-map-button measurement-map-button-yes"
                onClick={handleYes}
              >
                כן, יש לי מפה תקפה
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MeasurementMapPage

