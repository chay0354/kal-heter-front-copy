import styles from '../styles.module.css'

const infoData = {
  title: 'חיסכון בכסף',
  description: 'עלות פחותה של עד 50% משכר טרחה של אדריכל לבית חדש',
}

export const InfoSection = () => {
  return (
    <section
      className={`${styles['content-section']} ${styles['content-section-info']}`}
      aria-labelledby="info-section-title"
    >
      <div className={styles['content-section-inner']}>
        <h2 id="info-section-title" className={styles['content-section-title']}>
          {infoData.title}
        </h2>
        <p className={styles['content-section-description']}>{infoData.description}</p>
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
