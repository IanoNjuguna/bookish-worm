'use client'

import { useTranslations } from 'next-intl'
import { IconDiamond, IconHelpCircle } from '@tabler/icons-react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

export function HowItWorks() {
  const tNav = useTranslations('nav')
  const tOnboarding = useTranslations('onboarding')

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-midnight/70 dark:text-white/70 hover:text-midnight dark:hover:text-white hover:bg-midnight/5 dark:hover:bg-white/5 transition-colors"
          aria-label={tNav('howItWorks')}
        >
          <IconHelpCircle size={16} />
          <span className="hidden sm:inline">{tNav('howItWorks')}</span>
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={8}
        className="w-80 glass-surface bg-background/95 dark:bg-midnight/95 border-midnight/10 dark:border-white/10 p-4"
      >
        <div className="flex items-start gap-3">
          <IconDiamond size={18} className="text-pink-600 dark:text-cyber-pink shrink-0 mt-0.5" />
          <p className="text-sm font-medium text-midnight dark:text-white leading-relaxed">
            {tOnboarding('nudgeCollect')}
          </p>
        </div>
      </PopoverContent>
    </Popover>
  )
}
