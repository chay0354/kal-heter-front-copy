import React from 'react'
import { useNavigate } from 'react-router-dom'
import './TermsPage.css'

function TermsPage() {
  const navigate = useNavigate()

  return (
    <div className="home-page">
      <div className="home-container">
        <div className="home-content">
          <div className="logo-section">
            <div className="logo-circle">
              <div className="logo-inner">
                <span className="logo-text">קל</span>
              </div>
            </div>
            <h1 className="main-title">תנאי שימוש</h1>
            <div className="title-line"></div>
          </div>

          <div className="terms-modal" style={{ 
            position: 'relative', 
            maxWidth: '900px', 
            margin: '0 auto',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
            borderRadius: '24px',
            overflow: 'hidden'
          }}>
            <div className="terms-modal-header">
              <h2>תנאי שימוש</h2>
              <button 
                className="terms-close-button"
                onClick={() => navigate('/')}
              >
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
            <div className="terms-modal-content">
              <h3>1. כללי</h3>
              <p>
                ברוכים הבאים למערכת קל-היתר. השימוש במערכת זו כפוף לתנאי השימוש המפורטים להלן. 
                על ידי השימוש במערכת, אתה מסכים לתנאים אלה.
              </p>

              <h3>2. שימוש במערכת</h3>
              <p>
                המערכת נועדה לסייע בתהליך קבלת היתרי בנייה. השימוש במערכת הוא על אחריותך הבלעדית, 
                ואתה מתחייב לספק מידע מדויק ונכון.
              </p>

              <h3>3. אחריות</h3>
              <p>
                המערכת מספקת כלים מקצועיים והנחיות, אך אינה מהווה תחליף לייעוץ מקצועי אישי. 
                אין לראות במידע המוצג במערכת כעצה מקצועית מחייבת.
              </p>

              <h3>4. אבטחת מידע</h3>
              <p>
                אנו משתמשים באמצעי אבטחה מתקדמים להגנה על המידע שלך. עם זאת, אין אנו יכולים להבטיח 
                אבטחה מוחלטת מפני חדירות או תקלות טכניות.
              </p>

              <h3>5. שינויים בתנאים</h3>
              <p>
                אנו שומרים לעצמנו את הזכות לשנות את תנאי השימוש מעת לעת. שינויים ייכנסו לתוקף 
                עם פרסומם במערכת.
              </p>

              <h3>6. מגבלות אחריות</h3>
              <p>
                המערכת מסופקת "כפי שהיא" ללא כל אחריות מפורשת או משתמעת. לא נהיה אחראים לכל נזק 
                ישיר או עקיף שייגרם כתוצאה משימוש במערכת.
              </p>

              <h3>7. קניין רוחני</h3>
              <p>
                כל הזכויות במערכת, כולל התוכן, העיצוב והקוד, שמורות לנו. אין להעתיק, לשכפל או 
                להשתמש בתוכן ללא רשות מפורשת.
              </p>

              <h3>8. קשר</h3>
              <p>
                לשאלות או תלונות בנוגע לתנאי השימוש, ניתן ליצור קשר עם צוות התמיכה שלנו.
              </p>
            </div>
            <div className="terms-modal-footer">
              <button 
                className="terms-accept-button"
                onClick={() => navigate('/')}
              >
                חזרה לעמוד הבית
              </button>
            </div>
          </div>
        </div>

        <div className="decorative-elements">
          <div className="circle circle-1"></div>
          <div className="circle circle-2"></div>
          <div className="circle circle-3"></div>
          <div className="triangle triangle-1"></div>
          <div className="triangle triangle-2"></div>
        </div>
      </div>
    </div>
  )
}

export default TermsPage







