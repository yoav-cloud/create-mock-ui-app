import { useLocation } from 'react-router-dom'
import './Templates.css'
import BackButton from '../components/BackButton'

function Templates() {
  const location = useLocation()
  const projectId = location.state?.projectId

  return (
    <div className="templates">
      <div className="templates-header">
        <BackButton to="/create-design" />
        <h1 className="templates-title">Create Templates Just For You</h1>
        <p className="templates-subtitle">
          We're working on building a template library for you
        </p>
      </div>

      <div className="templates-content">
        <div className="templates-placeholder">
          <div className="templates-placeholder-icon">🚧</div>
          <h2 className="templates-placeholder-title">In the Works</h2>
          <p className="templates-placeholder-description">
            Our template library is coming soon. You'll be able to choose from
            hundreds of professionally designed templates to get started quickly.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Templates

