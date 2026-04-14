import { useState } from 'react'
import BuildingIcon from '../icons/BuildingIcon'
import DocumentFileIcon from '../icons/DocumentFileIcon'
import ChevronRightIcon from '../icons/ChevronRightIcon'
import PlanningRequest from '../PlanningRequest'
import styles from './styles.module.css'

const REGIONS = ['צפון', 'חיפה', 'מרכז', 'תל אביב', 'ירושלים', 'דרום', 'יהודה ושומרון']

const FormPage = () => {
  const [formData, setFormData] = useState({
    gush: '',
    helka: '',
    surveyMap: null,
    region: '',
    council: '',
    isIsraelLandAuthority: false,
  })
  const [errors, setErrors] = useState({})
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [showPlanningRequest, setShowPlanningRequest] = useState(false)

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData((prev) => ({ ...prev, surveyMap: file }))
      if (errors.surveyMap) {
        setErrors((prev) => ({ ...prev, surveyMap: '' }))
      }
    }
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.gush.trim()) newErrors.gush = 'נא להזין גוש'
    if (!formData.helka.trim()) newErrors.helka = 'נא להזין חלקה'
    if (!formData.surveyMap) newErrors.surveyMap = 'נא להעלות מפת מדידה'
    if (!formData.region) newErrors.region = 'נא לבחור איזור'
    if (!formData.council.trim()) newErrors.council = 'נא להזין שם מועצה'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateForm()) setShowPlanningRequest(true)
  }

  if (showPlanningRequest) {
    return (
      <div className={styles['form-page']}>
        <div className={styles['background-elements']}>
          <div className={`${styles['bg-shape']} ${styles['bg-shape-1']}`}></div>
          <div className={`${styles['bg-shape']} ${styles['bg-shape-2']}`}></div>
          <div className={`${styles['bg-shape']} ${styles['bg-shape-3']}`}></div>
          <div className={`${styles['bg-shape']} ${styles['bg-shape-4']}`}></div>
        </div>
        <PlanningRequest
          selectedPlan={selectedPlan}
          onBack={() => { setShowPlanningRequest(false); setSelectedPlan(null) }}
        />
      </div>
    )
  }

  return (
    <div className={styles['form-page']}>
      <div className={styles['background-elements']}>
        <div className={`${styles['bg-shape']} ${styles['bg-shape-1']}`}></div>
        <div className={`${styles['bg-shape']} ${styles['bg-shape-2']}`}></div>
        <div className={`${styles['bg-shape']} ${styles['bg-shape-3']}`}></div>
        <div className={`${styles['bg-shape']} ${styles['bg-shape-4']}`}></div>
      </div>

      <div className={styles['form-container']}>
        <div className={styles['form-header']}>
          <div className={styles['logo-section']}>
            <div className={styles['logo-icon']}>
              <BuildingIcon />
            </div>
            <h1 className={styles['form-title']}>קל-היתר</h1>
            <p className={styles['form-subtitle']}>מערכת להיתרי בנייה</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className={styles['form-content']}>
          <div className={styles['form-section']}>
            <h2 className={styles['section-title']}>פרטי הנכס</h2>
            <div className={styles['form-row']}>
              <div className={styles['form-group']}>
                <label htmlFor="gush" className={styles['form-label']}>
                  גוש <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  id="gush"
                  name="gush"
                  value={formData.gush}
                  onChange={handleInputChange}
                  className={`${styles['form-input']} ${errors.gush ? styles.error : ''} ${styles['text-input']}`}
                  placeholder="הזן מספר גוש"
                />
                {errors.gush && <span className={styles['error-message']}>{errors.gush}</span>}
              </div>

              <div className={styles['form-group']}>
                <label htmlFor="helka" className={styles['form-label']}>
                  חלקה <span className={styles.required}>*</span>
                </label>
                <input
                  type="text"
                  id="helka"
                  name="helka"
                  value={formData.helka}
                  onChange={handleInputChange}
                  className={`${styles['form-input']} ${errors.helka ? styles.error : ''} ${styles['text-input']}`}
                  placeholder="הזן מספר חלקה"
                />
                {errors.helka && <span className={styles['error-message']}>{errors.helka}</span>}
              </div>
            </div>
          </div>

          <div className={styles['form-section']}>
            <h2 className={styles['section-title']}>מפת מדידה</h2>
            <div className={styles['file-upload-container']}>
              <input
                type="file"
                id="surveyMap"
                name="surveyMap"
                onChange={handleFileChange}
                className={styles['file-input']}
                accept=".pdf,.jpg,.jpeg,.png,.dwg,.dxf"
              />
              <label
                htmlFor="surveyMap"
                className={`${styles['file-label']} ${errors.surveyMap ? styles.error : ''} ${formData.surveyMap ? styles['has-file'] : ''}`}
              >
                <div className={styles['file-icon']}>
                  <DocumentFileIcon />
                </div>
                {formData.surveyMap ? (
                  <div className={styles['file-info']}>
                    <span className={styles['file-name']}>{formData.surveyMap.name}</span>
                    <span className={styles['file-size']}>
                      {(formData.surveyMap.size / 1024).toFixed(2)} KB
                    </span>
                  </div>
                ) : (
                  <div className={styles['file-info']}>
                    <span className={styles['file-placeholder']}>לחץ לבחירת קובץ או גרור לכאן</span>
                    <span className={styles['file-hint']}>PDF, JPG, PNG, DWG, DXF</span>
                  </div>
                )}
              </label>
              {errors.surveyMap && <span className={styles['error-message']}>{errors.surveyMap}</span>}
            </div>
          </div>

          <div className={styles['form-section']}>
            <h2 className={styles['section-title']}>מיקום</h2>
            <div className={styles['form-group']}>
              <label htmlFor="region" className={styles['form-label']}>
                איזור בארץ <span className={styles.required}>*</span>
              </label>
              <select
                id="region"
                name="region"
                value={formData.region}
                onChange={handleInputChange}
                className={`${styles['form-select']} ${errors.region ? styles.error : ''} ${styles['text-input']}`}
              >
                <option value="">בחר איזור</option>
                {REGIONS.map((region) => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>
              {errors.region && <span className={styles['error-message']}>{errors.region}</span>}
            </div>

            <div className={styles['form-group']}>
              <label htmlFor="council" className={styles['form-label']}>
                שם מועצה <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                id="council"
                name="council"
                value={formData.council}
                onChange={handleInputChange}
                className={`${styles['form-input']} ${errors.council ? styles.error : ''} ${styles['text-input']}`}
                placeholder="הזן שם מועצה"
              />
              {errors.council && <span className={styles['error-message']}>{errors.council}</span>}
            </div>
          </div>

          <div className={styles['form-section']}>
            <div className={styles['form-group']}>
              <label className={styles['checkbox-label']}>
                <input
                  type="checkbox"
                  name="isIsraelLandAuthority"
                  checked={formData.isIsraelLandAuthority}
                  onChange={handleInputChange}
                />
                <span>האם השטח הוא בבעלות מקרקעי ישראל</span>
              </label>
            </div>
          </div>

          <div className={styles['form-actions']}>
            <button type="submit" className={styles['submit-button']}>
              <span>בחר תוכנית</span>
              <ChevronRightIcon />
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default FormPage
