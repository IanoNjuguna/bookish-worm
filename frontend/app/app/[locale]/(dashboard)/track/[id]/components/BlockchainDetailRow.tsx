import type { BlockchainDetailRowProps } from './TrackBlockchainDetails.types'

export function BlockchainDetailRow({ label, children }: BlockchainDetailRowProps) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-widest text-midnight/40 dark:text-white/35 font-bold mb-1.5">
        {label}
      </p>
      {children}
    </div>
  )
}
