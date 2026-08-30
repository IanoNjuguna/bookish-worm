import type { BlockchainDetailLinkProps } from './TrackBlockchainDetails.types'

export function BlockchainDetailLink({ href, children }: BlockchainDetailLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="text-xs text-pink-600 dark:text-cyber-pink hover:underline font-mono block truncate"
    >
      {children}
    </a>
  )
}
