'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLocale } from 'next-intl'
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
	quantity?: number
	supply?: string | number
	uploader_address?: string
	ticker?: string
	album_id?: number | null
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

async function fetchOnChainPricesAndQuantities(
	ownedTracks: Track[],
	userUtxoBalances: Record<string, bigint>,
	lucidInstance: any
): Promise<Track[]> {
	try {
		const { Data } = await import('@lucid-evolution/lucid')

		const updated = await Promise.all(ownedTracks.map(async (track) => {
			let activePrice = parseFloat(track.price || '5')
			let ownedQty = track.quantity || 1

			// 1. Check exact quantity owned in user's wallet UTXOs
			if (userUtxoBalances && Object.keys(userUtxoBalances).length > 0) {
				for (const [unit, qty] of Object.entries(userUtxoBalances)) {
					const assetNameHex = unit.slice(56)
					// Check CIP-68 label 444 hex prefix "001bc280"
					if (assetNameHex.startsWith('001bc280')) {
						const tokenNameStr = hexToString(assetNameHex.slice(8))
						const expectedTokenName = track.ticker
							? track.ticker.toUpperCase().replace(/[^A-Z0-9]/g, "")
							: "T" + String(track.album_id ? track.album_id : track.token_id).slice(-11)

						if (tokenNameStr === expectedTokenName && qty > 0n) {
							ownedQty = Number(qty)
						}
					}
				}
			}

			// 2. Fetch live active price from distribution contract datum on-chain
			if (lucidInstance && track.uploader_address && !track.uploader_address.startsWith('stake')) {
				try {
					const { getContractAddresses } = await import('@/lib/contractHelper')
					const { dAddress, mintCS } = await getContractAddresses(track.uploader_address)

					const tokenNameStr = track.ticker
						? track.ticker.toUpperCase().replace(/[^A-Z0-9]/g, "")
						: "T" + String(track.album_id ? track.album_id : track.token_id).slice(-11)

					const { fromText, toUnit } = await import('@lucid-evolution/lucid')
					const tokenName = fromText(tokenNameStr)
					const fracUnit = toUnit(mintCS, tokenName, 444)

					const utxos = await lucidInstance.utxosAtWithUnit(dAddress, fracUnit)
					if (utxos && utxos.length > 0 && utxos[0].datum) {
						const decoded = Data.from(utxos[0].datum)
						if (decoded && typeof decoded === "object" && "fields" in decoded) {
							const fields = (decoded as any).fields
							if (fields && fields.length > 0 && typeof fields[0] === "bigint") {
								activePrice = Number(fields[0]) / 1000000
							}
						}
					}
				} catch (e) {
					// Fallback to database price
				}
			}

			return {
				...track,
				price: String(activePrice),
				quantity: ownedQty
			}
		}))

		return updated
	} catch (e) {
		return ownedTracks
	}
}

export default function AssetsView() {
	const router = useRouter()
	const locale = useLocale()
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
						const registryRes = await fetch(`/api/token-logo?unit=${token.unit}`)
						if (registryRes.ok) {
							const regData = await registryRes.json()
							if (regData?.logoUrl) {
								return {
									...token,
									logoUrl: regData.logoUrl
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
				let aggregatedBalances: Record<string, bigint> = {}

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
					const updatedOwned = await fetchOnChainPricesAndQuantities(owned, aggregatedBalances, lucid)
					setOwnedNfts(updatedOwned)
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
		const unitPriceInADA = parseFloat(track.price || '5')
		const qty = track.quantity || 1
		return acc + (unitPriceInADA * qty * adaPrice)
	}, 0)

	const totalUsdValue = adaUsdValue + tokensUsdValue + nftUsdValue

	if (!isConnected) {
		return (
			<div className="border border-midnight/[0.08] dark:border-white/[0.08] p-12 text-center bg-[#FAF9F6] dark:bg-[#0D0D12]/60 rounded-2xl shadow-xl">
				<div className="w-16 h-16 mx-auto mb-6 bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-[#B794F4] rounded-2xl">
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
			<div className="border border-midnight/[0.08] dark:border-white/[0.08] p-6 lg:p-8 bg-[#FAF9F6] dark:bg-[#0D0D12]/60 rounded-2xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
				<div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-cyber-pink via-purple-500 to-transparent" />
				<div>
					<span className="text-midnight/70 dark:text-white/40 text-xs uppercase tracking-widest font-display font-bold">Total Portfolio Worth</span>
					<h3 className="text-4xl font-bold text-midnight dark:text-white mt-1 font-mono">${totalUsdValue.toFixed(2)} <span className="text-sm font-sans font-normal text-midnight/70 dark:text-white/40">USD</span></h3>
					<p className="text-[10px] text-midnight/60 dark:text-white/30 uppercase tracking-widest font-display font-bold mt-2">
						Real-Time Aggregated Balance (FT + NFT)
					</p>
				</div>
				
				<div className="flex gap-3">
					<div className="bg-white/[0.03] border border-midnight/10 dark:border-white/10 px-4 py-3 rounded-xl flex items-center gap-3">
						<div className="w-8 h-8 rounded-lg bg-[#FF1F8A]/10 flex items-center justify-center text-[#FF1F8A]">
							<IconCoins size={18} />
						</div>
						<div>
							<p className="text-[10px] text-midnight/70 dark:text-white/40 uppercase font-display font-bold leading-none mb-1">Tokens Worth</p>
							<p className="font-mono text-sm font-bold text-midnight dark:text-white">${(adaUsdValue + tokensUsdValue).toFixed(2)}</p>
						</div>
					</div>

					<div className="bg-white/[0.03] border border-midnight/10 dark:border-white/10 px-4 py-3 rounded-xl flex items-center gap-3">
						<div className="w-8 h-8 rounded-lg bg-[#B794F4]/10 flex items-center justify-center text-[#B794F4]">
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
					Song Tokens ({ownedNfts.length})
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
				<div className="border border-midnight/[0.08] dark:border-white/[0.08] rounded-2xl overflow-hidden bg-[#FAF9F6] dark:bg-[#0D0D12]/60 shadow-lg">
					<div className="divide-y divide-white/[0.08]">
						{/* ADA */}
						<div className="p-5 flex items-center justify-between hover:bg-midnight/5 dark:hover:bg-white/5 transition">
							<div className="flex items-center gap-4">
								<div className="w-10 h-10 rounded-full bg-midnight/5 dark:bg-white/5 border border-midnight/10 dark:border-white/10 flex items-center justify-center font-display font-bold text-midnight dark:text-white text-sm uppercase overflow-hidden">
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
										<div className="w-10 h-10 rounded-full bg-midnight/5 dark:bg-white/5 border border-midnight/10 dark:border-white/10 flex items-center justify-center font-display font-bold text-midnight dark:text-white text-sm uppercase overflow-hidden">
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
					<div className="space-y-3 sm:space-y-0 sm:grid sm:grid-cols-2 md:grid-cols-3 sm:gap-6">
						{ownedNfts.map((nft) => {
							const unitPrice = parseFloat(nft.price || '5')
							const qty = nft.quantity || 1
							const supply = Number(nft.supply || 1000)
							const holdingsAda = unitPrice * qty
							const holdingsUsd = holdingsAda * adaPrice
							const marketCapAda = unitPrice * supply
							const marketCapUsd = marketCapAda * adaPrice

							return (
								<div key={nft.token_id}>
									{/* Mobile List Row (visible only on mobile) */}
									<div 
										onClick={() => router.push(`/${locale}/track/${nft.token_id}`)}
										className="flex sm:hidden items-center justify-between p-3 bg-[#FAF9F6] dark:bg-[#0D0D12]/60 border border-midnight/[0.08] dark:border-white/[0.08] rounded-xl hover:border-cyber-pink/50 transition cursor-pointer active:scale-[0.98]"
									>
										<div className="flex items-center gap-3 min-w-0">
											<div className="w-12 h-12 relative rounded-lg overflow-hidden bg-midnight/5 dark:bg-white/5 flex-shrink-0">
												<img
													src={nft.image_url.replace('ipfs://', process.env.NEXT_PUBLIC_IPFS_GATEWAY || 'https://gateway.pinata.cloud/ipfs/')}
													alt={nft.name}
													className="w-full h-full object-cover"
												/>
												<div className="absolute -bottom-1 -right-1 bg-cyber-pink px-1 py-0.5 rounded text-[8px] font-mono font-bold text-white leading-none scale-90">
													x{qty}
												</div>
											</div>
											<div className="min-w-0">
												<h4 className="font-display font-bold text-sm text-midnight dark:text-white truncate">{nft.name}</h4>
												<p className="text-[10px] text-midnight/50 dark:text-white/50 truncate">by {nft.artist}</p>
											</div>
										</div>
										<div className="text-right flex-shrink-0 pl-2">
											<div className="font-mono font-bold text-xs text-cyber-pink">${holdingsUsd.toFixed(2)}</div>
											<div className="text-[9px] text-midnight/40 dark:text-white/40 font-mono">({holdingsAda.toFixed(1)} ADA)</div>
										</div>
									</div>

									{/* Desktop Card (visible only on sm screens and up) */}
									<div
										onClick={() => router.push(`/${locale}/track/${nft.token_id}`)}
										className="hidden sm:flex flex-col justify-between h-full border border-midnight/[0.08] dark:border-white/[0.08] bg-[#FAF9F6] dark:bg-[#0D0D12]/60 rounded-xl overflow-hidden hover:border-cyber-pink/50 transition cursor-pointer group shadow-md hover:shadow-xl"
									>
										<div>
											<div className="aspect-square w-full relative overflow-hidden bg-midnight/5 dark:bg-white/5 border-b border-midnight/5 dark:border-white/5">
												<img
													src={nft.image_url.replace('ipfs://', process.env.NEXT_PUBLIC_IPFS_GATEWAY || 'https://gateway.pinata.cloud/ipfs/')}
													alt={nft.name}
													className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
												/>
												<div className="absolute top-3 left-3 bg-cyber-pink/90 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-mono font-bold text-white shadow">
													{qty} {qty === 1 ? 'Fraction' : 'Fractions'}
												</div>
												<div className="absolute top-3 right-3 bg-black/70 backdrop-blur-md border border-white/10 px-2 py-0.5 rounded text-[10px] font-mono text-white/80">
													ID #{nft.token_id}
												</div>
											</div>
											<div className="p-4 space-y-3">
												<div>
													<h4 className="font-display font-bold text-midnight dark:text-white truncate group-hover:text-cyber-pink transition-colors">{nft.name}</h4>
													<p className="text-xs text-midnight/50 dark:text-white/50 truncate">by {nft.artist}</p>
												</div>

												<div className="space-y-2 pt-3 border-t border-midnight/10 dark:border-white/10">
													<div className="flex justify-between items-center text-xs">
														<span className="text-[10px] text-midnight/60 dark:text-white/40 uppercase tracking-widest font-display font-bold">YOUR HOLDINGS</span>
														<span className="font-mono font-bold text-cyber-pink">${holdingsUsd.toFixed(2)} USD <span className="text-[10px] text-midnight/40 dark:text-white/40 font-normal font-mono">({holdingsAda.toFixed(1)} ADA)</span></span>
													</div>
													<div className="flex justify-between items-center text-xs">
														<span className="text-[10px] text-midnight/60 dark:text-white/40 uppercase tracking-widest font-display font-bold">SONG MARKET CAP</span>
														<span className="font-mono font-semibold text-midnight/70 dark:text-white/70">${marketCapUsd.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD</span>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							)
						})}
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
