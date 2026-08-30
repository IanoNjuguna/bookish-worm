interface ProgressBarProps {
  displaySeg1: number
  displaySeg2: number
  displaySeg3: number
  displaySeg4: number
}

export default function ProgressBar({ displaySeg1, displaySeg2, displaySeg3, displaySeg4 }: ProgressBarProps) {
  return (
    <div className="w-full bg-midnight/10 dark:bg-white/10 h-3 rounded-full overflow-hidden flex gap-1 p-0.5 border border-midnight/15 dark:border-white/15">
      <div className="h-full rounded-full transition-all duration-150 ease-linear bg-fuchsia-500" style={{ width: `${displaySeg1}%` }} title="1. Media IPFS Upload" />
      <div className="h-full rounded-full transition-all duration-150 ease-linear bg-purple-500" style={{ width: `${displaySeg2}%` }} title="2. CIP-60 Metadata" />
      <div className="h-full rounded-full transition-all duration-150 ease-linear bg-blue-500" style={{ width: `${displaySeg3}%` }} title="3. On-Chain Minting" />
      <div className="h-full rounded-full transition-all duration-150 ease-linear bg-emerald-500" style={{ width: `${displaySeg4}%` }} title="4. Catalog Indexing" />
    </div>
  )
}
