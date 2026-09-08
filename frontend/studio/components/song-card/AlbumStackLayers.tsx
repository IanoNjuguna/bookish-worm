export function AlbumStackLayers() {
  return (
    <>
      {/* Third layer card (furthest back) */}
      <div className="absolute inset-0 transform translate-x-2 -translate-y-2 scale-[0.96] bg-black/[0.04] dark:bg-white/[0.04] border border-black/10 dark:border-white/10 rounded-xl transition-transform duration-300 group-hover:translate-x-2.5 group-hover:-translate-y-2.5 -z-10" />
      {/* Second layer card (middle) */}
      <div className="absolute inset-0 transform translate-x-1 -translate-y-1 scale-[0.98] bg-black/[0.08] dark:bg-white/[0.08] border border-black/10 dark:border-white/10 rounded-xl transition-transform duration-300 group-hover:translate-x-1.5 group-hover:-translate-y-2.5 -z-10" />
    </>
  )
}
