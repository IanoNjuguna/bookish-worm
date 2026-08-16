'use client'

import React, { useState, useEffect } from 'react'
import MarketplaceGrid from '@/components/MarketplaceGrid'
import { useTranslations } from 'next-intl'
import { useAudio } from '@/components/AudioProvider'
import { IconSearch as Search } from '@tabler/icons-react'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const GENRES = ["All", "Afrobeat", "AfroHouse", "Alternative", "Ambient", "Blues", "Classical", "Country", "Dancehall", "Disco", "EDM", "Electronic", "Folk", "Funk", "Hip Hop", "House", "Indie", "Jazz", "Latin", "Lo-Fi", "Pop", "R&B", "Rap", "Reggae", "Rock", "Soul", "Techno", "Trap"]

export default function SearchDashboard() {
  const tSearch = useTranslations('search')
  const { playerState, handlePlayTrack, isSidebarOpen } = useAudio()
  
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedGenre, setSelectedGenre] = useState('All')
  const [debouncedSearch, setDebouncedSearch] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery)
    }, 500)
    return () => clearTimeout(timer)
  }, [searchQuery])

  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      <div className="space-y-4">
        <h2 className="text-3xl font-bold text-midnight dark:text-white">{tSearch('title')}</h2>
        <div className="flex flex-col md:flex-row gap-3">
          <div id="search-input-container" className="relative group flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-midnight/60 dark:text-white/50 group-focus-within:text-pink-600 dark:group-focus-within:text-cyber-pink transition-colors" size={20} />
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="I want to listen to ..."
              className="w-full bg-midnight/5 dark:bg-white/5 border-midnight/10 dark:border-white/10 rounded-xl pl-12 pr-4 h-11 md:h-12 text-midnight dark:text-white focus-visible:ring-lavender focus-visible:ring-offset-0"
            />
          </div>
          <Select value={selectedGenre} onValueChange={setSelectedGenre}>
            <SelectTrigger className="w-full md:w-[180px] bg-midnight/5 dark:bg-white/5 border-midnight/10 dark:border-white/10 rounded-xl h-11 md:h-12 text-sm font-medium text-midnight dark:text-white hover:bg-midnight/10 dark:hover:bg-white/10 data-[state=open]:border-lavender">
              <SelectValue placeholder="Genre" />
            </SelectTrigger>
            <SelectContent className="bg-popover text-popover-foreground border border-midnight/10 dark:border-white/10 rounded-xl">
              {GENRES.map((g) => (
                <SelectItem 
                  key={g} 
                  value={g} 
                  className={cn(
                    "text-sm cursor-pointer transition-colors",
                    selectedGenre === g 
                      ? "text-pink-600 dark:text-cyber-pink font-semibold" 
                      : "text-midnight/80 dark:text-white/70"
                  )}
                >
                  {g}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div id="search-marketplace-grid">
        <MarketplaceGrid
          isSidebarOpen={isSidebarOpen}
          searchQuery={debouncedSearch}
          genre={selectedGenre}
          currentTrackId={playerState.currentTrack?.id}
          isPlaying={playerState.isPlaying}
          onPlay={(track, tracks) => handlePlayTrack({
            ...track,
            id: track.token_id,
            title: track.name,
            creator: track.artist,
            cover: track.image_url,
            url: track.streaming_url || track.audio_url.replace('ipfs://', 'https://gateway.pinata.cloud/ipfs/'),
            collaborators: 0,
            genre: track.genre,
            description: track.description
          }, tracks.map(t => ({
            ...t,
            id: t.token_id,
            title: t.name,
            creator: t.artist,
            cover: t.image_url,
            url: t.streaming_url || t.audio_url.replace('ipfs://', 'https://gateway.pinata.cloud/ipfs/'),
            collaborators: 0,
            genre: t.genre,
            description: t.description
          })))}
        />
      </div>
    </div>
  )
}
