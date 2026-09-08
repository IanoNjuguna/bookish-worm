'use client'

import { Track } from '@/lib/types'
import { cn } from '@/lib/utils'
import SongCard from '../SongCard'
import { gridClassName } from './MarketplaceGrid.constants'
import type {
  GridSectionProps,
  GridSectionVariant,
  SongCardDerivedProps,
} from './MarketplaceGrid.types'

const DEFAULT_TITLE_CLASS = "text-2xl font-bold text-midnight dark:text-white"

function resolveIsOwned(
  variant: GridSectionVariant,
  track: Track,
  cardProps: SongCardDerivedProps
): boolean | undefined {
  if (variant === 'single') return track.is_owned
  if (variant === 'album') return cardProps.albumTracks.every((t) => t.is_owned)
  return cardProps.isAlbum ? cardProps.albumTracks.every((t) => t.is_owned) : track.is_owned
}

export function GridSection({
  variant,
  tracks,
  allTracks,
  title,
  titleClassName,
  withTopBorder = false,
  onPlay,
  currentTrackId,
  isPlaying,
  isSidebarOpen,
  getSongCardProps,
}: GridSectionProps) {
  return (
    <div className={cn(
      "space-y-4",
      withTopBorder && "pt-6 border-t border-midnight/[0.06] dark:border-white/[0.06]"
    )}>
      {title && <h2 className={titleClassName ?? DEFAULT_TITLE_CLASS}>{title}</h2>}
      <div className={gridClassName(isSidebarOpen)}>
        {tracks.map((track) => {
          const cardProps = getSongCardProps(track)
          return (
            <SongCard
              key={track.token_id}
              tokenId={track.token_id}
              name={track.name}
              artist={track.artist}
              imageUrl={track.image_url}
              audioUrl={track.audio_url}
              genre={track.genre}
              price={track.price}
              onPlay={onPlay ? () => onPlay(track, allTracks) : undefined}
              isPlaying={isPlaying && currentTrackId === track.token_id}
              is_owned={resolveIsOwned(variant, track, cardProps)}
              playCount={cardProps.playCount}
              isAlbum={variant === 'album' ? true : variant === 'collected' ? cardProps.isAlbum : false}
              trackCount={variant === 'single' ? undefined : cardProps.trackCount}
              albumTracks={variant === 'single' ? undefined : cardProps.albumTracks}
              onPlayTrack={variant !== 'single' && onPlay ? (subTrack) => onPlay(subTrack, allTracks) : undefined}
            />
          )
        })}
      </div>
    </div>
  )
}
