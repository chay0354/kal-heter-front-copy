import { useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { TERMS_SECTIONS } from '../constants/termsContent'
import styles from './TermsPage.module.css'

function TermsPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const from = searchParams.get('from')
  const mode = searchParams.get('mode') || 'signup'
  const closeButtonRef = useRef(null)
  const modalRef = useRef(null)

  const handleClose = () => {
    if (from === 'auth') {
      navigate(`/auth?mode=${mode}`)
    } else {
      navigate('/')
    }
  }

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') handleClose()
    }

    if (closeButtonRef.current) {
      closeButtonRef.current.focus()
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [from, mode])

  return (
    <div className={styles['home-page']}>
      <div className={styles['home-container']}>
        <div className={styles['home-content']}>
          <div className={styles['logo-section']}>
            <div className={styles['logo-circle']}>
              <div className={styles['logo-inner']}>
                <span className={styles['logo-text']}>קל</span>
              </div>
            </div>
            <h1 className={styles['main-title']}>תנאי שימוש</h1>
            <div className={styles['title-line']}></div>
          </div>

          <div
            className={styles['terms-modal']}
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="terms-modal-title"
          >
            <div className={styles['terms-modal-header']}>
              <h2 id="terms-modal-title">תנאי שימוש</h2>
            </div>
            <div className={styles['terms-modal-content']}>
              {TERMS_SECTIONS.map((section) => (
                <div key={section.id}>
                  <h3>{section.title}</h3>
                  {section.content.map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))}
                </div>
              ))}
            </div>
            <div className={styles['terms-modal-footer']}>
              <button
                ref={closeButtonRef}
                className={styles['terms-accept-button']}
                onClick={handleClose}
                aria-label={from === 'auth' ? 'חזרה לעמוד ההרשמה' : 'חזרה לעמוד הבית'}
              >
                {from === 'auth' ? 'חזרה להרשמה' : 'חזרה לעמוד הבית'}
              </button>
            </div>
          </div>
        </div>

        <div className={styles['decorative-elements']}>
          <div className={`${styles.circle} ${styles['circle-1']}`}></div>
          <div className={`${styles.circle} ${styles['circle-2']}`}></div>
          <div className={`${styles.circle} ${styles['circle-3']}`}></div>
          <div className={`${styles.triangle} ${styles['triangle-1']}`}></div>
          <div className={`${styles.triangle} ${styles['triangle-2']}`}></div>
        </div>
      </div>
    </div>
  )
}

export default TermsPage
