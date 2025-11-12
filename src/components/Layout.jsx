import { useNavigate } from 'react-router-dom'
import './Layout.css'

function Layout({ children }) {
  const navigate = useNavigate()

  return (
    <div className="layout">
      <header className="layout-header">
        <div className="layout-container">
          <div className="layout-header-content">
            <h1 
              className="layout-title"
              onClick={() => navigate('/')}
              style={{ cursor: 'pointer' }}
            >
              Cloudinary Create
            </h1>
            <nav className="layout-nav">
              <button
                className="layout-nav-link"
                onClick={() => navigate('/brand-center')}
              >
                Brand Center
              </button>
              <button
                className="layout-nav-link"
                onClick={() => navigate('/preferences')}
              >
                Preferences
              </button>
            </nav>
          </div>
        </div>
      </header>
      <main className="layout-main">
        <div className="layout-container">
          {children}
        </div>
      </main>
    </div>
  )
}

export default Layout

