import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { signIn, signUp } from '../../services/auth'
import { getFormData } from '../../services/formData'
import { checkSubmissionStatus } from '../../services/formSubmission'
import BackArrowIcon from '../../components/icons/BackArrowIcon'
import EyeOnIcon from '../../components/icons/EyeOnIcon'
import EyeOffIcon from '../../components/icons/EyeOffIcon'
import AlertCircleIcon from '../../components/icons/AlertCircleIcon'
import CheckSuccessIcon from '../../components/icons/CheckSuccessIcon'
import styles from './styles.module.css'

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
  const [emailExistsError, setEmailExistsError] = useState('')
  const [loading, setLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    setIsSignUp(mode === 'signup')

    const savedFormData = sessionStorage.getItem('authFormData')
    if (savedFormData) {
      try {
        const formData = JSON.parse(savedFormData)
        if (formData.firstName) setFirstName(formData.firstName)
        if (formData.lastName) setLastName(formData.lastName)
        if (formData.phone) setPhone(formData.phone)
        if (formData.email) setEmail(formData.email)
        if (formData.password) setPassword(formData.password)
        if (formData.confirmPassword) setConfirmPassword(formData.confirmPassword)
        if (formData.termsAccepted !== undefined) setTermsAccepted(formData.termsAccepted)
        sessionStorage.removeItem('authFormData')
      } catch (e) {
        console.error('Error restoring form data:', e)
      }
    }
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
        setTimeout(async () => {
          try {
            const submissionStatus = await checkSubmissionStatus()
            if (submissionStatus.has_submitted) {
              navigate('/summary')
            } else {
              const existingFormData = getFormData()
              const hasFormData = existingFormData && (
                (existingFormData.personalDetails && Object.keys(existingFormData.personalDetails).length > 0) ||
                (existingFormData.propertyDetails && Object.keys(existingFormData.propertyDetails).length > 0) ||
                (existingFormData.measurementDetails && Object.keys(existingFormData.measurementDetails).length > 0) ||
                (existingFormData.selectedHouse && Object.keys(existingFormData.selectedHouse).length > 0)
              )
              navigate(hasFormData ? '/summary' : '/dashboard')
            }
          } catch {
            const existingFormData = getFormData()
            const hasFormData = existingFormData && (
              (existingFormData.personalDetails && Object.keys(existingFormData.personalDetails).length > 0) ||
              (existingFormData.propertyDetails && Object.keys(existingFormData.propertyDetails).length > 0) ||
              (existingFormData.measurementDetails && Object.keys(existingFormData.measurementDetails).length > 0) ||
              (existingFormData.selectedHouse && Object.keys(existingFormData.selectedHouse).length > 0)
            )
            navigate(hasFormData ? '/summary' : '/dashboard')
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
    setEmailExistsError('')
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
        setTimeout(() => navigate('/measurement-map'), 1500)
      } else if (result.requiresEmailConfirmation) {
        setSuccessMessage('נרשמת בהצלחה! אנא בדוק את האימייל שלך לאישור החשבון.')
      }
    } catch (err) {
      const msg = err.message || ''
      const isDuplicateEmail = ['already registered', 'already exists', 'already in use', 'duplicate', 'email']
        .some((term) => msg.toLowerCase().includes(term))
      if (isDuplicateEmail) {
        setEmailExistsError('כתובת אימייל כבר קיימת - את/ה כבר רשום')
      } else {
        setError(msg || 'שגיאה בהרשמה. נסה שוב.')
      }
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

  const handleEmailInvalid = (e) => {
    const emailValue = e.target.value
    if (!emailValue) {
      e.target.setCustomValidity('אנא הזן כתובת אימייל')
    } else if (!emailValue.includes('@')) {
      e.target.setCustomValidity("אנא כלול את הסימן '@' בכתובת האימייל")
    } else {
      e.target.setCustomValidity('אנא הזן כתובת אימייל תקינה')
    }
  }

  const handleEmailChange = (e) => {
    e.target.setCustomValidity('')
    setEmail(e.target.value)
    if (emailExistsError) setEmailExistsError('')
  }

  return (
    <div className={styles['home-page']}>
      <div className={styles['home-container']}>
        <div className={styles['home-content']}>
          <button
            className={styles['back-to-home-button']}
            onClick={() => navigate('/')}
            type="button"
          >
            <BackArrowIcon className={styles['back-arrow-icon']} />
            <span className={styles['back-to-home-text']}>חזרה למסך הבית</span>
          </button>

          <div className={styles['logo-section']}>
            <div className={styles['nav-logo-link']}>
              <span className={styles['nav-logo-text']}>קל-היתר</span>
              <img
                className={styles['nav-logo-icon']}
                alt="קל-היתר לוגו"
                src="https://c.animaapp.com/VuAXsrkU/img/group-10-1@2x.png"
              />
            </div>
            <p className={styles['auth-subtitle']}>
              המערכת שתלווה אתכם צעד־אחר־צעד עד לקבלת היתר הבנייה בצורה פשוטה, ברורה ונגישה.
            </p>
          </div>

          <div className={styles['sign-in-form-container']}>
            <div className={styles['auth-tabs']} role="tablist" aria-label="סוג כניסה">
              <button
                type="button"
                role="tab"
                aria-selected={isSignUp}
                aria-controls="signup-panel"
                id="signup-tab"
                className={`${styles['auth-tab']} ${isSignUp ? styles.active : ''}`}
                onClick={switchToSignUp}
              >
                הרשמה
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={!isSignUp}
                aria-controls="signin-panel"
                id="signin-tab"
                className={`${styles['auth-tab']} ${!isSignUp ? styles.active : ''}`}
                onClick={switchToSignIn}
              >
                התחברות
              </button>
            </div>

            {error && (
              <div className={styles['error-message']} role="alert" aria-live="assertive">
                <AlertCircleIcon className={styles['message-icon']} />
                <span>{error}</span>
              </div>
            )}

            {successMessage && (
              <div className={styles['success-message']} role="status" aria-live="polite">
                <CheckSuccessIcon className={styles['message-icon']} />
                <span>{successMessage}</span>
              </div>
            )}

            {isSignUp ? (
              <form
                className={styles['sign-in-form']}
                onSubmit={handleSignUp}
                role="tabpanel"
                id="signup-panel"
                aria-labelledby="signup-tab"
              >
                <div className={styles['form-group']}>
                  <label htmlFor="firstName">שם פרטי</label>
                  <input
                    type="text"
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="הקלד"
                    className={styles['text-input']}
                  />
                </div>
                <div className={styles['form-group']}>
                  <label htmlFor="lastName">שם משפחה</label>
                  <input
                    type="text"
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="הקלד"
                    className={styles['text-input']}
                  />
                </div>
                <div className={styles['form-group']}>
                  <label htmlFor="phone-signup">מספר נייד</label>
                  <input
                    type="tel"
                    id="phone-signup"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="הקלד"
                    className={styles['text-input-rtl']}
                  />
                </div>
                <div className={styles['form-group']}>
                  <label htmlFor="email-signup">
                    אימייל <span className={styles['required-indicator']} aria-label="שדה חובה">*</span>
                  </label>
                  <input
                    type="email"
                    id="email-signup"
                    value={email}
                    onChange={handleEmailChange}
                    onInvalid={handleEmailInvalid}
                    placeholder="הזן כתובת אימייל"
                    required
                    aria-required="true"
                    className={styles['text-input']}
                  />
                </div>
                <div className={styles['form-group']}>
                  <label htmlFor="password-signup">
                    בחר סיסמה <span className={styles['required-indicator']} aria-label="שדה חובה">*</span>
                  </label>
                  <div className={styles['password-input-wrapper']}>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password-signup"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="הקלד"
                      required
                      minLength={8}
                      className={styles['text-input']}
                    />
                    <button
                      type="button"
                      className={styles['password-toggle']}
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? 'הסתר סיסמה' : 'הצג סיסמה'}
                    >
                      {showPassword ? <EyeOffIcon /> : <EyeOnIcon />}
                    </button>
                  </div>
                  <p className={styles['password-requirements']}>
                    הסיסמה חייבת להכיל לפחות 8 תווים, לפחות תו אחד מיוחד- !@#$%&*
                  </p>
                </div>
                <div className={styles['form-group']}>
                  <label htmlFor="confirm-password-signup">
                    אישור סיסמה <span className={styles['required-indicator']} aria-label="שדה חובה">*</span>
                  </label>
                  <div className={styles['password-input-wrapper']}>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      id="confirm-password-signup"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="הקלד שוב את הסיסמה"
                      required
                      className={styles['text-input']}
                    />
                    <button
                      type="button"
                      className={styles['password-toggle']}
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      aria-label={showConfirmPassword ? 'הסתר סיסמה' : 'הצג סיסמה'}
                    >
                      {showConfirmPassword ? <EyeOffIcon /> : <EyeOnIcon />}
                    </button>
                  </div>
                  {confirmPassword && password !== confirmPassword && (
                    <p className={styles['password-mismatch']} role="alert">
                      <AlertCircleIcon width={16} height={16} />
                      <span>הסיסמאות אינן תואמות</span>
                    </p>
                  )}
                  {confirmPassword && password === confirmPassword && password.length > 0 && (
                    <p className={styles['password-match']} role="status">
                      <CheckSuccessIcon width={16} height={16} />
                      <span>הסיסמאות תואמות</span>
                    </p>
                  )}
                </div>
                <div className={styles['terms-checkbox-group']}>
                  <label htmlFor="terms-checkbox" className={styles['terms-label']}>
                    קראתי ואני מאשר/ת את{' '}
                    <button
                      type="button"
                      className={styles['terms-link-inline']}
                      onClick={() => {
                        sessionStorage.setItem(
                          'authFormData',
                          JSON.stringify({ firstName, lastName, phone, email, password, confirmPassword, termsAccepted })
                        )
                        navigate('/terms?from=auth&mode=signup')
                      }}
                    >
                      תנאי השימוש
                    </button>
                  </label>
                  <input
                    type="checkbox"
                    id="terms-checkbox"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className={styles['terms-checkbox']}
                  />
                </div>
                <button type="submit" className={styles['submit-button']} disabled={loading}>
                  {loading ? 'מתבצע...' : 'הרשמה'}
                </button>
                {emailExistsError && (
                  <p className={styles['email-exists-error']} role="alert">
                    {emailExistsError}
                  </p>
                )}
              </form>
            ) : (
              <form
                className={styles['sign-in-form']}
                onSubmit={handleSignIn}
                role="tabpanel"
                id="signin-panel"
                aria-labelledby="signin-tab"
              >
                <div className={styles['form-group']}>
                  <label htmlFor="email-signin">
                    אימייל <span className={styles['required-indicator']} aria-label="שדה חובה">*</span>
                  </label>
                  <input
                    type="email"
                    id="email-signin"
                    value={email}
                    onChange={handleEmailChange}
                    onInvalid={handleEmailInvalid}
                    placeholder="הזן כתובת אימייל"
                    required
                    aria-required="true"
                    className={styles['text-input']}
                  />
                </div>
                <div className={styles['form-group']}>
                  <label htmlFor="password-signin">
                    סיסמה <span className={styles['required-indicator']} aria-label="שדה חובה">*</span>
                  </label>
                  <div className={styles['password-input-wrapper']}>
                    <input
                      type={showPasswordSignIn ? 'text' : 'password'}
                      id="password-signin"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="הזן סיסמה"
                      required
                      className={styles['text-input']}
                    />
                    <button
                      type="button"
                      className={styles['password-toggle']}
                      onClick={() => setShowPasswordSignIn(!showPasswordSignIn)}
                      aria-label={showPasswordSignIn ? 'הסתר סיסמה' : 'הצג סיסמה'}
                    >
                      {showPasswordSignIn ? <EyeOffIcon /> : <EyeOnIcon />}
                    </button>
                  </div>
                </div>
                <div className={styles['forgot-password-link']}>
                  <button type="button" className={styles['forgot-password-button']}>
                    שכחתי סיסמה
                  </button>
                </div>
                <button type="submit" className={styles['submit-button']} disabled={loading}>
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
