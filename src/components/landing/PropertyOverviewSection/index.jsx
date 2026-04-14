import styles from '../styles.module.css'

const content = {
  title: 'חיסכון בזמן',
  description: 'מערכת אוטומטית שמסדרת, ממיינת ומגישה את החומרים במקומכם.',
}

export const PropertyOverviewSection = () => {
  return (
    <section
      className={`${styles['content-section']} ${styles['content-section-property']}`}
      aria-labelledby="property-overview-title"
    >
      <div className={styles['content-section-inner']}>
        <h2 id="property-overview-title" className={styles['content-section-title']}>
          {content.title}
        </h2>
        <p className={styles['content-section-description']}>{content.description}</p>
      </div>
      <img
        className={styles['content-section-line']}
        alt=""
        role="presentation"
        src="https://c.animaapp.com/VuAXsrkU/img/line-119-3.svg"
      />
    </section>
  )
}
