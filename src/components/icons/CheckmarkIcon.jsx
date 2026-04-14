const CheckmarkIcon = ({ width = 24, height = 24, className, stroke = 'currentColor', strokeWidth = 2 }) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M20 6L9 17L4 12"
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

export default CheckmarkIcon
