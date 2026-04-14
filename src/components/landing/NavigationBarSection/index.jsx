import { useNavigate } from 'react-router-dom'
import styles from '../styles.module.css'

export const NavigationBarSection = () => {
  const navigate = useNavigate()

  return (
    <nav className={styles['nav-bar']} role="navigation" aria-label="Main navigation">
      <button
        className={styles['nav-login-button']}
        type="button"
        aria-label="התחברות"
        onClick={() => navigate('/auth?mode=signin')}
      >
        <span className={styles['nav-login-button-text']}>התחברות</span>
      </button>
      <a href="/" className={styles['nav-logo-link']} aria-label="קל-היתר - דף הבית">
        <span className={styles['nav-logo-text']}>קל-היתר</span>
        <img
          className={styles['nav-logo-icon']}
          alt="קל-היתר לוגו"
          src="https://c.animaapp.com/VuAXsrkU/img/group-10-1@2x.png"
        />
      </a>
    </nav>
  )
}
