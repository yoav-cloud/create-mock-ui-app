import './Modal.css'

const SIZE_CLASS = {
  default: '',
  wide: 'modal-content--wide'
}

function Modal({
  isOpen,
  onClose,
  title,
  subtitle = null,
  children,
  size = 'default',
  contentClassName = '',
  headerActions = null,
  footerContent = null
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
    <div className="modal-overlay">
      <div className={contentClasses.join(' ')} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-header-left">
            {title && <h3 className="modal-title">{title}</h3>}
            {subtitle && <p className="modal-subtitle">{subtitle}</p>}
          </div>
          <div className="modal-header-right">
            {headerActions}
            <button className="modal-close" onClick={onClose} type="button">
              ×
            </button>
          </div>
        </div>
        <div className="modal-body">{children}</div>
        {footerContent && <div className="modal-footer">{footerContent}</div>}
      </div>
    </div>
  )
}

export default Modal

