'use client'

import { Checkbox } from '@/components/ui/checkbox'
import { resetOnboarding } from '@/lib/onboarding'

interface SettingsPreferencesProps {
  artistMode: boolean
  onToggle: (enabled: boolean) => void
}

export function SettingsPreferences({ artistMode, onToggle }: SettingsPreferencesProps) {
  return (
    <section>
      <h3 className="text-[10px] font-bold uppercase tracking-widest text-midnight/50 dark:text-white/40 mb-2">
        Preferences
      </h3>
      <div className="bg-midnight/5 dark:bg-white/5 border border-midnight/10 dark:border-white/10 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <Checkbox
            id="artist-mode"
            checked={artistMode}
            onCheckedChange={checked => onToggle(checked === true)}
          />
          <div className="space-y-1">
            <label
              htmlFor="artist-mode"
              className="text-sm font-semibold text-midnight dark:text-white cursor-pointer"
            >
              Artist Mode
            </label>
            <p className="text-xs text-midnight/60 dark:text-white/40 leading-relaxed">
              Show studio features like Upload, Earnings, and Analytics in your profile actions.
            </p>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-midnight/10 dark:border-white/10">
          <button
            onClick={resetOnboarding}
            className="text-xs font-semibold text-midnight/70 dark:text-white/70 hover:text-cyber-pink transition-colors"
          >
            Reset onboarding checklist
          </button>
          <p className="text-[10px] text-midnight/50 dark:text-white/40 mt-1">
            Clear onboarding state and reload the app
          </p>
        </div>
      </div>
    </section>
  )
}
