'use client'

import ChecklistHeader from './onboarding-checklist/ChecklistHeader'
import ChecklistProgress from './onboarding-checklist/ChecklistProgress'
import ChecklistStepRow from './onboarding-checklist/ChecklistStepRow'
import type { OnboardingChecklistProps } from './onboarding-checklist/OnboardingChecklist.types'

export default function OnboardingChecklist({
  visible,
  hasCollected,
  steps,
  doneCount,
  title,
  dismissLabel,
  dismiss,
  triggerConnect,
}: OnboardingChecklistProps) {
  if (!visible) return null

  return (
    <div className="glass-surface bg-background/90 dark:bg-midnight/60 rounded-2xl p-4 shadow-lg">
      <ChecklistHeader
        title={title}
        doneCount={doneCount}
        totalSteps={steps.length}
        showDismiss={hasCollected}
        dismissLabel={dismissLabel}
        onDismiss={dismiss}
      />

      {/* Progress hairline */}
      <ChecklistProgress doneCount={doneCount} totalSteps={steps.length} />

      <div className="space-y-1.5">
        {steps.map((step) => (
          <ChecklistStepRow key={step.key} step={step} onConnect={triggerConnect} />
        ))}
      </div>
    </div>
  )
}
