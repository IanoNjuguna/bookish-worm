'use client'

import React, { useState, useEffect } from 'react'
import MarketplaceGrid from '@/components/MarketplaceGrid'
import { useTranslations } from 'next-intl'
import { useAudio } from '@/components/AudioProvider'
import { IconSearch as Search } from '@tabler/icons-react'
import { cn } from '@/lib/utils'
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
        <h2 className="text-2xl font-bold">{tSearch('title')}</h2>
        <div className="flex flex-col md:flex-row gap-2">
          <div className="relative group flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-midnight/50 dark:text-white/20 group-focus-within:text-cyber-pink transition-colors" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="I want to listen to ..."
              className="w-full bg-midnight/5 dark:bg-white/5 border border-midnight/10 dark:border-white/10 rounded-none pl-12 pr-4 py-[14px] text-midnight dark:text-white focus:outline-none focus:border-cyber-pink focus:ring-1 focus:ring-cyber-pink/50 transition-all placeholder:text-midnight/50 dark:text-white/20 text-lg"
            />
          </div>
          <Select value={selectedGenre} onValueChange={setSelectedGenre}>
            <SelectTrigger className="w-full md:w-[180px] bg-midnight/5 dark:bg-white/5 border border-midnight/10 dark:border-white/10 rounded-none h-auto py-4 font-bold uppercase tracking-widest text-[10px] text-midnight/60 dark:text-white/60 hover:bg-midnight/10 dark:hover:bg-white/10 data-[state=open]:border-cyber-pink focus:ring-0 focus:ring-offset-0 transition-all">
              <SelectValue placeholder="Genre" />
            </SelectTrigger>
            <SelectContent className="bg-[#FAF9F6] dark:bg-[#0D0D12] border-midnight/10 dark:border-white/10 rounded-none text-midnight/80 dark:text-white/80">
              {GENRES.map((g) => (
                <SelectItem 
                  key={g} 
                  value={g} 
                  className={cn(
                    "font-bold uppercase tracking-widest text-[10px] cursor-pointer !bg-transparent transition-all",
                    selectedGenre === g 
                      ? "text-cyber-pink focus:text-cyber-pink" 
                      : "text-midnight/60 dark:text-white/60 focus:text-midnight dark:focus:text-white focus:font-semibold"
                  )}
                >
                  {g}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
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
  )
}
