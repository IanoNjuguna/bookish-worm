'use client'

import PricingFields from '@/components/upload/PricingFields'
import RoyaltiesFields from '@/components/upload/RoyaltiesFields'
import CollaboratorField from '@/components/upload/CollaboratorField'
import type { WizardStepProps } from '../UploadWizard.types'

export default function MonetizationStep({ upload }: WizardStepProps) {
  return (
    <div className="space-y-6">
      <div className="glass-surface rounded-2xl p-5 sm:p-6 space-y-6">
        <PricingFields
          price={upload.price}
          setPrice={upload.setPrice}
          supply={upload.supply}
          setSupply={upload.setSupply}
        />
      </div>
      <div className="glass-surface rounded-2xl p-5 sm:p-6 space-y-6">
        <RoyaltiesFields
          royaltyAddress={upload.royaltyAddress}
          setRoyaltyAddress={upload.setRoyaltyAddress}
          cardanoAddress={upload.cardanoAddress}
        />
      </div>
      <CollaboratorField
        collaborators={upload.collaborators}
        cardanoAddress={upload.cardanoAddress}
        addCollaborator={upload.addCollaborator}
        updateCollaborator={upload.updateCollaborator}
        removeCollaborator={upload.removeCollaborator}
      />
    </div>
  )
}
