'use client'

import { useEffect, useRef, useState } from 'react'
import { IconVolume2, IconVolumeOff } from '@tabler/icons-react'

interface VolumeControlProps {
  volume: number
  isMuted: boolean
  onToggleMute: () => void
  onSetVolume: (volume: number) => void
}

export function VolumeControl({ volume, isMuted, onToggleMute, onSetVolume }: VolumeControlProps) {
  const barRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  const calculateVolume = (clientX: number, rect: DOMRect) => {
    return Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
  }

  const handleBarPress = (clientX: number) => {
    if (!barRef.current) return
    const rect = barRef.current.getBoundingClientRect()
    const val = calculateVolume(clientX, rect)
    onSetVolume(val)
    if (val > 0 && isMuted) onToggleMute()
  }

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true)
    handleBarPress(e.clientX)
  }

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    setIsDragging(true)
    handleBarPress(e.touches[0].clientX)
  }

  useEffect(() => {
    if (!isDragging) return

    const handleMouseMove = (e: MouseEvent) => handleBarPress(e.clientX)
    const handleTouchMove = (e: TouchEvent) => handleBarPress(e.touches[0].clientX)
    const handleEnd = () => setIsDragging(false)

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleEnd)
    window.addEventListener('touchmove', handleTouchMove)
    window.addEventListener('touchend', handleEnd)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleEnd)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', handleEnd)
    }
  }, [isDragging, isMuted, onSetVolume, onToggleMute])

  const width = `${(isMuted ? 0 : volume) * 100}%`

  return (
    <div className="flex items-center gap-2 min-w-[100px]">
      <button onClick={onToggleMute} className="p-1.5 text-midnight/70 dark:text-white/40 hover:text-midnight dark:hover:text-white transition-colors flex-shrink-0" aria-label={isMuted ? 'Unmute' : 'Mute'}>
        {isMuted || volume === 0 ? <IconVolumeOff size={18} /> : <IconVolume2 size={18} />}
      </button>
      <div
        ref={barRef}
        className="group relative flex-1 h-3 flex items-center cursor-pointer"
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        role="slider"
        aria-label="Volume"
      >
        <div className="absolute inset-y-0 my-auto h-[3px] w-full bg-midnight/10 dark:bg-white/20 rounded-full" />
        <div className="absolute inset-y-0 my-auto h-[3px] bg-pink-600 dark:bg-cyber-pink rounded-full" style={{ width }} />
        <div className="absolute w-3 h-3 bg-white shadow-md transition-opacity -translate-x-1/2 opacity-0 group-hover:opacity-100 rounded-full border border-midnight/10" style={{ left: width }} />
      </div>
    </div>
  )
}
