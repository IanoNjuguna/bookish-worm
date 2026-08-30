export const API_URL = '/api-backend'

export function formatAddress(addr: string, short = false) {
  if (!addr || addr.length <= 19) return addr
  if (short) return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`
  return `${addr.substring(0, 10)}...${addr.substring(addr.length - 9)}`
}
