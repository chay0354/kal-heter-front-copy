const ClockIcon = ({ width = 24, height = 24, className, stroke = 'currentColor' }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <circle cx="12" cy="12" r="10" stroke={stroke} strokeWidth="2" />
    <path d="M12 6V12L16 14" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
  </svg>
)

export default ClockIcon
