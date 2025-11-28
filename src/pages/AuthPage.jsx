import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { signIn, signUp } from '../services/auth'
import '../components/HomePage.css'

function AuthPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const mode = searchParams.get('mode') || 'signin'
  
  const [isSignUp, setIsSignUp] = useState(mode === 'signup')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    setIsSignUp(mode === 'signup')
  }, [mode])

  const handleSignIn = async (e) => {
    e.preventDefault()
    setError('')
    setSuccessMessage('')
    setLoading(true)

    try {
      const result = await signIn(email, password)
      if (result.success) {
        setSuccessMessage('התחברת בהצלחה!')
        setTimeout(() => {
          navigate('/dashboard')
        }, 1000)
      }
    } catch (err) {
      setError(err.message || 'שגיאה בהתחברות. נסה שוב.')
    } finally {
      setLoading(false)
    }
  }

  const handleSignUp = async (e) => {
    e.preventDefault()
    setError('')
    setSuccessMessage('')
    setLoading(true)

    try {
      const result = await signUp(email, password, phone || null, fullName || null)
      if (result.success) {
        setSuccessMessage('נרשמת בהצלחה! מעבר למערכת...')
        setTimeout(() => {
          navigate('/dashboard')
        }, 1500)
      } else if (result.requiresEmailConfirmation) {
        setSuccessMessage('נרשמת בהצלחה! אנא בדוק את האימייל שלך לאישור החשבון.')
      }
    } catch (err) {
      setError(err.message || 'שגיאה בהרשמה. נסה שוב.')
    } finally {
      setLoading(false)
    }
  }

  const switchToSignUp = () => {
    setIsSignUp(true)
    setError('')
    setSuccessMessage('')
    navigate('/auth?mode=signup')
  }

  const switchToSignIn = () => {
    setIsSignUp(false)
    setError('')
    setSuccessMessage('')
    navigate('/auth?mode=signin')
  }

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

          <div className="sign-in-form-container">
            <div className="auth-tabs">
              <button
                type="button"
                className={`auth-tab ${!isSignUp ? 'active' : ''}`}
                onClick={switchToSignIn}
              >
                התחברות
              </button>
              <button
                type="button"
                className={`auth-tab ${isSignUp ? 'active' : ''}`}
                onClick={switchToSignUp}
              >
                הרשמה
              </button>
            </div>
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}
            {successMessage && (
              <div className="success-message">
                {successMessage}
              </div>
            )}
            {isSignUp ? (
              <form className="sign-in-form" onSubmit={handleSignUp}>
                <h3 className="form-title">הרשמה למערכת</h3>
                <div className="form-group">
                  <label htmlFor="fullName">שם מלא</label>
                  <input
                    type="text"
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="הכנס שם מלא"
                    style={{ color: '#2C3E50', backgroundColor: 'white' }}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email-signup">אימייל *</label>
                  <input
                    type="email"
                    id="email-signup"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="הכנס אימייל"
                    required
                    style={{ color: '#2C3E50', backgroundColor: 'white' }}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="phone-signup">מספר טלפון</label>
                  <input
                    type="tel"
                    id="phone-signup"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="הכנס מספר טלפון"
                    style={{ color: '#2C3E50', backgroundColor: 'white' }}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="password-signup">סיסמה *</label>
                  <input
                    type="password"
                    id="password-signup"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="הכנס סיסמה"
                    required
                    minLength={6}
                    style={{ color: '#2C3E50', backgroundColor: 'white' }}
                  />
                </div>
                <button type="submit" className="submit-button" disabled={loading}>
                  {loading ? 'מתבצע...' : 'הרשמה'}
                </button>
                <button 
                  type="button" 
                  className="back-button"
                  onClick={() => navigate('/')}
                >
                  חזרה
                </button>
                <div className="sign-in-terms-link">
                  <button 
                    type="button"
                    className="terms-link-button"
                    onClick={() => navigate('/terms')}
                  >
                    תנאי שימוש
                  </button>
                </div>
              </form>
            ) : (
              <form className="sign-in-form" onSubmit={handleSignIn}>
                <h3 className="form-title">התחברות למערכת</h3>
                <div className="form-group">
                  <label htmlFor="email-signin">אימייל *</label>
                  <input
                    type="email"
                    id="email-signin"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="הכנס אימייל"
                    required
                    style={{ color: '#2C3E50', backgroundColor: 'white' }}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="password-signin">סיסמה *</label>
                  <input
                    type="password"
                    id="password-signin"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="הכנס סיסמה"
                    required
                    style={{ color: '#2C3E50', backgroundColor: 'white' }}
                  />
                </div>
                <button type="submit" className="submit-button" disabled={loading}>
                  {loading ? 'מתבצע...' : 'התחבר'}
                </button>
                <button 
                  type="button" 
                  className="back-button"
                  onClick={() => navigate('/')}
                >
                  חזרה
                </button>
                <div className="sign-in-terms-link">
                  <button 
                    type="button"
                    className="terms-link-button"
                    onClick={() => navigate('/terms')}
                  >
                    תנאי שימוש
                  </button>
                </div>
              </form>
            )}
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

export default AuthPage






