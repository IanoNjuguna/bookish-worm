import { cn } from '@/lib/utils'
import type { CSSProperties } from 'react'
import type { MarqueeTextProps } from './SongCard.types'

export function MarqueeText({
  text,
  scrollAmount,
  isActive,
  containerRef,
  textRef,
  containerClassName,
  textClassName,
}: MarqueeTextProps) {
  return (
    <div ref={containerRef} className={containerClassName}>
      <span
        ref={textRef}
        style={{ '--scroll-x': `-${scrollAmount}px` } as CSSProperties}
        className={cn(
          textClassName,
          scrollAmount > 0 && isActive
            ? "animate-marquee-dynamic overflow-visible"
            : "truncate w-full"
        )}
      >
        {text}
      </span>
    </div>
  )
}
