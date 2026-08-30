'use client'

import { IconDiamond, IconDiamondFilled, IconLoader2 } from '@tabler/icons-react'
import type { MintDiamondOverlayProps } from './SongCard.types'

export function MintDiamondOverlay({ mintData, hasOwned, isMinting, onMint }: MintDiamondOverlayProps) {
  return (
    <div className="absolute top-2 left-2 z-20">
      {mintData.max > 0 && mintData.minted >= mintData.max ? (
        <IconDiamondFilled size={22} className="text-cyber-pink" />
      ) : hasOwned ? (
        <IconDiamondFilled size={22} className="text-emerald-500" />
      ) : (
        <button
          type="button"
          disabled={isMinting}
          onClick={onMint}
          className="text-white/70 hover:text-cyber-pink transition-colors duration-200"
        >
          {isMinting ? (
            <IconLoader2 size={22} className="animate-spin text-pink-600 dark:text-cyber-pink" />
          ) : (
            <IconDiamond size={22} />
          )}
        </button>
      )}
    </div>
  )
}
