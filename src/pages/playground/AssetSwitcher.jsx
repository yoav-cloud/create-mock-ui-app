import React, { useState, useEffect, useRef } from 'react'
import { ASSETS } from './constants'
import './AssetSwitcher.css'

export default function AssetSwitcher({ selectedAsset, onAssetChange }) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef(null)

  useEffect(() => {
    if (!isOpen) return
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  const handleSelect = (asset) => {
    onAssetChange(asset)
    setIsOpen(false)
  }

  return (
    <div ref={containerRef} className={`asset-switcher ${isOpen ? 'open' : ''}`}>
      <button
        type="button"
        className="asset-switcher-trigger"
        onClick={() => setIsOpen(prev => !prev)}
        aria-expanded={isOpen}
        aria-label="Select preview asset"
      >
        <img src={selectedAsset.previewUrl} alt={selectedAsset.name} />
        <span>{selectedAsset.name}</span>
        <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M6 9l6 6 6-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <div className="asset-switcher-panel">
        {ASSETS.map(asset => (
          <button
            type="button"
            key={asset.id}
            className={`asset-switcher-option ${asset.id === selectedAsset.id ? 'active' : ''}`}
            onClick={() => handleSelect(asset)}
          >
            <img src={asset.previewUrl} alt={asset.name} />
            <div className="asset-switcher-copy">
              <p>{asset.name}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

