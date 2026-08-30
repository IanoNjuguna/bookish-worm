'use client'

import { useEffect, useRef, useState } from 'react'

interface PlayerProgressProps {
  currentTime: number
  duration: number
  onSeek: (time: number) => void
  variant?: 'desktop' | 'mobile'
}

export function PlayerProgress({ currentTime, duration, onSeek, variant = 'desktop' }: PlayerProgressProps) {
  const barRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const progressPercent = duration > 0 && duration !== Infinity ? (currentTime / duration) * 100 : 0

  const formatTime = (time: number) => {
    if (!time || isNaN(time) || time === Infinity) return '0:00'
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const calculateTime = (clientX: number, rect: DOMRect) => {
    const percent = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
    return percent * (duration || 0)
  }

  const handleBarPress = (clientX: number) => {
    if (!barRef.current) return
    const rect = barRef.current.getBoundingClientRect()
    onSeek(calculateTime(clientX, rect))
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
  }, [isDragging, duration, onSeek])

  if (variant === 'mobile') {
    return (
      <div
        ref={barRef}
        className="h-2 self-stretch mx-3 mt-1 bg-midnight/10 dark:bg-white/10 relative cursor-pointer group overflow-hidden rounded-full"
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        role="slider"
        aria-label="Track Progress"
        aria-valuenow={Math.round(progressPercent)}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div className="h-full bg-pink-600 dark:bg-cyber-pink rounded-full" style={{ width: `${progressPercent}%` }} />
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2 w-full max-w-[500px]">
      <span className="text-[10px] text-midnight/70 dark:text-white/40 tabular-nums w-8 text-right flex-shrink-0">{formatTime(currentTime)}</span>
      <div
        ref={barRef}
        className="group relative flex-1 h-3 flex items-center cursor-pointer"
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        role="slider"
        aria-label="Track Progress"
      >
        <div className="absolute inset-y-0 my-auto h-[3px] w-full bg-midnight/10 dark:bg-white/10 rounded-full" />
        <div className="absolute inset-y-0 my-auto h-[3px] bg-pink-600 dark:bg-cyber-pink rounded-full" style={{ width: `${progressPercent}%` }} />
        <div className="absolute w-3 h-3 bg-white shadow-md transition-opacity -translate-x-1/2 opacity-0 group-hover:opacity-100 rounded-full border border-midnight/10" style={{ left: `${progressPercent}%` }} />
      </div>
      <span className="text-[10px] text-midnight/70 dark:text-white/40 tabular-nums w-8 flex-shrink-0">{formatTime(duration)}</span>
    </div>
  )
}
