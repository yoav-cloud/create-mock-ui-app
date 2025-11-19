import { useState, useEffect, useMemo, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import toast from 'react-hot-toast'
import './Generation.css'
import channelsData from '../../data/channels.json'
import { useDesign } from '../../context/DesignContext'

function GenerationResults({ designId }) {
  const location = useLocation()
  const { getDesign, getSubDesigns, getGenerationData, saveGenerationData } = useDesign()
  const [selectedAsset, setSelectedAsset] = useState(null)
  const [isGenerating, setIsGenerating] = useState(true)
  const [generatedAssets, setGeneratedAssets] = useState([])
  const generationStartedRef = useRef(false)
  
  // Load generation data from context (preferred) or location state (fallback)
  const savedGenerationData = useMemo(() => {
    return getGenerationData(designId)
  }, [designId, getGenerationData])
  
  const csvData = useMemo(() => {
    return savedGenerationData?.csvData || location.state?.csvData || []
  }, [savedGenerationData, location.state?.csvData])
  
  const expectedFields = useMemo(() => {
    return savedGenerationData?.expectedFields || location.state?.expectedFields || []
  }, [savedGenerationData, location.state?.expectedFields])
  
  const includeParent = savedGenerationData?.includeParent !== undefined 
    ? savedGenerationData.includeParent 
    : (location.state?.includeParent !== false) // Default to true if not specified

  // Get design and sub-designs to determine channels
  const design = getDesign(designId)
  const subDesigns = useMemo(() => {
    return design && !design.parentId ? getSubDesigns(designId) : []
  }, [design, designId, getSubDesigns])
  
  // Memoize channels to prevent infinite loops
  const channels = useMemo(() => {
    let channelsList = []
    
    // Only process if this is a parent design (not a sub-design)
    if (!design || design.parentId) {
      return channelsList // Sub-designs shouldn't show generation results
    }
    
    // Get channels from actual sub-designs that have channelId
    const subDesignChannels = subDesigns
      .filter(sub => sub.channelId)
      .map(sub => {
        const channel = channelsData.find(c => c.id === sub.channelId)
        return channel ? { ...channel, subDesignId: sub.id } : null
      })
      .filter(Boolean)
    
    channelsList = [...subDesignChannels]
    
    // If includeParent is true, add parent design as a channel
    if (includeParent) {
      channelsList.unshift({
        id: 'parent',
        name: design.name || 'Parent Design',
        transformation_string: '',
        output_format: 'png',
        max_file_size: null,
        isParent: true,
        designId: designId
      })
    }
    
    return channelsList
  }, [subDesigns, includeParent, design, designId])

  // Check if we have saved results and load them
  useEffect(() => {
    if (savedGenerationData && savedGenerationData.generatedAssets && savedGenerationData.generatedAssets.length > 0) {
      // Load saved results
      setGeneratedAssets(savedGenerationData.generatedAssets)
      setIsGenerating(false)
      generationStartedRef.current = true // Mark as started to prevent regeneration
      // Ensure results tab is enabled
      sessionStorage.setItem(`generation_started_${designId}`, 'true')
    } else if (!csvData || csvData.length === 0) {
      // No CSV data, not generating
      setIsGenerating(false)
      generationStartedRef.current = true // Prevent trying to generate with no data
    }
  }, [savedGenerationData, csvData, designId])

  // Generate assets progressively
  useEffect(() => {
    if (!csvData || csvData.length === 0) {
      setIsGenerating(false)
      return
    }

    // Prevent re-running if generation has already started or if we have saved results
    if (generationStartedRef.current || (savedGenerationData && savedGenerationData.generatedAssets)) {
      return
    }

    generationStartedRef.current = true
    setIsGenerating(true)
    setGeneratedAssets([])
    
    const totalAssets = csvData.length * channels.length
    toast.loading(`Generating ${totalAssets} assets...`, { id: 'generation' })

    // Generate assets progressively, one every 300ms
    let currentIndex = 0
    const timeoutIds = []

    const generateNextAsset = () => {
      if (currentIndex >= totalAssets) {
        setIsGenerating(false)
        toast.success(`Generation complete! ${totalAssets} assets created.`, { id: 'generation' })
        return
      }

      const rowIndex = Math.floor(currentIndex / channels.length)
      const channelIndex = currentIndex % channels.length
      const row = csvData[rowIndex]
      const channel = channels[channelIndex]

      if (row && channel) {
        const asset = {
          id: `asset-${row.id}-${channel.id}`,
          rowId: row.id,
          channelId: channel.id,
          channelName: channel.name,
          subDesignId: channel.subDesignId,
          designId: channel.designId || channel.subDesignId,
          isParent: channel.isParent || false,
          name: `Row ${row.id} - ${channel.name}`,
          color: `hsl(${(currentIndex * 137.5) % 360}, 70%, 60%)`, // Generate distinct colors
          data: row.data,
        }

        setGeneratedAssets((prev) => {
          const updated = [...prev, asset]
          // Save progress to context periodically (every 5 assets) or when complete
          if (updated.length % 5 === 0 || updated.length === totalAssets) {
            // Use setTimeout to ensure state is updated
            setTimeout(() => {
              saveGenerationData(designId, {
                csvData,
                expectedFields,
                includeParent,
                generatedAssets: updated,
              })
              
              // Mark generation as complete in sessionStorage
              if (updated.length === totalAssets) {
                sessionStorage.setItem(`generation_started_${designId}`, 'true')
              }
            }, 0)
          }
          return updated
        })
        currentIndex++
        const timeoutId = setTimeout(generateNextAsset, 300) // 300ms delay between each asset
        timeoutIds.push(timeoutId)
      } else {
        currentIndex++
        const timeoutId = setTimeout(generateNextAsset, 100)
        timeoutIds.push(timeoutId)
      }
    }

    // Start generation after a short delay
    const initialTimeoutId = setTimeout(generateNextAsset, 500)
    timeoutIds.push(initialTimeoutId)

    // Cleanup function to clear all timeouts
    return () => {
      timeoutIds.forEach(id => clearTimeout(id))
      generationStartedRef.current = false
    }
  }, [csvData, channels, savedGenerationData, designId, saveGenerationData, expectedFields, includeParent])

  // Group assets by channel
  const assetsByChannel = channels.reduce((acc, channel) => {
    acc[channel.id] = generatedAssets.filter(asset => asset.channelId === channel.id)
    return acc
  }, {})

  if (!csvData || csvData.length === 0) {
    return (
      <div className="generation-page">
        <div className="generation-header">
          <h2 className="generation-title">Generation Results</h2>
          <p className="generation-subtitle">
            View and manage your generated design variations
          </p>
        </div>
        <div className="generation-table-empty-state">
          <p>No generation data available. Upload CSV and start generation first.</p>
        </div>
      </div>
    )
  }

  if (channels.length === 0) {
    return (
      <div className="generation-page">
        <div className="generation-header">
          <h2 className="generation-title">Generation Results</h2>
          <p className="generation-subtitle">
            View and manage your generated design variations
          </p>
        </div>
        <div className="generation-table-empty-state">
          <p>
            {design?.parentId 
              ? 'Generation results are only available for parent designs.'
              : 'No sub-designs with channels found. Create sub-designs and assign channels to generate assets.'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="generation-page">
      <div className="generation-header">
        <h2 className="generation-title">Generation Results</h2>
        <p className="generation-subtitle">
          {isGenerating 
            ? `Generating assets... (${generatedAssets.length} of ${csvData.length * channels.length})`
            : `View and manage your generated design variations`
          }
        </p>
      </div>

      <div className="generation-results-content">
        <div className="generation-results-stats">
          <div className="generation-stat">
            <span className="generation-stat-value">{generatedAssets.length}</span>
            <span className="generation-stat-label">Total Assets</span>
          </div>
          <div className="generation-stat">
            <span className="generation-stat-value">{channels.length}</span>
            <span className="generation-stat-label">Channels</span>
          </div>
          <div className="generation-stat">
            <span className="generation-stat-value">{csvData.length}</span>
            <span className="generation-stat-label">Rows</span>
          </div>
        </div>

        {isGenerating && (
          <div className="generation-progress-bar">
            <div 
              className="generation-progress-fill"
              style={{ 
                width: `${(generatedAssets.length / (csvData.length * channels.length)) * 100}%` 
              }}
            />
          </div>
        )}

        {channels.map((channel) => {
          const channelAssets = assetsByChannel[channel.id] || []
          
          return (
            <div key={channel.id} className="generation-channel-section">
              <h3 className="generation-channel-title">
                {channel.name}
                <span className="generation-channel-count">
                  ({channelAssets.length} assets)
                </span>
              </h3>
              {channelAssets.length > 0 ? (
                <div className="generation-assets-grid">
                  {channelAssets.map((asset) => (
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
                          <span className="generation-asset-name">
                            Row {asset.rowId}
                          </span>
                        </div>
                      </div>
                      <div className="generation-asset-footer">
                        <span className="generation-asset-id">{asset.id}</span>
                        <button className="generation-asset-action">Download</button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="generation-channel-empty">
                  {isGenerating ? 'Generating...' : 'No assets generated for this channel'}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default GenerationResults


