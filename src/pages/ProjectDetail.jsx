import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import './ProjectDetail.css'
import designsData from '../data/designs.json'
import Button from '../components/Button'
import BackButton from '../components/BackButton'
import { useProject } from '../context/ProjectContext'
import { useDesign } from '../context/DesignContext'

function ProjectDetail() {
  const { projectId } = useParams()
  const navigate = useNavigate()
  const { getProject, updateProjectDesignCount } = useProject()
  const { getDesignsByProject, getSubDesigns } = useDesign()
  const [project, setProject] = useState(null)
  const [designs, setDesigns] = useState([])

  useEffect(() => {
    // Find project from context (includes newly created projects)
    const foundProject = getProject(projectId)
    setProject(foundProject)

    // Get designs from both static data and session context
    const staticDesigns = designsData[projectId] || []
    const sessionDesigns = getDesignsByProject(projectId)
    
    // Combine and deduplicate (session designs take precedence)
    // Filter out sub-designs - only show parent designs in project view
    const allDesigns = [...staticDesigns]
    sessionDesigns.forEach((sessionDesign) => {
      const existingIndex = allDesigns.findIndex((d) => d.id === sessionDesign.id)
      if (existingIndex >= 0) {
        allDesigns[existingIndex] = sessionDesign
      } else {
        allDesigns.push(sessionDesign)
      }
    })
    
    // Filter out sub-designs (only show designs without parentId)
    const parentDesigns = allDesigns.filter((d) => !d.parentId)
    setDesigns(parentDesigns)
    
    // Update project design count (only count parent designs)
    if (foundProject) {
      updateProjectDesignCount(projectId, parentDesigns.length)
    }
  }, [projectId, getProject, getDesignsByProject, updateProjectDesignCount])

  if (!project) {
    return (
      <div className="project-detail">
        <div className="project-detail-error">
          <p>Project not found</p>
          <Button onClick={() => navigate('/')}>Back to Projects</Button>
        </div>
      </div>
    )
  }

  const handleDesignClick = (designId) => {
    navigate(`/designs/${designId}`)
  }

  const handleCreateDesign = () => {
    navigate('/create-design', { state: { projectId } })
  }

  return (
    <div className="project-detail">
      <div className="project-detail-header">
        <div>
          <BackButton to="/" />
          <h1 className="project-detail-title">{project.name}</h1>
          {project.description && (
            <p className="project-detail-description">{project.description}</p>
          )}
        </div>
        <Button variant="primary" onClick={handleCreateDesign}>
          Create Design
        </Button>
      </div>

      <div className="project-detail-meta">
        <span className="project-detail-meta-item">
          <strong>Designs:</strong> {designs.length}
        </span>
        <span className="project-detail-meta-item">
          <strong>Updated:</strong> {project.updatedAt}
        </span>
      </div>

      {designs.length === 0 ? (
        <div className="designs-empty">
          <p>No designs in this project yet.</p>
          <Button variant="primary" onClick={handleCreateDesign}>
            Create Your First Design
          </Button>
        </div>
      ) : (
        <div className="designs-grid">
          {designs.map((design) => (
            <div
              key={design.id}
              className="design-card"
              onClick={() => handleDesignClick(design.id)}
            >
              <div className="design-card-header">
                <h3 className="design-card-title">{design.name}</h3>
                {getSubDesigns(design.id).length > 0 && (
                  <span className="design-card-badge" title="Has sub-designs">
                    {getSubDesigns(design.id).length} sub{getSubDesigns(design.id).length !== 1 ? 's' : ''}
                  </span>
                )}
              </div>
              {design.description && (
                <p className="design-card-description">{design.description}</p>
              )}
              <div className="design-card-footer">
                <span className="design-card-meta">
                  Updated {design.updatedAt}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ProjectDetail

