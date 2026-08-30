'use client'

interface RoyaltiesFieldsProps {
  royaltyAddress: string
  setRoyaltyAddress: (value: string) => void
}

export default function RoyaltiesFields({ royaltyAddress, setRoyaltyAddress }: RoyaltiesFieldsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <label className="text-sm font-medium text-midnight/80 dark:text-white">Royalty Percentage (%)</label>
        <div className="relative">
          <input
            type="number"
            value="5"
            disabled
            readOnly
            className="w-full bg-midnight/5 dark:bg-white/5 border border-midnight/10 dark:border-white/10 rounded-xl px-4 py-3 pr-14 text-midnight dark:text-white/90 cursor-not-allowed opacity-75 font-mono select-none"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-midnight/70 dark:text-white/70 text-xs font-bold font-mono">
            %
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-midnight/80 dark:text-white">Royalty Address (Optional)</label>
        <input
          type="text"
          value={royaltyAddress}
          onChange={(e) => setRoyaltyAddress(e.target.value)}
          placeholder="Defaults to your wallet address"
          className="w-full bg-midnight/5 dark:bg-white/5 border border-midnight/10 dark:border-white/10 rounded-xl px-4 py-3 text-midnight dark:text-white focus:border-lavender focus:ring-1 focus:ring-lavender/50 transition-all placeholder:text-midnight/70 dark:placeholder:text-white/50 font-mono text-xs"
        />
      </div>
    </div>
  )
}
