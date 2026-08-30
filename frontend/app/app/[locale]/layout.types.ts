import type React from 'react'

export interface LocaleLayoutProps {
	children: React.ReactNode
	params: Promise<{ locale: string }>
}
