import { useState } from 'react'
import './YogaLayoutViewer.css'

const YogaLayoutViewer = ({ yogaLayout, designId = 'unknown' }) => {
  const [viewMode, setViewMode] = useState('json')

  if (!yogaLayout) {
    return (
      <div className="yoga-layout-viewer empty">
        <p>No Yoga Layout available</p>
      </div>
    )
  }

  const renderJSON = () => {
    return (
      <pre className="yoga-json">
        {JSON.stringify(yogaLayout, null, 2)}
      </pre>
    )
  }

  const renderTree = () => {
    return (
      <div className="yoga-tree">
        <div className="yoga-tree-node root">
          <div className="yoga-tree-node-header">
            <span className="yoga-tree-node-label">Root Container</span>
            <span className="yoga-tree-node-size">
              {yogaLayout.container.width} × {yogaLayout.container.height}
            </span>
          </div>
          <div className="yoga-tree-children">
            {yogaLayout.children.map((child, index) => (
              <div key={child.key || index} className={`yoga-tree-node child ${child.type}`}>
                <div className="yoga-tree-node-header">
                  <span className="yoga-tree-node-type">{child.type}</span>
                  <span className="yoga-tree-node-label">{child.displayName}</span>
                </div>
                <div className="yoga-tree-node-details">
                  <div className="yoga-tree-node-detail">
                    Position: ({child.layout.left}, {child.layout.top})
                  </div>
                  <div className="yoga-tree-node-detail">
                    Size: {child.layout.width} × {child.layout.height}
                  </div>
                  {child.text && (
                    <div className="yoga-tree-node-detail">
                      Text: "{child.text.content}"
                    </div>
                  )}
                  {child.image && (
                    <div className="yoga-tree-node-detail">
                      Image: {child.image.publicId || 'dynamic'}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const renderStats = () => {
    const textLayers = yogaLayout.children.filter(c => c.type === 'text')
    const imageLayers = yogaLayout.children.filter(c => c.type === 'image')

    return (
      <div className="yoga-stats">
        <div className="yoga-stat">
          <span className="yoga-stat-label">Container</span>
          <span className="yoga-stat-value">
            {yogaLayout.container.width} × {yogaLayout.container.height}
          </span>
        </div>
        <div className="yoga-stat">
          <span className="yoga-stat-label">Total Layers</span>
          <span className="yoga-stat-value">{yogaLayout.children.length}</span>
        </div>
        <div className="yoga-stat">
          <span className="yoga-stat-label">Text Layers</span>
          <span className="yoga-stat-value">{textLayers.length}</span>
        </div>
        <div className="yoga-stat">
          <span className="yoga-stat-label">Image Layers</span>
          <span className="yoga-stat-value">{imageLayers.length}</span>
        </div>
        <div className="yoga-stat">
          <span className="yoga-stat-label">Background</span>
          <span className="yoga-stat-value">{yogaLayout.container.backgroundColor}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="yoga-layout-viewer">
      <div className="yoga-layout-viewer-header">
        <h3>Yoga Layout: {designId}</h3>
        <div className="yoga-layout-viewer-tabs">
          <button
            type="button"
            className={`yoga-tab ${viewMode === 'tree' ? 'active' : ''}`}
            onClick={() => setViewMode('tree')}
          >
            Tree View
          </button>
          <button
            type="button"
            className={`yoga-tab ${viewMode === 'json' ? 'active' : ''}`}
            onClick={() => setViewMode('json')}
          >
            JSON
          </button>
          <button
            type="button"
            className={`yoga-tab ${viewMode === 'stats' ? 'active' : ''}`}
            onClick={() => setViewMode('stats')}
          >
            Stats
          </button>
        </div>
      </div>
      <div className="yoga-layout-viewer-content">
        {viewMode === 'json' && renderJSON()}
        {viewMode === 'tree' && renderTree()}
        {viewMode === 'stats' && renderStats()}
      </div>
    </div>
  )
}

export default YogaLayoutViewer

