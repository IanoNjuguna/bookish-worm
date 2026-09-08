import { IconX } from '@tabler/icons-react'
import { cn } from '@/lib/utils'
import { InstallInstructions } from './InstallInstructions'
import { BannerActions } from './BannerActions'

export interface InstallBannerProps {
  isIOSView: boolean
  onInstall: () => void
  onDismiss: () => void
}

export function InstallBanner({ isIOSView, onInstall, onDismiss }: InstallBannerProps) {
  return (
    <div className={cn(
      "fixed bottom-24 left-4 right-4 z-[60] sm:left-auto sm:right-6 sm:w-[360px]",
      "animate-in slide-in-from-bottom-4 duration-500"
    )}>
      <div className="glass-surface bg-background/80 dark:bg-midnight/80 rounded-2xl p-4 shadow-xl border border-midnight/[0.08] dark:border-white/[0.08] relative overflow-hidden">
        <button
          onClick={onDismiss}
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-lg bg-midnight/5 dark:bg-white/5 text-midnight/40 dark:text-white/40 hover:text-midnight dark:hover:text-white hover:bg-midnight/10 dark:hover:bg-white/10 transition-colors"
          aria-label="Dismiss"
        >
          <IconX size={16} />
        </button>

        <div className="flex items-center gap-3 mb-3 pr-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/icons/icon-72x72.png" alt="Doba" className="w-10 h-10 rounded-xl border border-midnight/10 dark:border-white/10" />
          <div>
            <p className="text-sm font-bold text-midnight dark:text-white">Install Doba</p>
            <p className="text-[10px] uppercase tracking-wider text-midnight/50 dark:text-white/40 font-medium">Free · No App Store required</p>
          </div>
        </div>

        <InstallInstructions isIOSView={isIOSView} />

        <BannerActions isIOSView={isIOSView} onInstall={onInstall} onDismiss={onDismiss} />
      </div>
    </div>
  )
}
