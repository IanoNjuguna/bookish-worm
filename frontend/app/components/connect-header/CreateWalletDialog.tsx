'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { IconCopy } from '@tabler/icons-react'

interface CreateWalletDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  generatedSeed: string
  isConnecting: boolean
  onCopySeed: () => void
  onConfirm: () => Promise<void>
}

export function CreateWalletDialog({ open, onOpenChange, generatedSeed, isConnecting, onCopySeed, onConfirm }: CreateWalletDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-background dark:bg-card border-midnight/10 dark:border-white/10 text-midnight dark:text-white rounded-md">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-xl text-center font-bold">Save Your Recovery Phrase</DialogTitle>
          <DialogDescription className="text-midnight/60 dark:text-white/60 text-center pt-2">
            <span className="text-red-400 font-bold block mb-1">⚠️ FOR PROTOTYPING ONLY</span>
            Write these 24 words down and keep them safe. This is the ONLY time they will be shown. If you lose them, you will lose access to your funds forever.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-2">
          <div className="bg-black/50 border border-midnight/10 dark:border-white/10 p-4 font-mono text-sm leading-relaxed text-lavender select-all rounded-md break-words">
            {generatedSeed}
          </div>

          <Button
            onClick={onCopySeed}
            variant="outline"
            className="bg-transparent border-midnight/20 dark:border-white/20 hover:bg-midnight/5 dark:hover:bg-white/5 text-midnight dark:text-white rounded-md"
          >
            <IconCopy size={16} className="mr-2" /> Copy to Clipboard
          </Button>

          <Button
            onClick={onConfirm}
            disabled={isConnecting}
            className="bg-cyber-pink hover:bg-cyber-pink/90 text-midnight dark:text-white font-bold rounded-md mt-2"
          >
            {isConnecting ? "Connecting..." : "I have securely saved it"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
