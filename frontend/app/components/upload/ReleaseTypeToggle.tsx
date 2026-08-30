'use client'

import { cn } from '@/lib/utils'

interface ReleaseTypeToggleProps {
  isAlbum: boolean
  setIsAlbum: (value: boolean) => void
}

export default function ReleaseTypeToggle({ isAlbum, setIsAlbum }: ReleaseTypeToggleProps) {
  return (
    <div className="inline-flex p-1 mt-4 rounded-full bg-midnight/5 dark:bg-white/5 border border-midnight/10 dark:border-white/10">
      {[
        { label: 'single', value: false },
        { label: 'album', value: true },
      ].map(({ label, value }) => {
        const isActive = isAlbum === value
        return (
          <button
            key={label}
            type="button"
            onClick={() => setIsAlbum(value)}
            className={cn(
              'px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
              isActive
                ? 'bg-cyber-pink text-white'
                : 'text-midnight/60 dark:text-white/60 hover:text-midnight dark:hover:text-white hover:bg-midnight/5 dark:hover:bg-white/5'
            )}
          >
            {label}
          </button>
        )
      })}
    </div>
  )
}
