'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLocale } from 'next-intl'
import { useCardano } from '@/components/Providers'
import { useAssets } from './assets/useAssets'
import { AssetsConnectPrompt } from './assets/AssetsConnectPrompt'
import { PortfolioHeader } from './assets/PortfolioHeader'
import { AssetsTabs } from './assets/AssetsTabs'
import { TokenList } from './assets/TokenList'
import { DobaTokenBanner } from './assets/DobaTokenBanner'
import { NftGrid } from './assets/NftGrid'
import { EmptyAssets } from './assets/EmptyAssets'
import { AssetsLoading } from './assets/AssetsLoading'
import type { TokenAsset } from './assets/AssetsView.types'

export default function AssetsView() {
  const router = useRouter()
  const locale = useLocale()
  const { address, isConnected, lucid } = useCardano()
  const [activeTab, setActiveTab] = useState<'tokens' | 'nfts'>('tokens')
  const { adaBalance, adaPrice, customTokens, ownedNfts, loading } = useAssets(address, isConnected, lucid)

  if (!isConnected) return <AssetsConnectPrompt />

  const dobaPolicies = new Set<string>(
    [process.env.NEXT_PUBLIC_MINTING_POLICY_ID, ...ownedNfts.map(t => t.splitter)].filter(
      (p): p is string => Boolean(p)
    )
  )
  const isDobaToken = (t: TokenAsset) => dobaPolicies.has(t.policyId) || t.symbol === 'DOBA'
  const cardanoTokens = customTokens.filter(t => !isDobaToken(t))
  const dobaToken = customTokens.find(t => t.symbol === 'DOBA')

  const adaUsdValue = adaBalance * adaPrice
  const tokensUsdValue = cardanoTokens.reduce((acc, token) => acc + token.usdValue, 0)
  const nftUsdValue = ownedNfts.reduce((acc, track) => {
    const unitPriceInADA = parseFloat(track.price || '5')
    const qty = track.quantity || 1
    return acc + unitPriceInADA * qty * adaPrice
  }, 0)
  const dobaUsdValue = nftUsdValue + (dobaToken?.usdValue || 0)
  const totalUsdValue = adaUsdValue + tokensUsdValue + dobaUsdValue

  return (
    <div className="space-y-8 animate-fade-in">
      <PortfolioHeader
        totalUsdValue={totalUsdValue}
        walletUsdValue={adaUsdValue + tokensUsdValue}
        dobaUsdValue={dobaUsdValue}
      />
      <AssetsTabs activeTab={activeTab} nftCount={ownedNfts.length} onChange={setActiveTab} />
      {loading ? (
        <AssetsLoading />
      ) : activeTab === 'tokens' ? (
        <TokenList adaBalance={adaBalance} adaUsdValue={adaUsdValue} tokens={cardanoTokens} />
      ) : dobaToken || ownedNfts.length > 0 ? (
        <>
          {dobaToken && <DobaTokenBanner token={dobaToken} />}
          <NftGrid
            nfts={ownedNfts}
            adaPrice={adaPrice}
            onSelect={tokenId => window.open(`https://app.doba.world/track/${tokenId}`, '_blank', 'noopener,noreferrer')}
          />
        </>
      ) : (
        <EmptyAssets onDiscover={() => router.push(`/${locale}`)} />
      )}
    </div>
  )
}
