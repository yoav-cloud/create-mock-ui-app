import React from 'react'
import Modal from '../../components/Modal'
import './NewDesignModal.css'

export default function NewDesignModal({ isOpen, onClose, onSelectExample, onSelectFigma, onSelectCloudinary }) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create new design"
      subtitle="Choose how you want to start"
      contentClassName="new-design-modal-shell"
    >
      <div className="new-design-options">
        <button
          type="button"
          className="new-design-option new-design-option--example"
          onClick={() => {
            onSelectExample()
            onClose()
          }}
        >
          <div className="new-design-option-content">
            <h4>Example</h4>
            <p>Start with the default example built into the playground</p>
          </div>
          <span className="new-design-option-arrow" aria-hidden="true">→</span>
        </button>

        <button
          type="button"
          className="new-design-option new-design-option--figma"
          onClick={() => {
            onSelectFigma()
            onClose()
          }}
        >
          <div className="new-design-option-content">
            <h4>From Figma</h4>
            <p>Import a design directly from your Figma workspace</p>
          </div>
          <span className="new-design-option-arrow" aria-hidden="true">→</span>
        </button>

        <button
          type="button"
          className="new-design-option new-design-option--cloudinary new-design-option--disabled"
          onClick={onSelectCloudinary}
          disabled
        >
          <div className="new-design-option-content">
            <h4>From Cloudinary</h4>
            <p>Coming soon</p>
          </div>
          <span className="new-design-option-arrow" aria-hidden="true">→</span>
        </button>
      </div>
    </Modal>
  )
}

