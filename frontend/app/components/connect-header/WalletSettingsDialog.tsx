'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { IconCopy, IconSettings, IconKey } from '@tabler/icons-react'

interface WalletSettingsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  sessionSeedPhrase: string | null
  onCopySeed: () => void
}

export function WalletSettingsDialog({ open, onOpenChange, sessionSeedPhrase, onCopySeed }: WalletSettingsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-background dark:bg-card border-midnight/10 dark:border-white/10 text-midnight dark:text-white rounded-md">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <IconSettings className="text-lavender" />
            Wallet Settings
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-2">
          <div>
            <h3 className="text-sm font-semibold text-midnight/80 dark:text-white/80 mb-2 uppercase tracking-wide">Security</h3>
            {sessionSeedPhrase ? (
              <div className="bg-midnight/5 dark:bg-white/5 border border-midnight/10 dark:border-white/10 p-4 rounded-md">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-midnight/90 dark:text-white/90">Current Session Recovery Phrase</span>
                  <Button
                    onClick={onCopySeed}
                    variant="ghost"
                    size="sm"
                    className="h-8 text-xs text-lavender hover:bg-lavender/10 hover:text-lavender rounded-md"
                  >
                    <IconCopy size={14} className="mr-1" /> Copy
                  </Button>
                </div>
                <div className="bg-black/50 p-3 font-mono text-xs leading-relaxed text-midnight/60 dark:text-white/60 select-all break-words rounded-md">
                  {sessionSeedPhrase}
                </div>
                <p className="text-[10px] text-midnight/70 dark:text-white/40 mt-2">
                  Note: This phrase is only accessible during your current session. If you close or refresh this tab, it will be wiped from memory permanently.
                </p>
              </div>
            ) : (
              <div className="bg-midnight/5 dark:bg-white/5 border border-midnight/10 dark:border-white/10 p-4 rounded-md flex items-center gap-3">
                <IconKey className="text-midnight/70 dark:text-white/40" size={24} />
                <p className="text-sm text-midnight/60 dark:text-white/60">
                  No recovery phrase available. You are likely connected via a browser extension wallet which securely manages your keys.
                </p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
