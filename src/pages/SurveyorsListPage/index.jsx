import { useNavigate } from 'react-router-dom'
import { SURVEYORS } from '../../constants/surveyors'
import BackArrowIcon from '../../components/icons/BackArrowIcon'
import ChevronDownIcon from '../../components/icons/ChevronDownIcon'
import styles from './styles.module.css'

function SurveyorsListPage() {
  const navigate = useNavigate()

  return (
    <div className={styles['surveyors-list-page']}>
      <div className={styles['surveyors-list-container']}>
        <div className={styles['surveyors-list-content']}>
          <button
            className={styles['back-button']}
            onClick={() => navigate('/measurement-map')}
            type="button"
          >
            <BackArrowIcon className={styles['back-arrow-icon']} />
            <span className={styles['back-button-text']}>חזרה למסך הקודם</span>
          </button>

          <div className={styles['surveyors-list-card']}>
            <h1 className={styles['surveyors-list-title']}>רשימת מודדים מומלצים</h1>

            <div className={styles['surveyors-intro']}>
              <p className={styles['intro-text']}>
                עלות הפקת מפת המדידה אינה כלולה בתשלום עבור תהליך קבלת היתר הבנייה.
              </p>
              <p className={styles['intro-text']}>
                ניתן לבחור כל מודד מוסמך ולעבוד מולו באופן פרטי, לפי העדפתכם ולוחות הזמנים שנוחים לכם.
              </p>
            </div>

            <div className={styles['surveyors-table-container']}>
              <table className={styles['surveyors-table']}>
                <thead>
                  <tr>
                    <th className={styles['th-name']}>שם המודד</th>
                    <th className={styles['th-phone']}>טלפון</th>
                    <th className={styles['th-email']}>אימייל</th>
                    <th className={styles['th-area']}>
                      אזור פעילות
                      <ChevronDownIcon className={styles['chevron-icon']} width={16} height={16} />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {SURVEYORS.map((surveyor) => (
                    <tr key={surveyor.id}>
                      <td className={styles['td-name']}>{surveyor.name}</td>
                      <td className={styles['td-phone']}>{surveyor.phone}</td>
                      <td className={styles['td-email']}>{surveyor.email}</td>
                      <td className={styles['td-area']}>{surveyor.area}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SurveyorsListPage
