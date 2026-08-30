'use client'

import { IconTrash } from '@tabler/icons-react'
import { useTranslations } from 'next-intl'
import type { Collaborator } from './UploadView.types'

interface CollaboratorRowProps {
  index: number
  collaborator: Collaborator
  updateCollaborator: (index: number, field: keyof Collaborator, value: string | number) => void
  removeCollaborator: (index: number) => void
}

export default function CollaboratorRow({
  index,
  collaborator,
  updateCollaborator,
  removeCollaborator,
}: CollaboratorRowProps) {
  const t = useTranslations('upload')

  return (
    <div className="flex gap-2 sm:gap-3 items-center p-2 sm:p-3 bg-midnight/[0.03] dark:bg-white/[0.03] border border-midnight/10 dark:border-white/10 rounded-xl animate-fade-in group">
      <div className="flex-1 min-w-0">
        <input
          type="text"
          value={collaborator.address}
          onChange={(e) => updateCollaborator(index, 'address', e.target.value)}
          placeholder="addr1..."
          title={typeof collaborator.address === 'string' ? collaborator.address : undefined}
          className="w-full bg-transparent border-0 px-2 py-2 text-midnight dark:text-white text-sm font-mono placeholder:text-midnight/40 dark:placeholder:text-white/40 focus:ring-0 focus:outline-none truncate"
        />
      </div>
      <div className="w-20 sm:w-24 relative shrink-0">
        <input
          type="number"
          min={0}
          max={100}
          value={collaborator.split}
          onChange={(e) => updateCollaborator(index, 'split', e.target.value)}
          placeholder="%"
          className="w-full bg-midnight/5 dark:bg-white/5 border border-midnight/10 dark:border-white/10 rounded-lg px-2 py-2 text-midnight dark:text-white text-sm text-center focus:border-lavender focus:ring-1 focus:ring-lavender/50 transition-all"
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 text-midnight/50 dark:text-white/50 text-xs font-bold">%</div>
      </div>
      <button
        type="button"
        onClick={() => removeCollaborator(index)}
        className="p-2 text-midnight/40 dark:text-white/30 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors shrink-0"
        aria-label={t('remove')}
      >
        <IconTrash size={18} />
      </button>
    </div>
  )
}
