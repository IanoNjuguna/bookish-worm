import type { ChecklistProgressProps } from './OnboardingChecklist.types'

export default function ChecklistProgress({ doneCount, totalSteps }: ChecklistProgressProps) {
  return (
    <div className="h-[2px] w-full rounded-full bg-midnight/5 dark:bg-white/5 overflow-hidden mb-3">
      <div
        className="h-full rounded-full bg-pink-600 dark:bg-cyber-pink transition-all duration-500"
        style={{ width: `${(doneCount / totalSteps) * 100}%` }}
      />
    </div>
  )
}
