import type { Track } from './AssetsView.types'

export function hexToString(hex: string): string {
  try {
    let str = ''
    for (let i = 0; i < hex.length; i += 2) {
      const charCode = parseInt(hex.substring(i, i + 2), 16)
      if (charCode >= 32 && charCode <= 126) {
        str += String.fromCharCode(charCode)
      }
    }
    return str || hex
  } catch (e) {
    return hex
  }
}

export async function fetchOnChainPricesAndQuantities(
  ownedTracks: Track[],
  userUtxoBalances: Record<string, bigint>,
  lucidInstance: any
): Promise<Track[]> {
  try {
    const { Data } = await import('@lucid-evolution/lucid')

    const updated = await Promise.all(
      ownedTracks.map(async (track) => {
        let activePrice = parseFloat(track.price || '5')
        let ownedQty = track.quantity || 1

        if (userUtxoBalances && Object.keys(userUtxoBalances).length > 0) {
          for (const [unit, qty] of Object.entries(userUtxoBalances)) {
            const assetNameHex = unit.slice(56)
            if (assetNameHex.startsWith('001bc280')) {
              const tokenNameStr = hexToString(assetNameHex.slice(8))
              const expectedTokenName = track.ticker
                ? track.ticker.toUpperCase().replace(/[^A-Z0-9]/g, '')
                : 'T' + String(track.album_id ? track.album_id : track.token_id).slice(-11)

              if (tokenNameStr === expectedTokenName && qty > 0n) {
                ownedQty = Number(qty)
              }
            }
          }
        }

        if (lucidInstance && track.uploader_address && !track.uploader_address.startsWith('stake')) {
          try {
            const { getContractAddresses } = await import('@/lib/contractHelper')
            const { dAddress, mintCS } = await getContractAddresses(track.uploader_address)

            const tokenNameStr = track.ticker
              ? track.ticker.toUpperCase().replace(/[^A-Z0-9]/g, '')
              : 'T' + String(track.album_id ? track.album_id : track.token_id).slice(-11)

            const { fromText, toUnit } = await import('@lucid-evolution/lucid')
            const tokenName = fromText(tokenNameStr)
            const fracUnit = toUnit(mintCS, tokenName, 444)

            const utxos = await lucidInstance.utxosAtWithUnit(dAddress, fracUnit)
            if (utxos && utxos.length > 0 && utxos[0].datum) {
              const decoded = Data.from(utxos[0].datum)
              if (decoded && typeof decoded === 'object' && 'fields' in decoded) {
                const fields = (decoded as any).fields
                if (fields && fields.length > 0 && typeof fields[0] === 'bigint') {
                  activePrice = Number(fields[0]) / 1000000
                }
              }
            }
          } catch (e) {
            // Fallback to database price
          }
        }

        return { ...track, price: String(activePrice), quantity: ownedQty }
      })
    )

    return updated
  } catch (e) {
    return ownedTracks
  }
}
