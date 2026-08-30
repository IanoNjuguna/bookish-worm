import type { Track } from './TrackDetailClient.types'
import { REFERENCE_NFT_ASSET_PREFIX, toHex } from './TrackBlockchainDetails.constants'
import type { ProvenanceAsset, UseBlockchainDetailsReturn } from './TrackBlockchainDetails.types'

export function useBlockchainDetails(track: Track): UseBlockchainDetailsReturn {
  const policyId = track.splitter || process.env.NEXT_PUBLIC_MINTING_POLICY_ID
  const provenancePolicyId = track.splitter

  let provenance: ProvenanceAsset | null = null
  if (provenancePolicyId) {
    const targetTokenId = track.album_id ? track.album_id : track.token_id
    const tokenName = track.ticker
      ? track.ticker.toUpperCase().replace(/[^A-Z0-9]/g, '')
      : 'T' + String(targetTokenId).slice(-11)
    const assetUnit = provenancePolicyId + REFERENCE_NFT_ASSET_PREFIX + toHex(tokenName)
    provenance = { tokenName, assetUnit }
  }

  return { policyId, provenance }
}
