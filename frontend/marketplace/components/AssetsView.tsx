'use client'

import React, { useEffect, useState } from 'react'
import { useCardano } from '@/components/Providers'
import { IconMusic, IconCoins, IconPhoto, IconWallet } from '@tabler/icons-react'
import { DobaVisualizer } from '@/components/icons/DobaVisualizer'

interface Track {
	id?: number
	token_id: number
	name: string
	artist: string
	image_url: string
	price?: string
	is_owned?: boolean
}

interface TokenAsset {
	unit: string
	policyId: string
	name: string
	symbol: string
	balance: number
	usdValue: number
	price: number
	logoUrl?: string
}

// Known token registry with fallbacks for decals and prices
const KNOWN_TOKENS: Record<string, { symbol: string, decimals: number, price: number, name: string, fallbackLogo?: string }> = {
	"doba": { symbol: "DOBA", decimals: 0, price: 0.05, name: "Doba Ecosystem Token" },
	"usdc": { 
		symbol: "USDC", 
		decimals: 6, 
		price: 1.00, 
		name: "USD Coin (Bridge Asset)",
		fallbackLogo: "https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png"
	},
	"hosky": { 
		symbol: "HOSKY", 
		decimals: 0, 
		price: 0.00000096, 
		name: "Hosky Meme Coin",
		fallbackLogo: "https://assets.coingecko.com/coins/images/22812/large/hosky.png"
	}
}

// Decode hex asset names to UTF-8 strings
function hexToString(hex: string): string {
	try {
		let str = ''
		for (let i = 0; i < hex.length; i += 2) {
			const charCode = parseInt(hex.substring(i, i + 2), 16)
			if (charCode >= 32 && charCode <= 126) { // printable ascii
				str += String.fromCharCode(charCode)
			}
		}
		return str || hex
	} catch (e) {
		return hex
	}
}

