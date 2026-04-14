import { useNavigate } from 'react-router-dom'
import styles from '../styles.module.css'

export const TestimonialsSection = () => {
  const navigate = useNavigate()

  return (
    <section className={styles['testimonials-section']}>
      <div className={styles['testimonials-content']}>
        <h2 className={styles['testimonials-title']}>מוכנים להתחיל?</h2>
        <p className={styles['testimonials-description']}>
          זה הרגע להפוך תהליך גדול ומאתגר לחוויה פשוטה וברורה.
          <br /> היתר הבנייה שלכם יכול להיות הרבה יותר מהיר – והמערכת כבר מוכנה בשבילכם.
        </p>
      </div>
      <div className={styles['testimonials-button-container']}>
        <button
          className={styles['testimonials-button']}
          type="button"
          aria-label="התחל תהליך קבלת היתר בניה"
          onClick={() => navigate('/auth?mode=signup')}
        >
          <span className={styles['testimonials-button-text']}>התחל תהליך קבלת היתר בניה</span>
        </button>
      </div>
    </section>
  )
}
