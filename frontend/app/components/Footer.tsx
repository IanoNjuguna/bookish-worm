'use client'

import { useTranslations } from 'next-intl'
import LanguageSwitcher from './LanguageSwitcher'

export default function Footer() {
  const t = useTranslations('footer')
  const homeUrl = process.env.NEXT_PUBLIC_HOME_URL || 'https://doba.world'

  return (
    <div className="w-full text-midnight/70 dark:text-white/70 text-xs flex flex-col gap-3">
      {/* COMPANY section with About, How It Works, Docs */}
      <div>
        <span className="font-bold text-midnight/70 dark:text-white/40 uppercase tracking-widest text-[9px] block mb-1">
          COMPANY
        </span>
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-midnight/60 dark:text-white/60 font-medium">
          <a href={`${homeUrl}/about`} className="hover:text-[#FF1F8A] transition-colors">{t('about') || 'About'}</a>
          <span className="text-midnight/50 dark:text-white/20">·</span>
          <a href={`${homeUrl}/how-it-works`} className="hover:text-[#FF1F8A] transition-colors">{t('howItWorks') || 'How It Works'}</a>
          <span className="text-midnight/50 dark:text-white/20">·</span>
          <a href={`${homeUrl}/docs`} className="hover:text-[#FF1F8A] transition-colors">{t('docs') || 'Docs'}</a>
        </div>
      </div>

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
