import React, { useState } from 'react'
import './PlansGallery.css'

const PlansGallery = ({ onBack, onSelectPlan }) => {
  const [selectedPlan, setSelectedPlan] = useState(null)

  const plans = [
    {
      id: 1,
      name: 'וילה מודרנית - 250 מ"ר',
      area: 250,
      rooms: 5,
      floors: 2,
      style: 'מודרני',
      description: 'וילה מרווחת עם גינה פרטית, מטבח אמריקאי וסוויטה מפוארת',
      features: ['גינה פרטית', 'מרפסת שמש', 'מחסן', 'חניה'],
      price: '1,200,000',
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop'
    },
    {
      id: 2,
      name: 'בית קרקע קלאסי - 180 מ"ר',
      area: 180,
      rooms: 4,
      floors: 1,
      style: 'קלאסי',
      description: 'בית קרקע מסורתי עם חצר גדולה, מתאים למשפחה',
      features: ['חצר גדולה', 'מרפסת', 'מחסן', 'חניה 2 רכבים'],
      price: '850,000',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop'
    },
    {
      id: 3,
      name: 'דופלקס עירוני - 120 מ"ר',
      area: 120,
      rooms: 3,
      floors: 2,
      style: 'עירוני',
      description: 'דופלקס מודרני במרכז העיר, קרוב לכל השירותים',
      features: ['מרפסת', 'מחסן', 'חניה', 'מעלית'],
      price: '950,000',
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop'
    },
    {
      id: 4,
      name: 'בית פרטי מינימליסטי - 200 מ"ר',
      area: 200,
      rooms: 4,
      floors: 1,
      style: 'מינימליסטי',
      description: 'עיצוב נקי ומינימליסטי עם חלונות גדולים ונוף',
      features: ['חלונות גדולים', 'גינה', 'מרפסת', 'חניה'],
      price: '1,100,000',
      image: 'https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800&h=600&fit=crop'
    },
    {
      id: 5,
      name: 'וילה יוקרתית - 350 מ"ר',
      area: 350,
      rooms: 6,
      floors: 2,
      style: 'יוקרתי',
      description: 'וילה מפוארת עם בריכה, חדר כושר וסוויטות',
      features: ['בריכה', 'חדר כושר', '2 סוויטות', 'גינה גדולה'],
      price: '2,500,000',
      image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&h=600&fit=crop'
    },
    {
      id: 6,
      name: 'בית קרקע משפחתי - 220 מ"ר',
      area: 220,
      rooms: 5,
      floors: 1,
      style: 'משפחתי',
      description: 'בית גדול ומרווח עם חדרי ילדים ופינת משחקים',
      features: ['פינת משחקים', 'מרפסת', 'גינה', 'חניה 3 רכבים'],
      price: '1,350,000',
      image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=600&fit=crop'
    },
    {
      id: 7,
      name: 'דופלקס יוקרתי - 180 מ"ר',
      area: 180,
      rooms: 4,
      floors: 2,
      style: 'יוקרתי',
      description: 'דופלקס מפואר עם מרפסת גדולה ונוף פנורמי',
      features: ['מרפסת גדולה', 'מחסן', 'חניה', 'מעלית'],
      price: '1,400,000',
      image: 'https://images.unsplash.com/photo-1600607688969-a5bfcd646154?w=800&h=600&fit=crop'
    },
    {
      id: 8,
      name: 'בית אקולוגי - 160 מ"ר',
      area: 160,
      rooms: 3,
      floors: 1,
      style: 'אקולוגי',
      description: 'בית ידידותי לסביבה עם פאנלים סולאריים ומיחזור',
      features: ['פאנלים סולאריים', 'גינה אורגנית', 'מיחזור', 'חניה'],
      price: '980,000',
      image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&h=600&fit=crop'
    },
    {
      id: 9,
      name: 'וילה ים תיכונית - 280 מ"ר',
      area: 280,
      rooms: 5,
      floors: 2,
      style: 'ים תיכוני',
      description: 'וילה בסגנון ים תיכוני עם קשתות ופטיו',
      features: ['פטיו', 'גינה ים תיכונית', 'מרפסת', 'חניה'],
      price: '1,600,000',
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop'
    },
    {
      id: 10,
      name: 'בית קרקע קטן - 140 מ"ר',
      area: 140,
      rooms: 3,
      floors: 1,
      style: 'מודרני',
      description: 'בית קטן וחמים, מושלם לזוג צעיר',
      features: ['מרפסת', 'גינה קטנה', 'מחסן', 'חניה'],
      price: '720,000',
      image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&h=600&fit=crop'
    },
    {
      id: 11,
      name: 'דופלקס עם גינה - 150 מ"ר',
      area: 150,
      rooms: 3,
      floors: 2,
      style: 'עירוני',
      description: 'דופלקס עם גינה פרטית במרכז העיר',
      features: ['גינה פרטית', 'מרפסת', 'מחסן', 'חניה'],
      price: '880,000',
      image: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&h=600&fit=crop'
    },
    {
      id: 12,
      name: 'בית פרטי עם בריכה - 300 מ"ר',
      area: 300,
      rooms: 5,
      floors: 1,
      style: 'יוקרתי',
      description: 'בית מפואר עם בריכה פרטית וגינה גדולה',
      features: ['בריכה', 'גינה גדולה', 'מרפסת', 'חניה 3 רכבים'],
      price: '2,200,000',
      image: 'https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800&h=600&fit=crop'
    },
    {
      id: 13,
      name: 'וילה עם נוף - 240 מ"ר',
      area: 240,
      rooms: 4,
      floors: 2,
      style: 'מודרני',
      description: 'וילה עם נוף פנורמי וטרסות',
      features: ['נוף פנורמי', 'טרסות', 'מרפסת', 'חניה'],
      price: '1,450,000',
      image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&h=600&fit=crop'
    },
    {
      id: 14,
      name: 'בית קרקע מסורתי - 190 מ"ר',
      area: 190,
      rooms: 4,
      floors: 1,
      style: 'מסורתי',
      description: 'בית בסגנון מסורתי עם חצר פנימית',
      features: ['חצר פנימית', 'מרפסת', 'מחסן', 'חניה'],
      price: '1,050,000',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop'
    },
    {
      id: 15,
      name: 'דופלקס מינימליסטי - 130 מ"ר',
      area: 130,
      rooms: 3,
      floors: 2,
      style: 'מינימליסטי',
      description: 'דופלקס בעיצוב נקי ומינימליסטי',
      features: ['עיצוב נקי', 'מרפסת', 'מחסן', 'חניה'],
      price: '920,000',
      image: 'https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800&h=600&fit=crop'
    },
    {
      id: 16,
      name: 'בית פרטי עם סוויטה - 210 מ"ר',
      area: 210,
      rooms: 4,
      floors: 1,
      style: 'יוקרתי',
      description: 'בית עם סוויטה מפוארת ומטבח גדול',
      features: ['סוויטה', 'מטבח גדול', 'מרפסת', 'חניה'],
      price: '1,280,000',
      image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=600&fit=crop'
    },
    {
      id: 17,
      name: 'וילה עם חדר כושר - 320 מ"ר',
      area: 320,
      rooms: 6,
      floors: 2,
      style: 'יוקרתי',
      description: 'וילה מפוארת עם חדר כושר וסוויטות',
      features: ['חדר כושר', '2 סוויטות', 'גינה', 'חניה 4 רכבים'],
      price: '2,800,000',
      image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&h=600&fit=crop'
    },
    {
      id: 18,
      name: 'בית קרקע עם מחסן גדול - 170 מ"ר',
      area: 170,
      rooms: 4,
      floors: 1,
      style: 'מעשי',
      description: 'בית עם מחסן גדול וחניה מרווחת',
      features: ['מחסן גדול', 'מרפסת', 'גינה', 'חניה 2 רכבים'],
      price: '950,000',
      image: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&h=600&fit=crop'
    },
    {
      id: 19,
      name: 'דופלקס עם גג - 160 מ"ר',
      area: 160,
      rooms: 3,
      floors: 2,
      style: 'עירוני',
      description: 'דופלקס עם גג גדול ונוף',
      features: ['גג גדול', 'מרפסת', 'מחסן', 'חניה'],
      price: '1,100,000',
      image: 'https://images.unsplash.com/photo-1600607688969-a5bfcd646154?w=800&h=600&fit=crop'
    },
    {
      id: 20,
      name: 'בית פרטי יוקרתי - 270 מ"ר',
      area: 270,
      rooms: 5,
      floors: 1,
      style: 'יוקרתי',
      description: 'בית מפואר עם גינה מטופחת ונוף',
      features: ['גינה מטופחת', 'מרפסת גדולה', 'סוויטה', 'חניה 3 רכבים'],
      price: '1,750,000',
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop'
    }
  ]

  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan)
    if (onSelectPlan) {
      onSelectPlan(plan)
    }
  }

  return (
    <div className="plans-gallery">
      <div className="plans-header">
        <button onClick={onBack} className="back-button">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          חזרה לטופס
        </button>
        <h2 className="step-indicator-title">שלב 1: בעלי עניין</h2>
        <h1 className="plans-title">בחר תוכנית אדריכלית</h1>
        <p className="plans-subtitle">20 תוכניות מוכנות לבחירה</p>
      </div>

      <div className="plans-grid">
        {plans.map(plan => (
          <div 
            key={plan.id} 
            className={`plan-card ${selectedPlan?.id === plan.id ? 'selected' : ''}`}
            onClick={() => handleSelectPlan(plan)}
          >
            <div className="plan-image">
              <img 
                src={plan.image} 
                alt={plan.name}
                className="plan-image-img"
                loading="lazy"
                onError={(e) => {
                  e.target.style.display = 'none'
                  e.target.nextElementSibling.style.display = 'flex'
                }}
              />
              <div className="plan-image-placeholder" style={{ display: 'none' }}>
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 21H21V19H3V21ZM5 17H19L18 15H6L5 17ZM6 13H18L17 11H7L6 13ZM7 9H17L16 7H8L7 9ZM8 5H16L15 3H9L8 5Z" fill="currentColor"/>
                </svg>
              </div>
              <div className="plan-badge">{plan.style}</div>
            </div>
            
            <div className="plan-content">
              <h3 className="plan-name">{plan.name}</h3>
              <p className="plan-description">{plan.description}</p>
              
              <div className="plan-details">
                <div className="plan-detail-item">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>{plan.area} מ"ר</span>
                </div>
                <div className="plan-detail-item">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M9 22V12H15V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>{plan.rooms} חדרים</span>
                </div>
                <div className="plan-detail-item">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 21H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M5 21V7H19V21" stroke="currentColor" strokeWidth="2"/>
                    <path d="M5 7L12 3L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  <span>{plan.floors} קומות</span>
                </div>
              </div>

              <div className="plan-features">
                {plan.features.map((feature, idx) => (
                  <span key={idx} className="plan-feature-tag">{feature}</span>
                ))}
              </div>

              <div className="plan-footer">
                <button className="select-plan-button">
                  בחר תוכנית
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="plans-footer">
        <a 
          href="https://www.gov.il/he/departments/israel_land_authority/govil-landing-page" 
          target="_blank" 
          rel="noopener noreferrer"
          className="footer-link"
        >
          מקרקעי ישראל - אתר רשמי
        </a>
      </div>
    </div>
  )
}

export default PlansGallery

