import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import './Preferences.css'
import BackButton from '../components/BackButton'
import Button from '../components/Button'

function Preferences() {
  const navigate = useNavigate()
  const [webhookUrl, setWebhookUrl] = useState('')
  const [webhookKey, setWebhookKey] = useState('')
  const [outputFolder, setOutputFolder] = useState('')
  const [showWebhookTooltip, setShowWebhookTooltip] = useState(false)
  const [showKeyTooltip, setShowKeyTooltip] = useState(false)
  const [showFolderTooltip, setShowFolderTooltip] = useState(false)
  const [showWebhookKey, setShowWebhookKey] = useState(false)

  // Load saved preferences from sessionStorage
  useEffect(() => {
    const savedWebhookUrl = sessionStorage.getItem('preferences_webhook_url') || ''
    const savedWebhookKey = sessionStorage.getItem('preferences_webhook_key') || ''
    const savedOutputFolder = sessionStorage.getItem('preferences_output_folder') || ''
    
    setWebhookUrl(savedWebhookUrl)
    setWebhookKey(savedWebhookKey)
    setOutputFolder(savedOutputFolder)
  }, [])

  const handleSave = () => {
    // Save to sessionStorage
    sessionStorage.setItem('preferences_webhook_url', webhookUrl)
    sessionStorage.setItem('preferences_webhook_key', webhookKey)
    sessionStorage.setItem('preferences_output_folder', outputFolder)
    
    toast.success('Preferences saved!', { duration: 2000 })
  }

  const integrations = [
    {
      id: 'cloudinary-media-flows',
      name: 'Cloudinary Media Flows',
      description: 'Automate media transformations and workflows',
      icon: '☁️',
      color: '#0066cc',
    },
    {
      id: 'airtable',
      name: 'Airtable',
      description: 'Sync designs and assets with your Airtable bases',
      icon: '📊',
      color: '#18bfff',
    },
    {
      id: 'zapier',
      name: 'Zapier',
      description: 'Connect with 5000+ apps and automate workflows',
      icon: '⚡',
      color: '#ff4a00',
    },
    {
      id: 'make',
      name: 'Make',
      description: 'Build powerful automations and integrations',
      icon: '🔧',
      color: '#00c2ff',
    },
  ]

  return (
    <div className="preferences">
      <div className="preferences-header">
        <BackButton />
        <h1 className="preferences-title">Preferences</h1>
        <p className="preferences-subtitle">
          Configure webhooks, output settings, and integrations
        </p>
      </div>

      <div className="preferences-content">
        {/* Section 1: Webhook & Output Configuration */}
        <div className="preferences-section">
          <h2 className="preferences-section-title">Configuration</h2>
          
          <div className="preferences-form">
            {/* Webhook URL */}
            <div className="preferences-field">
              <div className="preferences-field-header">
                <label className="preferences-field-label" htmlFor="webhook-url">
                  Webhook URL
                </label>
                <div className="preferences-tooltip-container">
                  <button
                    className="preferences-tooltip-icon"
                    onMouseEnter={() => setShowWebhookTooltip(true)}
                    onMouseLeave={() => setShowWebhookTooltip(false)}
                    type="button"
                    aria-label="Webhook URL help"
                  >
                    ?
                  </button>
                  {showWebhookTooltip && (
                    <div className="preferences-tooltip">
                      <p>
                        The URL where generation completion events will be sent. 
                        Use HTTPS for secure connections. Example: https://your-domain.com/webhook
                      </p>
                    </div>
                  )}
                </div>
              </div>
              <input
                id="webhook-url"
                type="url"
                className="preferences-input"
                placeholder="https://your-domain.com/webhook"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
              />
            </div>

            {/* Webhook Security Key */}
            <div className="preferences-field">
              <div className="preferences-field-header">
                <label className="preferences-field-label" htmlFor="webhook-key">
                  Webhook Security Key
                </label>
                <div className="preferences-tooltip-container">
                  <button
                    className="preferences-tooltip-icon"
                    onMouseEnter={() => setShowKeyTooltip(true)}
                    onMouseLeave={() => setShowKeyTooltip(false)}
                    type="button"
                    aria-label="Webhook Security Key help"
                  >
                    ?
                  </button>
                  {showKeyTooltip && (
                    <div className="preferences-tooltip">
                      <p>
                        A secret key used to verify webhook requests. Include this in the 
                        Authorization header or as a query parameter. Best practice: Use a 
                        strong, randomly generated key (e.g., 32+ characters) and store it securely.
                      </p>
                      <p style={{ marginTop: '8px', fontSize: '12px', color: '#666' }}>
                        Example header: Authorization: Bearer YOUR_SECRET_KEY
                      </p>
                    </div>
                  )}
                </div>
              </div>
              <div className="preferences-input-wrapper">
                <input
                  id="webhook-key"
                  type={showWebhookKey ? 'text' : 'password'}
                  className="preferences-input"
                  placeholder="Enter a secure key (32+ characters recommended)"
                  value={webhookKey}
                  onChange={(e) => setWebhookKey(e.target.value)}
                />
                <button
                  type="button"
                  className="preferences-input-toggle"
                  onClick={() => setShowWebhookKey(!showWebhookKey)}
                  aria-label={showWebhookKey ? 'Hide key' : 'Show key'}
                >
                  {showWebhookKey ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
              <div className="preferences-field-hint">
                This key will be sent with webhook requests for authentication
              </div>
            </div>

            <div className="preferences-field-separator"></div>

            {/* Output Root Folder */}
            <div className="preferences-field">
              <div className="preferences-field-header">
                <label className="preferences-field-label" htmlFor="output-folder">
                  Output Root Folder in Cloud
                </label>
                <div className="preferences-tooltip-container">
                  <button
                    className="preferences-tooltip-icon"
                    onMouseEnter={() => setShowFolderTooltip(true)}
                    onMouseLeave={() => setShowFolderTooltip(false)}
                    type="button"
                    aria-label="Output folder help"
                  >
                    ?
                  </button>
                  {showFolderTooltip && (
                    <div className="preferences-tooltip">
                      <p>
                        The root folder path in your Cloudinary account where generated assets 
                        will be stored. Sub-folders will be created based on project and design names.
                      </p>
                      <p style={{ marginTop: '8px', fontSize: '12px', color: '#666' }}>
                        Example: /generated-assets or /designs/output
                      </p>
                    </div>
                  )}
                </div>
              </div>
              <input
                id="output-folder"
                type="text"
                className="preferences-input"
                placeholder="/generated-assets"
                value={outputFolder}
                onChange={(e) => setOutputFolder(e.target.value)}
              />
            </div>

            <div className="preferences-form-actions">
              <Button variant="primary" onClick={handleSave}>
                Save Preferences
              </Button>
            </div>
          </div>
        </div>

        {/* Section 2: Integrations */}
        <div className="preferences-section">
          <h2 className="preferences-section-title">Integrations</h2>
          <p className="preferences-section-description">
            Connect with external services to automate your workflow
          </p>
          
          <div className="preferences-integrations">
            {integrations.map((integration) => (
              <div key={integration.id} className="preferences-integration-card">
                <div className="preferences-integration-header">
                  <div className="preferences-integration-icon" style={{ color: integration.color }}>
                    {integration.icon}
                  </div>
                  <div className="preferences-integration-badge">Coming Soon</div>
                </div>
                <h3 className="preferences-integration-name">{integration.name}</h3>
                <p className="preferences-integration-description">
                  {integration.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Preferences

