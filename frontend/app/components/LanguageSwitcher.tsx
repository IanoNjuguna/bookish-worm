'use client'

import { useLocale, useTranslations } from 'next-intl'
import { useRouter, usePathname } from '@/i18n/navigation'
import { getSafeRedirect } from '@/lib/redirect'
import { routing, type Locale } from '@/i18n/routing'
import { IconLanguage, IconCheck } from '@tabler/icons-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

export default function LanguageSwitcher() {
  const t = useTranslations('languages')
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  function handleLocaleChange(newLocale: Locale) {
    const safePath = getSafeRedirect(pathname)
    router.replace(safePath, { locale: newLocale })
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="px-3 py-2 rounded-md text-midnight/70 dark:text-white/70 hover:text-midnight dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-all duration-300 flex items-center gap-2 shrink-0"
          title="Change language"
          aria-label="Change language"
        >
          <IconLanguage size={18} />
          <span className="text-xs font-semibold uppercase">{locale}</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="min-w-[160px] max-h-[70vh] overflow-y-auto glass-surface bg-background/95 dark:bg-midnight/95 rounded-xl shadow-xl border-midnight/10 dark:border-white/10"
      >
        {routing.locales.map((loc) => (
          <DropdownMenuItem
            key={loc}
            onClick={() => handleLocaleChange(loc)}
            className={cn(
              "text-xs font-medium cursor-pointer",
              loc === locale
                ? "text-cyber-pink font-bold bg-cyber-pink/5 dark:bg-cyber-pink/10 focus:bg-cyber-pink/5 dark:focus:bg-cyber-pink/10 focus:text-cyber-pink"
                : "text-midnight/70 dark:text-white/70 hover:text-midnight dark:hover:text-white hover:bg-midnight/5 dark:hover:bg-white/5"
            )}
          >
            {loc === locale && <IconCheck size={14} className="text-pink-600 dark:text-cyber-pink" />}
            {t(loc)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
