'use client'

import { Checkbox } from '@/components/ui/checkbox'
import { ThemeToggle } from '@/components/ThemeToggle'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import { useGradient } from '@/components/GradientProvider'

export function SettingsAppearance() {
  const { gradientEnabled, setGradientEnabled } = useGradient()

  return (
    <section>
      <h3 className="text-[10px] font-bold uppercase tracking-widest text-midnight/50 dark:text-white/40 mb-2">
        Appearance
      </h3>
      <div className="bg-midnight/5 dark:bg-white/5 border border-midnight/10 dark:border-white/10 rounded-xl p-4 space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-midnight dark:text-white">Theme</p>
            <p className="text-xs text-midnight/60 dark:text-white/40 leading-relaxed">
              Switch between light and dark mode
            </p>
          </div>
          <div id="theme-toggle-btn" className="shrink-0">
            <ThemeToggle />
          </div>
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-midnight dark:text-white">Language</p>
            <p className="text-xs text-midnight/60 dark:text-white/40 leading-relaxed">
              Choose your preferred language
            </p>
          </div>
          <div className="shrink-0">
            <LanguageSwitcher />
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Checkbox
            id="gradient-toggle"
            checked={gradientEnabled}
            onCheckedChange={checked => setGradientEnabled(checked === true)}
          />
          <div className="space-y-1 min-w-0">
            <label
              htmlFor="gradient-toggle"
              className="text-sm font-semibold text-midnight dark:text-white cursor-pointer"
            >
              Gradient background
            </label>
            <p className="text-xs text-midnight/60 dark:text-white/40 leading-relaxed">
              Show the animated ambient gradient behind the app
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
