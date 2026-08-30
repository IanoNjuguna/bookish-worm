import localFont from 'next/font/local'

export const chivo = localFont({
	src: [
		{ path: '../../public/fonts/Chivo-Regular.ttf', weight: '400', style: 'normal' },
		{ path: '../../public/fonts/Chivo-Medium.ttf', weight: '500', style: 'normal' },
		{ path: '../../public/fonts/Chivo-SemiBold.ttf', weight: '600', style: 'normal' },
		{ path: '../../public/fonts/Chivo-Bold.ttf', weight: '700', style: 'normal' },
	],
	variable: '--font-chivo',
	display: 'swap',
})

export const ibmPlexMono = localFont({
	src: [
		{ path: '../../public/fonts/IBMPlexMono-Regular.ttf', weight: '400', style: 'normal' },
		{ path: '../../public/fonts/IBMPlexMono-Medium.ttf', weight: '500', style: 'normal' },
		{ path: '../../public/fonts/IBMPlexMono-SemiBold.ttf', weight: '600', style: 'normal' },
	],
	variable: '--font-ibm-plex-mono',
	display: 'swap',
})

export const spaceMono = localFont({
	src: [
		{ path: '../../public/fonts/SpaceMono-Regular.ttf', weight: '400', style: 'normal' },
		{ path: '../../public/fonts/SpaceMono-Bold.ttf', weight: '700', style: 'normal' },
	],
	variable: '--font-space-mono',
	display: 'swap',
})

export const notoSansKr = localFont({
	src: [
		{ path: '../../public/fonts/NotoSansKR-Regular.ttf', weight: '400', style: 'normal' },
		{ path: '../../public/fonts/NotoSansKR-Medium.ttf', weight: '500', style: 'normal' },
		{ path: '../../public/fonts/NotoSansKR-Bold.ttf', weight: '700', style: 'normal' },
	],
	variable: '--font-noto-sans-kr',
	display: 'swap',
	preload: false,
})

// RTL languages
export const RTL_LOCALES = ['ar', 'he']
