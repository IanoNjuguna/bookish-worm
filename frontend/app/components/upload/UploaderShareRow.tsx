import { formatAddress } from './UploadView.lib'

interface UploaderShareRowProps {
  cardanoAddress: string | null
  uploaderShare: number
}

export default function UploaderShareRow({ cardanoAddress, uploaderShare }: UploaderShareRowProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:items-start p-3 bg-lavender/5 border border-lavender/20 rounded-xl mb-4">
      <div className="flex-1 flex items-center gap-2 min-w-0">
        <div className="w-8 h-8 rounded-full bg-lavender/20 flex items-center justify-center text-lavender uppercase font-bold text-xs shrink-0">Me</div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-midnight/90 dark:text-white">You (Uploader)</p>
          <p className="text-[10px] text-midnight/70 dark:text-white/70 font-mono truncate" title={cardanoAddress || undefined}>
            {cardanoAddress ? formatAddress(cardanoAddress) : 'No Cardano wallet connected'}
          </p>
        </div>
      </div>
      <div className="flex gap-3 sm:gap-0 items-center sm:items-start">
        <div className="w-full sm:w-28 relative">
          <div className="w-full bg-midnight/5 dark:bg-white/5 border border-midnight/10 dark:border-white/10 rounded-xl px-4 py-3 text-midnight dark:text-white text-sm text-center font-bold">
            {uploaderShare}
          </div>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-midnight/70 dark:text-white/70 text-xs font-bold">%</div>
        </div>
        <div className="hidden sm:block w-[44px]" />
      </div>
    </div>
  )
}
