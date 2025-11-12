import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import './PreDesignEditor.css'
import Button from '../components/Button'
import BackButton from '../components/BackButton'

function PreDesignEditor() {
  const navigate = useNavigate()
  const location = useLocation()
  const projectId = location.state?.projectId

  const [selectedOption, setSelectedOption] = useState(null)

  const creationOptions = [
    {
      id: 'template',
      title: 'Start from Template',
      description: 'Choose from a library of pre-designed templates',
      icon: '📐',
    },
    {
      id: 'blank',
      title: 'Start from Scratch',
      description: 'Start with a blank canvas and create from scratch',
      icon: '🎨',
    },
  ]

  const comingSoonOptions = [
    {
      id: 'canva',
      title: 'Import from Canva',
      description: 'Coming soon',
      icon: '🎭',
    },
    {
      id: 'psd',
      title: 'Import PSD',
      description: 'Coming soon',
      icon: '📄',
    },
  ]

  const handleOptionSelect = (optionId) => {
    setSelectedOption(optionId)
  }

  const handleContinue = () => {
    if (!selectedOption) return

    if (selectedOption === 'template') {
      navigate('/templates', {
        state: {
          projectId,
        },
      })
    } else if (selectedOption === 'blank') {
      navigate('/editor', {
        state: {
          projectId,
        },
      })
    }
  }

  return (
    <div className="pre-design-editor">
      <div className="pre-design-editor-header">
        <BackButton to="/" />
        <h1 className="pre-design-editor-title">Create New Design</h1>
        <p className="pre-design-editor-subtitle">
          Choose how you'd like to create your design
        </p>
      </div>

      <div className="pre-design-editor-options">
        {creationOptions.map((option) => (
          <div
            key={option.id}
            className={`pre-design-editor-option ${
              selectedOption === option.id ? 'selected' : ''
            }`}
            onClick={() => handleOptionSelect(option.id)}
          >
            <div className="pre-design-editor-option-icon">{option.icon}</div>
            <div className="pre-design-editor-option-content">
              <h3 className="pre-design-editor-option-title">{option.title}</h3>
              <p className="pre-design-editor-option-description">
                {option.description}
              </p>
            </div>
            {selectedOption === option.id && (
              <div className="pre-design-editor-option-check">✓</div>
            )}
          </div>
        ))}
        {comingSoonOptions.map((option) => (
          <div
            key={option.id}
            className="pre-design-editor-option pre-design-editor-option-disabled"
          >
            <div className="pre-design-editor-option-icon">{option.icon}</div>
            <div className="pre-design-editor-option-content">
              <h3 className="pre-design-editor-option-title">{option.title}</h3>
              <p className="pre-design-editor-option-description">
                {option.description}
              </p>
            </div>
            <div className="pre-design-editor-option-badge">Coming Soon</div>
          </div>
        ))}
      </div>

      <div className="pre-design-editor-actions">
        <Button
          variant="secondary"
          onClick={() => navigate(projectId ? `/projects/${projectId}` : '/')}
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={handleContinue}
          disabled={!selectedOption}
          className={!selectedOption ? 'disabled' : ''}
        >
          Continue
        </Button>
      </div>
    </div>
  )
}

export default PreDesignEditor

