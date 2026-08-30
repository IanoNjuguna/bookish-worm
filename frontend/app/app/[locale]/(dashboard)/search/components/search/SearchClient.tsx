'use client'

import { useTranslations } from 'next-intl'
import MarketplaceGrid from '@/components/MarketplaceGrid'
import { useSearch } from './useSearch'
import { SearchInput } from './SearchInput'
import { GenreSelect } from './GenreSelect'

export function SearchClient() {
  const tSearch = useTranslations('search')
  const search = useSearch()

  if (!search.mounted) return null

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      <div className="space-y-4">
        <h2 className="text-3xl font-bold text-midnight dark:text-white">{tSearch('title')}</h2>
        <div className="flex flex-col md:flex-row gap-3">
          <SearchInput value={search.searchQuery} onChange={search.setSearchQuery} />
          <GenreSelect selectedGenre={search.selectedGenre} onGenreChange={search.setSelectedGenre} />
        </div>
      </div>
      <div id="search-marketplace-grid">
        <MarketplaceGrid
          isSidebarOpen={search.isSidebarOpen}
          searchQuery={search.debouncedSearch}
          genre={search.selectedGenre}
          currentTrackId={search.currentTrackId}
          isPlaying={search.isPlaying}
          onPlay={search.handleGridPlay}
        />
      </div>
    </div>
  )
}
