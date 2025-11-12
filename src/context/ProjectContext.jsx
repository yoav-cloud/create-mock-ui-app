import { createContext, useContext, useState } from 'react'
import projectsData from '../data/projects.json'

const ProjectContext = createContext()

export function ProjectProvider({ children }) {
  const [projects, setProjects] = useState(() => {
    // Initialize with static data
    return projectsData
  })

  const createProject = (projectData) => {
    const newProject = {
      id: `project-${Date.now()}`,
      name: projectData.name,
      description: projectData.description || '',
      status: 'draft',
      designCount: 0,
      updatedAt: 'Just now',
      createdAt: new Date().toISOString(),
    }
    setProjects((prev) => [...prev, newProject])
    return newProject
  }

  const getProject = (projectId) => {
    return projects.find((p) => p.id === projectId) || null
  }

  const updateProjectDesignCount = (projectId, count) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projectId ? { ...p, designCount: count } : p
      )
    )
  }

  return (
    <ProjectContext.Provider
      value={{
        projects,
        createProject,
        getProject,
        updateProjectDesignCount,
      }}
    >
      {children}
    </ProjectContext.Provider>
  )
}

export function useProject() {
  const context = useContext(ProjectContext)
  if (!context) {
    throw new Error('useProject must be used within ProjectProvider')
  }
  return context
}

