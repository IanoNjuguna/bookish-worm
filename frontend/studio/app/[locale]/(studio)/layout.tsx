import type React from 'react'
import DashboardLayoutClient from '@/components/DashboardLayoutClient'

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return <DashboardLayoutClient>{children}</DashboardLayoutClient>
}
