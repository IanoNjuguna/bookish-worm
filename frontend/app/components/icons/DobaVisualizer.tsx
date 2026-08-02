import React from 'react'

export function DobaVisualizer({ size = 24, className = "" }: { size?: number, className?: string }) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 100 100"
			width={size}
			height={size}
			className={className}
			fill="currentColor"
		>
			{/* 6-bar rhythmic visualizer based on the provided image */}
			<rect x="10" y="25" width="10" height="50" rx="5" />
			<rect x="25" y="35" width="10" height="45" rx="5" />
			<rect x="40" y="20" width="10" height="55" rx="5" />
			<rect x="55" y="30" width="10" height="50" rx="5" />
			<rect x="70" y="22" width="10" height="60" rx="5" />
			<rect x="85" y="35" width="10" height="45" rx="5" />
		</svg>
	)
}
