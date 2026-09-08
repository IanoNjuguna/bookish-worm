'use client'

import { useTranslations } from 'next-intl'
import { IconDiamond, IconHelpCircle, IconUpload } from '@tabler/icons-react'
import { Link } from '@/i18n/navigation'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

interface HowItWorksProps {
  mode?: 'fan' | 'studio'
}

export function HowItWorks({ mode = 'fan' }: HowItWorksProps) {
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
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <IconDiamond size={18} className="text-pink-600 dark:text-cyber-pink shrink-0 mt-0.5" />
            <p className="text-sm font-medium text-midnight dark:text-white leading-relaxed">
              {mode === 'studio' ? tOnboarding('nudgeUpload') : tOnboarding('nudgeCollect')}
            </p>
          </div>
          {mode === 'studio' && (
            <Link
              href="/upload"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-cyber-pink hover:text-cyber-pink/80 transition-colors"
            >
              <IconUpload size={14} />
              {tNav('upload')}
            </Link>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
