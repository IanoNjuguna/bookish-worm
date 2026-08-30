import type React from 'react'
import type { Track } from './TrackDetailClient.types'

export interface TrackBlockchainDetailsProps {
  track: Track
}

export interface ProvenanceAsset {
  tokenName: string
  assetUnit: string
}

export interface UseBlockchainDetailsReturn {
  policyId: string | undefined
  provenance: ProvenanceAsset | null
}

export interface BlockchainDetailRowProps {
  label: string
  children: React.ReactNode
}

export interface BlockchainDetailLinkProps {
  href: string
  children: React.ReactNode
}
