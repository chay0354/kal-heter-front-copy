import React, { useState } from 'react'
import './App.css'
import HomePage from './components/HomePage'
import FormPage from './components/FormPage'

function App() {
  const [isSignedIn, setIsSignedIn] = useState(false)

  const handleSignIn = () => {
    setIsSignedIn(true)
  }

  return (
    <div className="app">
      {!isSignedIn ? (
        <HomePage onSignIn={handleSignIn} />
      ) : (
        <FormPage />
      )}
    </div>
  )
}

export default App

