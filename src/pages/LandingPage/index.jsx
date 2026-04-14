import { useNavigate } from 'react-router-dom'
import { CallToActionSection } from '../../components/landing/CallToActionSection'
import { ContactFormSection } from '../../components/landing/ContactFormSection'
import { FeaturesSection } from '../../components/landing/FeaturesSection'
import { HeroSection } from '../../components/landing/HeroSection'
import { ImageGallerySection } from '../../components/landing/ImageGallerySection'
import { InfoSection } from '../../components/landing/InfoSection'
import { LayoutWrapperSection } from '../../components/landing/LayoutWrapperSection'
import { MainContentSection } from '../../components/landing/MainContentSection'
import { NavigationBarSection } from '../../components/landing/NavigationBarSection'
import { PropertyDetailsSection } from '../../components/landing/PropertyDetailsSection'
import { PropertyOverviewSection } from '../../components/landing/PropertyOverviewSection'
import { TestimonialsSection } from '../../components/landing/TestimonialsSection'
import styles from './styles.module.css'

function LandingPage() {
  const navigate = useNavigate()

  return (
    <>
      <div className={styles['landing-page-container']}>
        <NavigationBarSection />

        <img
          className={styles['hero-background-img']}
          alt="Hero background"
          src="/hero-background.jpg"
        />

        <ImageGallerySection />

        <div className={styles['hero-frame-container']}>
          <article className={styles['hero-stats-item']}>
            <div className={styles['hero-stats-value']}>24/7</div>
            <div className={styles['hero-stats-label']}>זמינות מלאה</div>
          </article>
          <article className={styles['hero-stats-item']}>
            <div className={styles['hero-stats-value']}>100%</div>
            <div className={styles['hero-stats-label']}>ליווי מקצועי</div>
          </article>
          <article className={styles['hero-stats-item']}>
            <div className={styles['hero-stats-value']}>1,000+</div>
            <div className={styles['hero-stats-label']}>לקוחות מרוצים</div>
          </article>
        </div>

        <div
          className={`${styles['hero-button-container']} ${styles['hero-button-primary-container']}`}
        >
          <button
            className={styles['hero-primary-button']}
            aria-label="התחל תהליך קבלת היתר בניה"
            onClick={() => navigate('/auth?mode=signup')}
          >
            <span>התחל תהליך קבלת היתר בניה</span>
          </button>
        </div>

        <div
          className={`${styles['hero-button-container']} ${styles['hero-button-secondary-container']}`}
        >
          <button
            className={styles['hero-secondary-button']}
            aria-label="צור קשר"
            onClick={() => navigate('/auth?mode=signin')}
          >
            <span>צור קשר</span>
          </button>
        </div>

        <MainContentSection />

        <section className={styles['why-choose-section']}>
          <div className={styles['why-choose-content']}>
            <img
              className={styles['why-choose-image']}
              alt="בית מודרני מבטון"
              src="/why-choose-image.jpg"
            />
            <div className={styles['why-choose-text']}>
              <h2 className={styles['why-choose-title']}>למה לבחור בקל־היתר</h2>
              <InfoSection />
              <PropertyOverviewSection />
              <CallToActionSection />
              <HeroSection />
            </div>
          </div>
        </section>

        <FeaturesSection />
        <TestimonialsSection />
        <ContactFormSection />
      </div>

      <PropertyDetailsSection />
    </>
  )
}

export default LandingPage
