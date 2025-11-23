import React from 'react'
import { useNavigate } from 'react-router-dom'
import '../components/HomePage.css'

function LandingPage() {
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
            <h1 className="main-title">קל-היתר</h1>
            <div className="title-line"></div>
          </div>

          <div className="auth-buttons-container" style={{ marginTop: '2rem', marginBottom: '2rem' }}>
            <button 
              className="sign-in-button"
              onClick={() => navigate('/auth?mode=signin')}
            >
              חיבור משתמש קיים
            </button>
            <button 
              className="sign-up-button"
              onClick={() => navigate('/auth?mode=signup')}
            >
              כניסת משתמש חדש
            </button>
          </div>

          <div className="description-section">
            <h2 className="subtitle">מערכת ליווי מלא לקבלת היתר בנייה</h2>
            <p className="description">
              מערכת <strong>קל-היתר</strong> נועדה ללוות אותך בכל שלב בתהליך קבלת היתר הבנייה, כמו אדריכל. מהגשת הבקשה למידע תכנוני, בקשה להיתר בנייה, אישור לתחילת עבודה ותעודת גמר (תופס 4).
            </p>
            <p className="description">
              אנו מספקים לך כלים מקצועיים, הנחיות ברורות ותמיכה מלאה לאורך כל הדרך, 
              כדי להפוך את התהליך המורכב לפשוט, מהיר ויעיל.
            </p>
          </div>

          <div className="benefits-section">
            <h2 className="section-title">למה לבחור בקל-היתר?</h2>
            <div className="benefits-grid">
              <div className="benefit-item">
                <div className="benefit-icon">
                  <div className="icon-check"></div>
                </div>
                <h4>חיסכון בזמן</h4>
                <p>תהליך מהיר ויעיל שמקצר את זמן ההמתנה משמעותית</p>
              </div>
              <div className="benefit-item">
                <div className="benefit-icon">
                  <div className="icon-check"></div>
                </div>
                <h4>חיסכון בכסף</h4>
                <p>מניעת טעויות יקרות וטיפול מקצועי שיחסוך לך כסף</p>
              </div>
              <div className="benefit-item">
                <div className="benefit-icon">
                  <div className="icon-check"></div>
                </div>
                <h4>שקיפות מלאה</h4>
                <p>מעקב אחר כל שלב בתהליך עם עדכונים שוטפים</p>
              </div>
              <div className="benefit-item">
                <div className="benefit-icon">
                  <div className="icon-check"></div>
                </div>
                <h4>נוחות מקסימלית</h4>
                <p>ניהול מלא מהבית, שליטה מלאה על הכל</p>
              </div>
            </div>
          </div>

          <div className="stats-section">
            <div className="stat-item">
              <div className="stat-number">100%</div>
              <div className="stat-label">ליווי מקצועי</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">24/7</div>
              <div className="stat-label">זמינות מלאה</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">1000+</div>
              <div className="stat-label">לקוחות מרוצים</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">95%</div>
              <div className="stat-label">שיעור הצלחה</div>
            </div>
          </div>

          <div className="features-section">
            <div className="feature-card">
              <div className="feature-icon">
                <div className="icon-document"></div>
              </div>
              <h3>ניהול בקשות</h3>
              <p>מעקב אחר כל הבקשות והמסמכים במקום אחד, ניהול מסודר ויעיל של כל הפרויקטים שלך</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <div className="icon-chart"></div>
              </div>
              <h3>מעקב סטטוס</h3>
              <p>עדכונים בזמן אמת על מצב הבקשה, התראות אוטומטיות על כל שינוי או עדכון חשוב</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <div className="icon-support"></div>
              </div>
              <h3>ליווי מקצועי</h3>
              <p>הנחיות וסיוע בכל שלב בתהליך, תמיכה מקצועית ומומחיות בתחום היתרי הבנייה</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <div className="icon-upload"></div>
              </div>
              <h3>העלאת מסמכים</h3>
              <p>העלאת כל המסמכים הנדרשים בצורה מאובטחת, ניהול קבצים מסודר ונגיש</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <div className="icon-calendar"></div>
              </div>
              <h3>תזמון ומועדים</h3>
              <p>מעקב אחר מועדים חשובים, תזכורות אוטומטיות וניהול לוח זמנים יעיל</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <div className="icon-shield"></div>
              </div>
              <h3>אבטחה מלאה</h3>
              <p>הגנה על המידע האישי והמסמכים שלך, מערכת מאובטחת ומוצפנת ברמה גבוהה</p>
            </div>
          </div>

          <div className="process-section">
            <h2 className="section-title">תהליך העבודה שלנו</h2>
            <div className="process-steps">
              <div className="process-step">
                <div className="step-number">1</div>
                <h3>רישום והרשמה</h3>
                <p>הרשמה מהירה למערכת ומילוי פרטים בסיסיים ללא התחייבות</p>
              </div>
              <div className="process-arrow">←</div>
              <div className="process-step">
                <div className="step-number">2</div>
                <h3>הגשת בקשה למידע</h3>
                <p>מילוי טופס הבקשה והעלאת המסמכים הנדרשים</p>
              </div>
              <div className="process-arrow">←</div>
              <div className="process-step">
                <div className="step-number">3</div>
                <h3>הגשת בקשה להיתר</h3>
                <p>הגשת הבקשה המלאה לקבלת היתר בנייה</p>
              </div>
              <div className="process-arrow">←</div>
              <div className="process-step">
                <div className="step-number">4</div>
                <h3>קבלת ההיתר</h3>
                <p>קבלת האישור הסופי והיתר הבנייה</p>
              </div>
              <div className="process-arrow">←</div>
              <div className="process-step">
                <div className="step-number">5</div>
                <h3>אישור להתחלת עבודה</h3>
                <p>קבלת האישור להתחלת עבודות הבנייה</p>
              </div>
              <div className="process-arrow">←</div>
              <div className="process-step">
                <div className="step-number">6</div>
                <h3>תעודת גמר+תופס</h3>
                <p>קבלת תעודת גמר ותופס 4</p>
              </div>
            </div>
          </div>

          <div className="cta-section">
            <div className="cta-content">
              <h3 className="cta-title">מוכן להתחיל?</h3>
              <p className="cta-description">הצטרף לאלפי לקוחות מרוצים וקבל את היתר הבנייה שלך בקלות</p>
            </div>
          </div>

          <div className="footer-section">
            <button 
              className="terms-button"
              onClick={() => navigate('/terms')}
            >
              תנאי שימוש
            </button>
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

export default LandingPage

