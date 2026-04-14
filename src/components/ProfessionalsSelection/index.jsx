import BackArrowIcon from '../icons/BackArrowIcon'
import PhoneIcon from '../icons/PhoneIcon'
import styles from './styles.module.css'

const PROFESSIONALS = [
  { id: 1, name: 'יוסי כהן', phone: '050-1234567', area: 'מרכז', rating: 4.8 },
  { id: 2, name: 'שרה לוי', phone: '052-2345678', area: 'צפון', rating: 4.9 },
  { id: 3, name: 'דוד אברהם', phone: '054-3456789', area: 'דרום', rating: 4.7 },
  { id: 4, name: 'רחל דוד', phone: '050-4567890', area: 'ירושלים', rating: 4.8 },
  { id: 5, name: 'משה ישראלי', phone: '052-5678901', area: 'מרכז', rating: 4.6 },
]

const ProfessionalsSelection = ({ onBack }) => {
  return (
    <div className={styles['professionals-selection']}>
      <div className={styles['professionals-container']}>
        <div className={styles['professionals-header']}>
          <button onClick={onBack} className={styles['back-button']}>
            <BackArrowIcon />
            חזרה
          </button>
          <h1 className={styles['professionals-title']}>בחירת מודדים</h1>
        </div>

        <div className={styles['professionals-list']}>
          {PROFESSIONALS.map((professional) => (
            <div key={professional.id} className={styles['professional-card']}>
              <div className={styles['professional-info']}>
                <h3 className={styles['professional-name']}>{professional.name}</h3>
                <p className={styles['professional-detail']}>אזור: {professional.area}</p>
                <div className={styles['professional-rating']}>
                  <span className={styles['rating-value']}>{professional.rating}</span>
                  <span className={styles['rating-stars']}>★★★★★</span>
                </div>
              </div>
              <div className={styles['professional-contact']}>
                <a href={`tel:${professional.phone}`} className={styles['phone-link']}>
                  <PhoneIcon />
                  {professional.phone}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ProfessionalsSelection
