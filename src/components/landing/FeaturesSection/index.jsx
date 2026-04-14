import styles from '../styles.module.css'
import componentStyles from '../components/styles.module.css'

const STEPS = [
  {
    number: 1,
    label: 'רישום ראשוני',
    description: 'יוצרים משתמש ונכנסים למערכת בצורה מאובטחת.',
    icon: '/icons/1.png',
    alt: 'רישום ראשוני',
    className: 'view',
    frameClass: 'frame',
    descClass: 'text',
  },
  {
    number: 2,
    label: 'בחירת בית המגורים',
    description: 'מזינים גודל המגרש ובוחרים מתוך המאגר',
    icon: '/icons/2.png',
    alt: 'בחירת בית המגורים',
    className: 'view',
    frameClass: 'frame',
    descClass: 'text',
  },
  {
    number: 3,
    label: 'מילוי מידע תכנוני',
    description: 'המערכת מדריכה בדיוק אילו מסמכים חסרים ומה צריך לצרף',
    icon: '/icons/3.png',
    alt: 'מילוי מידע תכנוני',
    className: 'view-3',
    frameClass: 'frame-2',
    descClass: 'p',
  },
  {
    number: 4,
    label: 'הגשת בקשה להיתר',
    description: 'קל היתר שולחת את הבקשה ומציגה לכם כל דרישה או עדכון מהרשות',
    icon: '/icons/4.png',
    alt: 'הגשת בקשה להיתר',
    className: 'view-4',
    frameClass: 'frame',
    descClass: 'text-2',
  },
  {
    number: 5,
    label: 'קבלת היתר הבנייה',
    description: 'בסיום כל השלבים, ההיתר נחתם ומוכן להמשך העבודה.',
    icon: '/icons/6.png',
    alt: 'קבלת היתר הבנייה',
    className: 'view-6',
    frameClass: 'frame',
    descClass: 'text',
  },
]

export const FeaturesSection = () => {
  return (
    <section className={styles['features-section']}>
      <img
        className={styles['features-section-bg']}
        alt=""
        src="https://c.animaapp.com/VuAXsrkU/img/rectangle-921229.png"
        role="presentation"
      />
      <h2 className={styles['features-section-title']}>
        איך מתבצע
        <br />
        התהליך?
      </h2>
      <p className={styles['features-section-description']}>
        תהליך קבלת ההיתר הופך אצלנו למסלול פשוט וברור.
        <br /> המערכת מדריכה אתכם צעד-אחר-צעד, מציגה מה נדרש בכל שלב, ומעדכנת בזמן אמת עד לרגע שבו
        ההיתר מאושר.
        <br />
        ככה זה כשיש שילוב של טכנולוגיה חכמה וליווי מקצועי שמתרחש בשקט מאחורי הקלעים.
      </p>

      <div className={componentStyles.screen}>
        {STEPS.map((step, index) => (
          <div key={step.number}>
            <div className={componentStyles[step.className]}>
              <div className={componentStyles.div}>
                <div className={componentStyles['text-wrapper']}>שלב {step.number}</div>
                <div className={componentStyles[step.frameClass]}>
                  <div className={componentStyles['text-wrapper-2']}>{step.label}</div>
                  <p className={componentStyles[step.descClass]}>{step.description}</p>
                </div>
              </div>
              <div className={componentStyles['view-2']}>
                <img className={componentStyles['icon-instance-node']} alt={step.alt} src={step.icon} />
              </div>
            </div>
            {index < STEPS.length - 1 && <div className={componentStyles['connecting-line']}></div>}
          </div>
        ))}
      </div>
    </section>
  )
}
