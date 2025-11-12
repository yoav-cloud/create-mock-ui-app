import { Routes, Route } from 'react-router-dom'
import { DesignProvider } from './context/DesignContext'
import { ProjectProvider } from './context/ProjectContext'
import Layout from './components/Layout'
import ProjectsIndex from './pages/ProjectsIndex'
import ProjectDetail from './pages/ProjectDetail'
import DesignDashboard from './pages/DesignDashboard'
import PreDesignEditor from './pages/PreDesignEditor'
import Templates from './pages/Templates'
import Editor from './pages/Editor'
import BrandCenter from './pages/BrandCenter'

function App() {
  return (
    <ProjectProvider>
      <DesignProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<ProjectsIndex />} />
            <Route path="/projects/:projectId" element={<ProjectDetail />} />
            <Route path="/designs/:designId/*" element={<DesignDashboard />} />
            <Route path="/create-design" element={<PreDesignEditor />} />
            <Route path="/templates" element={<Templates />} />
            <Route path="/editor" element={<Editor />} />
            <Route path="/editor/:designId" element={<Editor />} />
            <Route path="/brand-center" element={<BrandCenter />} />
          </Routes>
        </Layout>
      </DesignProvider>
    </ProjectProvider>
  )
}

export default App

