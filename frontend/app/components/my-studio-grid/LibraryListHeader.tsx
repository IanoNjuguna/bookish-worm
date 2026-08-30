import { IconEye } from '@tabler/icons-react'

export function LibraryListHeader() {
  return (
    <div className="hidden md:grid md:grid-cols-[48px_1fr_120px_100px_160px_60px] gap-4 px-4 py-2 border-b border-white/5 text-xs font-medium text-midnight/70 dark:text-white/40 uppercase tracking-widest mb-2">
      <div className="flex justify-center">#</div>
      <div>Title</div>
      <div className="hidden md:block">Genre</div>
      <div className="hidden md:block">Streams</div>
      <div className="hidden lg:block">Date Added</div>
      <div className="flex justify-center">
        <IconEye size={14} className="opacity-40" />
      </div>
    </div>
  )
}
