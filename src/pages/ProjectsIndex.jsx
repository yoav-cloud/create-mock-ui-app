import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import './ProjectsIndex.css'
import Button from '../components/Button'
import Modal from '../components/Modal'
import { useProject } from '../context/ProjectContext'
import { useDesign } from '../context/DesignContext'

function ProjectsIndex() {
  const navigate = useNavigate()
  const { projects, createProject } = useProject()
  const { getDesignsWithoutProject, getSubDesigns } = useDesign()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [projectName, setProjectName] = useState('')
  const [projectDescription, setProjectDescription] = useState('')
  const [standaloneDesigns, setStandaloneDesigns] = useState([])

  const { designs } = useDesign()

  useEffect(() => {
    // Get designs without a project
    // Watch the designs object to update when new designs are added
    const standaloneDesigns = getDesignsWithoutProject()
    setStandaloneDesigns(standaloneDesigns)
  }, [getDesignsWithoutProject, designs])

  const handleProjectClick = (projectId) => {
    navigate(`/projects/${projectId}`)
  }

  const handleCreateProject = () => {
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setProjectName('')
    setProjectDescription('')
  }

  const handleSubmitProject = (e) => {
    e.preventDefault()
    if (!projectName.trim()) return

    const newProject = createProject({
      name: projectName.trim(),
      description: projectDescription.trim(),
    })

    toast.success(`Project "${newProject.name}" created!`, { duration: 2000 })
    handleCloseModal()
    navigate(`/projects/${newProject.id}`)
  }

  const handleCreateDesign = () => {
    navigate('/create-design')
  }

  const handleDesignClick = (designId) => {
    navigate(`/designs/${designId}`)
  }

  return (
    <div className="projects-index">
      <div className="projects-header">
        <div>
          <h2 className="projects-title">Projects & Designs</h2>
          <p className="projects-subtitle">
            Manage your creative projects and designs
          </p>
        </div>
        <div className="projects-actions">
          <Button variant="secondary" onClick={handleCreateProject}>
            Create Project
          </Button>
          <Button variant="primary" onClick={handleCreateDesign}>
            Create Design
          </Button>
        </div>
      </div>

      {standaloneDesigns.length > 0 && (
        <div className="projects-section">
          <h3 className="projects-section-title">Standalone Designs</h3>
          <div className="projects-grid">
            {standaloneDesigns.map((design) => (
              <div
                key={design.id}
                className="project-card design-card"
                onClick={() => handleDesignClick(design.id)}
              >
                <div className="project-card-header">
                  <h3 className="project-card-title">{design.name}</h3>
                  {getSubDesigns(design.id).length > 0 && (
                    <span className="design-card-badge" title="Has sub-designs">
                      {getSubDesigns(design.id).length} sub{getSubDesigns(design.id).length !== 1 ? 's' : ''}
                    </span>
                  )}
                </div>
                {design.description && (
                  <p className="project-card-description">{design.description}</p>
                )}
                <div className="project-card-footer">
                  <span className="project-card-meta">
                    Updated {design.updatedAt ? new Date(design.updatedAt).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {projects.length === 0 ? (
        <div className="projects-empty">
          <p>No projects yet. Create your first project to get started.</p>
          <Button variant="primary" onClick={handleCreateProject}>
            Create Your First Project
          </Button>
        </div>
      ) : (
        <div className="projects-section">
          <h3 className="projects-section-title">Projects</h3>
          <div className="projects-grid">
            {projects.map((project) => (
              <div
                key={project.id}
                className="project-card"
                onClick={() => handleProjectClick(project.id)}
              >
                <div className="project-card-header">
                  <h3 className="project-card-title">{project.name}</h3>
                </div>
                {project.description && (
                  <p className="project-card-description">{project.description}</p>
                )}
                <div className="project-card-footer">
                  <span className="project-card-meta">
                    {project.designCount || 0} designs
                  </span>
                  <span className="project-card-meta">
                    Updated {project.updatedAt}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="Create New Project"
      >
        <form onSubmit={handleSubmitProject}>
          <div className="modal-form-group">
            <label htmlFor="project-name" className="modal-label">
              Project Name <span className="modal-required">*</span>
            </label>
            <input
              id="project-name"
              type="text"
              className="modal-input"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="Enter project name"
              required
              autoFocus
            />
          </div>
          <div className="modal-form-group">
            <label htmlFor="project-description" className="modal-label">
              Description
            </label>
            <textarea
              id="project-description"
              className="modal-textarea"
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
              placeholder="Enter project description (optional)"
              rows={4}
            />
          </div>
          <div className="modal-actions">
            <Button
              type="button"
              variant="secondary"
              onClick={handleCloseModal}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={!projectName.trim()}>
              Create Project
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default ProjectsIndex

