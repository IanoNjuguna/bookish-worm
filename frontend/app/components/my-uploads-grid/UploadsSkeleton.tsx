import React from 'react'

export function UploadsSkeleton() {
	return (
		<div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-6">
			{[...Array(6)].map((_, i) => (
				<div key={i} className="aspect-[3/4] glass animate-pulse rounded-xl" />
			))}
		</div>
	)
}
