'use client'

import { useTranslations } from 'next-intl'
import CollectNudge from './CollectNudge'
import { useMarketplaceGrid } from './marketplace-grid/useMarketplaceGrid'
import { GridSkeleton } from './marketplace-grid/GridSkeleton'
import { GridEmptyState } from './marketplace-grid/GridEmptyState'
import { GridSection } from './marketplace-grid/GridSection'
import { LoadMoreButton } from './marketplace-grid/LoadMoreButton'
import type { MarketplaceGridProps } from './marketplace-grid/MarketplaceGrid.types'

export default function MarketplaceGrid({
  onPlay, currentTrackId, isPlaying, searchQuery = '', genre = '', limit = 24,
  isSidebarOpen = false, splitPlaylist = false
}: MarketplaceGridProps) {
  const tHome = useTranslations('home')
  const tLibrary = useTranslations('library')
  const grid = useMarketplaceGrid({ searchQuery, genre, limit, splitPlaylist })

  if (grid.loading) return <GridSkeleton isSidebarOpen={isSidebarOpen} />
  if (!grid.tracks.length) return <GridEmptyState />

  const sectionProps = { onPlay, currentTrackId, isPlaying, isSidebarOpen, allTracks: grid.tracks, getSongCardProps: grid.getSongCardProps }

  return (
    <div className="space-y-8">
      <CollectNudge />
      {splitPlaylist && grid.collectedTracks.length > 0 ? (
        <>
          {/* My Playlist Section */}
          <GridSection title={tLibrary('title')} variant="collected" tracks={grid.collectedTracks} {...sectionProps} />

          {/* Discover Music Section */}
          {grid.discoverSingles.length > 0 && (
            <GridSection title={tHome('discoverMusic')} variant="single" tracks={grid.discoverSingles} withTopBorder {...sectionProps} />
          )}

          {/* Top Albums Section */}
          {grid.discoverAlbums.length > 0 && (
            <GridSection title="Top Albums" variant="album" tracks={grid.discoverAlbums} withTopBorder {...sectionProps} />
          )}
        </>
      ) : (
        <>
          {/* Discover Music Section */}
          {grid.discoverSingles.length > 0 && (
            <GridSection
              title={splitPlaylist ? tHome('discoverMusic') : undefined}
              titleClassName={splitPlaylist ? "text-2xl font-bold text-midnight dark:text-white mb-4" : undefined}
              variant="single"
              tracks={grid.discoverSingles}
              {...sectionProps}
            />
          )}

          {/* Top Albums Section */}
          {grid.discoverAlbums.length > 0 && (
            <GridSection title="Top Albums" variant="album" tracks={grid.discoverAlbums} withTopBorder {...sectionProps} />
          )}
        </>
      )}

      <LoadMoreButton hasMore={grid.hasMore} loadingMore={grid.loadingMore} onLoadMore={() => grid.fetchTracks(true)} />
    </div>
  )
}
