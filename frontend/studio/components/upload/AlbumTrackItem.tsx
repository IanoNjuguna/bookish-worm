'use client'

import { IconTrash } from '@tabler/icons-react'
import type { AlbumTrack } from './UploadView.types'

const formatDuration = (duration: string) =>
  duration ? duration.replace('PT', '').replace('M', ':').replace('S', '') : '--:--'

interface AlbumTrackItemProps {
  index: number
  track: AlbumTrack
  canRemove: boolean
  updateTrack: (index: number, field: keyof Omit<AlbumTrack, 'id'>, value: unknown) => void
  onFileChange: (index: number, e: React.ChangeEvent<HTMLInputElement>) => void
  onRemove: (index: number) => void
}

export default function AlbumTrackItem({
  index,
  track,
  canRemove,
  updateTrack,
  onFileChange,
  onRemove,
}: AlbumTrackItemProps) {
  return (
    <div className="p-4 bg-midnight/5 dark:bg-white/5 border border-midnight/10 dark:border-white/10 rounded-xl flex flex-col md:flex-row gap-4 items-center justify-between">
      <div className="flex-1 space-y-2 w-full">
        <label className="text-xs font-semibold text-midnight/60 dark:text-white/90">Track {index + 1} Title</label>
        <input
          type="text"
          placeholder="Track Title"
          value={track.title}
          onChange={(e) => updateTrack(index, 'title', e.target.value)}
          className="w-full bg-midnight/5 dark:bg-white/5 border border-midnight/10 dark:border-white/10 rounded-xl px-3 py-2 text-sm text-midnight dark:text-white focus:outline-none focus:border-cyber-pink"
          required
        />
      </div>
      <div className="flex-1 space-y-2 w-full">
        <label className="text-xs font-semibold text-midnight/60 dark:text-white/90">Audio File</label>
        <div className="flex items-center gap-2">
          <label className="cursor-pointer bg-midnight/10 dark:bg-white/10 hover:bg-white/20 text-midnight dark:text-white px-3 py-2 rounded-xl text-xs font-medium transition-colors">
            {track.file ? 'Change' : 'Choose File'}
            <input type="file" accept="audio/*" onChange={(e) => onFileChange(index, e)} className="hidden" />
          </label>
          <span className="text-xs text-midnight/60 dark:text-white/90 truncate max-w-[150px]">
            {track.file ? track.file.name : 'No file selected'}
          </span>
        </div>
      </div>
      <div className="text-xs text-midnight/70 dark:text-white/70 min-w-[60px] text-right font-mono">
        {formatDuration(track.duration)}
      </div>
      <button
        type="button"
        onClick={() => onRemove(index)}
        className="text-red-400 hover:text-red-300 p-2"
        disabled={!canRemove}
      >
        <IconTrash size={16} />
      </button>
    </div>
  )
}
