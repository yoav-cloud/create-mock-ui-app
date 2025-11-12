import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
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
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 2000,
                iconTheme: {
                  primary: '#4caf50',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 4000,
                iconTheme: {
                  primary: '#f44336',
                  secondary: '#fff',
                },
              },
            }}
          />
        </Layout>
      </DesignProvider>
    </ProjectProvider>
  )
}

export default App

