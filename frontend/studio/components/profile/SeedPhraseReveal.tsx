'use client'

import { Button } from '@/components/ui/button'
import { IconCopy, IconEye, IconEyeOff } from '@tabler/icons-react'
import { toast } from 'sonner'

interface SeedPhraseRevealProps {
  sessionSeedPhrase: string
  showSeedPhrase: boolean
  setShowSeedPhrase: (value: boolean) => void
}

export function SeedPhraseReveal({
  sessionSeedPhrase,
  showSeedPhrase,
  setShowSeedPhrase,
}: SeedPhraseRevealProps) {
  return (
    <div className="bg-midnight/5 dark:bg-white/5 border border-midnight/10 dark:border-white/10 rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-midnight dark:text-white">Seed Phrase</p>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSeedPhrase(!showSeedPhrase)}
            className="h-8 text-xs text-midnight/60 dark:text-white/60 hover:text-midnight dark:hover:text-white hover:bg-midnight/5 dark:hover:bg-white/5 rounded-lg shrink-0"
          >
            {showSeedPhrase ? <IconEyeOff size={14} /> : <IconEye size={14} />}
            <span className="ml-1">{showSeedPhrase ? 'Hide' : 'Reveal'}</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              navigator.clipboard.writeText(sessionSeedPhrase)
              toast.success('Copied to clipboard')
            }}
            className="h-8 text-xs text-lavender hover:bg-lavender/10 hover:text-lavender rounded-lg shrink-0"
          >
            <IconCopy size={14} className="mr-1" />
            Copy
          </Button>
        </div>
      </div>
      <div className="bg-midnight/5 dark:bg-white/5 p-3 font-mono text-xs leading-relaxed text-midnight/70 dark:text-white/60 rounded-lg min-h-[44px] flex items-center">
        {showSeedPhrase ? (
          <span className="select-all break-words">{sessionSeedPhrase}</span>
        ) : (
          <span className="tracking-widest">••• ••• ••• ••• ••• •••</span>
        )}
      </div>
      <p className="text-[10px] text-midnight/50 dark:text-white/40 leading-relaxed">
        Your seed phrase is the master key to your wallet. Anyone with it can access your funds, so store it somewhere safe and never share it. For your security, Doba only keeps it in memory during this browser session — once you close or refresh this tab, it is erased and cannot be shown again.
      </p>
    </div>
  )
}
