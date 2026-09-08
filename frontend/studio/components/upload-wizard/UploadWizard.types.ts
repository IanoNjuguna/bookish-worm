import type { UseUploadReturn } from '@/components/upload/useUpload'
import type { UseAlbumTracksReturn } from '@/components/upload/UploadView.types'

export type WizardStep = 1 | 2 | 3 | 4

export interface WizardStepProps {
  upload: UseUploadReturn
  album: UseAlbumTracksReturn
}
