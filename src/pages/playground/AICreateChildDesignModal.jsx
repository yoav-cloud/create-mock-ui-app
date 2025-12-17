import React, { useEffect, useState } from 'react'
import Modal from '../../components/Modal'
import Button from '../../components/Button'

export default function AICreateChildDesignModal({ isOpen, onClose, onCreate }) {
  const [adType, setAdType] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!isOpen) return
    setAdType('')
    setIsSubmitting(false)
  }, [isOpen])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const trimmed = adType.trim()
    if (!trimmed) return
    setIsSubmitting(true)
    try {
      await onCreate?.(trimmed)
      onClose?.()
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Child Design">
      <form onSubmit={handleSubmit}>
        <div className="modal-form-group">
          <label htmlFor="ai-ad-type" className="modal-label">
            Ad type <span className="modal-required">*</span>
          </label>
          <input
            id="ai-ad-type"
            type="text"
            className="modal-input"
            value={adType}
            onChange={(e) => setAdType(e.target.value)}
            placeholder='e.g. "LinkedIn Ad", "X Ad", "YouTube Thumbnail"'
            required
            autoFocus
          />
        </div>
        <div className="modal-actions">
          <Button type="button" variant="secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={!adType.trim() || isSubmitting}>
            {isSubmitting ? 'Creating…' : 'Create'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}


