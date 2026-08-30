import React from 'react'
import { IconSearch as Search } from '@tabler/icons-react'
import { Input } from '@/components/ui/input'
import type { SearchInputProps } from './Search.types'

export function SearchInput({ value, onChange }: SearchInputProps) {
  return (
    <div id="search-input-container" className="relative group flex-1">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-midnight/60 dark:text-white/50 group-focus-within:text-pink-600 dark:group-focus-within:text-cyber-pink transition-colors" size={20} />
      <Input
        type="text"
        value={value}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
        placeholder="I want to listen to ..."
        className="w-full bg-midnight/5 dark:bg-white/5 border-midnight/10 dark:border-white/10 rounded-xl pl-12 pr-4 h-11 md:h-12 text-midnight dark:text-white focus-visible:ring-lavender focus-visible:ring-offset-0"
      />
    </div>
  )
}
