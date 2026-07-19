'use client'

import { useState, useEffect } from 'react'
import {
	LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
	BarChart, Bar, Cell
} from 'recharts'
import { IconMusic, IconUsers, IconTrendingUp, IconHeadphones } from '@tabler/icons-react'
import { useAudio } from '@/components/AudioProvider'
import { useTheme } from 'next-themes'
import { cn } from '@/lib/utils'

interface AnalyticsData {
	totalPlays: number
	uniqueListeners: number
	totalCollectors: number
	playsOverTime: { date: string; count: number }[]
	topTracks: { tokenId: number; name: string; plays: number }[]
}

export default function AnalyticsView() {
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
				setError("Not authenticated")
				return
			}

			const res = await fetch('/api-backend/analytics', {
				headers: {
					'Authorization': `Bearer ${token}`
				}
			})

			if (!res.ok) {
				const errorData = await res.json().catch(() => ({}))
				throw new Error(errorData.message || errorData.error || 'Failed to fetch analytics')
			}
			const result = await res.json()
			setData(result)
		} catch (err: any) {
			setError(err.message)
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		if (isAuthenticated) {
			fetchAnalytics()
		}
	}, [isAuthenticated])

	if (loading) {
		return (
			<div className="flex flex-col items-center justify-center p-12 md:p-24 space-y-4">
				<div className="w-8 h-8 border-2 border-[#FF1F8A] border-t-transparent rounded-full animate-spin" />
				<p className="text-midnight/60 dark:text-white/50 italic text-sm">Aggregating artist data...</p>
			</div>
		)
	}

	if (error || !data) {
		return (
			<div className="p-12 text-center rounded-none bg-midnight/[0.02] dark:bg-white/[0.02] border border-midnight/[0.08] dark:border-white/[0.08]">
				<IconTrendingUp className="w-12 h-12 mx-auto mb-4 text-midnight/50 dark:text-white/20" />
				<h3 className="text-xl font-semibold mb-2">Analytics unavailable</h3>
				<p className="text-midnight/70 dark:text-white/60 mb-6">{error || "Connect your wallet to see your artist performance."}</p>
			</div>
		)
	}

	return (
		<div className="space-y-8 animate-fade-in">
			{/* Metrics Row */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
				<MetricCard
					label="Total Plays"
					value={data.totalPlays.toLocaleString()}
					icon={<IconHeadphones className="text-cyber-pink" size={24} />}
					subtext="> 1 minute streams"
				/>
				<MetricCard
					label="Unique Listeners"
					value={data.uniqueListeners.toLocaleString()}
					icon={<IconUsers className="text-[#B794F4]" size={24} />}
					subtext="Audience reach"
				/>
				<MetricCard
					label="Total Collectors"
					value={data.totalCollectors.toLocaleString()}
					icon={<IconMusic className="text-blue-400" size={24} />}
					subtext="Owners of your work"
				/>
				<MetricCard
					label="Growth"
					value={`${data.totalPlays > 0 ? '+100%' : '0%'}`}
					icon={<IconTrendingUp className="text-green-400" size={24} />}
					subtext="Last 30 days"
				/>
			</div>

			{/* Charts Row */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
				{/* Plays Over Time */}
				<div className="bg-midnight/[0.02] dark:bg-white/[0.02] border border-midnight/[0.08] dark:border-white/[0.08] p-6 rounded-none relative overflow-hidden group">
					<div className="absolute top-0 right-0 w-16 h-16 bg-[#FF1F8A]/5 -mr-8 -mt-8 rotate-45 pointer-events-none" />
					<h3 className="text-lg font-bold mb-6 flex items-center gap-2 uppercase tracking-tighter">
						<IconTrendingUp size={20} className="text-[#FF1F8A]" />
						Streaming Activity
					</h3>
					<div className="h-[250px] sm:h-[300px] w-full">
						<ResponsiveContainer width="100%" height="100%">
							<LineChart data={data.playsOverTime} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
								<CartesianGrid strokeDasharray="3 3" stroke={mounted && resolvedTheme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(13,13,18,0.08)'} vertical={false} />
								<XAxis
									dataKey="date"
									stroke={mounted && resolvedTheme === 'dark' ? 'rgba(255,255,255,0.3)' : 'rgba(13,13,18,0.4)'}
									fontSize={9}
									tickFormatter={(val) => new Date(val).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
									tick={{ dy: 5 }}
								/>
								<YAxis stroke={mounted && resolvedTheme === 'dark' ? 'rgba(255,255,255,0.3)' : 'rgba(13,13,18,0.4)'} fontSize={9} />
								<Tooltip
									contentStyle={{ backgroundColor: '#1A1A22', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0' }}
									itemStyle={{ color: '#FF1F8A', fontSize: '12px' }}
									labelStyle={{ color: 'rgba(255,255,255,0.5)', fontSize: '10px', marginBottom: '4px' }}
								/>
								<Line
									type="linear"
									dataKey="count"
									stroke="#FF1F8A"
									strokeWidth={2}
									dot={{ fill: '#FF1F8A', r: 3, strokeWidth: 0 }}
									activeDot={{ r: 5, stroke: '#fff', strokeWidth: 2 }}
								/>
							</LineChart>
						</ResponsiveContainer>
					</div>
				</div>

				{/* Top Tracks */}
				<div className="bg-midnight/[0.02] dark:bg-white/[0.02] border border-midnight/[0.08] dark:border-white/[0.08] p-6 rounded-none text-midnight dark:text-white relative overflow-hidden group">
					<div className="absolute top-0 right-0 w-16 h-16 bg-[#B794F4]/5 -mr-8 -mt-8 rotate-45 pointer-events-none" />
					<h3 className="text-lg font-bold mb-6 flex items-center gap-2 uppercase tracking-tighter">
						<IconMusic size={20} className="text-[#B794F4]" />
						Top Performing Tracks
					</h3>
					<div className="space-y-4">
						{data.topTracks.length > 0 ? (
							data.topTracks.map((track, idx) => (
								<div key={track.tokenId} className="flex items-center justify-between p-2 sm:p-3 rounded-none hover:bg-midnight/5 dark:hover:bg-white/5 transition-colors group">
									<div className="flex items-center gap-3 sm:gap-4 min-w-0">
										<span className="text-midnight/70 dark:text-white/30 font-bold italic w-4 flex-shrink-0 text-xs sm:text-sm">{idx + 1}</span>
										<div className="min-w-0">
											<p className="font-semibold text-xs sm:text-sm group-hover:text-cyber-pink transition-colors truncate">{track.name}</p>
											<p className="text-[9px] sm:text-[10px] text-midnight/60 dark:text-white/50 uppercase tracking-widest truncate">ID #{track.tokenId}</p>
										</div>
									</div>
									<div className="text-right flex-shrink-0 ml-4">
										<p className="font-bold text-[#B794F4] text-xs sm:text-sm font-mono whitespace-nowrap">{track.plays} plays</p>
										<div className="h-1 bg-midnight/10 dark:bg-white/10 w-12 sm:w-20 rounded-none mt-1 overflow-hidden">
											<div
												className="h-full bg-cyber-pink"
												style={{ width: `${(track.plays / (data.topTracks[0]?.plays || 1)) * 100}%` }}
											/>
										</div>
									</div>
								</div>
							))
						) : (
							<div className="p-12 text-center text-midnight/60 dark:text-white/50 italic text-sm">
								No streaming data yet.
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}

function MetricCard({ label, value, icon, subtext }: { label: string; value: string; icon: React.ReactNode; subtext: string }) {
	return (
		<div className="bg-midnight/[0.02] dark:bg-white/[0.02] border border-midnight/[0.08] dark:border-white/[0.08] p-6 rounded-none hover:border-[#B794F4]/50 transition-all group relative overflow-hidden">
			{/* Geometric Accent */}
			<div className="absolute top-0 left-0 w-1 h-full bg-[#B794F4]/0 group-hover:bg-[#B794F4]/50 transition-all" />
			<div className="absolute top-0 right-0 w-8 h-8 bg-midnight/5 dark:bg-white/5 -mr-4 -mt-4 rotate-45 transition-transform group-hover:scale-110" />

			<div className="flex items-center justify-between mb-4">
				<span className="text-midnight/70 dark:text-white/60 text-[10px] font-black uppercase tracking-[0.2em]">{label}</span>
				<div className="p-2 bg-midnight/5 dark:bg-white/5 group-hover:bg-midnight/5 dark:hover:bg-white/5 transition-colors border border-white/5">
					{icon}
				</div>
			</div>
			<p className="text-3xl sm:text-4xl font-black mb-1 tracking-tighter text-midnight dark:text-white font-mono">{value}</p>
			<p className="text-[9px] sm:text-[10px] text-midnight/50 dark:text-white/40 uppercase tracking-widest">{subtext}</p>
		</div>
	)
}
