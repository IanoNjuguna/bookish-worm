'use client'

import { IconMusic } from '@tabler/icons-react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'

export function LibraryEmptyState() {
  const t = useTranslations('library')

  return (
    <div id="library-empty-state" className="glass p-12 text-center rounded-2xl bg-midnight/[0.02] dark:bg-white/[0.02] border border-midnight/[0.08] dark:border-white/[0.08] shadow-xl">
      <IconMusic className="w-12 h-12 mx-auto mb-4 text-midnight/50 dark:text-white/20" />
      <h3 className="text-xl font-semibold mb-2">{t('noSongs')}</h3>
      <p className="text-midnight/70 dark:text-white/40 italic text-sm">{t('noSongsDesc') || "You don't own any songs yet. Head to the marketplace to discover music!"}</p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 mt-6 bg-cyber-pink hover:bg-cyber-pink/90 text-white font-bold text-xs uppercase tracking-widest px-5 py-3 rounded-xl transition-all"
      >
        {t('discoverMusic') || 'Discover Music'}
      </Link>
    </div>
  )
}
