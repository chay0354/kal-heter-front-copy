import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './ProcessExplanationPage.css'

function ProcessExplanationPage() {
  const navigate = useNavigate()
  const [isChecked, setIsChecked] = useState(false)

  const handleContinue = () => {
    if (isChecked) {
      navigate('/dashboard')
    }
  }

  const handleBack = () => {
    navigate(-1)
  }

  return (
    <div className="process-explanation-page">
      <div className="process-explanation-container">
        <div 
          className="process-explanation-content"
          style={{
            backgroundImage: "url('/eef4e7b9c078d09a23b8f5bf3ffc49e51fb0dee3.png')",
            backgroundPosition: 'center center',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat'
          }}
        >
          <button 
            className="back-button"
            onClick={handleBack}
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
            <span className="back-text">חזרה למסך הקודם</span>
          </button>

          <div className="logo-section">
            <div className="nav-logo-link">
              <span className="nav-logo-text">קל-היתר</span>
              <img className="nav-logo-icon" alt="קל-היתר לוגו" src="https://c.animaapp.com/VuAXsrkU/img/group-10-1@2x.png" />
            </div>
            <p className="auth-subtitle">המערכת שתלווה אתכם צעד אחר צעד עד לקבלת היתר הבנייה בצורה פשוטה, ברורה ונגישה.</p>
          </div>

          <div className="process-explanation-card">
            <h2 className="process-explanation-title">
              הסבר קצר על התהליך לפני שמתחילים
            </h2>
            
            <div className="process-explanation-text">
              <p>Lorem ipsum dolor sit amet consectetur. Dui nunc purus mauris nam pretium risus faucibus at. Vulputate penatibus congue netus ultricies velit et. Sagittis integer eu orci in amet euismod diam dignissim vel. Eget suspendisse quisque lacus hendrerit viverra in. Vitae volutpat ultricies nibh .ornare</p>
              <p>Lorem ipsum dolor sit amet consectetur. Dui nunc purus mauris nam pretium risus faucibus at. Vulputate penatibus congue netus ultricies velit et. Sagittis integer eu orci in amet euismod diam dignissim vel. Eget suspendisse quisque lacus hendrerit viverra in. Vitae volutpat ultricies nibh .ornare</p>
              <p>Lorem ipsum dolor sit amet consectetur. Dui nunc purus mauris nam pretium risus faucibus at. Vulputate penatibus congue netus ultricies velit et. Sagittis integer eu orci in amet euismod diam dignissim vel. Eget suspendisse quisque lacus hendrerit viverra in. Vitae volutpat ultricies nibh .ornare</p>
              <p>Lorem ipsum dolor sit amet consectetur. Dui nunc purus mauris nam pretium risus faucibus at. Vulputate penatibus congue netus ultricies velit et. Sagittis integer eu orci in amet euismod diam dignissim vel. Eget suspendisse quisque lacus hendrerit viverra in. Vitae volutpat ultricies nibh .ornare</p>
            </div>

            <div className="checkbox-container">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={(e) => setIsChecked(e.target.checked)}
                  className="checkbox-input"
                />
                <span className="checkbox-text">
                  <input
                    type="checkbox"
                    id="terms-checkbox"
                    className="terms-checkbox"
                    checked={isChecked}
                    onChange={(e) => setIsChecked(e.target.checked)}
                  />
                  קראתי ואני מאשר/ת את התנאים ואת הנחיות הגשת המסמכים.
                </span>
              </label>
            </div>

            <button 
              type="button"
              className="continue-button"
              onClick={handleContinue}
              disabled={!isChecked}
            >
              בוא נתחיל!
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProcessExplanationPage

