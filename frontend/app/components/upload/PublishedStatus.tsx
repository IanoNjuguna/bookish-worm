interface PublishedStatusProps {
  publishedSongId: number | null
}

export default function PublishedStatus({ publishedSongId }: PublishedStatusProps) {
  if (publishedSongId === null) return null

  return (
    <div className="glass-surface p-5 space-y-3">
      <div className="flex items-center justify-between text-xs">
        <span className="text-midnight/70 dark:text-white/70 uppercase tracking-wider font-bold">Catalog Status</span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm text-midnight/80 dark:text-white">Song ID: {publishedSongId.toString()}</span>
        <span className="text-[10px] bg-emerald-500/20 text-emerald-500 px-2 py-0.5 rounded-xl font-bold">PUBLISHED</span>
      </div>
    </div>
  )
}
