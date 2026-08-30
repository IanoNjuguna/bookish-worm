'use client'

interface TrackNotFoundProps {
  onBack: () => void
}

export function TrackNotFound({ onBack }: TrackNotFoundProps) {
  return (
    <div className="min-h-screen bg-transparent flex flex-col items-center justify-center gap-4">
      <p className="text-midnight/70 dark:text-white/40">Track not found</p>
      <button onClick={onBack} className="text-pink-600 dark:text-cyber-pink text-sm underline">
        Go back to assets
      </button>
    </div>
  )
}
