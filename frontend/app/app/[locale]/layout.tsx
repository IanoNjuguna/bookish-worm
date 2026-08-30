import React from "react"
import type { Metadata, Viewport } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'

import '../globals.css'
import { Providers } from "@/components/Providers"
import { AudioProvider } from "@/components/audio"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { ThemeProvider } from "@/components/ThemeProvider"
import { GradientProvider } from "@/components/GradientProvider"
import { ConsentAwareAnalytics } from "@/components/ConsentAwareAnalytics"
import { CookieConsentBanner } from "@/components/CookieConsent"
import { DynamicFavicon } from "@/components/DynamicFavicon"
import { Toaster } from "@/components/ui/sonner"
import { PWAInstallPrompt } from "@/components/PWAInstallPrompt"
import VantaBackground from "@/components/VantaBackground"
import { chivo, ibmPlexMono, spaceMono, notoSansKr, RTL_LOCALES } from './layout.constants'
import type { LocaleLayoutProps } from './layout.types'

export const metadata: Metadata = {
	metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://app.doba.world'),
	title: 'pre-drop your music on doba | for artists and super fans',
	description: 'Doba lets artists release music as collectible song tokens. Fans collect, stream for free, and support the artists they love — before the streaming platforms.',
	manifest: '/manifest.json',
	appleWebApp: {
		capable: true,
		statusBarStyle: 'black-translucent',
		title: 'Doba',
		startupImage: '/icons/icon-512x512.png',
	},
	icons: {
		icon: [
			{ url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
			{ url: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
			{ url: '/doba.ico' },
		],
		apple: [
			{ url: '/icons/icon-152x152.png', sizes: '152x152', type: 'image/png' },
			{ url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
		],
		shortcut: '/doba.ico',
	},
	openGraph: {
		siteName: 'doba',
		url: '/',
		images: [
			{
				url: '/doba-og.png',
				width: 1200,
				height: 630,
				alt: 'Preview',
			},
		],
	},
	twitter: {
		card: 'summary_large_image',
		site: '@doba_DAO',
		images: ['/doba-og.png'],
	},
	other: {
		'talentapp:project_verification': '44388cc20c53b76e658fd42a0679e234c22e2f97278196bf75bfc12e67b05bcaf81b5726868e4e6582739e7aa4395fde04629e0d2c409431da28f053f2ff59c6',
		'mobile-web-app-capable': 'yes',
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

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
	const { locale } = await params

	if (!routing.locales.includes(locale as any)) {
		notFound()
	}

	const messages = await getMessages()

	const dir = RTL_LOCALES.includes(locale) ? 'rtl' : 'ltr'

	return (
		<html lang={locale} dir={dir} className={`${chivo.variable} ${spaceMono.variable} ${ibmPlexMono.variable} ${notoSansKr.variable}`} suppressHydrationWarning>
			<body className="font-sans antialiased" suppressHydrationWarning>
				<NextIntlClientProvider messages={messages}>
					<ThemeProvider attribute="class" defaultTheme="dark">
						<Providers>
							<AudioProvider>
								<GradientProvider>
									<VantaBackground />
									{children}
								</GradientProvider>
							</AudioProvider>
						</Providers>
					</ThemeProvider>
				</NextIntlClientProvider>
				<DynamicFavicon />
				<PWAInstallPrompt />
				<CookieConsentBanner />
				<Toaster position="bottom-right" closeButton />
				<SpeedInsights />
				<ConsentAwareAnalytics />
			</body>
		</html>
	)
}
