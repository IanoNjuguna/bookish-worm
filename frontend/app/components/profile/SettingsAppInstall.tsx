'use client'

import { Button } from '@/components/ui/button'
import { IconDownload } from '@tabler/icons-react'

interface SettingsAppInstallProps {
  onInstall: () => void
}

export function SettingsAppInstall({ onInstall }: SettingsAppInstallProps) {
  return (
    <section>
      <h3 className="text-[10px] font-bold uppercase tracking-widest text-midnight/50 dark:text-white/40 mb-2">
        App
      </h3>
      <div className="bg-midnight/5 dark:bg-white/5 border border-midnight/10 dark:border-white/10 rounded-xl p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-1">
            <p className="text-sm font-semibold text-midnight dark:text-white">Install Doba</p>
            <p className="text-xs text-midnight/60 dark:text-white/40 leading-relaxed">
              Add Doba to your home screen for instant access and lock screen controls.
            </p>
          </div>
          <Button
            size="sm"
            onClick={onInstall}
            className="shrink-0 bg-lavender hover:bg-lavender/90 text-midnight font-bold text-xs uppercase tracking-wider px-3 py-2 h-auto rounded-xl"
          >
            <IconDownload size={14} className="mr-1.5" />
            Install
          </Button>
        </div>
      </div>
    </section>
  )
}
