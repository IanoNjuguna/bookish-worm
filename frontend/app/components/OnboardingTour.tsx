'use client'

import React, { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { useParams, usePathname } from 'next/navigation'
import { Step } from 'react-joyride'
import { useTranslations } from 'next-intl'
import { useCardano } from '@/components/Providers'
import { useTheme } from 'next-themes'
import { cn } from '@/lib/utils'

// Dynamically import Joyride with SSR disabled and resolve the named export to prevent TypeScript compilation errors
const Joyride = dynamic(() => import('react-joyride').then(mod => mod.Joyride), { ssr: false }) as any

// Custom 90s Sportswear Beacon Component
const CustomBeacon = ({ beaconRef, ...props }: any) => {
	return (
		<span
			ref={beaconRef}
			{...props}
			className="relative flex h-6 w-6 cursor-pointer justify-center items-center"
		>
			<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#B57EDC] opacity-75"></span>
			<span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-[#B57EDC] border-2 border-[#0D0D12] shadow-md"></span>
		</span>
	)
}

export default function OnboardingTour() {
	const tNav = useTranslations('nav')
	const pathname = usePathname() || ''
	const params = useParams()
	const { resolvedTheme } = useTheme()
	
	// Cardano Wallet Authentication State
	const { isConnected, address } = useCardano()

	const [run, setRun] = useState(false)
	const [key, setKey] = useState(0) // Force reset/remount Joyride
	const [hasSongs, setHasSongs] = useState(false) // Dynamic library branching state

	// Custom 90s Sportswear Tooltip Component with dynamic theme-aware contrast color schemes
	const CustomTooltip = ({
		backProps,
		closeProps,
		primaryProps,
		skipProps,
		tooltipProps,
		index,
		isLastStep,
		size,
		step,
		continuous,
	}: any) => {
		const isDarkTheme = resolvedTheme === 'dark'

		return (
			<div
				{...tooltipProps}
				className={cn(
					"rounded-none border-2 border-double border-[#B794F4] p-5 shadow-2xl relative overflow-hidden w-[calc(100vw-32px)] sm:max-w-[340px] focus:outline-none",
					isDarkTheme 
						? "bg-[#FAF9F6] text-[#0D0D12]" 
						: "bg-[#0D0D12] text-[#FAF9F6]"
				)}
				style={{
					backgroundImage: 'radial-gradient(rgba(183, 148, 244, 0.08) 15%, transparent 16%)',
					backgroundSize: '5px 5px',
				}}
			>
				{/* Printed paper wear overlay */}
				<div className={cn(
					"absolute inset-0 opacity-10 pointer-events-none",
					isDarkTheme
						? "bg-[linear-gradient(rgba(13,13,18,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(13,13,18,0.04)_1px,transparent_1px)] bg-[size:20px_20px]"
						: "bg-[linear-gradient(rgba(183,148,244,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(183,148,244,0.04)_1px,transparent_1px)] bg-[size:20px_20px]"
				)} />

				{/* Saturated Fujifilm Velvia Lens Flare effect */}
				<div className="absolute -top-16 -right-16 w-32 h-32 bg-gradient-to-br from-[#B57EDC]/10 via-[#FF1F8A]/5 to-transparent rounded-full blur-2xl pointer-events-none" />

				{/* Tooltip Header */}
				{step.title && (
					<h5 className={cn(
						"font-chivo font-black text-sm uppercase tracking-wider border-b pb-2 mb-3 flex items-center justify-between",
						isDarkTheme ? "text-[#0D0D12] border-[#B794F4]/30" : "text-[#FAF9F6] border-[#B794F4]/30"
					)}>
						<span>{step.title}</span>
						<span className={cn(
							"font-mono text-[10px] border px-1.5 py-0.5",
							isDarkTheme 
								? "text-[#B794F4] bg-[#FAF9F6] border-[#B794F4]/30" 
								: "text-[#B794F4] bg-[#0D0D12] border-[#B794F4]/30"
						)}>
							SPEC {index + 1}/{size}
						</span>
					</h5>
				)}

				{/* Tooltip Body */}
				<div className={cn(
					"font-mono text-[11px] leading-relaxed mb-6 whitespace-normal",
					isDarkTheme ? "text-[#333333]" : "text-[#E2DCF0]"
				)}>
					{step.content}
				</div>

				{/* Tooltip Controls */}
				<div className="flex items-center justify-between pt-2.5 border-t border-[#B794F4]/20">
					<div>
						{index > 0 && (
							<button
								{...backProps}
								className={cn(
									"font-mono text-[10px] uppercase tracking-wider transition-colors mr-3.5 outline-none",
									isDarkTheme ? "text-[#B794F4] hover:text-[#B794F4]/80" : "text-[#B794F4]/70 hover:text-[#B794F4]"
								)}
							>
								&lt; BACK
							</button>
						)}
						<button
							{...skipProps}
							className="font-mono text-[10px] text-red-400/60 hover:text-red-400 uppercase tracking-wider transition-colors outline-none"
						>
							[SKIP]
						</button>
					</div>
					<button
						{...primaryProps}
						className={cn(
							"font-chivo font-black text-[11px] uppercase px-4 py-2 rounded-none tracking-widest transition-all outline-none",
							isDarkTheme
								? "bg-[#0D0D12] hover:bg-[#2A2A38] text-[#FAF9F6] shadow-[2px_2px_0px_#B794F4] active:shadow-[1px_1px_0px_#B794F4] active:translate-y-[1px]"
								: "bg-[#FAF9F6] hover:bg-[#EAEAEF] text-[#0D0D12] shadow-[2px_2px_0px_#B794F4] active:shadow-[1px_1px_0px_#B794F4] active:translate-y-[1px]"
						)}
					>
						{isLastStep ? 'COMPLETE' : 'NEXT >'}
					</button>
				</div>
			</div>
		)
	}

	// Helper to get page identifier for path-segmented onboarding
	const getPageKey = (): string => {
		if (pathname.includes('/profile') || pathname.includes('/assets')) return 'profile'
		if (pathname.includes('/track/')) return 'track'
		if (pathname.includes('/upload')) return 'upload'
		if (pathname.includes('/library')) return 'library'
		if (pathname.includes('/search')) return 'search'
		if (pathname.includes('/earnings')) return 'earnings'
		if (pathname.includes('/analytics')) return 'analytics'
		if (pathname.includes('/deposit')) return 'deposit'
		if (pathname.includes('/send-money')) return 'send_money'
		return 'dashboard'
	}

	const getTourStorageKey = (): string => {
		const pageKey = (isConnected && address) ? getPageKey() : 'auth'
		return `doba_completed_tour_${pageKey}`
	}

	// Fetch owned songs to determine library page onboarding branch
	useEffect(() => {
		if (isConnected && address) {
			const authData = localStorage.getItem('doba_auth_data')
			const headers: Record<string, string> = {}
			if (authData) {
				const parsed = JSON.parse(authData)
				if (parsed?.accessToken) {
					headers['Authorization'] = `Bearer ${parsed.accessToken}`
				}
			}
			fetch('/api-backend/songs', { headers })
				.then(res => {
					if (res.ok) return res.json()
					throw new Error('Failed to load owned tracks')
				})
				.then((tracks: any[]) => {
					const owned = tracks.filter(t => t.is_owned)
					setHasSongs(owned.length > 0)
				})
				.catch(err => console.error('Onboarding: error fetching library state', err))
		}
	}, [isConnected, address, pathname])

	// Just-In-Time Contextual Tour auto-run trigger per page
	useEffect(() => {
		setRun(false) // Reset any running state when path/auth updates
		const storageKey = getTourStorageKey()
		const hasCompleted = localStorage.getItem(storageKey)
		
		if (!hasCompleted) {
			const timer = setTimeout(() => setRun(true), 1500)
			return () => clearTimeout(timer)
		}
	}, [pathname, isConnected, address])

	useEffect(() => {
		// Listen for custom trigger events from the header help button
		const handleTrigger = () => {
			setKey(prev => prev + 1)
			setRun(true)
		}
		window.addEventListener('doba-trigger-tour', handleTrigger)
		return () => window.removeEventListener('doba-trigger-tour', handleTrigger)
	}, [])

	// Dynamically build steps based on user authentication state and current path
	const getSteps = (): Step[] => {
		const locale = (params?.locale as string) || 'en'

		// 1. STATE-AWARE RULE: IF SIGNED OUT, ONLY WALK THROUGH SIGN IN / GET STARTED
		if (!isConnected || !address) {
			return [
				{
					target: '#connect-wallet-btn',
					content: 'CLICK HERE TO CONNECT YOUR CARDANO WALLET AND SECURELY SIGN IN TO THE NETWORK.',
					title: 'AUTHENTICATION GATE',
					placement: 'bottom',
					skipBeacon: true,
				}
			]
		}
		
		// 2. STATE-AWARE RULE: IF SIGNED IN, DYNAMIC PAGE-SPECIFIC TOURS
		// Profile / Assets Page Context
		if (pathname.includes('/profile') || pathname.includes('/assets')) {
			return [
				{
					target: '#profile-card',
					content: 'YOUR DECENTRALIZED WEB3 IDENTITY, PROFILE PHOTO, BIOGRAPHY AND WALLET KEY DETAILS.',
					title: 'PROFILE MATRIX',
					placement: 'bottom',
					skipBeacon: true,
				},
				{
					target: '#profile-actions-bar',
					content: 'TRIGGER DEPOSITS, QUICK TRANSFERS, AND EXHAUSTIVE VIEW ASSETS AUDITING.',
					title: 'ON-CHAIN ACTIONS',
					placement: 'bottom',
				},
				{
					target: '#my-uploads-section',
					content: 'TRACKS AND ALBUMS YOU HAVE PUBLISHED ON-CHAIN TO COLLECT RECURRING ROYALTIES.',
					title: 'CREATOR CATALOG',
					placement: 'top',
				}
			]
		}

		// Track Details Page Context
		if (pathname.includes('/track/')) {
			return [
				{
					target: '#track-artwork-container',
					content: 'VINTAGE PRINT DESIGN ARTWORK. STREAM HIGH-FIDELITY PREVIEW AUDIO INSTANTLY.',
					title: 'SONG METADATA',
					placement: 'bottom',
					skipBeacon: true,
				},
				{
					target: '#track-collect-container',
					content: 'SUPPORT THE ARTIST BY PURCHASING FRACTIONAL OWNER TOKENS ON-CHAIN.',
					title: 'COLLECT UTILITY',
					placement: 'bottom',
				},
				{
					target: '#blockchain-details-section',
					content: 'FULL POLICY ID, METADATA SPECIFICATIONS, AND PROVENANCE BLOCKCHAIN DETAILS.',
					title: 'BLOCKCHAIN PROVENANCE',
					placement: 'top',
				}
			]
		}

		// Upload Page Context
		if (pathname.includes('/upload')) {
			return [
				{
					target: '#upload-audio-zone',
					content: 'DRAG AND DROP WAV/MP3 AUDIO FILES. DECENTRALIZED ASSETS ARE AUTOMATICALLY PINSED ON IPFS.',
					title: 'AUDIO SOURCE BUFFER',
					placement: 'bottom',
					skipBeacon: true,
				},
				{
					target: '#upload-details-form',
					content: 'CONFIGURE THE RELEASE SPECIFICATIONS, GENRE, PRICE, AND MINT SIZE.',
					title: 'MINTING ATTRIBUTES',
					placement: 'bottom',
				},
				{
					target: '#upload-royalties-section',
					content: 'SET YOUR ROYALTY PERCENTAGE TO AUTOMATICALLY COLLECT RECURRING SALES ROYALTIES.',
					title: 'SECONDARY ROYALTIES',
					placement: 'top',
				}
			]
		}

		// Library / Playlist Page Context
		if (pathname.includes('/library')) {
			// IF the user owns music content, show management and playing guide
			if (hasSongs) {
				return [
					{
						target: '#library-songs-grid',
						content: 'STREAM YOUR COLLECTED SONG FRAGMENTS, MINT RECORD DETAILS, OR INITIATE DOWNLOADS.',
						title: 'COLLECTED ARCHIVES',
						placement: 'bottom',
						skipBeacon: true,
					},
					{
						target: '#sidebar-toggle-btn',
						content: 'TOGGLE THE NOW PLAYING SIDEBAR DRAWER TO MANAGE AND AUDIT INDIVIDUAL TRACK SPLITS.',
						title: 'TRACK METADATA VIEW',
						placement: 'left',
					}
				]
			}
			
			// ELSE (empty library), execute focused 'discovery and acquisition' tour directing to marketplace
			return [
				{
					target: '#library-empty-state',
					content: 'YOUR PLAYLIST IS UNPOPULATED. YOU DO NOT OWN ANY CARDANO SONG FRACTIONS YET.',
					title: 'ARCHIVE VACANT',
					placement: 'bottom',
					skipBeacon: true,
				},
				{
					target: '#side-nav-library', // highlighting nav to prompt search/marketplace visit
					content: 'GO BACK TO THE MARKETPLACE HOME OR USE SEARCH IN THE NAV MENU TO DISCOVER NEW MUSIC.',
					title: 'DISCOVER MUSIC',
					placement: 'right',
				}
			]
		}

		// Search Page Context
		if (pathname.includes('/search')) {
			return [
				{
					target: '#search-input-container',
					content: 'SEARCH BY KEYWORDS OR FILTER BY MUSIC GENRES TO PINPOINT TARGET SONG FRACTIONS.',
					title: 'FILTER SPECIFICATION',
					placement: 'bottom',
					skipBeacon: true,
				},
				{
					target: '#search-marketplace-grid',
					content: 'BROWSE MINTED TITLES, SCARCITY PERCENTAGES, AND PRICES BEFORE ACQUISITION.',
					title: 'MARKETPLACE INDEX',
					placement: 'top',
				}
			]
		}

		// Earnings Page Context
		if (pathname.includes('/earnings')) {
			return [
				{
					target: '#earnings-metrics-grid',
					content: 'TRACK YOUR LIFETIME ON-CHAIN SALES VOLUME AND SECURE WALLET CUSTODY ASSETS.',
					title: 'REVENUE AUDIT',
					placement: 'bottom',
					skipBeacon: true,
				},
				{
					target: '#earnings-splits-list',
					content: 'VERIFY REAL-TIME COLLABORATOR REVENUE DIVISION SPLITS CONFIGURED PER SONG.',
					title: 'COLLABORATOR MATRIX',
					placement: 'top',
				}
			]
		}

		// Analytics Page Context
		if (pathname.includes('/analytics')) {
			return [
				{
					target: '#analytics-metrics-grid',
					content: 'AUDIT TOTAL STREAMS, GEOGRAPHIC LISTENER ENGAGEMENT, AND MONTHLY RETENTION RATES.',
					title: 'METRIC SPECIFICATION',
					placement: 'bottom',
					skipBeacon: true,
				},
				{
					target: '#analytics-charts-row',
					content: 'VISUAL STREAM DATA RECORD PLOTTED OVER RECENT INTERVALS.',
					title: 'PERFORMANCE CHARTS',
					placement: 'top',
				}
			]
		}

		// Deposit Page Context
		if (pathname.includes('/deposit')) {
			return [
				{
					target: '#deposit-funds-container',
					content: 'FUND YOUR INTEGRATED CARDANO WALLET TO BEGIN COLLECTING OR MINTING.',
					title: 'DEPOSIT ENGINE',
					placement: 'bottom',
					skipBeacon: true,
				}
			]
		}

		// Send Money Page Context
		if (pathname.includes('/send-money')) {
			return [
				{
					target: '#send-funds-container',
					content: 'TRANSFER ADA OR COLLECTED NFT FRACTIONS TO EXTERNAL BLOCKCHAIN IDENTITIES.',
					title: 'TRANSFER ENGINE',
					placement: 'bottom',
					skipBeacon: true,
				}
			]
		}

		// Default / Home / General Dashboard Context
		return [
			{
				target: '#side-nav-library',
				content: 'GO TO THE PLAYLIST ARCHIVE TO VIEW YOUR COLLECTED TRACKS AND MINTED NFTS.',
				title: 'YOUR ARCHIVES',
				placement: 'right',
				skipBeacon: true,
			},
			{
				target: '#sidebar-toggle-btn',
				content: 'EXPAND THE RIGHT DRAWER DRAWER TO INSPECT DETAILS OF THE CURRENT AUDIO SELECTION.',
				title: 'NOW PLAYING UTILITY',
				placement: 'left',
			},
			{
				target: '#theme-toggle-btn',
				content: 'SWITCH THE GRAPHICS INTERFACE FROM DARK TO LIGHT PRESENTATION STYLES.',
				title: 'THEME PRESENTATION',
				placement: 'bottom',
			}
		]
	}

	// Install step appended to every tour flow
	const INSTALL_STEP = {
		target: 'body',
		placement: 'center' as const,
		title: 'INSTALL DOBA',
		content: 'Add Doba to your home screen for instant access, lock screen music controls, and push notifications \u2014 no App Store required.',
		skipBeacon: true,
		data: { isInstallStep: true },
	}

	const handleJoyrideCallback = (data: any) => {
		const { status, action, index, type, step } = data
		const finishedStatuses = ['finished', 'skipped']

		// Fire the install prompt when the tour naturally finishes (which ends on the install step)
		// or if the user interacts with the install step specifically
		if (status === 'finished' || ((step as any)?.data?.isInstallStep && type === 'step:after')) {
			window.dispatchEvent(new CustomEvent('doba-trigger-install'))
		}

		if (finishedStatuses.includes(status)) {
			setRun(false)
			const storageKey = getTourStorageKey()
			localStorage.setItem(storageKey, 'true')
		}
	}

	// Enforce center alignment globally for all onboarding steps to occupy viewport center space and display flawlessly on mobile
	const rawSteps = [...getSteps(), INSTALL_STEP]
	const steps = rawSteps.map(step => {
		const targetSelector = typeof step.target === 'string' ? step.target : ''
		let useBodyFallback = false

		if (typeof window !== 'undefined' && targetSelector && targetSelector !== 'body') {
			try {
				const element = document.querySelector(targetSelector)
				if (!element) {
					useBodyFallback = true
				} else {
					const rect = element.getBoundingClientRect()
					if (rect.width === 0 && rect.height === 0) {
						useBodyFallback = true
					}
				}
			} catch (e) {
				useBodyFallback = true
			}
		}

		return {
			...step,
			target: useBodyFallback ? 'body' : step.target,
			placement: 'center' as const
		}
	})

	return (
		<Joyride
			key={key}
			callback={handleJoyrideCallback}
			continuous={true}
			run={run}
			scrollToFirstStep={true}
			steps={steps}
			tooltipComponent={CustomTooltip}
			beaconComponent={CustomBeacon}
			styles={{
				options: {
					overlayColor: resolvedTheme === 'dark' ? 'rgba(13, 13, 18, 0.75)' : 'rgba(250, 249, 246, 0.75)',
					zIndex: 10000,
				}
			} as any}
		/>
	)
}
