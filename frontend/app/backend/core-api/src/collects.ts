/**
 * What a collect actually cost, read from the transaction rather than inferred.
 *
 * fee_lovelace   the sum of outputs to the treasury address in that tx
 * price_lovelace the buyer's net outflow: lovelace in from them, minus lovelace
 *                back to them as change. It therefore includes the network fee,
 *                which is the truthful answer to "what did this cost the fan".
 *
 * Both are nullable. A missing treasury output is not a zero fee; it is a collect
 * that was built without one, and the caller must be able to tell the difference.
 */
export type CollectAmounts = {
  priceLovelace: number | null
  feeLovelace: number | null
}

const TREASURY_FALLBACK = ''

function blockfrostHeaders(): Record<string, string> {
  const projectId = process.env.BLOCKFROST_PROJECT_ID || ''
  if (!projectId) throw new Error('BLOCKFROST_PROJECT_ID is missing')
  return { project_id: projectId }
}

function lovelaceOf(amounts: { unit: string; quantity: string }[]): number {
  const ada = amounts.find((a) => a.unit === 'lovelace')
  return ada ? Number(ada.quantity) : 0
}

export async function getCollectAmounts(
  txHash: string,
  buyerAddress: string,
  treasuryAddress = process.env.TREASURY_ADDRESS || TREASURY_FALLBACK,
): Promise<CollectAmounts> {
  const res = await fetch(`https://cardano-mainnet.blockfrost.io/api/v0/txs/${txHash}/utxos`, {
    headers: blockfrostHeaders(),
  })
  if (!res.ok) throw new Error(`Blockfrost tx utxos failed: ${res.status}`)

  const body = (await res.json()) as {
    inputs: { address: string; amount: { unit: string; quantity: string }[] }[]
    outputs: { address: string; amount: { unit: string; quantity: string }[] }[]
  }

  const buyer = buyerAddress.toLowerCase()
  const inFromBuyer = body.inputs
    .filter((i) => i.address.toLowerCase() === buyer)
    .reduce((sum, i) => sum + lovelaceOf(i.amount), 0)
  const backToBuyer = body.outputs
    .filter((o) => o.address.toLowerCase() === buyer)
    .reduce((sum, o) => sum + lovelaceOf(o.amount), 0)

  const treasury = treasuryAddress.toLowerCase()
  const feeOutputs = treasury
    ? body.outputs.filter((o) => o.address.toLowerCase() === treasury)
    : []

  return {
    priceLovelace: inFromBuyer > 0 ? inFromBuyer - backToBuyer : null,
    feeLovelace: treasury ? feeOutputs.reduce((sum, o) => sum + lovelaceOf(o.amount), 0) : null,
  }
}
