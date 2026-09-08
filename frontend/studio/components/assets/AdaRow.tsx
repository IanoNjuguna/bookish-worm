'use client'

interface AdaRowProps {
  balance: number
  usdValue: number
}

export function AdaRow({ balance, usdValue }: AdaRowProps) {
  return (
    <div className="p-5 flex items-center justify-between hover:bg-midnight/5 dark:hover:bg-white/5 transition">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-midnight/5 dark:bg-white/5 border border-midnight/10 dark:border-white/10 flex items-center justify-center font-display font-bold text-midnight dark:text-white text-sm uppercase overflow-hidden">
          <img
            src="https://assets.coingecko.com/coins/images/975/large/cardano.png"
            alt="ADA"
            className="w-full h-full object-cover p-1.5"
          />
        </div>
        <div>
          <h4 className="font-display font-bold text-midnight dark:text-white">ADA</h4>
          <p className="text-xs text-midnight/70 dark:text-white/40 font-mono">Cardano Native Asset</p>
        </div>
      </div>
      <div className="text-right">
        <p className="font-bold font-mono text-midnight dark:text-white">{balance.toFixed(2)} ADA</p>
        <p className="text-xs text-midnight/70 dark:text-white/40 font-mono">${usdValue.toFixed(2)} USD</p>
      </div>
    </div>
  )
}
