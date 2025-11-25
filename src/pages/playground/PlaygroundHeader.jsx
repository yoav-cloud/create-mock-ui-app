import React from 'react'
import { ASSETS } from './constants'
import './PlaygroundHeader.css'

export default function PlaygroundHeader({ selectedAsset, onAssetChange }) {
  return (
    <div className="playground-header">
      <h2>Design Playground</h2>
      <div className="asset-selector-container">
        <div className="asset-selector">
          {ASSETS.map(asset => (
            <div 
              key={asset.id}
              className={`asset-option ${selectedAsset.id === asset.id ? 'active' : ''}`}
              onClick={() => onAssetChange(asset)}
              title={asset.name}
            >
              <img src={asset.previewUrl} alt={asset.name} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

