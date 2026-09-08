'use client'

import { ImportSeedDialog } from './ImportSeedDialog'
import { CreateWalletDialog } from './CreateWalletDialog'
import { WalletSettingsDialog } from './WalletSettingsDialog'
import type { UseConnectHeaderReturn } from './useConnectHeader'

interface ConnectHeaderDialogsProps {
  header: UseConnectHeaderReturn
}

export function ConnectHeaderDialogs({ header }: ConnectHeaderDialogsProps) {
  return (
    <>
      <ImportSeedDialog
        open={header.isSeedModalOpen}
        onOpenChange={header.setIsSeedModalOpen}
        seedPhrase={header.seedPhrase}
        seedError={header.seedError}
        isConnecting={header.isConnecting}
        onSeedPhraseChange={header.handleSeedPhraseChange}
        onSubmit={header.handleImportSeed}
      />
      <CreateWalletDialog
        open={header.isCreateModalOpen}
        onOpenChange={header.setIsCreateModalOpen}
        generatedSeed={header.generatedSeed}
        isConnecting={header.isConnecting}
        onCopySeed={header.handleCopyGeneratedSeed}
        onConfirm={header.handleConfirmCreatedSeed}
      />
      <WalletSettingsDialog
        open={header.isSettingsModalOpen}
        onOpenChange={header.setIsSettingsModalOpen}
        sessionSeedPhrase={header.sessionSeedPhrase}
        onCopySeed={header.handleCopySessionSeed}
      />
    </>
  )
}
