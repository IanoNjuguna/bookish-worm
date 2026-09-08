'use client'

interface MobileProgressBarProps {
  currentTime: number
  duration: number
  onSeek: (time: number) => void
}

function formatTime(time: number) {
  if (!time || isNaN(time) || time === Infinity) return '0:00'
  const minutes = Math.floor(time / 60)
  const seconds = Math.floor(time % 60)
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

export function MobileProgressBar({ currentTime, duration, onSeek }: MobileProgressBarProps) {
  const progressPercent = duration > 0 && duration !== Infinity ? (currentTime / duration) * 100 : 0

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    onSeek(percent * (duration || 0))
  }

  return (
    <div className="space-y-2">
      <div
        className="h-[3px] w-full bg-midnight/10 dark:bg-white/10 relative cursor-pointer group overflow-hidden rounded-full"
        onClick={handleClick}
        role="slider"
        aria-label="Track Progress"
        aria-valuenow={Math.round(progressPercent)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="absolute inset-y-0 left-0 bg-pink-600 dark:bg-cyber-pink transition-all h-full rounded-full"
          style={{ width: `${progressPercent}%` }}
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-pink-600 dark:bg-cyber-pink border border-midnight/10 dark:border-white/10 opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ left: `calc(${progressPercent}% - 6px)` }}
        />
      </div>
      <div className="flex items-center justify-between text-[10px] text-midnight/70 dark:text-white/40 tabular-nums font-bold uppercase tracking-widest">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>
    </div>
  )
}
