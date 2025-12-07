import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import LandingPage from './pages/LandingPage'
import AuthPage from './pages/AuthPage'
import TermsPage from './pages/TermsPage'
import DashboardPage from './pages/DashboardPage'
import AdminPage from './pages/AdminPage'
import MeasurementMapPage from './pages/MeasurementMapPage'
import SurveyorsListPage from './pages/SurveyorsListPage'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/measurement-map" element={<MeasurementMapPage />} />
          <Route path="/surveyors-list" element={<SurveyorsListPage />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } 
          />
          <Route path="/admin03254" element={<AdminPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
