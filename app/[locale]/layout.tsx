import React from "react"
import type { Metadata, Viewport } from 'next'
import localFont from 'next/font/local'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'

import '../globals.css'
import { Providers } from "@/components/Providers"
import { AudioProvider } from "@/components/AudioProvider"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "@/components/ThemeProvider"
import { DynamicFavicon } from "@/components/DynamicFavicon"
import { Toaster } from "@/components/ui/sonner"

const chivo = localFont({
	src: [
		{ path: '../../public/fonts/Chivo-Regular.ttf', weight: '400', style: 'normal' },
		{ path: '../../public/fonts/Chivo-Medium.ttf', weight: '500', style: 'normal' },
		{ path: '../../public/fonts/Chivo-SemiBold.ttf', weight: '600', style: 'normal' },
		{ path: '../../public/fonts/Chivo-Bold.ttf', weight: '700', style: 'normal' },
	],
	variable: '--font-chivo',
	display: 'swap',
})

const ibmPlexMono = localFont({
	src: [
		{ path: '../../public/fonts/IBMPlexMono-Regular.ttf', weight: '400', style: 'normal' },
		{ path: '../../public/fonts/IBMPlexMono-Medium.ttf', weight: '500', style: 'normal' },
		{ path: '../../public/fonts/IBMPlexMono-SemiBold.ttf', weight: '600', style: 'normal' },
	],
	variable: '--font-ibm-plex-mono',
	display: 'swap',
})

const spaceMono = localFont({
	src: [
		{ path: '../../public/fonts/SpaceMono-Regular.ttf', weight: '400', style: 'normal' },
		{ path: '../../public/fonts/SpaceMono-Bold.ttf', weight: '700', style: 'normal' },
	],
	variable: '--font-space-mono',
	display: 'swap',
})

const notoSansKr = localFont({
	src: [
		{ path: '../../public/fonts/NotoSansKR-Regular.ttf', weight: '400', style: 'normal' },
		{ path: '../../public/fonts/NotoSansKR-Medium.ttf', weight: '500', style: 'normal' },
		{ path: '../../public/fonts/NotoSansKR-Bold.ttf', weight: '700', style: 'normal' },
	],
	variable: '--font-noto-sans-kr',
	display: 'swap',
	preload: false,
})

export const metadata: Metadata = {
	metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
	title: 'Doba | Release and collect music records as digital assets',
	description: 'Doba is a distribution service for artists to release music and manage their careers.',
	icons: {
		icon: '/doba.ico', // Favicon: public/doba.ico
		apple: '/doba.png', // For iOS home screens
	},
	openGraph: {
		images: [
			{
				url: '/doba-banner.png',
				width: 1200,
				height: 630,
				alt: 'Preview',
			},
		],
	},
	twitter: {
		card: 'summary_large_image',
		images: ['/doba-banner.png'],
	},
	other: {
		'talentapp:project_verification': '44388cc20c53b76e658fd42a0679e234c22e2f97278196bf75bfc12e67b05bcaf81b5726868e4e6582739e7aa4395fde04629e0d2c409431da28f053f2ff59c6',
	},
}

export const viewport: Viewport = {
	width: 'device-width',
	initialScale: 1,
	maximumScale: 1,
	userScalable: false,
	themeColor: '#0D0D12',
	viewportFit: 'cover',
}

type Props = {
	children: React.ReactNode
	params: Promise<{ locale: string }>
}

export default async function LocaleLayout({ children, params }: Props) {
	const { locale } = await params

	if (!routing.locales.includes(locale as any)) {
		notFound()
	}

	const messages = await getMessages()

	// RTL languages
	const rtlLocales = ['ar', 'he']
	const dir = rtlLocales.includes(locale) ? 'rtl' : 'ltr'

	return (
		<html lang={locale} dir={dir} className={`${chivo.variable} ${spaceMono.variable} ${ibmPlexMono.variable} ${notoSansKr.variable}`} suppressHydrationWarning>
			<body className="font-sans antialiased" suppressHydrationWarning>
				<NextIntlClientProvider messages={messages}>
					<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
						<Providers>
							<AudioProvider>
								{children}
							</AudioProvider>
						</Providers>
					</ThemeProvider>
				</NextIntlClientProvider>
				<DynamicFavicon />
				<Toaster position="bottom-right" closeButton />
				<SpeedInsights />
				<Analytics />
			</body>
		</html>
	)
}
