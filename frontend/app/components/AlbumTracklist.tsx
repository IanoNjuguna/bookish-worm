'use client'

import { Track } from '@/lib/types'
import { cn } from '@/lib/utils'
import { IconPlayerPause, IconPlayerPlay } from '@tabler/icons-react'
import React from 'react'

interface AlbumTracklistProps {
  albumTracks: Track[]
  isExpanded: boolean
  currentPlayingId?: number | null
  isPlaying?: boolean
  onPlayTrack?: (track: Track) => void
}

export function AlbumTracklist({
  albumTracks,
  isExpanded,
  currentPlayingId,
  isPlaying,
  onPlayTrack,
}: AlbumTracklistProps) {
  if (!albumTracks.length) return null

  return (
    <div
      className={cn(
        "overflow-hidden transition-all duration-300 ease-in-out",
        isExpanded ? "max-h-[300px] opacity-100" : "max-h-0 opacity-0"
      )}
    >
      <div className="glass-surface border-t-0 rounded-t-none rounded-b-lg px-3 pb-3 pt-1">
        <div className="overflow-y-auto max-h-[260px] space-y-0.5 custom-scrollbar">
          {albumTracks.map((track, index) => {
            const isTrackPlaying =
              isPlaying &&
              (currentPlayingId === track.token_id || currentPlayingId === track.id)

            return (
              <div
                key={track.token_id || track.id}
                onClick={(e) => {
                  e.stopPropagation()
                  onPlayTrack?.(track)
                }}
                className={cn(
                  "flex items-center justify-between py-2 px-2 rounded text-[11px] cursor-pointer transition-colors w-full min-w-0",
                  isTrackPlaying
                    ? "bg-purple-600/10 dark:bg-lavender/15 text-purple-600 dark:text-lavender font-semibold"
                    : "hover:bg-black/5 dark:hover:bg-white/5 text-black/70 dark:text-white/70"
                )}
              >
                <div className="flex items-center gap-2.5 min-w-0 mr-2">
                  <span className="font-mono text-black/35 dark:text-white/35 text-[9px] flex-shrink-0 w-4 text-right">
                    {index + 1}
                  </span>
                  <span className="truncate font-medium">{track.name}</span>
                </div>
                <div className="flex-shrink-0">
                  {isTrackPlaying ? (
                    <IconPlayerPause
                      size={12}
                      className="text-pink-600 dark:text-cyber-pink fill-pink-600 dark:fill-cyber-pink"
                    />
                  ) : (
                    <IconPlayerPlay size={12} className="text-black/25 dark:text-white/25" />
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
