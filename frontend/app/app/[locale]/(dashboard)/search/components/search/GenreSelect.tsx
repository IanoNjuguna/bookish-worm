import { cn } from '@/lib/utils'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { GENRES } from './Search.constants'
import type { GenreSelectProps } from './Search.types'

export function GenreSelect({ selectedGenre, onGenreChange }: GenreSelectProps) {
  return (
    <Select value={selectedGenre} onValueChange={onGenreChange}>
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
  )
}
