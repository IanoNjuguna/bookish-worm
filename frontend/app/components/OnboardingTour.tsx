'use client'

import React, { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { useParams, usePathname } from 'next/navigation'
import { Step } from 'react-joyride'
import { useTranslations } from 'next-intl'

// Dynamically import Joyride with SSR disabled and resolve the named export to prevent TypeScript compilation errors
const Joyride = dynamic(() => import('react-joyride').then(mod => mod.Joyride), { ssr: false }) as any

export default function OnboardingTour() {
	const tNav = useTranslations('nav')
	const pathname = usePathname() || ''
	const params = useParams()
	const [run, setRun] = useState(false)
	const [key, setKey] = useState(0) // Used to force reset/remount Joyride on demand

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

	// Dynamically build steps based on current path
	const getSteps = (): Step[] => {
		const locale = (params?.locale as string) || 'en'
		
		// 1. Profile / Assets Page Context
		if (pathname.includes('/profile') || pathname.includes('/assets')) {
			return [
				{
					target: '#profile-card',
					content: 'This card displays your verified identity, bio, and connected Cardano wallet address.',
					title: 'Your Web3 Profile 🪪',
					placement: 'bottom',
					skipBeacon: true,
				},
				{
					target: '#profile-actions-bar',
					content: 'Execute on-chain transfers, fund your wallet, or view all your collected assets side-by-side.',
					title: 'Wallet Actions ⚡',
					placement: 'bottom',
				},
				{
					target: '#my-uploads-section',
					content: 'Tracks you upload as an artist will be cataloged here for fans to discover and collect.',
					title: 'Your Uploaded Releases 💿',
					placement: 'top',
				}
			]
		}

		// 2. Track Details Page Context
		if (pathname.includes('/track/')) {
			return [
				{
					target: '#track-artwork-container',
					content: 'Click the overlay play button to stream this song immediately. High-quality audio is stored securely.',
					title: 'Song Artwork 🎨',
					placement: 'bottom',
					skipBeacon: true,
				},
				{
					target: '#track-collect-container',
					content: 'Support the artist by collecting fractions of this track. Collected records can be downloaded directly.',
					title: 'Collect Song Fractions 💎',
					placement: 'bottom',
				},
				{
					target: '#blockchain-details-section',
					content: 'Auditable on-chain metadata including the minting Policy ID, reference NFT provenance, and parameters.',
					title: 'Decentralized Details 🔗',
					placement: 'top',
				}
			]
		}

		// 3. Upload Page Context
		if (pathname.includes('/upload')) {
			return [
				{
					target: '#upload-audio-zone',
					content: 'Drag and drop your audio files (MP3/WAV) to prepare them for IPFS decentralized pinning.',
					title: 'Audio Uploader 🎙️',
					placement: 'bottom',
					skipBeacon: true,
				},
				{
					target: '#upload-details-form',
					content: 'Enter the song details, artist credentials, genre tagging, and initial mint price in ADA.',
					title: 'Release Details 📝',
					placement: 'bottom',
				},
				{
					target: '#upload-royalties-section',
					content: 'Configure your perpetual on-chain royalty percentages to automatically collect revenue on secondary trades.',
					title: 'Secondary Sales Royalties 💰',
					placement: 'top',
				}
			]
		}

		// 4. Default / Home / General Dashboard Context
		return [
			{
				target: '#connect-wallet-btn',
				content: 'Click here to connect your Cardano wallet. Authentic wallet connection unlocks the full platform capability.',
				title: 'Connect Wallet 🔑',
				placement: 'bottom',
				skipBeacon: true,
			},
			{
				target: '#side-nav-library',
				content: 'Access your playlists, collected tracks, and owned music fractions here.',
				title: 'Your Library 🎧',
				placement: 'right',
			},
			{
				target: '#sidebar-toggle-btn',
				content: 'Open the right drawer sidebar to see details of the current track and buy fractions.',
				title: 'Now Playing Drawer 📂',
				placement: 'left',
			},
			{
				target: '#theme-toggle-btn',
				content: 'Switch between light and dark modes to suit your viewing preference.',
				title: 'Theme Settings 🌗',
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
			showProgress={true}
			showSkipButton={true}
			steps={getSteps()}
			styles={{
				options: {
					arrowColor: 'var(--card-bg, #FAF9F6)',
					backgroundColor: 'var(--tooltip-bg, #FAF9F6)',
					overlayColor: 'rgba(13, 13, 18, 0.4)',
					primaryColor: '#FF1F8A', // Doba Cyber-Pink
					textColor: 'var(--text-color, #0D0D12)',
					zIndex: 10000,
				},
				tooltip: {
					borderRadius: '12px',
					border: '1px solid rgba(255, 31, 138, 0.15)',
					boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
					padding: '20px',
					backgroundColor: 'var(--tooltip-bg, #FAF9F6)',
				},
				tooltipContainer: {
					textAlign: 'left',
					fontFamily: 'var(--font-chivo), sans-serif',
				},
				buttonNext: {
					backgroundColor: '#FF1F8A',
					borderRadius: '6px',
					fontSize: '11px',
					fontWeight: 'bold',
					textTransform: 'uppercase',
					letterSpacing: '1px',
					padding: '8px 16px',
					outline: 'none',
				},
				buttonBack: {
					color: 'gray',
					fontSize: '11px',
					marginRight: '12px',
					outline: 'none',
				},
				buttonSkip: {
					color: 'gray',
					fontSize: '11px',
					outline: 'none',
				},
			} as any}
		/>
	)
}

