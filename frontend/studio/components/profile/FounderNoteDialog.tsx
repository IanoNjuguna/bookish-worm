'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { IconNote } from '@tabler/icons-react'

interface FounderNoteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function FounderNoteDialog({ open, onOpenChange }: FounderNoteDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px] w-[calc(100%-2rem)] max-h-[85vh] overflow-y-auto glass-surface text-midnight dark:text-white shadow-2xl p-5 sm:p-6">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <IconNote className="text-lavender" />
            A note from the founder
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <img
            src="/note.jpg"
            alt="Handwritten note from the founder"
            className="w-full rounded-xl border border-midnight/10 dark:border-white/10"
          />
          <p className="text-sm text-midnight/70 dark:text-white/70 text-center">
            Glad you made it. I hope doba brings you joy.
          </p>
          <p className="text-xs text-midnight/50 dark:text-white/50 text-center">— Ian, founder of doba</p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
