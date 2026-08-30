export const API_URL = '/api-backend'

export interface KnownToken {
  symbol: string
  decimals: number
  price: number
  name: string
  fallbackLogo?: string
}

export const KNOWN_TOKENS: Record<string, KnownToken> = {
  doba: { symbol: 'DOBA', decimals: 0, price: 0.05, name: 'Doba Ecosystem Token' },
  usdc: {
    symbol: 'USDC',
    decimals: 6,
    price: 1.0,
    name: 'USD Coin (Bridge Asset)',
    fallbackLogo: 'https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png',
  },
  hosky: {
    symbol: 'HOSKY',
    decimals: 0,
    price: 0.00000096,
    name: 'Hosky Meme Coin',
    fallbackLogo: 'https://assets.coingecko.com/coins/images/22812/large/hosky.png',
  },
}
