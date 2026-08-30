export const DIRECT_BACKEND_URL = (
  process.env.NEXT_PUBLIC_DIRECT_API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  'https://bookish-worm-production.up.railway.app'
).replace(/\/$/, '')

export const API_URL = '/api-backend'
export const DEFAULT_PRICE = '10'
export const DEFAULT_SUPPLY = '5000'
export const DEFAULT_ROYALTY = '5'
export const DEFAULT_DURATION = 'PT3M45S'
export const MINIMUM_BALANCE_LOVELACE = 2000000n
