'use client'

import { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { useCardano } from '../Providers'
import { useAudio } from '@/components/audio'
import { toast } from 'sonner'
import { SUPPORTED_WALLET_IDS, JUST_CONNECTED_STORAGE_KEY } from './ConnectHeader.constants'
import type { CardanoWalletInfo, WalletUtxo, SocialProvider } from './ConnectHeader.types'

export interface UseConnectHeaderReturn {
  isConnected: boolean
  isConnecting: boolean
  address: string | undefined
  signInLabel: string
  availableWallets: CardanoWalletInfo[]
  seedPhrase: string
  seedError: string
  generatedSeed: string
  sessionSeedPhrase: string | null
  isSeedModalOpen: boolean
  isCreateModalOpen: boolean
  isSettingsModalOpen: boolean
  isAuthModalOpen: boolean
  setIsSeedModalOpen: (open: boolean) => void
  setIsCreateModalOpen: (open: boolean) => void
  setIsSettingsModalOpen: (open: boolean) => void
  setIsAuthModalOpen: (open: boolean) => void
  connect: (wallet: string) => Promise<void>
  connectSocial: (provider: SocialProvider) => Promise<void>
  handleSeedPhraseChange: (value: string) => void
  handleImportSeed: () => Promise<void>
  handleCreateWallet: () => Promise<void>
  handleCopyGeneratedSeed: () => void
  handleConfirmCreatedSeed: () => Promise<void>
  handleCopySessionSeed: () => void
}

export function useConnectHeader(propAddress?: string): UseConnectHeaderReturn {
  const t = useTranslations('header')
  const { address: cardanoAddress, isConnected, connect, connectFromSeed, connectSocial, disconnect, walletName, lucid, isConnecting, sessionSeedPhrase } = useCardano()
  const { isAuthenticated, isCheckingAuth, login } = useAudio()
  // Use the payment address (addr_test1...) for display; fall back to propAddress if no wallet connected
  const address = cardanoAddress || propAddress

  const [adaBalance, setAdaBalance] = useState('0.00')
  const [copied, setCopied] = useState(false)
  const [availableWallets, setAvailableWallets] = useState<CardanoWalletInfo[]>([])
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isSeedModalOpen, setIsSeedModalOpen] = useState(false)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [seedPhrase, setSeedPhrase] = useState("")
  const [generatedSeed, setGeneratedSeed] = useState("")
  const [seedError, setSeedError] = useState("")

  // Detect installed wallets
  useEffect(() => {
    if (typeof window === 'undefined') return

    const wallets: CardanoWalletInfo[] = []

    const cardano = window.cardano
    if (cardano) {
      SUPPORTED_WALLET_IDS.forEach(id => {
        const injected = cardano[id]
        if (injected) {
          wallets.push({
            id,
            name: injected.name || id.charAt(0).toUpperCase() + id.slice(1),
            icon: injected.icon || ''
          })
        }
      })

      Object.keys(cardano).forEach(id => {
        const injected = cardano[id]
        if (!SUPPORTED_WALLET_IDS.includes(id) && injected && typeof injected.enable === 'function' && injected.name && !wallets.some(w => w.id === id)) {
          wallets.push({
            id,
            name: injected.name,
            icon: injected.icon || ''
          })
        }
      })
    }

    setAvailableWallets(wallets)
  }, [])

  // Fetch ADA balance
  useEffect(() => {
    async function fetchBalance() {
      if (!address || !lucid) return

      try {
        const wallet = typeof lucid.wallet === 'function' ? lucid.wallet() : lucid.wallet
        let utxos: WalletUtxo[] = []

        if (wallet && typeof wallet.getUtxos === 'function') {
          utxos = await wallet.getUtxos().catch(() => [])
        } else if (typeof lucid.utxosAt === 'function') {
          utxos = await lucid.utxosAt(address).catch(() => [])
        }

        const lovelace = utxos.reduce(
          (total: bigint, utxo) => total + (utxo.assets?.lovelace ?? 0n),
          0n
        )

        const ada = Number(lovelace) / 1000000
        setAdaBalance(ada.toFixed(2))
      } catch (e) {
        setAdaBalance('0.00')
      }
    }

    fetchBalance()
    const interval = setInterval(fetchBalance, 15000)
    return () => clearInterval(interval)
  }, [address, lucid])

  // Automatically trigger backend authentication if the wallet was just connected
  useEffect(() => {
    if (isConnected && !isAuthenticated && typeof window !== 'undefined') {
      const justConnected = sessionStorage.getItem(JUST_CONNECTED_STORAGE_KEY)
      if (justConnected === 'true') {
        sessionStorage.removeItem(JUST_CONNECTED_STORAGE_KEY)
        login()
      }
    }
  }, [isConnected, isAuthenticated, login])

  const handleCopy = () => {
    if (!address) return
    navigator.clipboard.writeText(address)
    setCopied(true)
    toast.success('Address copied')
    setTimeout(() => setCopied(false), 2000)
  }

  const activeWalletIcon = walletName && typeof window !== 'undefined'
      ? window.cardano?.[walletName]?.icon
      : null

  const handleSeedPhraseChange = (value: string) => {
    setSeedPhrase(value)
    setSeedError("")
  }

  const handleImportSeed = async () => {
    if (seedPhrase.trim().length > 0) {
      setSeedError("")
      try {
        await connectFromSeed(seedPhrase.trim())
        setIsSeedModalOpen(false)
        setSeedPhrase("")
      } catch (e) {
        setSeedError(e instanceof Error && e.message ? e.message : "Invalid seed phrase")
      }
    }
  }

  const handleCreateWallet = async () => {
    try {
      const { generateSeedPhrase } = await import("@lucid-evolution/utils")
      const seed = generateSeedPhrase()
      setGeneratedSeed(seed)
      setIsCreateModalOpen(true)
    } catch (e) {
      toast.error("Failed to generate seed phrase")
    }
  }

  const handleCopyGeneratedSeed = () => {
    navigator.clipboard.writeText(generatedSeed)
    toast.success("Copied to clipboard")
  }

  const handleConfirmCreatedSeed = async () => {
    try {
      await connectFromSeed(generatedSeed)
      setIsCreateModalOpen(false)
      setGeneratedSeed("")
    } catch (e) {
      toast.error(e instanceof Error && e.message ? e.message : "Failed to import wallet from seed phrase")
    }
  }

  const handleCopySessionSeed = () => {
    if (!sessionSeedPhrase) return
    navigator.clipboard.writeText(sessionSeedPhrase)
    toast.success("Copied to clipboard")
  }

  return {
    isConnected,
    isConnecting,
    address,
    signInLabel: t('signIn') || 'Sign In',
    availableWallets,
    seedPhrase,
    seedError,
    generatedSeed,
    sessionSeedPhrase,
    isSeedModalOpen,
    isCreateModalOpen,
    isSettingsModalOpen,
    isAuthModalOpen,
    setIsSeedModalOpen,
    setIsCreateModalOpen,
    setIsSettingsModalOpen,
    setIsAuthModalOpen,
    connect,
    connectSocial,
    handleSeedPhraseChange,
    handleImportSeed,
    handleCreateWallet,
    handleCopyGeneratedSeed,
    handleConfirmCreatedSeed,
    handleCopySessionSeed
  }
}
