'use client'

import React, { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { useParams, usePathname } from 'next/navigation'
import { Step } from 'react-joyride'
import { useTranslations } from 'next-intl'
import { useCardano } from '@/components/Providers'

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
			<span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-[#B57EDC] border-2 border-[#0D2418] shadow-md"></span>
		</span>
	)
}

// Custom 90s Sportswear Tooltip Component
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
	return (
		<div
			{...tooltipProps}
			className="rounded-none border-2 border-double border-[#C1A87D] bg-[#0D2418] text-[#FAF9F6] max-w-[340px] p-5 shadow-2xl relative overflow-hidden"
			style={{
				backgroundImage: 'radial-gradient(rgba(193, 168, 125, 0.08) 15%, transparent 16%)',
				backgroundSize: '5px 5px',
			}}
		>
			{/* Printed paper wear overlay */}
			<div className="absolute inset-0 opacity-10 bg-[linear-gradient(rgba(193,168,125,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(193,168,125,0.05)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />

			{/* Saturated Fujifilm Velvia Lens Flare effect */}
			<div className="absolute -top-16 -right-16 w-32 h-32 bg-gradient-to-br from-[#B57EDC]/10 via-[#FF1F8A]/5 to-transparent rounded-full blur-2xl pointer-events-none" />

			{/* Tooltip Header */}
			{step.title && (
				<h5 className="font-chivo font-black text-sm uppercase tracking-wider text-[#FAF9F6] border-b border-[#C1A87D]/30 pb-2 mb-3 flex items-center justify-between">
					<span>{step.title}</span>
					<span className="font-mono text-[10px] text-[#C1A87D] bg-[#0D2418] border border-[#C1A87D]/30 px-1.5 py-0.5">
						SPEC {index + 1}/{size}
					</span>
				</h5>
			)}

			{/* Tooltip Body */}
			<div className="font-mono text-[11px] text-[#E5D7B7] leading-relaxed mb-6 whitespace-normal">
				{step.content}
			</div>

			{/* Tooltip Controls */}
			<div className="flex items-center justify-between pt-2.5 border-t border-[#C1A87D]/20">
				<div>
					{index > 0 && (
						<button
							{...backProps}
							className="font-mono text-[10px] text-[#C1A87D]/70 hover:text-[#C1A87D] uppercase tracking-wider transition-colors mr-3.5 outline-none"
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
					className="font-chivo font-black text-[11px] uppercase bg-[#B57EDC] hover:bg-[#A36CCB] text-[#0D2418] px-4 py-2 rounded-none tracking-widest transition-all shadow-[2px_2px_0px_#C1A87D] active:translate-y-[1px] active:shadow-[1px_1px_0px_#C1A87D] outline-none"
				>
					{isLastStep ? 'COMPLETE' : 'NEXT >'}
				</button>
			</div>
		</div>
	)
}

export default function OnboardingTour() {
	const tNav = useTranslations('nav')
	const pathname = usePathname() || ''
	const params = useParams()
	
	// Cardano Wallet Authentication State
	const { isConnected, address } = useCardano()

	const [run, setRun] = useState(false)
	const [key, setKey] = useState(0) // Force reset/remount Joyride
	const [hasSongs, setHasSongs] = useState(false) // Dynamic library branching state

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

	useEffect(() => {
		// Auto-run only if they have not completed onboarding before
		const hasCompletedTour = localStorage.getItem('doba_completed_onboarding')
		if (!hasCompletedTour) {
			const timer = setTimeout(() => setRun(true), 1500)
			return () => clearTimeout(timer)
		}
	}, [])

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
					content: 'DRAG AND DROP WAV/MP3 AUDIO FILES. DECENTRALIZED ASSETS ARE AUTOMATICALLY PINNED ON IPFS.',
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

	const handleJoyrideCallback = (data: any) => {
		const { status } = data
		const finishedStatuses = ['finished', 'skipped']

		if (finishedStatuses.includes(status)) {
			setRun(false)
			localStorage.setItem('doba_completed_onboarding', 'true')
		}
	}

	return (
		<Joyride
			key={key}
			onEvent={handleJoyrideCallback}
			continuous={true}
			run={run}
			scrollToFirstStep={true}
			steps={getSteps()}
			tooltipComponent={CustomTooltip}
			beaconComponent={CustomBeacon}
			styles={{
				options: {
					overlayColor: 'rgba(11, 30, 20, 0.82)', // Saturated deep forest green with Fujfilm Velvia color grading feel
					zIndex: 10000,
				}
			} as any}
		/>
	)
}
