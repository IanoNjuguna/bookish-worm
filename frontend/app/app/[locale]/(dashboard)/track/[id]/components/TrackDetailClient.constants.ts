export const API_URL = '/api-backend'

export function formatTokenId(id: string | number) {
  const s = String(id)
  if (s.length <= 10) return s
  return `${s.slice(0, 4)}...${s.slice(-4)}`
}
