export interface OnboardingStep {
  key: string
  label: string
  done: boolean
}

export type OnboardingMode = 'fan' | 'studio'

export interface UseOnboardingChecklistOptions {
  mode?: OnboardingMode
}

export interface UseOnboardingChecklistResult {
  visible: boolean
  hasCompleted: boolean
  steps: OnboardingStep[]
  doneCount: number
  title: string
  dismissLabel: string
  dismiss: () => void
  triggerConnect: () => void
}

export interface OnboardingChecklistProps {
  visible: boolean
  hasCompleted: boolean
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
