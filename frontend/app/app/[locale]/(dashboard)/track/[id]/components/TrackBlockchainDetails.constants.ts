export const REFERENCE_NFT_ASSET_PREFIX = '000643b0'

export function toHex(str: string): string {
  return Array.from(str)
    .map(c => c.charCodeAt(0).toString(16).padStart(2, '0'))
    .join('')
}
