'use client'

import { IconHelpCircle, IconNote } from '@tabler/icons-react'

interface ProfileHeaderActionsProps {
  onNote: () => void
}

export function ProfileHeaderActions({ onNote }: ProfileHeaderActionsProps) {
  const base =
    'p-1.5 sm:p-2 text-midnight/50 dark:text-white/50 hover:text-midnight dark:hover:text-white hover:bg-midnight/5 dark:hover:bg-white/10 transition-colors rounded-lg'

  return (
    <div className="flex items-center gap-1">
      <a
        href="https://www.doba.world/support"
        target="_blank"
        rel="noopener noreferrer"
        className={base}
        title="Help & Support"
      >
        <IconHelpCircle size={16} className="sm:w-[18px] sm:h-[18px]" />
      </a>
      <button type="button" onClick={onNote} className={base} title="A note from the founder">
        <IconNote size={16} className="sm:w-[18px] sm:h-[18px]" />
      </button>
    </div>
  )
}
