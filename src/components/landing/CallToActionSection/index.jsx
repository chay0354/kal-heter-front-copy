import styles from '../styles.module.css'

export const CallToActionSection = () => {
  const sectionData = {
    title: 'בקרות מקצועיות',
    description: 'כל מסמך או פעולה המתבצעים באפליקציה - עוברים בדיקת התאמה מלאה.',
    lineImage: 'https://c.animaapp.com/VuAXsrkU/img/line-119-3.svg',
  }

  return (
    <section
      className={`${styles['content-section']} ${styles['content-section-cta']}`}
      aria-labelledby="cta-section-title"
    >
      <div className={styles['content-section-inner']}>
        <h2 id="cta-section-title" className={styles['content-section-title']}>
          {sectionData.title}
        </h2>
        <p className={styles['content-section-description']}>{sectionData.description}</p>
      </div>
      <img
        className={styles['content-section-line']}
        alt=""
        role="presentation"
        src={sectionData.lineImage}
      />
    </section>
  )
}
