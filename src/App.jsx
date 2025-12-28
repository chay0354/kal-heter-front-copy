import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import LandingPage from './pages/LandingPage'
import AuthPage from './pages/AuthPage'
import TermsPage from './pages/TermsPage'
import DashboardPage from './pages/DashboardPage'
import AdminPage from './pages/AdminPage'
import MeasurementMapPage from './pages/MeasurementMapPage'
import ProcessExplanationPage from './pages/ProcessExplanationPage'
import SurveyorsListPage from './pages/SurveyorsListPage'
import SummaryPage from './pages/SummaryPage'
import ProtectedRoute from './components/ProtectedRoute'
import PlanningRequest from './components/PlanningRequest'

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/process-explanation" element={<ProcessExplanationPage />} />
          <Route path="/measurement-map" element={<MeasurementMapPage />} />
          <Route path="/surveyors-list" element={<SurveyorsListPage />} />
          <Route 
            path="/personal-details" 
            element={
              <ProtectedRoute>
                <PlanningRequest showFields={true} selectedPlan={null} onBack={null} nextPath="/property-details" />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/property-details" 
            element={
              <ProtectedRoute>
                <PlanningRequest showFields={false} selectedPlan={null} onBack={null} nextPath="/property-details-final" />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/property-details-final" 
            element={
              <ProtectedRoute>
                <PlanningRequest showFields={false} hideSections={true} selectedPlan={null} onBack={null} nextPath="/home-catalog" />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/home-catalog" 
            element={
              <ProtectedRoute>
                <PlanningRequest showFields={false} hideSections={true} hideMeasurement={true} selectedPlan={null} onBack={null} nextPath="/summary" />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/summary" 
            element={
              <ProtectedRoute>
                <SummaryPage />
              </ProtectedRoute>
            } 
          />
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
