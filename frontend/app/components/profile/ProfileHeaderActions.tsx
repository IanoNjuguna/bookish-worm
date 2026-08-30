'use client'

import { IconEdit, IconHelpCircle, IconNote, IconSettings } from '@tabler/icons-react'

interface ProfileHeaderActionsProps {
  onEdit: () => void
  onNote: () => void
  onSettings: () => void
}

export function ProfileHeaderActions({ onEdit, onNote, onSettings }: ProfileHeaderActionsProps) {
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
      <button type="button" onClick={onSettings} className={base} title="Settings">
        <IconSettings size={16} className="sm:w-[18px] sm:h-[18px]" />
      </button>
      <button type="button" onClick={onEdit} className={base} title="Edit Profile">
        <IconEdit size={16} className="sm:w-[18px] sm:h-[18px]" />
      </button>
    </div>
  )
}
