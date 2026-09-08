'use client'

import { logger } from '@/lib/logger'
import { useEffect, useState } from 'react'
import { useCardano } from '@/components/Providers'
import { useAudio } from '@/components/audio'
import type { Collaborator, RoyaltyEntry, Track } from './EarningsView.types'
import { REFRESH_INTERVAL_MS } from './EarningsView.constants'

export interface UseEarningsViewResult {
	isConnected: boolean
	loading: boolean
	royaltyTracks: RoyaltyEntry[]
	balance: string
	lifetimeEarnings: string
	fetchEarnings: () => Promise<void>
}

export function useEarningsView(): UseEarningsViewResult {
	const { address, isConnected, lucid } = useCardano()
	const { effectiveAddress } = useAudio()
	const [loading, setLoading] = useState(false)
	const [royaltyTracks, setRoyaltyTracks] = useState<RoyaltyEntry[]>([])
	const [balance, setBalance] = useState('0.00')
	const [lifetimeEarnings, setLifetimeEarnings] = useState('0.00')

	const fetchEarnings = async () => {
		if (!isConnected || !address) return
		setLoading(true)
		try {
			// Get current wallet balance
			if (lucid) {
				try {
					const wallet = typeof lucid.wallet === 'function' ? lucid.wallet() : lucid.wallet
					let lovelace = 0n

					if (wallet && typeof wallet.getUtxos === 'function') {
						const utxos = (await wallet.getUtxos()) || []
						lovelace = utxos.reduce(
							(total: bigint, utxo: { assets?: { lovelace?: bigint } }) => total + (utxo.assets?.lovelace ?? 0n),
							0n
						)
					} else if (wallet && typeof wallet.getLovelace === 'function') {
						lovelace = BigInt(await wallet.getLovelace())
					} else if (typeof lucid.utxosAt === 'function' && address) {
						const utxos = (await lucid.utxosAt(address)) || []
						lovelace = utxos.reduce(
							(total: bigint, utxo: { assets?: { lovelace?: bigint } }) => total + (utxo.assets?.lovelace ?? 0n),
							0n
						)
					}

					setBalance((Number(lovelace) / 1000000).toFixed(2))
				} catch (e) {
					console.warn('EarningsView: Wallet bridge request timed out or failed', e)
				}
			}

			// 1. Fetch all tracks
			const res = await fetch('/api-backend/songs')
			if (!res.ok) throw new Error('Failed to fetch songs')
			const tracks: Track[] = await res.json()

			const entries: RoyaltyEntry[] = []
			let totalEarned = 0

			// 2. Fetch collaborators for each track to check if user has splits
			for (const track of tracks) {
				try {
					const collabRes = await fetch(`/api-backend/songs/${track.token_id}/collaborators`)
					if (!collabRes.ok) continue
					const collaborators: Collaborator[] = await collabRes.json()

					// Check if user is either the uploader (owner) or in the collaborators list (checking both payment and stake address formats)
					const isUploader = track.uploader_address && (
						(address && track.uploader_address.toLowerCase() === address.toLowerCase()) ||
						(effectiveAddress && track.uploader_address.toLowerCase() === effectiveAddress.toLowerCase())
					)
					const collabEntry = collaborators.find((c) => c.wallet_address && (
						(address && c.wallet_address.toLowerCase() === address.toLowerCase()) ||
						(effectiveAddress && c.wallet_address.toLowerCase() === effectiveAddress.toLowerCase())
					))

					if (isUploader || collabEntry) {
						// Calculate split percentage
						let shares = 0
						if (collabEntry) {
							shares = collabEntry.split_percentage
						} else {
							// If they are uploader, their share is 100% minus collaborator splits
							const totalCollabSplits = collaborators.reduce((acc: number, curr) => acc + curr.split_percentage, 0)
							shares = Math.max(0, 100 - totalCollabSplits)
						}

						const priceNum = parseFloat(track.price || '5')
						const mintCount = track.mint_count || 0
						const myEarnings = ((priceNum * mintCount * shares) / 100).toFixed(2)

						entries.push({
							track: track.name,
							tokenId: track.token_id,
							price: track.price || '5',
							mintCount,
							shares,
							myEarnings,
							uploaderAddress: track.uploader_address,
							imageUrl: track.image_url
						})

						totalEarned += parseFloat(myEarnings)
					}
				} catch (err) {
					console.warn(`Failed to fetch collaborators for track ${track.token_id}`, err)
				}
			}

			setRoyaltyTracks(entries)
			setLifetimeEarnings(totalEarned.toFixed(2))
		} catch (error) {
			logger.error('Error fetching earnings', error)
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		fetchEarnings()
		const interval = setInterval(fetchEarnings, REFRESH_INTERVAL_MS)
		return () => clearInterval(interval)
	}, [isConnected, address, lucid])

	return { isConnected, loading, royaltyTracks, balance, lifetimeEarnings, fetchEarnings }
}
