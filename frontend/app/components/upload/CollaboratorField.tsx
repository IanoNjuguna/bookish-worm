'use client'

import { useTranslations } from 'next-intl'
import { IconPlus } from '@tabler/icons-react'
import UploaderShareRow from './UploaderShareRow'
import CollaboratorRow from './CollaboratorRow'
import type { Collaborator } from './UploadView.types'

interface CollaboratorFieldProps {
  collaborators: Collaborator[]
  cardanoAddress: string | null
  addCollaborator: () => void
  updateCollaborator: (index: number, field: keyof Collaborator, value: string | number) => void
  removeCollaborator: (index: number) => void
}

export default function CollaboratorField({
  collaborators,
  cardanoAddress,
  addCollaborator,
  updateCollaborator,
  removeCollaborator,
}: CollaboratorFieldProps) {
  const t = useTranslations('upload')
  const otherSharesSum = collaborators.reduce((sum, c) => sum + (Number(c.split) || 0), 0)

  return (
    <div className="space-y-6 glass-surface rounded-2xl p-5 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h3 className="text-lg sm:text-xl font-semibold flex items-center gap-2 text-midnight/90 dark:text-white">
            <span className="w-1 h-5 sm:h-6 bg-lavender rounded-xl" />
            {t('collaborators')}
          </h3>
          <p className="text-xs text-midnight/70 dark:text-white/70 mt-1 font-medium leading-relaxed">
            Configure collaborator payment addresses for instant sales payouts on Cardano.
          </p>
        </div>
        <button
          type="button"
          onClick={addCollaborator}
          className="text-sm text-midnight dark:text-white bg-lavender hover:bg-lavender/90 px-3 py-1.5 rounded-xl flex items-center justify-center gap-1.5 transition-colors font-semibold whitespace-nowrap shrink-0"
        >
          <IconPlus size={16} />
          {t('addCollaborator')}
        </button>
      </div>

      <div className="space-y-3">
        <UploaderShareRow cardanoAddress={cardanoAddress} uploaderShare={Math.max(0, 100 - otherSharesSum)} />
        {collaborators.map((collaborator, index) => (
          <CollaboratorRow
            key={index}
            index={index}
            collaborator={collaborator}
            updateCollaborator={updateCollaborator}
            removeCollaborator={removeCollaborator}
          />
        ))}
        {collaborators.length === 0 && (
          <div className="text-center py-8 border border-midnight/5 dark:border-white/5 rounded-xl bg-midnight/[0.02] dark:bg-white/[0.02]">
            <p className="text-sm text-midnight/70 dark:text-white/70 italic">{t('collaboratorsHint')}</p>
          </div>
        )}
      </div>
    </div>
  )
}
