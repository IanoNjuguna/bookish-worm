'use client'

import { Button } from '@/components/ui/button'
import { IconCheck } from '@tabler/icons-react'

interface ProfileEditActionsProps {
  isSaving: boolean
}

export function ProfileEditActions({ isSaving }: ProfileEditActionsProps) {
  return (
    <div className="flex justify-center pt-2">
      <Button
        type="submit"
        disabled={isSaving}
        className="bg-lavender hover:bg-lavender/90 text-midnight font-bold px-6 py-2 h-auto rounded-xl flex items-center gap-2 transition-all disabled:opacity-50"
      >
        {isSaving ? (
          'Saving...'
        ) : (
          <>
            <IconCheck size={18} />
            Save Profile
          </>
        )}
      </Button>
    </div>
  )
}
