'use client'

import { useTranslations } from 'next-intl'
import { IconCheck, IconChevronDown } from '@tabler/icons-react'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { GENRES } from '@/constants/genres'

interface GenreSelectProps {
  genre: string
  setGenre: (value: string) => void
  open: boolean
  setOpen: (value: boolean) => void
}

export default function GenreSelect({ genre, setGenre, open, setOpen }: GenreSelectProps) {
  const t = useTranslations('upload')

  return (
    <div className="relative">
      <Command className="bg-transparent text-midnight dark:text-white rounded-xl overflow-visible">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <div
              className={cn(
                'relative flex items-center w-full bg-midnight/5 dark:bg-white/5 border border-midnight/10 dark:border-white/10 rounded-xl px-1 text-midnight dark:text-white transition-all cursor-text',
                open ? 'border-cyber-pink' : 'hover:bg-midnight/10 dark:hover:bg-white/10'
              )}
              onClick={() => setOpen(true)}
            >
              <CommandInput
                placeholder={genre || t('genrePlaceholder')}
                value={open ? undefined : genre}
                onValueChange={() => {
                  if (!open) setOpen(true)
                }}
                className="h-11 text-base border-0 focus:ring-0 rounded-xl placeholder:text-midnight/60 dark:placeholder:text-white/40"
                wrapperClassName="border-0 w-full"
              />
              <IconChevronDown className="absolute right-4 h-4 w-4 shrink-0 opacity-50 pointer-events-none" />
            </div>
          </PopoverTrigger>
          <PopoverContent
            className="w-[--radix-popover-trigger-width] p-0 glass-surface border-t-0 rounded-xl"
            onOpenAutoFocus={(e) => e.preventDefault()}
          >
            <CommandList>
              <CommandEmpty>{t('noGenre')}</CommandEmpty>
              <CommandGroup>
                {GENRES.map((g) => (
                  <CommandItem
                    key={g}
                    value={g}
                    onSelect={(currentValue) => {
                      setGenre(currentValue === genre ? '' : currentValue)
                      setOpen(false)
                    }}
                    className={cn(
                      'text-midnight dark:text-white data-[selected=true]:text-midnight dark:data-[selected=true]:text-white cursor-pointer transition-all !bg-transparent',
                      genre === g ? 'font-bold' : 'font-normal data-[selected=true]:font-semibold'
                    )}
                  >
                    <IconCheck
                      className={cn(
                        'mr-2 h-4 w-4',
                        genre === g ? 'opacity-100 text-pink-600 dark:text-cyber-pink' : 'opacity-0'
                      )}
                    />
                    {g}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </PopoverContent>
        </Popover>
      </Command>
    </div>
  )
}
