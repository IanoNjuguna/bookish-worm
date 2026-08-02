'use client'

import { useTranslations } from 'next-intl'
import LanguageSwitcher from './LanguageSwitcher'

export default function Footer() {
  const t = useTranslations('footer')

  return (
    <div className="w-full text-midnight/70 dark:text-white/70 text-xs flex flex-col gap-3">

      {/* Language selector and copyright */}
      <div className="flex flex-col gap-2 pt-1">
        <div className="flex items-center gap-2 text-midnight/50 dark:text-white/50">
          <span>{t('language') || 'Language'}:</span>
          <LanguageSwitcher />
        </div>
        <p className="text-[10px] text-midnight/70 dark:text-white/40 mt-0.5">
          © {new Date().getFullYear()} doba
        </p>
      </div>
    </div>
  )
}
