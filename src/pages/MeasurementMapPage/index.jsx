import { useNavigate } from 'react-router-dom'
import BackArrowIcon from '../../components/icons/BackArrowIcon'
import styles from './styles.module.css'

function MeasurementMapPage() {
  const navigate = useNavigate()

  return (
    <div className={styles['measurement-map-page']}>
      <div className={styles['measurement-map-container']}>
        <div className={styles['measurement-map-content']}>
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
              המערכת שתלווה אתכם צעד אחר צעד עד לקבלת היתר הבנייה בצורה פשוטה, ברורה ונגישה.
            </p>
          </div>

          <div className={styles['measurement-map-card']}>
            <h2 className={styles['measurement-map-question']}>
              האם יש ברשותך מפת מדידה מחצי שנה אחרונה?
            </h2>
            <p className={styles['measurement-map-explanation']}>
              מפת מדידה עדכנית היא מסמך חובה לצורך פתיחת בקשה למידע תכנוני. אם אין לכם - ניתן לקבל דרך מודד מוסמך.
            </p>
            <div className={styles['measurement-map-buttons']}>
              <button
                type="button"
                className={`${styles['measurement-map-button']} ${styles['measurement-map-button-no']}`}
                onClick={() => navigate('/surveyors-list')}
              >
                לא, אני צריך מפת מדידה
              </button>
              <button
                type="button"
                className={`${styles['measurement-map-button']} ${styles['measurement-map-button-yes']}`}
                onClick={() => navigate('/process-explanation')}
              >
                כן, יש לי מפה תקפה
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MeasurementMapPage
