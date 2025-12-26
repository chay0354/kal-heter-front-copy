import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { signIn, signUp } from '../services/auth'
import { getFormData } from '../services/formData'
import { checkSubmissionStatus } from '../services/formSubmission'
import './AuthPage.css'

function AuthPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const mode = searchParams.get('mode') || 'signin'
  
  const [isSignUp, setIsSignUp] = useState(mode === 'signup')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [showPasswordSignIn, setShowPasswordSignIn] = useState(false)
  const [termsAccepted, setTermsAccepted] = useState(false)
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
        
        // Check if user has already submitted a form
        setTimeout(async () => {
          try {
            const submissionStatus = await checkSubmissionStatus()
            if (submissionStatus.has_submitted) {
              // User has already submitted, redirect to summary page
              navigate('/summary')
            } else {
              // Check if user has existing form data in localStorage
              const existingFormData = getFormData()
              const hasFormData = existingFormData && (
                (existingFormData.personalDetails && Object.keys(existingFormData.personalDetails).length > 0) ||
                (existingFormData.propertyDetails && Object.keys(existingFormData.propertyDetails).length > 0) ||
                (existingFormData.measurementDetails && Object.keys(existingFormData.measurementDetails).length > 0) ||
                (existingFormData.selectedHouse && Object.keys(existingFormData.selectedHouse).length > 0)
              )
              
              // If user has form data, redirect to summary page
              // Otherwise, redirect to dashboard
              if (hasFormData) {
                navigate('/summary')
              } else {
                navigate('/dashboard')
              }
            }
          } catch (statusError) {
            console.error('Error checking submission status:', statusError)
            // On error, check localStorage as fallback
            const existingFormData = getFormData()
            const hasFormData = existingFormData && (
              (existingFormData.personalDetails && Object.keys(existingFormData.personalDetails).length > 0) ||
              (existingFormData.propertyDetails && Object.keys(existingFormData.propertyDetails).length > 0) ||
              (existingFormData.measurementDetails && Object.keys(existingFormData.measurementDetails).length > 0) ||
              (existingFormData.selectedHouse && Object.keys(existingFormData.selectedHouse).length > 0)
            )
            
            if (hasFormData) {
              navigate('/summary')
            } else {
              navigate('/dashboard')
            }
          }
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

    if (!termsAccepted) {
      setError('יש לאשר את תנאי השימוש')
      setLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setError('הסיסמאות אינן תואמות. אנא ודא שהסיסמאות זהות.')
      setLoading(false)
      return
    }

    try {
      const fullName = `${firstName} ${lastName}`.trim()
      const result = await signUp(email, password, phone || null, fullName || null)
      if (result.success) {
        setSuccessMessage('נרשמת בהצלחה! מעבר למערכת...')
        setTimeout(() => {
          navigate('/measurement-map')
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
    setPassword('')
    setConfirmPassword('')
    navigate('/auth?mode=signup')
  }

  const switchToSignIn = () => {
    setIsSignUp(false)
    setError('')
    setSuccessMessage('')
    setPassword('')
    setConfirmPassword('')
    navigate('/auth?mode=signin')
  }

  // Custom email validation handler
  const handleEmailInvalid = (e) => {
    const emailValue = e.target.value
    if (!emailValue) {
      e.target.setCustomValidity('אנא הזן כתובת אימייל')
    } else if (!emailValue.includes('@')) {
      e.target.setCustomValidity('אנא כלול את הסימן \'@\' בכתובת האימייל')
    } else {
      e.target.setCustomValidity('אנא הזן כתובת אימייל תקינה')
    }
  }

  // Clear custom validity when user types
  const handleEmailChange = (e) => {
    e.target.setCustomValidity('')
    setEmail(e.target.value)
  }

  return (
    <div className="home-page">
      <div className="home-container">
        <div 
          className="home-content"
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
            <p className="auth-subtitle">המערכת שתלווה אתכם צעד־אחר־צעד עד לקבלת היתר הבנייה  בצורה פשוטה, ברורה ונגישה.</p>
          </div>

          <div className="sign-in-form-container">
            <div className="auth-tabs">
              <button
                type="button"
                className={`auth-tab ${isSignUp ? 'active' : ''}`}
                onClick={switchToSignUp}
              >
                הרשמה
              </button>
              <button
                type="button"
                className={`auth-tab ${!isSignUp ? 'active' : ''}`}
                onClick={switchToSignIn}
              >
                התחברות
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
                <div className="form-group">
                  <label htmlFor="firstName">שם פרטי</label>
                  <input
                    type="text"
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="הקלד"
                    style={{ color: '#2C3E50', backgroundColor: 'white' }}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="lastName">שם משפחה</label>
                  <input
                    type="text"
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="הקלד"
                    style={{ color: '#2C3E50', backgroundColor: 'white' }}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="phone-signup">מספר נייד</label>
                  <input
                    type="tel"
                    id="phone-signup"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="הקלד"
                    style={{ color: '#2C3E50', backgroundColor: 'white', textAlign: 'right', direction: 'rtl' }}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email-signup">אימייל</label>
                  <input
                    type="email"
                    id="email-signup"
                    value={email}
                    onChange={handleEmailChange}
                    onInvalid={handleEmailInvalid}
                    placeholder="הזן כתובת אימייל"
                    required
                    style={{ color: '#2C3E50', backgroundColor: 'white' }}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="password-signup">בחר סיסמה</label>
                  <div className="password-input-wrapper">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password-signup"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="הקלד"
                      required
                      minLength={8}
                      style={{ color: '#2C3E50', backgroundColor: 'white' }}
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? 'הסתר סיסמה' : 'הצג סיסמה'}
                    >
                      {showPassword ? (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                          <path d="M1 1L23 23" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                      ) : (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                      )}
                    </button>
                  </div>
                  <p className="password-requirements">הסיסמה חייבת להכיל לפחות 8 תווים, לפחות תו אחד מיוחד- !@#$%&*</p>
                </div>
                <div className="form-group">
                  <label htmlFor="confirm-password-signup">אישור סיסמה</label>
                  <div className="password-input-wrapper">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      id="confirm-password-signup"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="הקלד שוב את הסיסמה"
                      required
                      style={{ color: '#2C3E50', backgroundColor: 'white' }}
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      aria-label={showConfirmPassword ? 'הסתר סיסמה' : 'הצג סיסמה'}
                    >
                      {showConfirmPassword ? (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                          <path d="M1 1L23 23" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                      ) : (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                      )}
                    </button>
                  </div>
                  {confirmPassword && password !== confirmPassword && (
                    <p className="password-error" style={{ color: '#c33', fontSize: '13px', marginTop: '8px', direction: 'rtl', textAlign: 'right' }}>
                      הסיסמאות אינן תואמות
                    </p>
                  )}
                  {confirmPassword && password === confirmPassword && password.length > 0 && (
                    <p className="password-success" style={{ color: '#3c3', fontSize: '13px', marginTop: '8px', direction: 'rtl', textAlign: 'right' }}>
                      הסיסמאות תואמות
                    </p>
                  )}
                </div>
                <div className="terms-checkbox-group">
                  <label htmlFor="terms-checkbox" className="terms-label">
                    קראתי ואני מאשר/ת את{' '}
                    <button
                      type="button"
                      className="terms-link-inline"
                      onClick={() => navigate('/terms')}
                    >
                      תנאי השימוש
                    </button>
                  </label>
                  <input
                    type="checkbox"
                    id="terms-checkbox"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="terms-checkbox"
                  />
                </div>
                <button type="submit" className="submit-button" disabled={loading}>
                  {loading ? 'מתבצע...' : 'הרשמה'}
                </button>
              </form>
            ) : (
              <form className="sign-in-form" onSubmit={handleSignIn}>
                <div className="form-group">
                  <label htmlFor="email-signin">אימייל</label>
                  <input
                    type="email"
                    id="email-signin"
                    value={email}
                    onChange={handleEmailChange}
                    onInvalid={handleEmailInvalid}
                    placeholder="הזן כתובת אימייל"
                    required
                    style={{ color: '#2C3E50', backgroundColor: 'white' }}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="password-signin">סיסמה</label>
                  <div className="password-input-wrapper">
                    <input
                      type={showPasswordSignIn ? 'text' : 'password'}
                      id="password-signin"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="הזן סיסמה"
                      required
                      style={{ color: '#2C3E50', backgroundColor: 'white' }}
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPasswordSignIn(!showPasswordSignIn)}
                      aria-label={showPasswordSignIn ? 'הסתר סיסמה' : 'הצג סיסמה'}
                    >
                      {showPasswordSignIn ? (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                          <path d="M1 1L23 23" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                      ) : (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
                <div className="forgot-password-link">
                  <button
                    type="button"
                    className="forgot-password-button"
                    onClick={() => {/* Handle forgot password */}}
                  >
                    שכחתי סיסמה
                  </button>
                </div>
                <button type="submit" className="submit-button" disabled={loading}>
                  {loading ? 'מתבצע...' : 'התחברות'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthPage






