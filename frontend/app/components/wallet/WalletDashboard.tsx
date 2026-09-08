'use client'

import { useCardano } from '@/components/Providers'
import { WalletActions } from '@/components/profile/WalletActions'
import { useAssets } from '@/components/assets/useAssets'
import { AssetsConnectPrompt } from '@/components/assets/AssetsConnectPrompt'
import { useArtistMode } from '@/components/dashboard/useArtistMode'
import { WalletBalanceCard } from './WalletBalanceCard'
import { WalletRecentNfts } from './WalletRecentNfts'

export function WalletDashboard() {
  const { address, isConnected, lucid } = useCardano()
  const artistMode = useArtistMode()
  const { adaBalance, adaPrice, ownedNfts, loading } = useAssets(address, isConnected, lucid)

  if (!isConnected) {
    return <AssetsConnectPrompt />
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <WalletBalanceCard
        address={address}
        balance={adaBalance}
        price={adaPrice}
        loading={loading}
      />
      <WalletActions artistMode={artistMode} />
      <WalletRecentNfts nfts={ownedNfts.slice(0, 4)} loading={loading} />
    </div>
  )
}
