import React from 'react'
import PlanningRequest from '../components/PlanningRequest'
import '../components/FormPage.css'

const DashboardPage = () => {
  return (
    <div className="form-page">
      <div className="background-elements">
        <div className="bg-shape bg-shape-1"></div>
        <div className="bg-shape bg-shape-2"></div>
        <div className="bg-shape bg-shape-3"></div>
        <div className="bg-shape bg-shape-4"></div>
      </div>
      <PlanningRequest selectedPlan={null} onBack={null} />
    </div>
  )
}

export default DashboardPage

