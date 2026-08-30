'use client'

import { useTranslations } from 'next-intl'

interface PricingFieldsProps {
  price: string
  setPrice: (value: string) => void
  supply: string
  setSupply: (value: string) => void
}

export default function PricingFields({ price, setPrice, supply, setSupply }: PricingFieldsProps) {
  const t = useTranslations('upload')

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <label className="text-sm font-medium text-midnight/80 dark:text-white">Price (in ADA)</label>
        <div className="relative">
          <input
            type="number"
            step="1"
            min="10"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="e.g. 10"
            className="w-full bg-midnight/5 dark:bg-white/5 border border-midnight/10 dark:border-white/10 rounded-xl px-4 py-3 pr-14 text-midnight dark:text-white focus:border-lavender focus:ring-1 focus:ring-lavender/50 transition-all placeholder:text-midnight/60 dark:placeholder:text-white/40"
            required
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-midnight/70 dark:text-white/70 text-xs font-bold font-mono">
            ADA
          </div>
        </div>
        <p className="text-xs text-midnight/60 dark:text-white/40">Recommended minimum price is 10 ADA</p>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-midnight/80 dark:text-white">{t('maxSupplyLabel')}</label>
        <input
          type="number"
          min="1"
          value={supply}
          onChange={(e) => setSupply(e.target.value)}
          placeholder={t('maxSupplyPlaceholder')}
          className="w-full bg-midnight/5 dark:bg-white/5 border border-midnight/10 dark:border-white/10 rounded-xl px-4 py-3 text-midnight dark:text-white focus:border-lavender focus:ring-1 focus:ring-lavender/50 transition-all placeholder:text-midnight/60 dark:placeholder:text-white/40"
          required
        />
      </div>
    </div>
  )
}
