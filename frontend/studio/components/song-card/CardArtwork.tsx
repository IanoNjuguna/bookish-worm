import { DEFAULT_IPFS_GATEWAY } from './SongCard.constants'
import type { CardArtworkProps } from './SongCard.types'
import { AlbumStackLayers } from './AlbumStackLayers'
import { ArtworkPlayButton } from './ArtworkPlayButton'
import { PlayCountBadge } from './PlayCountBadge'
import { MintDiamondOverlay } from './MintDiamondOverlay'

export function CardArtwork({
  name,
  imageUrl,
  isAlbum,
  isPlaying,
  playCount,
  onPlay,
  mintData,
  hasOwned,
  isMinting,
  onMint,
}: CardArtworkProps) {
  return (
    <div className="relative w-full aspect-square flex-shrink-0">
      {isAlbum && <AlbumStackLayers />}

      {/* Main Artwork Cover */}
      <div className="relative w-full h-full rounded-xl overflow-hidden z-0">
        <img
          src={(imageUrl || '').replace('ipfs://', process.env.NEXT_PUBLIC_IPFS_GATEWAY || DEFAULT_IPFS_GATEWAY)}
          alt={name}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Play Button - bottom right of artwork, appears on hover */}
        {onPlay && <ArtworkPlayButton onPlay={onPlay} isPlaying={isPlaying} />}

        {/* Plays data in top right corner */}
        {playCount !== undefined && playCount > 0 && (
          <PlayCountBadge playCount={playCount} isAlbum={isAlbum} />
        )}

        {/* Diamonds data in top left corner */}
        <MintDiamondOverlay
          mintData={mintData}
          hasOwned={hasOwned}
          isMinting={isMinting}
          onMint={onMint}
        />
      </div>
    </div>
  )
}
