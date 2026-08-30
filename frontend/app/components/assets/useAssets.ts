'use client'

import { useEffect, useState } from 'react'
import { API_URL, KNOWN_TOKENS } from './AssetsView.constants'
import { hexToString, fetchOnChainPricesAndQuantities } from './assets.helpers'
import type { Track, TokenAsset } from './AssetsView.types'

export interface UseAssetsReturn {
  adaBalance: number
  adaPrice: number
  customTokens: TokenAsset[]
  ownedNfts: Track[]
  loading: boolean
}

export function useAssets(address: string | null | undefined, isConnected: boolean, lucid: any): UseAssetsReturn {
  const [adaBalance, setAdaBalance] = useState(0)
  const [adaPrice, setAdaPrice] = useState(0.38)
  const [customTokens, setCustomTokens] = useState<TokenAsset[]>([])
  const [ownedNfts, setOwnedNfts] = useState<Track[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchRegistryLogos(tokensList: TokenAsset[]) {
      try {
        const updatedTokens = await Promise.all(
          tokensList.map(async (token) => {
            if (token.symbol.toLowerCase() === 'doba' || token.logoUrl) {
              return token
            }
            try {
              const registryRes = await fetch(`/api/token-logo?unit=${token.unit}`)
              if (registryRes.ok) {
                const regData = await registryRes.json()
                if (regData?.logoUrl) {
                  return { ...token, logoUrl: regData.logoUrl }
                }
              }
            } catch (e) {
              console.log(`Failed to fetch logo for ${token.symbol} from registry:`, e)
            }
            return token
          })
        )
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

            return { unit, policyId, name, symbol, balance, usdValue, price, logoUrl }
          })

          setCustomTokens(parsedTokens)
          fetchRegistryLogos(parsedTokens)
        }

        const authData = typeof window !== 'undefined' ? localStorage.getItem('doba_auth_data') : null
        const headers: Record<string, string> = {}
        if (authData) {
          const parsedAuth = JSON.parse(authData)
          if (parsedAuth && parsedAuth.accessToken) {
            headers['Authorization'] = `Bearer ${parsedAuth.accessToken}`
          }
        }

        const res = await fetch(`${API_URL.replace(/\/$/, '')}/songs`, { headers })
        if (res.ok) {
          const allTracks: Track[] = await res.json()
          const owned = allTracks.filter(t => t.is_owned)
          const updatedOwned = await fetchOnChainPricesAndQuantities(owned, aggregatedBalances, lucid)
          setOwnedNfts(updatedOwned)
        }

        try {
          const priceRes = await fetch(
            'https://api.coingecko.com/api/v3/simple/price?ids=cardano&vs_currencies=usd'
          )
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

  return { adaBalance, adaPrice, customTokens, ownedNfts, loading }
}
