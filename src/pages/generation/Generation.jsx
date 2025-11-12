import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import './Generation.css'
import { useDesign } from '../../context/DesignContext'
import designsData from '../../data/designs.json'
import Button from '../../components/Button'

function Generation({ designId }) {
  const navigate = useNavigate()
  const { getDesign, getEffectiveLayers, saveGenerationData, getGenerationData } = useDesign()
  const [design, setDesign] = useState(null)
  const [csvData, setCsvData] = useState([])
  const [isUploading, setIsUploading] = useState(false)
  const [hasUploaded, setHasUploaded] = useState(false)
  
  // Load saved CSV data from context if available
  useEffect(() => {
    const savedData = getGenerationData(designId)
    if (savedData && savedData.csvData && savedData.csvData.length > 0) {
      setCsvData(savedData.csvData)
      setHasUploaded(true)
    }
  }, [designId, getGenerationData])

  useEffect(() => {
    // Load design data
    const savedDesign = getDesign(designId)
    
    if (savedDesign) {
      setDesign(savedDesign)
      return
    }

    // Fallback to static designs data
    let foundDesign = null
    for (const [projectId, designs] of Object.entries(designsData)) {
      const d = designs.find((d) => d.id === designId)
      if (d) {
        foundDesign = d
        break
      }
    }

    if (foundDesign) {
      // Create mock design structure with text layers
      const mockDesign = {
        ...foundDesign,
        layers: [
          {
            id: 'text-1',
            type: 'text',
            x: 100,
            y: 100,
            text: 'Sample Text 1',
            fontSize: 24,
            fill: '#000000',
          },
          {
            id: 'text-2',
            type: 'text',
            x: 100,
            y: 150,
            text: 'Sample Text 2',
            fontSize: 20,
            fill: '#333333',
          },
        ],
        canvasSize: { width: 800, height: 600 },
      }
      setDesign(mockDesign)
    }
  }, [designId, getDesign])

  // Get expected field names from text layers (using effective layers for sub-designs)
  const expectedFields = useMemo(() => {
    if (!design) return []
    const effectiveLayers = getEffectiveLayers(designId)
    const fields = effectiveLayers
      .filter((layer) => layer.type === 'text')
      .map((layer) => layer.id)
    return fields
  }, [design, designId, getEffectiveLayers])
  
  // Store expected fields for use in generateMockData (use actual fields or defaults)
  const displayFields = useMemo(() => {
    return expectedFields.length > 0 ? expectedFields : ['field1', 'field2']
  }, [expectedFields])

  // Generate mock CSV data with some problematic rows
  const generateMockData = () => {
    // If no expected fields, create some default fields for the mock data
    const fields = expectedFields.length > 0 
      ? expectedFields 
      : ['field1', 'field2'] // Default fields if no text layers

    return [
      // Valid rows
      {
        id: 1,
        data: {
          [fields[0]]: 'Value 1A',
          [fields[1] || fields[0]]: 'Value 1B',
        },
      },
      {
        id: 2,
        data: {
          [fields[0]]: 'Value 2A',
          [fields[1] || fields[0]]: 'Value 2B',
        },
      },
      // Row with missing value
      {
        id: 3,
        data: {
          [fields[0]]: 'Value 3A',
          [fields[1] || fields[0]]: '', // Missing value
        },
      },
      // Row with mismatched field name
      {
        id: 4,
        data: {
          [fields[0]]: 'Value 4A',
          'wrong-field-name': 'Value 4B', // Wrong field name
        },
      },
      // Row with both issues
      {
        id: 5,
        data: {
          [fields[0]]: '', // Missing value
          'another-wrong-field': 'Value 5B', // Wrong field name
        },
      },
      // Another valid row
      {
        id: 6,
        data: {
          [fields[0]]: 'Value 6A',
          [fields[1] || fields[0]]: 'Value 6B',
        },
      },
    ]
  }

  const handleUploadCSV = () => {
    setIsUploading(true)
    setHasUploaded(false)
    setCsvData([])
    
    toast.loading('Uploading CSV file...', { id: 'csv-upload' })

    // Simulate upload processing
    setTimeout(() => {
      const mockData = generateMockData()
      setCsvData(mockData)
      setIsUploading(false)
      setHasUploaded(true)
      
      // Save to context for session persistence (clear old generation results)
      saveGenerationData(designId, {
        csvData: mockData,
        expectedFields: displayFields,
        generatedAssets: null, // Clear old results when new CSV is uploaded
      })
      
      toast.success(`CSV uploaded successfully! ${mockData.length} rows processed.`, { id: 'csv-upload' })
    }, 2000) // 2 second delay
  }

  // Validate a row and return warnings
  const validateRow = (row) => {
    const warnings = []
    
    // Check for missing values
    displayFields.forEach((field) => {
      if (!row.data[field] || row.data[field].trim() === '') {
        warnings.push(`Missing value for field: ${field}`)
      }
    })

    // Check for mismatched field names
    const dataFields = Object.keys(row.data)
    dataFields.forEach((field) => {
      if (!displayFields.includes(field)) {
        warnings.push(`Unknown field: "${field}" (expected: ${displayFields.join(', ')})`)
      }
    })

    return warnings
  }

  if (!design) {
    return (
      <div className="generation-page">
        <div className="generation-loading">Loading design...</div>
      </div>
    )
  }

  return (
    <div className="generation-page">
      <div className="generation-header">
        <h2 className="generation-title">Generation</h2>
        <p className="generation-subtitle">
          Upload CSV data to generate multiple variations of your design
        </p>
      </div>

      <div className="generation-content">
        <div className="generation-table-container">
          <div className="generation-table-header">
            <div className="generation-table-info">
              <span className="generation-table-count">
                {csvData.length} row{csvData.length !== 1 ? 's' : ''}
              </span>
              {displayFields.length > 0 && (
                <span className="generation-table-fields">
                  Expected fields: {displayFields.join(', ')}
                </span>
              )}
            </div>
            <Button 
              variant="primary" 
              onClick={handleUploadCSV}
              disabled={isUploading}
            >
              {isUploading ? 'Uploading...' : 'Upload CSV'}
            </Button>
          </div>

          {isUploading ? (
            <div className="generation-upload-loading">
              <div className="generation-spinner"></div>
              <p>Processing CSV file...</p>
            </div>
          ) : csvData.length > 0 ? (
            <div className="generation-table-wrapper">
              <table className="generation-table">
                <thead>
                  <tr>
                    <th className="generation-table-row-number">#</th>
                    {displayFields.map((field) => (
                      <th key={field} className="generation-table-header-cell">
                        {field}
                      </th>
                    ))}
                    <th className="generation-table-status">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {csvData.map((row) => {
                    const warnings = validateRow(row)
                    const hasWarnings = warnings.length > 0

                    return (
                      <tr
                        key={row.id}
                        className={`generation-table-row ${
                          hasWarnings ? 'generation-table-row-warning' : ''
                        }`}
                      >
                        <td className="generation-table-row-number">
                          {row.id}
                        </td>
                        {displayFields.map((field) => (
                          <td key={field} className="generation-table-cell">
                            {row.data[field] || (
                              <span className="generation-table-empty">
                                (empty)
                              </span>
                            )}
                          </td>
                        ))}
                        <td className="generation-table-status">
                          {hasWarnings ? (
                            <div className="generation-table-warnings">
                              <span className="generation-table-warning-icon">
                                ⚠️
                              </span>
                              <div className="generation-table-warning-tooltip">
                                {warnings.map((warning, idx) => (
                                  <div key={idx}>{warning}</div>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <span className="generation-table-valid">✓</span>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="generation-table-empty-state">
              <p>No data available. Upload a CSV file to get started.</p>
            </div>
          )}

          {csvData.length > 0 && (
            <div className="generation-table-actions">
              <Button 
                variant="primary"
                onClick={() => {
                  // Mark generation as started and navigate to results
                  sessionStorage.setItem(`generation_started_${designId}`, 'true')
                  // Get the toggle state from sessionStorage (defaults to true if not set)
                  const includeParent = sessionStorage.getItem(`include_parent_generation_${designId}`) !== 'false'
                  
                  // Save generation config to context
                  saveGenerationData(designId, {
                    csvData,
                    expectedFields: displayFields,
                    includeParent,
                  })
                  
                  toast.success('Starting generation...', { duration: 2000 })
                  
                  navigate(`/designs/${designId}/generation/results`)
                }}
              >
                Start Generation
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Generation

