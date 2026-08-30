import { cn } from '@/lib/utils'
import type { CardMetadataProps } from './SongCard.types'
import { MarqueeText } from './MarqueeText'

export function CardMetadata({
  name,
  artist,
  price,
  isAlbum,
  trackCount,
  albumTracks,
  isExpanded,
  isHovered,
  isPlaying,
  isLongPressed,
  titleScrollAmount,
  artistScrollAmount,
  titleContainerRef,
  titleTextRef,
  artistContainerRef,
  artistTextRef,
}: CardMetadataProps) {
  const isMarqueeActive = isHovered || isPlaying || isLongPressed

  return (
    <div className="mt-3 flex flex-col gap-1 px-1 min-w-0">
      <MarqueeText
        text={name}
        scrollAmount={titleScrollAmount}
        isActive={isMarqueeActive}
        containerRef={titleContainerRef}
        textRef={titleTextRef}
        containerClassName="overflow-hidden whitespace-nowrap w-full relative"
        textClassName="inline-block font-display font-bold text-sm text-black dark:text-white leading-tight group-hover:text-black dark:group-hover:text-lavender transition-colors duration-200"
      />
      <div className="flex items-center justify-between gap-2 min-w-0">
        <MarqueeText
          text={artist}
          scrollAmount={artistScrollAmount}
          isActive={isMarqueeActive}
          containerRef={artistContainerRef}
          textRef={artistTextRef}
          containerClassName="overflow-hidden whitespace-nowrap flex-grow relative min-w-0"
          textClassName="inline-block text-[10px] text-black/50 dark:text-white/50 font-sans font-medium uppercase tracking-[1px]"
        />
        <span className="text-[10px] font-sans font-bold text-purple-600 dark:text-lavender flex-shrink-0">
          {isAlbum ? (
            albumTracks && albumTracks.length > 0
              ? `${albumTracks.filter((t) => !t.is_owned).reduce((sum, t) => sum + Number(t.price || 5), 0)} ADA`
              : `${Number(price || 5) * trackCount} ADA`
          ) : (
            `${price || '5'} ADA`
          )}
        </span>
      </div>
      {isAlbum && (
        <div className="flex items-center justify-between mt-0.5">
          <span className="text-[9px] font-sans font-semibold tracking-wider text-black/40 dark:text-white/40 uppercase">
            {trackCount} TRACKS
          </span>
          <span
            className={cn(
              "text-[9px] font-sans font-semibold tracking-wider text-black/30 dark:text-white/30 uppercase transition-transform duration-300",
              isExpanded && "rotate-180"
            )}
          >
            ▾
          </span>
        </div>
      )}
    </div>
  )
}
