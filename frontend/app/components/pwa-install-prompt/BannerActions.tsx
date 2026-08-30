import { IconDownload } from '@tabler/icons-react'

export interface BannerActionsProps {
  isIOSView: boolean
  onInstall: () => void
  onDismiss: () => void
}

export function BannerActions({ isIOSView, onInstall, onDismiss }: BannerActionsProps) {
  return (
    <div className="flex items-center justify-end gap-3">
      <button
        onClick={onDismiss}
        className="text-xs font-semibold text-midnight/50 dark:text-white/40 hover:text-midnight dark:hover:text-white transition-colors px-2 py-1.5 rounded-lg hover:bg-midnight/5 dark:hover:bg-white/5"
      >
        Not now
      </button>
      {!isIOSView && (
        <button
          onClick={onInstall}
          className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider bg-lavender hover:bg-lavender/90 text-midnight px-4 py-2 rounded-xl transition-all active:scale-95"
        >
          <IconDownload size={14} />
          Install
        </button>
      )}
      {isIOSView && (
        <button
          onClick={onDismiss}
          className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider bg-lavender hover:bg-lavender/90 text-midnight px-4 py-2 rounded-xl transition-all active:scale-95"
        >
          Got it
        </button>
      )}
    </div>
  )
}
