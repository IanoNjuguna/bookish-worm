export const API_URL = '/api-backend'

export const DEFAULT_MAX_SUPPLY = 5000

export const formatTokenId = (id: string | number) => {
  const s = String(id)
  if (s.length <= 10) return s
  return `${s.slice(0, 4)}...${s.slice(-4)}`
}

export const resolveIpfs = (url: string) =>
  (url || '').replace('ipfs://', process.env.NEXT_PUBLIC_IPFS_GATEWAY || 'https://gateway.pinata.cloud/ipfs/')
