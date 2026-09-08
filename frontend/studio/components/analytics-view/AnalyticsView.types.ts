export interface PlaysOverTimePoint {
	date: string
	count: number
}

export interface TopTrack {
	tokenId: number
	name: string
	plays: number
}

export interface AnalyticsData {
	totalPlays: number
	uniqueListeners: number
	totalCollectors: number
	playsOverTime: PlaysOverTimePoint[]
	topTracks: TopTrack[]
}
