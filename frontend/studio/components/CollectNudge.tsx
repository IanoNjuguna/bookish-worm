'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { IconX, IconDiamond } from '@tabler/icons-react'

const NUDGE_KEY = 'doba_nudge_collect_seen'
const COLLECT_KEY = 'doba_has_collected'

// One-time contextual hint shown on the marketplace to visitors who
// haven't collected yet. Self-dismisses after 12s; dismissed forever on close.
export default function CollectNudge() {
  const t = useTranslations('onboarding')
  const [visible, setVisible] = useState(false)

  function dismiss() {
    localStorage.setItem(NUDGE_KEY, 'true')
    setVisible(false)
  }

  useEffect(() => {
    if (localStorage.getItem(NUDGE_KEY) === 'true') return
    if (localStorage.getItem(COLLECT_KEY) === 'true') return
    const show = setTimeout(() => setVisible(true), 1500)
    const hide = setTimeout(() => dismiss(), 13500)
    return () => {
      clearTimeout(show)
      clearTimeout(hide)
    }
  }, [])

  if (!visible) return null

  return (
    <div className="fixed bottom-28 left-1/2 -translate-x-1/2 z-[70] glass-surface bg-background/90 dark:bg-midnight/85 border border-black/10 dark:border-white/15 rounded-2xl shadow-xl px-4 py-3 flex items-center gap-3 max-w-xs animate-slide-in-down">
      <IconDiamond size={18} className="text-pink-600 dark:text-cyber-pink shrink-0" />
      <p className="text-xs font-medium text-midnight dark:text-white leading-relaxed">
        {t('nudgeCollect')}
      </p>
      <button
        onClick={dismiss}
        className="w-7 h-7 flex items-center justify-center rounded-lg bg-midnight/5 dark:bg-white/5 text-midnight/50 dark:text-white/40 hover:text-midnight dark:hover:text-white hover:bg-midnight/10 dark:hover:bg-white/10 transition-colors shrink-0"
        title={t('dismiss')}
        aria-label={t('dismiss')}
      >
        <IconX size={14} />
      </button>
    </div>
  )
}
