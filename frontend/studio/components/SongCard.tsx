'use client'

import { cn } from '@/lib/utils'
import { AlbumTracklist } from './AlbumTracklist'
import { useSongCard } from './song-card/useSongCard'
import { CardArtwork } from './song-card/CardArtwork'
import { CardMetadata } from './song-card/CardMetadata'
import type { SongCardProps } from './song-card/SongCard.types'

export default function SongCard(props: SongCardProps) {
  const {
    name, artist, imageUrl, price, onPlay, onPlayTrack, playCount,
    isPlaying = false, isAlbum = false, trackCount = 0, albumTracks = [],
  } = props
  const card = useSongCard(props)

  return (
    <div className="flex flex-col">
      <div
        ref={card.cardRef}
        onClick={card.handleClick}
        onMouseEnter={card.handleMouseEnter}
        onMouseLeave={card.handleMouseLeave}
        {...card.longPressBind}
        className={cn(
          "group relative flex flex-col p-3 rounded-2xl cursor-pointer select-none glass-surface transition-all duration-300",
          "hover:bg-midnight/[0.03] dark:hover:bg-white/[0.03] hover:border-midnight/15 dark:hover:border-white/15",
          card.isLongPressed && "scale-[0.97] duration-150",
          isAlbum && card.isExpanded && "border-b-0 rounded-b-none"
        )}
      >
        {/* Top Section - Artwork Container */}
        <CardArtwork
          name={name}
          imageUrl={imageUrl}
          isAlbum={isAlbum}
          isPlaying={isPlaying}
          playCount={playCount}
          onPlay={onPlay}
          mintData={card.mintData}
          hasOwned={card.hasOwned}
          isMinting={card.isMinting}
          onMint={card.handleMint}
        />

        {/* Bottom Section - Metadata */}
        <CardMetadata
          name={name}
          artist={artist}
          price={price}
          isAlbum={isAlbum}
          trackCount={trackCount}
          albumTracks={albumTracks}
          isExpanded={card.isExpanded}
          isHovered={card.isHovered}
          isPlaying={isPlaying}
          isLongPressed={card.isLongPressed}
          titleScrollAmount={card.titleScrollAmount}
          artistScrollAmount={card.artistScrollAmount}
          titleContainerRef={card.titleContainerRef}
          titleTextRef={card.titleTextRef}
          artistContainerRef={card.artistContainerRef}
          artistTextRef={card.artistTextRef}
        />
      </div>

      <AlbumTracklist
        albumTracks={albumTracks}
        isExpanded={card.isExpanded}
        currentPlayingId={card.currentPlayingId}
        isPlaying={card.isPlayerPlaying}
        onPlayTrack={onPlayTrack}
      />
    </div>
  )
}
