import { IconSquareCheckFilled, IconCircle } from '@tabler/icons-react'
import { Link } from '@/i18n/navigation'
import { cn } from '@/lib/utils'
import { STEP_ROW_CLASS } from './OnboardingChecklist.constants'
import type { ChecklistStepRowProps } from './OnboardingChecklist.types'

export default function ChecklistStepRow({ step, onConnect }: ChecklistStepRowProps) {
  const row = (
    <>
      {step.done ? (
        <IconSquareCheckFilled size={16} className="text-emerald-500 shrink-0" />
      ) : (
        <IconCircle size={16} className="text-midnight/70 dark:text-white/50 shrink-0" />
      )}
      <span
        className={cn(
          'text-xs font-medium transition-colors',
          step.done
            ? 'text-midnight/60 dark:text-white/50 line-through'
            : 'text-midnight/80 dark:text-white/80 group-hover:text-midnight dark:group-hover:text-white'
        )}
      >
        {step.label}
      </span>
    </>
  )

  if (step.done) return <div className={STEP_ROW_CLASS}>{row}</div>
  if (step.key === 'collect') {
    return (
      <Link href="/" className={STEP_ROW_CLASS}>
        {row}
      </Link>
    )
  }
  if (step.key === 'upload') {
    return (
      <Link href="/upload" className={STEP_ROW_CLASS}>
        {row}
      </Link>
    )
  }
  return (
    <button onClick={onConnect} className={STEP_ROW_CLASS}>
      {row}
    </button>
  )
}
