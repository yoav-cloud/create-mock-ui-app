import React from 'react'
import './FigmaImportModal.css'

export default function FigmaWizardSteps({ steps, currentStep }) {
  const activeIndex = steps.findIndex(step => step.key === currentStep)

  return (
    <ol className="figma-wizard-steps" role="list">
      {steps.map((step, index) => {
        const state = index < activeIndex ? 'complete' : index === activeIndex ? 'current' : 'upcoming'
        return (
          <li key={step.key} className={`figma-wizard-step figma-wizard-step--${state}`}>
            <span className="figma-wizard-step__bullet">
              {state === 'complete' ? '✓' : index + 1}
            </span>
            <span className="figma-wizard-step__label">{step.label}</span>
          </li>
        )
      })}
    </ol>
  )
}

