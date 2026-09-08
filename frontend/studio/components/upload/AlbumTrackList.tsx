'use client'

import { IconPlus } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import AlbumTrackItem from './AlbumTrackItem'
import type { AlbumTrack } from './UploadView.types'

interface AlbumTrackListProps {
  tracks: AlbumTrack[]
  addTrack: () => void
  removeTrack: (index: number) => void
  updateTrack: (index: number, field: keyof Omit<AlbumTrack, 'id'>, value: unknown) => void
  onFileChange: (index: number, e: React.ChangeEvent<HTMLInputElement>) => void
}

export default function AlbumTrackList({
  tracks,
  addTrack,
  removeTrack,
  updateTrack,
  onFileChange,
}: AlbumTrackListProps) {
  return (
    <div className="space-y-4 col-span-1 md:col-span-2">
      <label className="text-sm font-medium text-midnight/80 dark:text-white">Album Tracks</label>
      <div className="space-y-4">
        {tracks.map((track, idx) => (
          <AlbumTrackItem
            key={track.id}
            index={idx}
            track={track}
            canRemove={tracks.length > 1}
            updateTrack={updateTrack}
            onFileChange={onFileChange}
            onRemove={removeTrack}
          />
        ))}
        <Button
          type="button"
          variant="outline"
          onClick={addTrack}
          className="w-full h-auto py-3 border-dashed border-midnight/20 dark:border-white/20 bg-midnight/5 dark:bg-white/5 hover:bg-midnight/10 dark:hover:bg-white/10 text-midnight dark:text-white rounded-xl"
        >
          <IconPlus size={16} /> Add Track
        </Button>
      </div>
    </div>
  )
}
