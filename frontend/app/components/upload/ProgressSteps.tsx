import { IconCheck, IconLoader2 } from '@tabler/icons-react'
import { cn } from '@/lib/utils'

interface ProgressStepsProps {
  uploadStep: number
}

const steps = [
  { title: '1. Media IPFS Upload', color: 'bg-fuchsia-500' },
  { title: '2. CIP-60 Metadata Generation', color: 'bg-purple-500' },
  { title: '3. On-Chain Cardano Minting', color: 'bg-blue-500' },
  { title: '4. Catalog Indexing & Finalize', color: 'bg-emerald-500' },
]

export default function ProgressSteps({ uploadStep }: ProgressStepsProps) {
  return (
    <div className="space-y-3 pt-3 border-t border-midnight/[0.06] dark:border-white/[0.06] text-xs">
      {steps.map((stepItem, idx) => {
        const stepNum = idx + 1
        const isDone = uploadStep > stepNum
        const isCurrent = uploadStep === stepNum
        return (
          <div key={idx} className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className={cn('w-2.5 h-2.5 rounded-full shrink-0', stepItem.color)} />
              <span
                className={cn(
                  'font-medium transition-colors',
                  isCurrent
                    ? 'text-midnight dark:text-white font-bold'
                    : isDone
                      ? 'text-midnight/50 dark:text-white/50'
                      : 'text-midnight/30 dark:text-white/30'
                )}
              >
                {stepItem.title}
              </span>
            </div>
            {isDone ? (
              <IconCheck size={16} className="text-emerald-500 shrink-0" />
            ) : isCurrent ? (
              <IconLoader2 size={16} className="animate-spin text-purple-400 shrink-0" />
            ) : (
              <span className="text-[10px] text-midnight/30 dark:text-white/30 font-mono">Pending</span>
            )}
          </div>
        )
      })}
    </div>
  )
}
