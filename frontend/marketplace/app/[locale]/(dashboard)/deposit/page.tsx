'use client'

import React, { useState, useEffect } from 'react'
import DepositView from '@/components/DepositView'

export default function DepositDashboard() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  return (
    <div className="space-y-6 animate-fade-in">
      <DepositView />
    </div>
  )
}
