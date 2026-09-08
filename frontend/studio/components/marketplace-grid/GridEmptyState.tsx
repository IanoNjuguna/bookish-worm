'use client'

import { IconMusic } from '@tabler/icons-react'
import { useTranslations } from 'next-intl'

export function GridEmptyState() {
  const t = useTranslations('marketplace')

  return (
    <div id="marketplace-empty-state" className="glass-surface rounded-2xl p-12 text-center">
      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-midnight/5 dark:bg-white/5 flex items-center justify-center">
        <IconMusic size={32} strokeWidth={1} className="text-midnight/40 dark:text-white/40" />
      </div>
      <h3 className="text-xl font-semibold text-midnight dark:text-white mb-2">{t('noSongs')}</h3>
      <p className="text-sm text-midnight/60 dark:text-white/50">Check back soon for new releases.</p>
    </div>
  )
}
