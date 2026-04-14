import { useState } from 'react'
import styles from '../styles.module.css'

const FORM_FIELDS = [
  { name: 'fullName', placeholder: 'שם מלא', type: 'text' },
  { name: 'email', placeholder: 'אימייל', type: 'email' },
  { name: 'phone', placeholder: 'טלפון', type: 'tel' },
]

export const ContactFormSection = () => {
  const [formData, setFormData] = useState({ fullName: '', email: '', phone: '' })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
  }

  return (
    <section className={styles['contact-form-section']}>
      <div className={styles['contact-form-content']}>
        <h2 className={styles['contact-form-title']}>
          <span className={styles['contact-form-title-normal']}>לא בטוחים מה הצעד הבא? </span>
          <span className={styles['contact-form-title-bold']}>אנחנו כאן בשבילכם</span>
        </h2>
        <p className={styles['contact-form-description']}>
          השאירו פרטים ונעזור לכם להבין בדיוק מה צריך לעשות
        </p>
        <form onSubmit={handleSubmit} className={styles['contact-form']}>
          {FORM_FIELDS.map((field) => (
            <div key={field.name} className={styles['contact-form-field-wrapper']}>
              <div className={styles['contact-form-input-wrapper']}>
                <label htmlFor={field.name} className={styles['sr-only']}>
                  {field.placeholder}
                </label>
                <input
                  type={field.type}
                  id={field.name}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleInputChange}
                  placeholder={field.placeholder}
                  className={styles['contact-form-input']}
                  required
                  aria-required="true"
                />
              </div>
            </div>
          ))}
          <div className={styles['contact-form-submit-wrapper']}>
            <button
              type="submit"
              className={styles['contact-form-submit-button']}
              aria-label="שלח טופס"
            >
              <img
                className={styles['contact-form-submit-icon']}
                alt=""
                src="https://c.animaapp.com/VuAXsrkU/img/linear---arrows---arrow-left.svg"
                aria-hidden="true"
              />
              <span className={styles['contact-form-submit-text']}>שלח</span>
            </button>
          </div>
        </form>
      </div>
      <img
        className={styles['contact-form-image']}
        alt="בית מודרני מבטון"
        src="https://c.animaapp.com/VuAXsrkU/img/3d-rendering-big-modern-concrete-house-2-1.png"
      />
    </section>
  )
}
