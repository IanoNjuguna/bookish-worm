'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface ImportSeedDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  seedPhrase: string
  seedError: string
  isConnecting: boolean
  onSeedPhraseChange: (value: string) => void
  onSubmit: () => Promise<void>
}

export function ImportSeedDialog({ open, onOpenChange, seedPhrase, seedError, isConnecting, onSeedPhraseChange, onSubmit }: ImportSeedDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-background dark:bg-card border-midnight/10 dark:border-white/10 text-midnight dark:text-white rounded-md">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-xl text-center font-bold">Import Seed Phrase</DialogTitle>
          <DialogDescription className="text-midnight/60 dark:text-white/60 text-center pt-2">
            <span className="text-red-400 font-bold block mb-1">⚠️ FOR PROTOTYPING ONLY</span>
            Enter your 12, 15, 24, or 27 word seed phrase to connect directly. Do not import a seed phrase containing real mainnet funds.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-2">
          <div>
            <Input
              placeholder="word1 word2 word3..."
              value={seedPhrase}
              onChange={(e) => onSeedPhraseChange(e.target.value)}
              className="bg-midnight/5 dark:bg-white/5 border-midnight/10 dark:border-white/10 text-midnight dark:text-white rounded-md focus-visible:ring-lavender"
            />
            {seedError && <p className="text-red-400 text-xs font-medium mt-2 ml-1">{seedError}</p>}
          </div>
          <Button
            onClick={onSubmit}
            disabled={isConnecting || !seedPhrase.trim()}
            className="bg-lavender hover:bg-lavender/90 text-midnight font-bold rounded-md"
          >
            {isConnecting ? "Connecting..." : "Connect"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
