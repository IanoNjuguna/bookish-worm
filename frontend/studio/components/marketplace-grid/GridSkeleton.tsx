import { SKELETON_COUNT, gridClassName } from './MarketplaceGrid.constants'

interface GridSkeletonProps {
  isSidebarOpen: boolean
}

export function GridSkeleton({ isSidebarOpen }: GridSkeletonProps) {
  return (
    <div className={gridClassName(isSidebarOpen)}>
      {[...Array(SKELETON_COUNT)].map((_, i) => (
        <div key={i} className="aspect-[3/4] glass-surface animate-pulse" />
      ))}
    </div>
  )
}
