import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BackArrowIcon from '../../components/icons/BackArrowIcon'
import styles from './styles.module.css'

function ProcessExplanationPage() {
  const navigate = useNavigate()
  const [isChecked, setIsChecked] = useState(false)

  return (
    <div className={styles['process-explanation-page']}>
      <div className={styles['process-explanation-container']}>
        <div className={styles['process-explanation-content']}>
          <button
            className={styles['back-button']}
            onClick={() => navigate(-1)}
            type="button"
          >
            <BackArrowIcon className={styles['back-arrow-icon']} />
            <span className={styles['back-text']}>חזרה למסך הקודם</span>
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
              המערכת שתלווה אתכם צעד אחר צעד עד לקבלת היתר הבנייה בצורה פשוטה, ברורה ונגישה.
            </p>
          </div>

          <div className={styles['process-explanation-card']}>
            <h2 className={styles['process-explanation-title']}>
              הסבר קצר על התהליך לפני שמתחילים
            </h2>

            <div className={styles['process-explanation-text']}>
              <p>
                אנו נאסוף מכם כעת נתונים אודות הפרויקט שלכם, בסיום התהליך הצוות שלנו יראה את הבקשה שלכם במערכת הניהול ויצור איתכם קשר.
              </p>
            </div>

            <div className={styles['checkbox-container']}>
              <label className={styles['checkbox-label']}>
                <input
                  type="checkbox"
                  id="terms-checkbox"
                  className={styles['terms-checkbox']}
                  checked={isChecked}
                  onChange={(e) => setIsChecked(e.target.checked)}
                />
                <span className={styles['checkbox-text']}>
                  קראתי ואני מאשר/ת את התנאים ואת הנחיות הגשת המסמכים.
                </span>
              </label>
            </div>

            <button
              type="button"
              className={styles['continue-button']}
              onClick={() => isChecked && navigate('/dashboard')}
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
