import { MINIMUM_BALANCE_LOVELACE } from './UploadView.constants'

interface BalanceWarningProps {
  cardanoAddress: string | null
  adaBalance: bigint | null
}

export default function BalanceWarning({ cardanoAddress, adaBalance }: BalanceWarningProps) {
  if (!cardanoAddress || adaBalance === null || adaBalance >= MINIMUM_BALANCE_LOVELACE) return null

  return (
    <div className="glass-surface border-red-500/30 p-5 text-red-700 dark:text-red-400 text-xs space-y-3">
      <p className="font-bold uppercase tracking-wider">⚠️ INSUFFICIENT WALLET BALANCE</p>
      <p>
        Your wallet address has less than 2 ADA ({(Number(adaBalance) / 1000000).toFixed(2)} ADA). You need at least 2 ADA
        to cover minting transaction fees and the minimum UTxO storage deposit on the Cardano network.
      </p>
    </div>
  )
}
