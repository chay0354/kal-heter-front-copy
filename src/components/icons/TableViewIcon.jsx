const TableViewIcon = ({ width = 16, height = 16, className }) => (
  <svg
    className={className}
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="3" y="3" width="18" height="4" rx="1" fill="currentColor" />
    <rect x="3" y="10" width="18" height="4" rx="1" fill="currentColor" />
    <rect x="3" y="17" width="18" height="4" rx="1" fill="currentColor" />
  </svg>
)

export default TableViewIcon
