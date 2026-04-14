import styles from '../styles.module.css'

const content = {
  title: 'שקיפות מוחלטת',
  description:
    'כל שלב בתהליך מוצג בצורה ברורה ופשוטה, כדי שתדעו בדיוק היכן אתם עומדים ומה הצעד הבא.',
}

export const HeroSection = () => {
  return (
    <section
      className={`${styles['content-section']} ${styles['content-section-hero']}`}
      aria-labelledby="hero-title"
    >
      <div className={styles['content-section-inner']}>
        <h2 id="hero-title" className={styles['content-section-title']}>
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
