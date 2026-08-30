'use client'

interface TrackMintProgressProps {
  mintCount: number
  maxSupply: number
}

export function TrackMintProgress({ mintCount, maxSupply }: TrackMintProgressProps) {
  if (maxSupply <= 0) return null
  return (
    <div className="h-[3px] w-full bg-midnight/10 dark:bg-white/10 rounded-full overflow-hidden mb-5 md:mb-6">
      <div
        className="h-full bg-pink-600 dark:bg-cyber-pink transition-all duration-1000 rounded-full"
        style={{ width: `${Math.min(100, (mintCount / maxSupply) * 100)}%` }}
      />
    </div>
  )
}
