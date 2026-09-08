'use client'

import { useTranslations } from 'next-intl'
import { IconMusic, IconUser, IconTag, IconCoin, IconStack, IconPercentage } from '@tabler/icons-react'
import AttestationSubmit from '@/components/upload/AttestationSubmit'
import BalanceWarning from '@/components/upload/BalanceWarning'
import PublishedStatus from '@/components/upload/PublishedStatus'
import type { WizardStepProps } from '../UploadWizard.types'

interface SummaryItemProps {
  icon: React.ReactNode
  label: string
  value: string
}

function SummaryItem({ icon, label, value }: SummaryItemProps) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-xl bg-midnight/[0.03] dark:bg-white/[0.03]">
      <div className="p-1.5 rounded-lg bg-midnight/5 dark:bg-white/5 text-midnight/70 dark:text-white/70 shrink-0">
        {icon}
      </div>
      <div className="min-w-0">
        <div className="text-[10px] uppercase tracking-wider text-midnight/50 dark:text-white/50 font-semibold">{label}</div>
        <div className="text-sm font-medium text-midnight dark:text-white truncate">{value}</div>
      </div>
    </div>
  )
}

export default function ReviewStep({ upload }: WizardStepProps) {
  const t = useTranslations('upload.wizard')

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <SummaryItem icon={<IconMusic size={16} />} label={t('summaryTitle')} value={upload.title || '-'} />
        <SummaryItem icon={<IconUser size={16} />} label={t('summaryArtist')} value={upload.artistName || '-'} />
        <SummaryItem icon={<IconTag size={16} />} label={t('summaryGenre')} value={upload.genre || '-'} />
        <SummaryItem icon={<IconCoin size={16} />} label={t('summaryPrice')} value={`${upload.price} ADA`} />
        <SummaryItem icon={<IconStack size={16} />} label={t('summarySupply')} value={upload.supply} />
        <SummaryItem icon={<IconPercentage size={16} />} label={t('summaryRoyalty')} value={upload.royaltyAddress ? `${upload.royaltyAddress.slice(0, 12)}...` : '-'} />
      </div>

      <BalanceWarning cardanoAddress={upload.cardanoAddress} adaBalance={upload.adaBalance} />
      <AttestationSubmit
        attested={upload.attested}
        setAttested={upload.setAttested}
        isUploading={upload.isUploading}
        isAlbum={upload.isAlbum}
        disabled={false}
        showButton={false}
      />
      <PublishedStatus publishedSongId={upload.publishedSongId} />
    </div>
  )
}
