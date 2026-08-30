'use client'

interface LoadMoreButtonProps {
  hasMore: boolean
  loadingMore: boolean
  onLoadMore: () => void
}

export function LoadMoreButton({ hasMore, loadingMore, onLoadMore }: LoadMoreButtonProps) {
  return (
    <>
      {hasMore && (
        <div className="flex justify-center pt-8">
          <button
            type="button"
            onClick={onLoadMore}
            disabled={loadingMore}
            className="px-8 py-3 bg-midnight/5 dark:bg-white/5 border border-midnight/10 dark:border-white/10 text-midnight/60 dark:text-white/60 hover:text-midnight dark:hover:text-white hover:bg-midnight/5 dark:hover:bg-white/5 transition-all font-bold uppercase tracking-widest text-xs disabled:opacity-50"
          >
            {loadingMore ? 'Loading...' : 'Load More'}
          </button>
        </div>
      )}
    </>
  )
}
