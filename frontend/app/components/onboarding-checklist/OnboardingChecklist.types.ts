export interface OnboardingStep {
  key: string
  label: string
  done: boolean
}

export interface UseOnboardingChecklistResult {
  visible: boolean
  hasCollected: boolean
  steps: OnboardingStep[]
  doneCount: number
  title: string
  dismissLabel: string
  dismiss: () => void
  triggerConnect: () => void
}

export interface OnboardingChecklistProps {
  visible: boolean
  hasCollected: boolean
  steps: OnboardingStep[]
  doneCount: number
  title: string
  dismissLabel: string
  dismiss: () => void
  triggerConnect: () => void
}

export interface ChecklistHeaderProps {
  title: string
  doneCount: number
  totalSteps: number
  showDismiss: boolean
  dismissLabel: string
  onDismiss: () => void
}

export interface ChecklistProgressProps {
  doneCount: number
  totalSteps: number
}

export interface ChecklistStepRowProps {
  step: OnboardingStep
  onConnect: () => void
}
