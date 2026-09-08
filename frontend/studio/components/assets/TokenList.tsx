'use client'

import { AdaRow } from './AdaRow'
import { TokenRow } from './TokenRow'
import type { TokenAsset } from './AssetsView.types'

interface TokenListProps {
  adaBalance: number
  adaUsdValue: number
  tokens: TokenAsset[]
}

export function TokenList({ adaBalance, adaUsdValue, tokens }: TokenListProps) {
  return (
    <div className="glass-surface rounded-2xl overflow-hidden shadow-lg">
      <div className="divide-y divide-midnight/[0.06] dark:divide-white/[0.06]">
        <AdaRow balance={adaBalance} usdValue={adaUsdValue} />
        {tokens.length > 0 ? (
          tokens.map(token => <TokenRow key={token.unit} token={token} />)
        ) : (
          <div className="p-8 text-center text-midnight/70 dark:text-white/40 text-sm">
            No other tokens found in this wallet.
          </div>
        )}
      </div>
    </div>
  )
}
