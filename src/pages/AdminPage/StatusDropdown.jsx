import React, { useState } from 'react'

const StatusDropdown = ({ value, onChange, userId, onStatusChange, onClick }) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = React.useRef(null)

  const options = ['בטיפול', 'בקשה טופלה']

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleSelect = async (newStatus) => {
    setIsOpen(false)
    if (onStatusChange) {
      await onStatusChange(newStatus)
    }
    if (onChange) {
      onChange({ target: { value: newStatus } })
    }
  }

  return (
    <div
      ref={dropdownRef}
      style={{ position: 'relative', width: '100px' }}
      onClick={(e) => {
        e.stopPropagation()
        if (onClick) onClick(e)
      }}
    >
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{
          padding: '6px 28px 6px 12px',
          borderRadius: '12px',
          fontSize: '0.875rem',
          fontWeight: '600',
          border: '1px solid #e5e7eb',
          background: 'white',
          color: '#2C3E50',
          cursor: 'pointer',
          textAlign: 'center',
          transition: 'all 0.2s ease',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          minHeight: '35px'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = '#667eea'
          e.currentTarget.style.boxShadow = '0 2px 6px rgba(102, 126, 234, 0.2)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = '#e5e7eb'
          e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)'
        }}
      >
        <span style={{ flex: 1, textAlign: 'center' }}>{value || 'בטיפול'}</span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            marginLeft: '8px',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease'
          }}
        >
          <path d="M6 9L1 4h10z" fill="#6b7280" />
        </svg>
      </div>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            marginTop: '4px',
            background: 'white',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            border: '1px solid #e5e7eb',
            zIndex: 1000,
            overflow: 'hidden'
          }}
        >
          {options.map((option) => (
            <div
              key={option}
              onClick={() => handleSelect(option)}
              style={{
                padding: '10px 16px',
                fontSize: '0.875rem',
                fontWeight: value === option ? '600' : '500',
                color: value === option ? '#667eea' : '#2C3E50',
                background: value === option ? '#eef2ff' : 'white',
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'all 0.2s ease',
                borderBottom: option !== options[options.length - 1] ? '1px solid #f3f4f6' : 'none'
              }}
              onMouseEnter={(e) => {
                if (value !== option) {
                  e.currentTarget.style.background = '#f9fafb'
                }
              }}
              onMouseLeave={(e) => {
                if (value !== option) {
                  e.currentTarget.style.background = 'white'
                }
              }}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default StatusDropdown
