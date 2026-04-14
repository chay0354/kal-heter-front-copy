import { useNavigate } from 'react-router-dom'
import styles from '../styles.module.css'

export const PropertyDetailsSection = () => {
  const navigate = useNavigate()

  return (
    <footer className={styles['footer-section']}>
      <div className={styles['footer-content']}>
        <div className={styles['footer-logo-wrapper']}>
          <h1 className={styles['footer-logo-text']}>קל-היתר</h1>
          <img
            className={styles['footer-logo-icon']}
            alt="קל-היתר לוגו"
            src="https://c.animaapp.com/VuAXsrkU/img/group-10@2x.png"
          />
        </div>
        <p className={styles['footer-tagline']}>בנייה מתחילה בהיתר. היתר מתחיל בקל־היתר</p>
      </div>

      <div className={styles['footer-accessibility-section']}>
        <p className={styles['footer-accessibility-title']}>האתר נגיש ע״פ תקן WCAG – level A</p>
      </div>

      <div className={styles['footer-bottom']}>
        <hr className={styles['footer-divider']} aria-hidden="true" />
        <div className={styles['footer-links']}>
          <button onClick={() => navigate('/terms')} className={styles['footer-link-button']}>
            תנאי שימוש
          </button>
          <p className={styles['footer-copyright']}>© כל הזכויות שמורות לקל-היתר 24 2025</p>
        </div>
      </div>
    </footer>
  )
}
