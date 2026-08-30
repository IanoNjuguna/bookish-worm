import { EXPLORER_URL } from '@/lib/config'
import { BlockchainDetailLink } from './BlockchainDetailLink'
import { BlockchainDetailRow } from './BlockchainDetailRow'
import { useBlockchainDetails } from './useBlockchainDetails'
import type { TrackBlockchainDetailsProps } from './TrackBlockchainDetails.types'

export function TrackBlockchainDetails({ track }: TrackBlockchainDetailsProps) {
  const { policyId, provenance } = useBlockchainDetails(track)

  return (
    <div id="blockchain-details-section" className="space-y-4 glass-surface rounded-2xl p-5 sm:p-6">
      <h2 className="text-xs font-bold uppercase tracking-widest text-midnight/40 dark:text-white/30">
        Blockchain Details
      </h2>
      <div className="space-y-5 pt-2">
        <BlockchainDetailRow label="Policy ID">
          {policyId ? (
            <BlockchainDetailLink href={`${EXPLORER_URL}/tokenPolicy/${policyId}`}>
              {policyId.slice(0, 10)}...{policyId.slice(-10)}
            </BlockchainDetailLink>
          ) : (
            <span className="text-xs text-midnight/40 dark:text-white/30 font-mono">N/A</span>
          )}
        </BlockchainDetailRow>

        <BlockchainDetailRow label="Creator Address">
          {track.uploader_address ? (
            <BlockchainDetailLink href={`${EXPLORER_URL}/address/${track.uploader_address}`}>
              {track.uploader_address.slice(0, 12)}...{track.uploader_address.slice(-10)}
            </BlockchainDetailLink>
          ) : (
            <span className="text-xs text-midnight/40 dark:text-white/30 font-mono">N/A</span>
          )}
        </BlockchainDetailRow>

        <BlockchainDetailRow label="Provenance">
          {provenance ? (
            <BlockchainDetailLink href={`${EXPLORER_URL}/token/${provenance.assetUnit}`}>
              {provenance.tokenName} (Reference NFT)
            </BlockchainDetailLink>
          ) : (
            <span className="text-xs text-midnight/40 dark:text-white/30 font-mono">N/A</span>
          )}
        </BlockchainDetailRow>

        <BlockchainDetailRow label="Token ID">
          {track.token_id !== undefined ? (
            <span className="text-xs text-pink-600 dark:text-cyber-pink font-mono block">#{track.token_id}</span>
          ) : (
            <span className="text-xs text-midnight/40 dark:text-white/30 font-mono">N/A</span>
          )}
        </BlockchainDetailRow>
      </div>
    </div>
  )
}
