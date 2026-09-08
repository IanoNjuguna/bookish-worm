'use client'

import { SeedPhraseUnavailable } from './SeedPhraseUnavailable'
import { SeedPhraseReveal } from './SeedPhraseReveal'

interface SettingsSecurityProps {
  sessionSeedPhrase: string | null
  showSeedPhrase: boolean
  setShowSeedPhrase: (value: boolean) => void
}

export function SettingsSecurity({
  sessionSeedPhrase,
  showSeedPhrase,
  setShowSeedPhrase,
}: SettingsSecurityProps) {
  return (
    <section>
      <h3 className="text-[10px] font-bold uppercase tracking-widest text-midnight/50 dark:text-white/40 mb-2">
        Security
      </h3>
      {sessionSeedPhrase ? (
        <SeedPhraseReveal
          sessionSeedPhrase={sessionSeedPhrase}
          showSeedPhrase={showSeedPhrase}
          setShowSeedPhrase={setShowSeedPhrase}
        />
      ) : (
        <SeedPhraseUnavailable />
      )}
    </section>
  )
}
