import React from 'react'
import { IconMusic } from '@tabler/icons-react'

export function UploadsEmptyState() {
	return (
		<div className="glass p-12 text-center rounded-2xl bg-midnight/[0.02] dark:bg-white/[0.02] border border-midnight/[0.08] dark:border-white/[0.08] shadow-xl">
			<IconMusic className="w-12 h-12 mx-auto mb-4 text-midnight/50 dark:text-white/20" />
			<h3 className="text-xl font-semibold mb-2">No Uploads Yet</h3>
			<p className="text-midnight/70 dark:text-white/40 italic text-sm">You haven't published any songs on Doba. Head to the Upload tab to mint your first track!</p>
		</div>
	)
}
