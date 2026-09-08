import { IconX } from '@tabler/icons-react'
import type { ChecklistHeaderProps } from './OnboardingChecklist.types'

export default function ChecklistHeader({ title, doneCount, totalSteps, showDismiss, dismissLabel, onDismiss }: ChecklistHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-2">
      <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-purple-600 dark:text-lavender">
        {title} · {doneCount}/{totalSteps}
      </p>
      {showDismiss && (
        <button
          onClick={onDismiss}
          className="w-7 h-7 flex items-center justify-center rounded-lg bg-midnight/5 dark:bg-white/5 text-midnight/50 dark:text-white/40 hover:text-midnight dark:hover:text-white hover:bg-midnight/10 dark:hover:bg-white/10 transition-colors"
          title={dismissLabel}
          aria-label={dismissLabel}
        >
          <IconX size={12} />
        </button>
      )}
    </div>
  )
}
