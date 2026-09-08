export function LibraryLoadingState() {
  return (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-14 glass animate-pulse rounded-xl" />
      ))}
    </div>
  )
}
