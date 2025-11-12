import { useState } from 'react'
import './Generation.css'

function GenerationResults({ designId }) {
  const [selectedAsset, setSelectedAsset] = useState(null)

  // Mock generated assets with different colored backgrounds
  const assets = [
    { id: '1', name: 'Asset 1', color: '#FF6B6B' },
    { id: '2', name: 'Asset 2', color: '#4ECDC4' },
    { id: '3', name: 'Asset 3', color: '#45B7D1' },
    { id: '4', name: 'Asset 4', color: '#FFA07A' },
    { id: '5', name: 'Asset 5', color: '#98D8C8' },
    { id: '6', name: 'Asset 6', color: '#F7DC6F' },
    { id: '7', name: 'Asset 7', color: '#BB8FCE' },
    { id: '8', name: 'Asset 8', color: '#85C1E2' },
    { id: '9', name: 'Asset 9', color: '#F8B739' },
    { id: '10', name: 'Asset 10', color: '#52BE80' },
    { id: '11', name: 'Asset 11', color: '#EC7063' },
    { id: '12', name: 'Asset 12', color: '#5DADE2' },
  ]

  return (
    <div className="generation-page">
      <div className="generation-header">
        <h2 className="generation-title">Generation Results</h2>
        <p className="generation-subtitle">
          View and manage your generated design variations
        </p>
      </div>

      <div className="generation-results-content">
        <div className="generation-results-stats">
          <div className="generation-stat">
            <span className="generation-stat-value">{assets.length}</span>
            <span className="generation-stat-label">Total Assets</span>
          </div>
          <div className="generation-stat">
            <span className="generation-stat-value">2</span>
            <span className="generation-stat-label">Batches</span>
          </div>
          <div className="generation-stat">
            <span className="generation-stat-value">Today</span>
            <span className="generation-stat-label">Last Generated</span>
          </div>
        </div>

        <div className="generation-assets-grid">
          {assets.map((asset) => (
            <div
              key={asset.id}
              className={`generation-asset-card ${
                selectedAsset === asset.id ? 'selected' : ''
              }`}
              onClick={() =>
                setSelectedAsset(selectedAsset === asset.id ? null : asset.id)
              }
            >
              <div
                className="generation-asset-preview"
                style={{ backgroundColor: asset.color }}
              >
                <div className="generation-asset-overlay">
                  <span className="generation-asset-name">{asset.name}</span>
                </div>
              </div>
              <div className="generation-asset-footer">
                <span className="generation-asset-id">{asset.id}</span>
                <button className="generation-asset-action">Download</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default GenerationResults

