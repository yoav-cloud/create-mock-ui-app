import './Modal.css'

const SIZE_CLASS = {
  default: '',
  wide: 'modal-content--wide'
}

function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'default',
  contentClassName = ''
}) {
  if (!isOpen) return null

  const contentClasses = ['modal-content']
  if (SIZE_CLASS[size]) {
    contentClasses.push(SIZE_CLASS[size])
  }
  if (contentClassName) {
    contentClasses.push(contentClassName)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className={contentClasses.join(' ')} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">{title}</h3>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  )
}

export default Modal

