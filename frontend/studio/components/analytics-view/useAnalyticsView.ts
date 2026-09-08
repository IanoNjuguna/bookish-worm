'use client'

import { useState, useEffect } from 'react'
import { useAudio } from '@/components/audio'
import { useTheme } from 'next-themes'
import type { AnalyticsData } from './AnalyticsView.types'
import { AUTH_REQUIRED_MESSAGE } from './AnalyticsView.constants'

export interface UseAnalyticsViewResult {
	isDark: boolean
	data: AnalyticsData | null
	loading: boolean
	error: string | null
}

export function useAnalyticsView(): UseAnalyticsViewResult {
	const { getValidToken, isAuthenticated } = useAudio()
	const { resolvedTheme } = useTheme()
	const [mounted, setMounted] = useState(false)
	const [data, setData] = useState<AnalyticsData | null>(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		setMounted(true)
	}, [])

	const fetchAnalytics = async () => {
		try {
			setLoading(true)
			const token = await getValidToken()
			if (!token) {
				setError(AUTH_REQUIRED_MESSAGE)
				setLoading(false)
				return
			}

			const res = await fetch('/api-backend/analytics', {
				headers: {
					'Authorization': `Bearer ${token}`
				}
			})

			if (!res.ok) {
				const errorData = (await res.json().catch(() => ({}))) as { message?: string; error?: string }
				throw new Error(errorData.message || errorData.error || 'Failed to fetch analytics')
			}
			const result = await res.json()
			setData(result)
		} catch (err) {
			setError(err instanceof Error ? err.message : String(err))
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		if (isAuthenticated) {
			fetchAnalytics()
		} else {
			setLoading(false)
		}
	}, [isAuthenticated])

	return { isDark: mounted && resolvedTheme === 'dark', data, loading, error }
}
