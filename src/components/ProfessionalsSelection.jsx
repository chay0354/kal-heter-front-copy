import React, { useState } from 'react'
import './ProfessionalsSelection.css'

const ProfessionalsSelection = ({ onBack }) => {
  const professionals = [
    { id: 1, name: 'יוסי כהן', phone: '050-1234567', area: 'מרכז', rating: 4.8 },
    { id: 2, name: 'שרה לוי', phone: '052-2345678', area: 'צפון', rating: 4.9 },
    { id: 3, name: 'דוד אברהם', phone: '054-3456789', area: 'דרום', rating: 4.7 },
    { id: 4, name: 'רחל דוד', phone: '050-4567890', area: 'ירושלים', rating: 4.8 },
    { id: 5, name: 'משה ישראלי', phone: '052-5678901', area: 'מרכז', rating: 4.6 }
  ]

  return (
    <div className="professionals-selection">
      <div className="professionals-container">
        <div className="professionals-header">
          <button onClick={onBack} className="back-button">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            חזרה
          </button>
          <h1 className="professionals-title">בחירת מודדים</h1>
        </div>

        <div className="professionals-list">
          {professionals.map(professional => (
            <div key={professional.id} className="professional-card">
              <div className="professional-info">
                <h3 className="professional-name">{professional.name}</h3>
                <p className="professional-detail">אזור: {professional.area}</p>
                <div className="professional-rating">
                  <span className="rating-value">{professional.rating}</span>
                  <span className="rating-stars">★★★★★</span>
                </div>
              </div>
              <div className="professional-contact">
                <a href={`tel:${professional.phone}`} className="phone-link">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22 16.92V19.92C22.0011 20.1985 21.9441 20.4742 21.8325 20.7292C21.7209 20.9842 21.5573 21.2126 21.3518 21.3999C21.1463 21.5872 20.9033 21.7293 20.6391 21.8167C20.3749 21.9041 20.0955 21.9349 19.82 21.907C16.7428 21.5856 13.787 20.5341 11.19 18.85C8.77382 17.3147 6.72533 15.2662 5.19 12.85C3.49997 10.2412 2.44824 7.27099 2.13 4.18C2.10211 3.90453 2.13288 3.62514 2.2203 3.36093C2.30772 3.09671 2.44983 2.85368 2.63713 2.64818C2.82443 2.44268 3.05284 2.27912 3.30783 2.16751C3.56283 2.0559 3.83852 1.99893 4.117 2H7.12C7.68147 1.99522 8.22047 2.16708 8.658 2.49C9.09553 2.81292 9.40829 3.27008 9.55 3.79L10.77 8.07C10.8951 8.58295 10.8563 9.12355 10.6583 9.61778C10.4603 10.112 10.1126 10.5392 9.66 10.85L8.09 12C9.51443 14.4133 11.5867 16.4856 14 17.91L15.15 16.34C15.4608 15.8874 15.888 15.5397 16.3822 15.3417C16.8765 15.1437 17.4171 15.1049 17.93 15.23L22.21 16.45C22.7309 16.5917 23.1881 16.9045 23.511 17.342C23.8339 17.7795 24.0058 18.3185 24.001 18.88L22 16.92H22.001Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  {professional.phone}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ProfessionalsSelection

