import React, { useState } from 'react'
import styles from './styles.module.css'
import ChevronDownIcon from '../../../components/icons/ChevronDownIcon'

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
      className={styles.wrapper}
      onClick={(e) => {
        e.stopPropagation()
        if (onClick) onClick(e)
      }}
    >
      <div
        className={styles.trigger}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={styles['trigger-text']}>{value || 'בטיפול'}</span>
        <ChevronDownIcon
          width={12}
          height={12}
          className={`${styles.chevron}${isOpen ? ` ${styles.open}` : ''}`}
        />
      </div>

      {isOpen && (
        <div className={styles.menu}>
          {options.map((option) => (
            <div
              key={option}
              className={`${styles.option}${value === option ? ` ${styles.selected}` : ''}`}
              onClick={() => handleSelect(option)}
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
