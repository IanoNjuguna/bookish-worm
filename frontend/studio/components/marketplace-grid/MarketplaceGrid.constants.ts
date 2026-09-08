import { cn } from '@/lib/utils'

export const API_URL = '/api-backend'
export const SKELETON_COUNT = 12

export function gridClassName(isSidebarOpen: boolean): string {
  return cn(
    "grid gap-6",
    isSidebarOpen
      ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
      : "grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
  )
}
