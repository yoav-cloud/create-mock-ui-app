import { useState, useEffect } from 'react'
import './BrandCenter.css'
import brandKitsData from '../data/brandKits.json'
import channelsData from '../data/channels.json'
import Button from '../components/Button'
import BackButton from '../components/BackButton'

function BrandCenter() {
  const [brandKits, setBrandKits] = useState([])
  const [channels, setChannels] = useState([])
  const [activeTab, setActiveTab] = useState('brand-kits')

  useEffect(() => {
    setBrandKits(brandKitsData)
    setChannels(channelsData)
  }, [])

  const parseColors = (colorsString) => {
    if (!colorsString) return []
    return colorsString.split(',').map((item) => {
      const [name, hex] = item.split(':')
      return { name, hex }
    })
  }

  const parseFonts = (fontsString) => {
    if (!fontsString) return []
    return fontsString.split(',').map((font) => font.trim())
  }

  const handleCreateBrandKit = () => {
    // TODO: Implement create brand kit flow
    console.log('Create brand kit clicked')
  }

  const handleCreateChannel = () => {
    // TODO: Implement create channel flow
    console.log('Create channel clicked')
  }

  return (
    <div className="brand-center">
      <div className="brand-center-header">
        <BackButton />
        <div>
          <h2 className="brand-center-title">Brand Center</h2>
          <p className="brand-center-subtitle">
            Manage your brand kits and channels
          </p>
        </div>
      </div>

      <div className="brand-center-tabs">
        <button
          className={`brand-center-tab ${
            activeTab === 'brand-kits' ? 'active' : ''
          }`}
          onClick={() => setActiveTab('brand-kits')}
        >
          Brand Kits
        </button>
        <button
          className={`brand-center-tab ${
            activeTab === 'channels' ? 'active' : ''
          }`}
          onClick={() => setActiveTab('channels')}
        >
          Channels
        </button>
      </div>

      {activeTab === 'brand-kits' && (
        <div className="brand-center-content">
          <div className="brand-center-section-header">
            <h3 className="brand-center-section-title">Brand Kits</h3>
            <Button variant="primary" onClick={handleCreateBrandKit}>
              Create Brand Kit
            </Button>
          </div>

          {brandKits.length === 0 ? (
            <div className="brand-center-empty">
              <p>No brand kits yet. Create your first brand kit to get started.</p>
            </div>
          ) : (
            <div className="brand-kits-grid">
              {brandKits.map((kit) => {
                const colors = parseColors(kit.colors)
                const fonts = parseFonts(kit.fonts)

                return (
                  <div key={kit.id} className="brand-kit-card">
                    <div className="brand-kit-card-header">
                      <h4 className="brand-kit-card-title">{kit.name}</h4>
                    </div>

                    {kit.logo && (
                      <div className="brand-kit-logo">
                        <img
                          src={kit.logo}
                          alt={`${kit.name} logo`}
                          className="brand-kit-logo-image"
                        />
                      </div>
                    )}

                    {colors.length > 0 && (
                      <div className="brand-kit-section">
                        <div className="brand-kit-section-label">Colors</div>
                        <div className="brand-kit-colors">
                          {colors.map((color, idx) => (
                            <div
                              key={idx}
                              className="brand-kit-color-item"
                              title={`${color.name}: ${color.hex}`}
                            >
                              <div
                                className="brand-kit-color-swatch"
                                style={{ backgroundColor: color.hex }}
                              />
                              <span className="brand-kit-color-name">
                                {color.name}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {fonts.length > 0 && (
                      <div className="brand-kit-section">
                        <div className="brand-kit-section-label">Fonts</div>
                        <div className="brand-kit-fonts">
                          {fonts.map((font, idx) => (
                            <span key={idx} className="brand-kit-font-item">
                              {font}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="brand-kit-card-footer">
                      <Button variant="secondary" className="brand-kit-action">
                        Edit
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}

      {activeTab === 'channels' && (
        <div className="brand-center-content">
          <div className="brand-center-section-header">
            <h3 className="brand-center-section-title">Channels</h3>
            <Button variant="primary" onClick={handleCreateChannel}>
              Create Channel
            </Button>
          </div>

          {channels.length === 0 ? (
            <div className="brand-center-empty">
              <p>No channels yet. Create your first channel to get started.</p>
            </div>
          ) : (
            <div className="channels-grid">
              {channels.map((channel) => (
                <div key={channel.id} className="channel-card">
                  <div className="channel-card-header">
                    <h4 className="channel-card-title">{channel.name}</h4>
                  </div>

                  <div className="channel-details">
                    <div className="channel-detail-item">
                      <span className="channel-detail-label">
                        Transformation:
                      </span>
                      <code className="channel-detail-value">
                        {channel.transformation_string}
                      </code>
                    </div>

                    {channel.output_format && (
                      <div className="channel-detail-item">
                        <span className="channel-detail-label">Format:</span>
                        <span className="channel-detail-value">
                          {channel.output_format.toUpperCase()}
                        </span>
                      </div>
                    )}

                    {channel.max_file_size && (
                      <div className="channel-detail-item">
                        <span className="channel-detail-label">Max Size:</span>
                        <span className="channel-detail-value">
                          {channel.max_file_size}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="channel-card-footer">
                    <Button variant="secondary" className="channel-action">
                      Edit
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default BrandCenter

