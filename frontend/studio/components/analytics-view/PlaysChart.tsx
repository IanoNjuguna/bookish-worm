import {
	LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'
import { IconTrendingUp } from '@tabler/icons-react'
import type { PlaysOverTimePoint } from './AnalyticsView.types'

interface PlaysChartProps {
	playsOverTime: PlaysOverTimePoint[]
	isDark: boolean
}

export function PlaysChart({ playsOverTime, isDark }: PlaysChartProps) {
	return (
		<div className="bg-midnight/[0.02] dark:bg-white/[0.02] border border-midnight/[0.08] dark:border-white/[0.08] p-6 rounded-2xl shadow-xl relative overflow-hidden group">
			<div className="absolute top-0 right-0 w-16 h-16 bg-cyber-pink/5 -mr-8 -mt-8 rotate-45 pointer-events-none" />
			<h3 className="text-lg font-bold mb-6 flex items-center gap-2 uppercase tracking-tighter">
				<IconTrendingUp size={20} className="text-pink-600 dark:text-cyber-pink" />
				Streaming Activity
			</h3>
			<div className="h-[250px] sm:h-[300px] w-full">
				<ResponsiveContainer width="100%" height="100%">
					<LineChart data={playsOverTime} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
						<CartesianGrid strokeDasharray="3 3" stroke={isDark ? 'rgba(255,255,255,0.05)' : 'rgba(13,13,18,0.08)'} vertical={false} />
						<XAxis
							dataKey="date"
							stroke={isDark ? 'rgba(255,255,255,0.3)' : 'rgba(13,13,18,0.4)'}
							fontSize={9}
							tickFormatter={(val) => new Date(val).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
							tick={{ dy: 5 }}
						/>
						<YAxis stroke={isDark ? 'rgba(255,255,255,0.3)' : 'rgba(13,13,18,0.4)'} fontSize={9} />
						<Tooltip
							contentStyle={{ backgroundColor: '#1A1A22', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
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
	)
}