export default function AssetsView() {
	const { address, isConnected, lucid } = useCardano()
	
	const [adaBalance, setAdaBalance] = useState(0)
	const [adaPrice, setAdaPrice] = useState(0.38)
	const [customTokens, setCustomTokens] = useState<TokenAsset[]>([])
	const [ownedNfts, setOwnedNfts] = useState<Track[]>([])
	const [loading, setLoading] = useState(true)
	const [activeTab, setActiveTab] = useState<'tokens' | 'nfts'>('tokens')

	useEffect(() => {
		async function fetchRegistryLogos(tokensList: TokenAsset[]) {
			try {
				const updatedTokens = await Promise.all(tokensList.map(async (token) => {
					// Skip registry check for DOBA or tokens that already have fallback logos
					if (token.symbol.toLowerCase() === 'doba' || token.logoUrl) {
						return token
					}

					try {
						const registryRes = await fetch(`https://raw.githubusercontent.com/cardano-foundation/cardano-token-registry/master/mappings/${token.unit}.json`)
						if (registryRes.ok) {
							const regData = await registryRes.json()
							if (regData?.logo?.value) {
								return {
									...token,
									logoUrl: `data:image/png;base64,${regData.logo.value}`
								}
							}
						}
					} catch (e) {
						console.log(`Failed to fetch logo for ${token.symbol} from registry:`, e)
					}
					return token
				}))
				setCustomTokens(updatedTokens)
			} catch (e) {
				console.error('Failed to update background logos:', e)
			}
		}

		async function fetchAssets() {
			if (!isConnected || !address) {
				setLoading(false)
				return
			}
			setLoading(true)

			try {
				// 1. Fetch ADA balance and custom tokens from wallet
				if (lucid) {
					const wallet = typeof lucid.wallet === 'function' ? lucid.wallet() : lucid.wallet
					let utxos: any[] = []
					let lovelace = 0n

					if (wallet && typeof wallet.getUtxos === 'function') {
						utxos = (await wallet.getUtxos()) || []
						lovelace = utxos.reduce(
							(total: bigint, utxo: { assets?: { lovelace?: bigint } }) => total + (utxo.assets?.lovelace ?? 0n),
							0n
						)
					} else if (wallet && typeof wallet.getLovelace === 'function') {
						lovelace = BigInt(await wallet.getLovelace())
						if (typeof lucid.utxosAt === 'function') {
							utxos = (await lucid.utxosAt(address)) || []
						}
					} else if (typeof lucid.utxosAt === 'function') {
						utxos = (await lucid.utxosAt(address)) || []
						lovelace = utxos.reduce(
							(total: bigint, utxo: { assets?: { lovelace?: bigint } }) => total + (utxo.assets?.lovelace ?? 0n),
							0n
						)
					} else {
						throw new Error('No supported wallet balance method found on Lucid instance')
					}

					setAdaBalance(Number(lovelace) / 1000000)

					const aggregatedBalances: Record<string, bigint> = {}
					for (const utxo of utxos) {
						if (!utxo.assets) continue
						for (const [unit, qty] of Object.entries(utxo.assets)) {
							if (unit === 'lovelace') continue
							aggregatedBalances[unit] = (aggregatedBalances[unit] || 0n) + BigInt(qty as any)
						}
					}

					const parsedTokens: TokenAsset[] = Object.entries(aggregatedBalances).map(([unit, qty]) => {
						const policyId = unit.slice(0, 56)
						const assetNameHex = unit.slice(56)
						const symbol = hexToString(assetNameHex)
						const tokenSymbolLower = symbol.toLowerCase()
						const known = KNOWN_TOKENS[tokenSymbolLower]

						const decimals = known ? known.decimals : 0
						const price = known ? known.price : 0
						const name = known ? known.name : `${symbol} Token`
						const balance = Number(qty) / Math.pow(10, decimals)
						const usdValue = balance * price
						const logoUrl = known?.fallbackLogo

						return {
							unit,
							policyId,
							name,
							symbol,
							balance,
							usdValue,
							price,
							logoUrl
						}
					})

					// Render tokens and balances immediately
					setCustomTokens(parsedTokens)

					// Fetch logos from the GitHub registry in the background
					fetchRegistryLogos(parsedTokens)
				}

				// 2. Fetch owned music NFTs from the backend
				const authData = typeof window !== 'undefined' ? localStorage.getItem('doba_auth_data') : null
				const headers: Record<string, string> = {}
				if (authData) {
					const parsedAuth = JSON.parse(authData)
					if (parsedAuth && parsedAuth.accessToken) {
						headers['Authorization'] = `Bearer ${parsedAuth.accessToken}`
					}
				}

				const res = await fetch('/api-backend/songs', { headers })
				if (res.ok) {
					const allTracks: Track[] = await res.json()
					const owned = allTracks.filter(t => t.is_owned)
					setOwnedNfts(owned)
				}

				// 3. Try to fetch real-time ADA price from CoinGecko
				try {
					const priceRes = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=cardano&vs_currencies=usd')
					if (priceRes.ok) {
						const priceData = await priceRes.json()
						if (priceData?.cardano?.usd) {
							setAdaPrice(priceData.cardano.usd)
						}
					}
				} catch (e) {
					console.log('Failed to fetch real-time ADA price, using fallback.')
				}

			} catch (err) {
				console.error('AssetsView: Error fetching assets', err)
			} finally {
				setLoading(false)
			}
		}

		fetchAssets()
	}, [isConnected, address, lucid])

	// Calculate portfolio values
	const adaUsdValue = adaBalance * adaPrice
	const tokensUsdValue = customTokens.reduce((acc, token) => acc + token.usdValue, 0)
	const nftUsdValue = ownedNfts.reduce((acc, track) => {
		const priceInADA = parseFloat(track.price || '5')
		return acc + (priceInADA * adaPrice)
	}, 0)

	const totalUsdValue = adaUsdValue + tokensUsdValue + nftUsdValue

	if (!isConnected) {
		return (
			<div className="border border-midnight/[0.08] dark:border-white/[0.08] p-12 text-center bg-[#FAF9F6] dark:bg-[#0D0D12]/60 rounded-none">
				<div className="w-16 h-16 mx-auto mb-6 bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-[#B794F4] rounded-none">
					<IconWallet size={32} />
				</div>
				<h3 className="text-xl font-display font-bold mb-2">Connect Wallet</h3>
				<p className="text-midnight/50 dark:text-white/50 text-sm max-w-sm mx-auto mb-6">
					Connect your Cardano wallet to view your asset balances, custom tokens, and collected NFTs.
				</p>
			</div>
		)
	}

	return (
		<div className="space-y-8 animate-fade-in">
			{/* Portfolio Balance Header */}
			<div className="border border-midnight/[0.08] dark:border-white/[0.08] p-6 lg:p-8 bg-[#FAF9F6] dark:bg-[#0D0D12]/60 rounded-none relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
				<div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-cyber-pink via-purple-500 to-transparent" />
				<div>
					<span className="text-midnight/70 dark:text-white/40 text-xs uppercase tracking-widest font-display font-bold">Total Portfolio Worth</span>
					<h3 className="text-4xl font-bold text-midnight dark:text-white mt-1 font-mono">${totalUsdValue.toFixed(2)} <span className="text-sm font-sans font-normal text-midnight/70 dark:text-white/40">USD</span></h3>
					<p className="text-[10px] text-midnight/60 dark:text-white/30 uppercase tracking-widest font-display font-bold mt-2">
						Real-Time Aggregated Balance (FT + NFT)
					</p>
				</div>
				
				<div className="flex gap-3">
					<div className="bg-white/[0.03] border border-midnight/10 dark:border-white/10 px-4 py-3 rounded-none flex items-center gap-3">
						<div className="w-8 h-8 rounded-none bg-[#FF1F8A]/10 flex items-center justify-center text-[#FF1F8A]">
							<IconCoins size={18} />
						</div>
						<div>
							<p className="text-[10px] text-midnight/70 dark:text-white/40 uppercase font-display font-bold leading-none mb-1">Tokens Worth</p>
							<p className="font-mono text-sm font-bold text-midnight dark:text-white">${(adaUsdValue + tokensUsdValue).toFixed(2)}</p>
						</div>
					</div>

					<div className="bg-white/[0.03] border border-midnight/10 dark:border-white/10 px-4 py-3 rounded-none flex items-center gap-3">
						<div className="w-8 h-8 rounded-none bg-[#B794F4]/10 flex items-center justify-center text-[#B794F4]">
							<IconMusic size={18} />
						</div>
						<div>
							<p className="text-[10px] text-midnight/70 dark:text-white/40 uppercase font-display font-bold leading-none mb-1">NFTs Worth</p>
							<p className="font-mono text-sm font-bold text-midnight dark:text-white">${nftUsdValue.toFixed(2)}</p>
						</div>
					</div>
				</div>
			</div>

			{/* Tab Switcher */}
			<div className="flex border-b border-midnight/[0.08] dark:border-white/[0.08] gap-6">
				<button
					onClick={() => setActiveTab('tokens')}
					className={`pb-4 text-sm font-display font-bold uppercase tracking-wider transition-all relative ${
						activeTab === 'tokens' ? 'text-midnight dark:text-white' : 'text-midnight/70 dark:text-white/40 hover:text-midnight dark:hover:text-white'
					}`}
				>
					Fungible Tokens
					{activeTab === 'tokens' && (
						<div className="absolute bottom-0 left-0 w-full h-[2px] bg-cyber-pink" />
					)}
				</button>
				<button
					onClick={() => setActiveTab('nfts')}
					className={`pb-4 text-sm font-display font-bold uppercase tracking-wider transition-all relative ${
						activeTab === 'nfts' ? 'text-midnight dark:text-white' : 'text-midnight/70 dark:text-white/40 hover:text-midnight dark:hover:text-white'
					}`}
				>
					Non-Fungible Tokens ({ownedNfts.length})
					{activeTab === 'nfts' && (
						<div className="absolute bottom-0 left-0 w-full h-[2px] bg-cyber-pink" />
					)}
				</button>
			</div>

			{loading ? (
				<div className="p-12 text-center">
					<div className="w-8 h-8 border-2 border-[#FF1F8A] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
					<p className="text-midnight/70 dark:text-white/40 text-sm italic">Loading your portfolio assets...</p>
				</div>
			) : activeTab === 'tokens' ? (
				/* Fungible Tokens List */
				<div className="border border-midnight/[0.08] dark:border-white/[0.08] rounded-none overflow-hidden bg-[#FAF9F6] dark:bg-[#0D0D12]/60">
					<div className="divide-y divide-white/[0.08]">
						{/* ADA */}
						<div className="p-5 flex items-center justify-between hover:bg-midnight/5 dark:hover:bg-white/5 transition">
							<div className="flex items-center gap-4">
								<div className="w-10 h-10 rounded-none bg-midnight/5 dark:bg-white/5 border border-midnight/10 dark:border-white/10 flex items-center justify-center font-display font-bold text-midnight dark:text-white text-sm uppercase overflow-hidden">
									<img src="https://assets.coingecko.com/coins/images/975/large/cardano.png" alt="ADA" className="w-full h-full object-cover p-1.5" />
								</div>
								<div>
									<h4 className="font-display font-bold text-midnight dark:text-white">ADA</h4>
									<p className="text-xs text-midnight/70 dark:text-white/40 font-mono">Cardano Native Asset</p>
								</div>
							</div>
							<div className="text-right">
								<p className="font-bold font-mono text-midnight dark:text-white">{adaBalance.toFixed(2)} ADA</p>
								<p className="text-xs text-midnight/70 dark:text-white/40 font-mono">${adaUsdValue.toFixed(2)} USD</p>
							</div>
						</div>

						{/* Custom Tokens */}
						{customTokens.length > 0 ? (
							customTokens.map((token) => (
								<div key={token.unit} className="p-5 flex items-center justify-between hover:bg-midnight/5 dark:hover:bg-white/5 transition">
									<div className="flex items-center gap-4">
										<div className="w-10 h-10 rounded-none bg-midnight/5 dark:bg-white/5 border border-midnight/10 dark:border-white/10 flex items-center justify-center font-display font-bold text-midnight dark:text-white text-sm uppercase overflow-hidden">
											{token.symbol === 'DOBA' ? (
												<DobaVisualizer className="text-[#FF1F8A] w-6 h-6 animate-pulse" />
											) : token.logoUrl ? (
												<img src={token.logoUrl} alt={token.symbol} className="w-full h-full object-cover" />
											) : (
												token.symbol.slice(0, 2)
											)}
										</div>
										<div>
											<h4 className="font-display font-bold text-midnight dark:text-white">{token.symbol}</h4>
											<p className="text-xs text-midnight/70 dark:text-white/40 font-mono truncate max-w-[200px]" title={token.name}>
												{token.name}
											</p>
										</div>
									</div>
									<div className="text-right">
										<p className="font-bold font-mono text-midnight dark:text-white">
											{token.balance.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 6 })} {token.symbol}
										</p>
										<p className="text-xs text-midnight/70 dark:text-white/40 font-mono">
											{token.price > 0 ? `$${token.usdValue.toFixed(2)} USD` : '-'}
										</p>
									</div>
								</div>
							))
						) : (
							<div className="p-8 text-center text-midnight/70 dark:text-white/40 text-sm">
								No custom fungible tokens found in this wallet.
							</div>
						)}
					</div>
				</div>
			) : (
				/* Non-Fungible Tokens (Music NFTs) Grid */
				ownedNfts.length > 0 ? (
					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
						{ownedNfts.map((nft) => (
							<div key={nft.token_id} className="border border-midnight/[0.08] dark:border-white/[0.08] bg-[#FAF9F6] dark:bg-[#0D0D12]/60 rounded-none overflow-hidden hover:border-midnight/20 dark:hover:border-white/20 transition group">
								<div className="aspect-square w-full relative overflow-hidden bg-midnight/5 dark:bg-white/5 border-b border-white/5">
									<img
										src={nft.image_url.replace('ipfs://', 'https://gateway.pinata.cloud/ipfs/')}
										alt={nft.name}
										className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
									/>
									<div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md border border-midnight/10 dark:border-white/10 px-2 py-0.5 rounded-none text-[10px] font-mono text-midnight/80 dark:text-white/80">
										ID #{nft.token_id}
									</div>
								</div>
								<div className="p-4 space-y-2">
									<div>
										<h4 className="font-display font-bold text-midnight dark:text-white truncate">{nft.name}</h4>
										<p className="text-xs text-midnight/50 dark:text-white/50 truncate">by {nft.artist}</p>
									</div>
									<div className="flex justify-between items-center pt-2 border-t border-white/5">
										<span className="text-[10px] text-midnight/60 dark:text-white/30 uppercase tracking-widest font-display font-bold">EST. WORTH</span>
										<span className="font-mono text-sm font-bold text-cyber-pink">${(parseFloat(nft.price || '5') * adaPrice).toFixed(2)} USD</span>
									</div>
								</div>
							</div>
						))}
					</div>
				) : (
					<div className="border border-midnight/[0.08] dark:border-white/[0.08] p-12 text-center bg-[#FAF9F6] dark:bg-[#0D0D12]/60 rounded-none">
						<IconPhoto className="w-12 h-12 mx-auto mb-4 text-midnight/50 dark:text-white/20" />
						<h4 className="text-lg font-display font-bold mb-1">No NFTs Found</h4>
						<p className="text-midnight/70 dark:text-white/40 text-sm max-w-xs mx-auto">
							You don't own any music NFTs yet. Head over to the Marketplace to buy and collect tracks!
						</p>
					</div>
				)
			)}
		</div>
	)
}
