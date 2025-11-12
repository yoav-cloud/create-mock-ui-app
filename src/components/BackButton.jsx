import { useNavigate } from 'react-router-dom'
import './BackButton.css'

function BackButton({ children = '← Back', className = '', to }) {
  const navigate = useNavigate()

  const handleClick = () => {
    if (to) {
      navigate(to)
    } else {
      navigate(-1) // Fallback to history if no path provided
    }
  }

  return (
    <button
      className={`back-button ${className}`}
      onClick={handleClick}
    >
      {children}
    </button>
  )
}

export default BackButton

