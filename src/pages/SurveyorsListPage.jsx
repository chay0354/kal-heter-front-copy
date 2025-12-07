import React from 'react'
import { useNavigate } from 'react-router-dom'
import './SurveyorsListPage.css'

function SurveyorsListPage() {
  const navigate = useNavigate()

  // Sample surveyors data - you can replace this with API data later
  const surveyors = [
    {
      id: 1,
      name: 'משה לוי',
      phone: '050-1234567',
      email: 'moshe@gmail.com',
      area: 'תל אביב והסביבה'
    },
    {
      id: 2,
      name: 'משה לוי',
      phone: '050-1234567',
      email: 'moshe@gmail.com',
      area: 'תל אביב והסביבה'
    },
    {
      id: 3,
      name: 'משה לוי',
      phone: '050-1234567',
      email: 'moshe@gmail.com',
      area: 'תל אביב והסביבה'
    },
    {
      id: 4,
      name: 'משה לוי',
      phone: '050-1234567',
      email: 'moshe@gmail.com',
      area: 'תל אביב והסביבה'
    },
    {
      id: 5,
      name: 'משה לוי',
      phone: '050-1234567',
      email: 'moshe@gmail.com',
      area: 'תל אביב והסביבה'
    },
    {
      id: 6,
      name: 'משה לוי',
      phone: '050-1234567',
      email: 'moshe@gmail.com',
      area: 'תל אביב והסביבה'
    },
    {
      id: 7,
      name: 'משה לוי',
      phone: '050-1234567',
      email: 'moshe@gmail.com',
      area: 'תל אביב והסביבה'
    }
  ]

  return (
    <div className="surveyors-list-page">
      <div className="surveyors-list-container">
        <div className="surveyors-list-content">
          <button 
            className="back-button"
            onClick={() => navigate('/measurement-map')}
            type="button"
          >
            <svg 
              className="back-arrow-icon" 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                d="M15 18L9 12L15 6" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
            <span className="back-button-text">חזרה למסך הקודם</span>
          </button>

          <div className="surveyors-list-card">
            <h1 className="surveyors-list-title">רשימת מודדים מומלצים</h1>
            
            <div className="surveyors-intro">
              <p className="intro-text">
                עלות הפקת מפת המדידה אינה כלולה בתשלום עבור תהליך קבלת היתר הבנייה.
              </p>
              <p className="intro-text">
                ניתן לבחור כל מודד מוסמך ולעבוד מולו באופן פרטי, לפי העדפתכם ולוחות הזמנים שנוחים לכם.
              </p>
            </div>

            <div className="surveyors-table-container">
              <table className="surveyors-table">
                <thead>
                  <tr>
                    <th className="th-name">שם המודד</th>
                    <th className="th-phone">טלפון</th>
                    <th className="th-email">אימייל</th>
                    <th className="th-area">
                      אזור פעילות
                      <svg className="chevron-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {surveyors.map((surveyor, index) => (
                    <tr key={surveyor.id}>
                      <td className="td-name">{surveyor.name}</td>
                      <td className="td-phone">{surveyor.phone}</td>
                      <td className="td-email">
                        {surveyor.email}
                      </td>
                      <td className="td-area">{surveyor.area}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SurveyorsListPage

