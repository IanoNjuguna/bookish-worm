import { BlockFrostAPI } from '@blockfrost/blockfrost-js'
import { logger } from './lib/logger'
import { getTrack } from './database'

// ─── Blockfrost Client ────────────────────────────────────────────────────────

let apiInstance: BlockFrostAPI | null = null

function getBlockfrostApi(): BlockFrostAPI {
	if (apiInstance) return apiInstance
	const projectId = process.env.BLOCKFROST_PROJECT_ID
	if (!projectId) {
		throw new Error('BLOCKFROST_PROJECT_ID is missing')
	}
	const network = projectId.startsWith('mainnet')
		? 'mainnet'
		: projectId.startsWith('preview')
		? 'preview'
		: projectId.startsWith('preprod')
		? 'preprod'
		: 'mainnet'
	apiInstance = new BlockFrostAPI({ projectId, network })
	return apiInstance
}

// ─── Koios Fallback Client ────────────────────────────────────────────────────
// Koios is a free, community-run Cardano API — no key required.
// Used as a failover when Blockfrost returns 429 or 5xx errors.

const IS_MAINNET = process.env.NEXT_PUBLIC_CARDANO_NETWORK?.toLowerCase() === 'mainnet'
  || process.env.CARDANO_NETWORK?.toLowerCase() === 'mainnet'

const KOIOS_BASE = IS_MAINNET
	? 'https://api.koios.rest/api/v1'
	: 'https://preprod.koios.rest/api/v1'

async function koiosGetAddressAssets(address: string): Promise<{ unit: string; quantity: string }[]> {
	const res = await fetch(`${KOIOS_BASE}/address_assets?_address=${encodeURIComponent(address)}`, {
		headers: { 'Accept': 'application/json' }
	})
	if (!res.ok) throw new Error(`Koios address_assets failed: ${res.status}`)
	const data: any[] = await res.json()
	// Koios returns [{ address, asset_list: [{ policy_id, asset_name, quantity }] }]
	const assets: { unit: string; quantity: string }[] = []
	for (const row of data) {
		for (const a of (row.asset_list || [])) {
			assets.push({ unit: `${a.policy_id}${a.asset_name}`, quantity: String(a.quantity) })
		}
	}
	return assets
}

async function koiosGetStakeAssets(stakeAddress: string): Promise<{ unit: string; quantity: string }[]> {
	const res = await fetch(`${KOIOS_BASE}/account_assets?_stake_address=${encodeURIComponent(stakeAddress)}`, {
		headers: { 'Accept': 'application/json' }
	})
	if (!res.ok) throw new Error(`Koios account_assets failed: ${res.status}`)
	const data: any[] = await res.json()
	const assets: { unit: string; quantity: string }[] = []
	for (const row of data) {
		for (const a of (row.asset_list || [])) {
			assets.push({ unit: `${a.policy_id}${a.asset_name}`, quantity: String(a.quantity) })
		}
	}
	return assets
}

// ─── Ownership Verification ───────────────────────────────────────────────────

export async function verifyOwnershipOnChain(userAddress: string, tokenId: number): Promise<boolean> {
	const projectId = process.env.BLOCKFROST_PROJECT_ID || ''
	if (!projectId) {
		logger.warn('Blockfrost project ID is not configured.')
		return false
	}

	try {
		const track = await getTrack(tokenId)
		if (!track) {
			logger.warn(`verifyOwnershipOnChain: Track ${tokenId} not found in database.`)
			return false
		}

		const policyId = track.splitter
		if (!policyId) {
			logger.warn(`verifyOwnershipOnChain: Policy ID (splitter) missing for track ${tokenId}.`)
			return false
		}

		const targetTokenId = track.album_id ? Number(track.album_id) : tokenId

		// CIP-68 fractional token: label 444 prefix + token name
		const tokenNameStr = track.ticker
			? track.ticker.toUpperCase().replace(/[^A-Z0-9]/g, "")
			: 'T' + String(targetTokenId).slice(-11)
		const assetNameHex = Buffer.from(tokenNameStr).toString('hex')
		const assetUnit = policyId + '001bc280' + assetNameHex

		// ── Try Blockfrost first ──────────────────────────────────────────────
		try {
			const api = getBlockfrostApi()

			if (userAddress.startsWith('stake')) {
				const assets = await api.accountsAddressesAssetsAll(userAddress)
				return assets.some(asset => asset.unit === assetUnit && Number(asset.quantity) > 0)
			} else {
				const addressInfo = await api.addresses(userAddress)
				const amount = addressInfo.amount || []
				return amount.some(item => item.unit === assetUnit && Number(item.quantity) > 0)
			}
		} catch (blockfrostErr: any) {
			const status = blockfrostErr?.status_code || blockfrostErr?.status || blockfrostErr?.statusCode
			// Only fall through to Koios on rate-limit (429) or server errors (5xx)
			if (status === 429 || (status >= 500 && status < 600)) {
				logger.warn(`[Blockfrost] ${status} error — falling back to Koios for address ${userAddress}`)
			} else {
				throw blockfrostErr // Re-throw unexpected errors (e.g. 400 bad address)
			}
		}

		// ── Koios fallback ────────────────────────────────────────────────────
		logger.info(`[Koios] Verifying ownership for ${userAddress} on track ${tokenId}`)
		let assets: { unit: string; quantity: string }[]

		if (userAddress.startsWith('stake')) {
			assets = await koiosGetStakeAssets(userAddress)
		} else {
			assets = await koiosGetAddressAssets(userAddress)
		}

		return assets.some(a => a.unit === assetUnit && Number(a.quantity) > 0)

	} catch (err) {
		logger.error(`Failed to verify ownership on-chain for ${userAddress} on track ${tokenId}`, err)
		return false
	}
}

export async function getRemainingFractionsOnChain(policyId: string, ticker: string, tokenId: number): Promise<number | null> {
	const projectId = process.env.BLOCKFROST_PROJECT_ID || ''
	if (!projectId) {
		logger.warn('Blockfrost project ID is not configured.')
		return null
	}

	const targetTokenId = tokenId
	const tokenNameStr = ticker
		? ticker.toUpperCase().replace(/[^A-Z0-9]/g, "")
		: 'T' + String(targetTokenId).slice(-11)
	const assetNameHex = Buffer.from(tokenNameStr).toString('hex')
	const assetUnit = policyId + '001bc280' + assetNameHex

	// Try Blockfrost first
	try {
		const api = getBlockfrostApi()
		const holders = await api.assetsAddresses(assetUnit)
		if (holders.length === 0) {
			return null
		}
		const scriptHolder = holders.find(h => h.address.startsWith('addr_test1w') || h.address.startsWith('addr1w'))
		if (scriptHolder) {
			return Number(scriptHolder.quantity)
		}
		return 0
	} catch (blockfrostErr: any) {
		const status = blockfrostErr?.status_code || blockfrostErr?.status || blockfrostErr?.statusCode
		if (status === 404) {
			// Asset not found / minted yet
			return null
		}
		if (status === 429 || (status >= 500 && status < 600)) {
			logger.warn(`[Blockfrost] ${status} error in getRemainingFractions — falling back to Koios`)
		} else {
			logger.error(`Blockfrost getRemainingFractions error:`, blockfrostErr)
			return null
		}
	}

	// Koios fallback
	try {
		logger.info(`[Koios] Getting remaining fractions for policy ${policyId}`)
		const label444NameHex = '001bc280' + assetNameHex
		const url = `${KOIOS_BASE}/asset_addresses?_asset_policy=${policyId}&_asset_name=${label444NameHex}`
		const res = await fetch(url, { headers: { 'Accept': 'application/json' } })
		if (!res.ok) {
			if (res.status === 404) return null
			throw new Error(`Koios asset_addresses failed: ${res.status}`)
		}
		const holders: any[] = await res.json()
		if (holders.length === 0) {
			return null
		}
		const scriptHolder = holders.find(h => h.payment_address?.startsWith('addr_test1w') || h.payment_address?.startsWith('addr1w'))
		if (scriptHolder) {
			return Number(scriptHolder.quantity)
		}
		return 0
	} catch (koiosErr) {
		logger.error(`Koios getRemainingFractions failed`, koiosErr)
		return null
	}
}

