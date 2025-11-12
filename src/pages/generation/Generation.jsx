import { useState, useEffect, useMemo } from 'react'
import './Generation.css'
import { useDesign } from '../../context/DesignContext'
import designsData from '../../data/designs.json'
import Button from '../../components/Button'

function Generation({ designId }) {
  const { getDesign } = useDesign()
  const [design, setDesign] = useState(null)
  const [csvData, setCsvData] = useState([])

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

  // Get expected field names from text layers
  const expectedFields = useMemo(() => {
    if (!design || !design.layers) return []
    return design.layers
      .filter((layer) => layer.type === 'text')
      .map((layer) => layer.id)
  }, [design])

  // Generate mock CSV data with some problematic rows
  useEffect(() => {
    if (expectedFields.length === 0) return

    const mockData = [
      // Valid rows
      {
        id: 1,
        data: {
          [expectedFields[0]]: 'Value 1A',
          [expectedFields[1]]: 'Value 1B',
        },
      },
      {
        id: 2,
        data: {
          [expectedFields[0]]: 'Value 2A',
          [expectedFields[1]]: 'Value 2B',
        },
      },
      // Row with missing value
      {
        id: 3,
        data: {
          [expectedFields[0]]: 'Value 3A',
          [expectedFields[1]]: '', // Missing value
        },
      },
      // Row with mismatched field name
      {
        id: 4,
        data: {
          [expectedFields[0]]: 'Value 4A',
          'wrong-field-name': 'Value 4B', // Wrong field name
        },
      },
      // Row with both issues
      {
        id: 5,
        data: {
          [expectedFields[0]]: '', // Missing value
          'another-wrong-field': 'Value 5B', // Wrong field name
        },
      },
      // Another valid row
      {
        id: 6,
        data: {
          [expectedFields[0]]: 'Value 6A',
          [expectedFields[1]]: 'Value 6B',
        },
      },
    ]

    setCsvData(mockData)
  }, [expectedFields])

  // Validate a row and return warnings
  const validateRow = (row) => {
    const warnings = []
    
    // Check for missing values
    expectedFields.forEach((field) => {
      if (!row.data[field] || row.data[field].trim() === '') {
        warnings.push(`Missing value for field: ${field}`)
      }
    })

    // Check for mismatched field names
    const dataFields = Object.keys(row.data)
    dataFields.forEach((field) => {
      if (!expectedFields.includes(field)) {
        warnings.push(`Unknown field: "${field}" (expected: ${expectedFields.join(', ')})`)
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
              {expectedFields.length > 0 && (
                <span className="generation-table-fields">
                  Expected fields: {expectedFields.join(', ')}
                </span>
              )}
            </div>
            <Button variant="primary">Upload CSV</Button>
          </div>

          {csvData.length > 0 ? (
            <div className="generation-table-wrapper">
              <table className="generation-table">
                <thead>
                  <tr>
                    <th className="generation-table-row-number">#</th>
                    {expectedFields.map((field) => (
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
                        {expectedFields.map((field) => (
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
              <Button variant="primary">Start Generation</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Generation

