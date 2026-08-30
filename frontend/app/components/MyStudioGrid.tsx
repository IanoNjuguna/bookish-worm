'use client'

import type { MyStudioGridProps } from './my-studio-grid/MyStudioGrid.types'
import { useMyStudioGrid } from './my-studio-grid/useMyStudioGrid'
import { LibraryLoadingState } from './my-studio-grid/LibraryLoadingState'
import { LibraryEmptyState } from './my-studio-grid/LibraryEmptyState'
import { LibraryListHeader } from './my-studio-grid/LibraryListHeader'
import { LibraryTrackRow } from './my-studio-grid/LibraryTrackRow'

export default function MyStudioGrid({ address, onPlay, currentTrackId, isPlaying }: MyStudioGridProps) {
  const {
    ownedTracks,
    loading,
    hoveredTrackId,
    setHoveredTrackId,
    handleOpenSidebar,
    playTrack,
  } = useMyStudioGrid(address, onPlay)

  if (loading) {
    return <LibraryLoadingState />
  }

  if (!ownedTracks.length) {
    return <LibraryEmptyState />
  }

  return (
    <div className="flex flex-col">
      {/* List Header */}
      <LibraryListHeader />

      {/* List Rows */}
      <div id="library-songs-grid" className="flex flex-col">
        {ownedTracks.map((track, index) => {
          const isCurrent = Boolean(isPlaying) && currentTrackId === track.token_id
          return (
            <LibraryTrackRow
              key={track.token_id}
              track={track}
              index={index}
              showPlayButton={hoveredTrackId === track.token_id || isCurrent}
              isCurrent={isCurrent}
              onMouseEnter={() => setHoveredTrackId(track.token_id)}
              onMouseLeave={() => setHoveredTrackId(null)}
              onPlay={() => playTrack(track)}
              onOpenSidebar={() => handleOpenSidebar(track)}
            />
          )
        })}
      </div>
    </div>
  )
}
