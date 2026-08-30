import { IconAlertTriangle, IconClock } from '@tabler/icons-react'
import { formatElapsed } from './UploadView.lib'
import ProgressBar from './ProgressBar'
import ProgressSteps from './ProgressSteps'

interface UploadProgressProps {
  isUploading: boolean
  uploadStep: number
  uploadStatusText: string
  elapsedSeconds: number
  displaySeg1: number
  displaySeg2: number
  displaySeg3: number
  displaySeg4: number
}

export default function UploadProgress({
  isUploading,
  uploadStep,
  uploadStatusText,
  elapsedSeconds,
  displaySeg1,
  displaySeg2,
  displaySeg3,
  displaySeg4,
}: UploadProgressProps) {
  if (!isUploading) return null

  return (
    <div className="fixed inset-0 z-50 w-screen h-screen flex items-center justify-center p-4 bg-transparent backdrop-blur-xl md:backdrop-blur-2xl animate-fade-in">
      <div className="w-full max-w-md glass-surface p-6 space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-midnight dark:text-white flex items-center gap-2 tracking-tight">
              Publishing Release
            </h3>
            <p className="text-xs font-semibold text-amber-500 flex items-center gap-1.5 uppercase tracking-wide">
              <IconAlertTriangle size={14} className="shrink-0 text-amber-500" />
              Please do not close or refresh this page
            </p>
            <p className="text-xs text-midnight/60 dark:text-white/60">
              Media assets are being pinned to IPFS and signed on Cardano.
            </p>
          </div>
          <div
            className="flex items-center gap-1 text-[11px] font-mono text-midnight/60 dark:text-white/60 bg-midnight/5 dark:bg-white/5 border border-midnight/10 dark:border-white/10 px-2 py-1 rounded-xl shrink-0"
            title="Elapsed publishing time"
          >
            <IconClock size={13} className="shrink-0 text-midnight/40 dark:text-white/40" />
            <span>{formatElapsed(elapsedSeconds)}</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-midnight/70 dark:text-white/70 truncate max-w-full">
              {uploadStatusText || 'Processing release...'}
            </span>
          </div>
          <ProgressBar
            displaySeg1={displaySeg1}
            displaySeg2={displaySeg2}
            displaySeg3={displaySeg3}
            displaySeg4={displaySeg4}
          />
        </div>

        <ProgressSteps uploadStep={uploadStep} />
      </div>
    </div>
  )
}
