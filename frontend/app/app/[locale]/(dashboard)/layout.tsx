import React from 'react'
import DashboardLayoutClient from '@/components/DashboardLayoutClient'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardLayoutClient>
      {children}
    </DashboardLayoutClient>
  )
}
