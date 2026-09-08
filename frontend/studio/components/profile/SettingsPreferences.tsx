'use client'

import { resetOnboarding } from '@/lib/onboarding'

export function SettingsPreferences() {
  return (
    <section>
      <h3 className="text-[10px] font-bold uppercase tracking-widest text-midnight/50 dark:text-white/40 mb-2">
        Preferences
      </h3>
      <div className="bg-midnight/5 dark:bg-white/5 border border-midnight/10 dark:border-white/10 rounded-xl p-4">
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
    </section>
  )
}
