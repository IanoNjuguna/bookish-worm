'use client'

import React, { useState, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter } from '@/i18n/navigation'
import { useCardano } from './Providers'
import { useAudio } from '@/components/AudioProvider'
import { Button } from '@/components/ui/button'
import { IconCopy, IconCheck, IconExternalLink, IconLogout, IconWallet, IconChevronDown, IconBrandGoogle, IconUser, IconSettings, IconHelp, IconMenu, IconX, IconHome, IconPlaylistAdd, IconSearch, IconMusic, IconCurrencyDollar, IconTrendingUp, IconPlus, IconCoins, IconKey, IconShieldCheck } from '@tabler/icons-react'
import { toast } from 'sonner'
import { EXPLORER_URL } from '@/lib/config'
import { ThemeToggle } from './ThemeToggle'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from '@/components/ui/dropdown-menu'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { AuthModal } from '@/components/AuthModal'

interface CardanoWalletInfo {
  id: string;
  name: string;
  icon: string;
}

const formatAddress = (address: string, startChars: number = 10, endChars: number = 9): string => {
  if (!address || address.length <= startChars + endChars) {
    return address
  }
  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`
}

export default function ConnectHeader({ address: propAddress, logout, onNavigate, onMenuClick, isMenuOpen }: { address?: string, logout?: () => void, onNavigate?: (view: string) => void, onMenuClick?: () => void, isMenuOpen?: boolean }) {
  const t = useTranslations('header')
  const router = useRouter()
  const { address: cardanoAddress, isConnected, connect, connectFromSeed, disconnect, walletName, lucid, isConnecting, sessionSeedPhrase } = useCardano()
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
  const [seedPhrase, setSeedPhrase] = useState("")
  const [generatedSeed, setGeneratedSeed] = useState("")
  const [seedError, setSeedError] = useState("")

  // Detect installed wallets
  useEffect(() => {
    if (typeof window === 'undefined') return

    const wallets: CardanoWalletInfo[] = []

    const cardano = (window as any).cardano
    if (cardano) {
      const supported = ['nami', 'eternl', 'lace', 'vespr', 'flint', 'yoroi', 'typhoncip30', 'gerowallet', 'nufi']
      
      supported.forEach(id => {
        if (cardano[id]) {
          wallets.push({
            id,
            name: cardano[id].name || id.charAt(0).toUpperCase() + id.slice(1),
            icon: cardano[id].icon || ''
          })
        }
      })

      Object.keys(cardano).forEach(id => {
        if (!supported.includes(id) && cardano[id] && cardano[id].enable && cardano[id].name && !wallets.some(w => w.id === id)) {
          wallets.push({
            id,
            name: cardano[id].name,
            icon: cardano[id].icon || ''
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
        let lovelace = 0n

        if (wallet && typeof wallet.getUtxos === 'function') {
          const utxos = await wallet.getUtxos()
          lovelace = utxos.reduce(
            (total: bigint, utxo: { assets?: { lovelace?: bigint } }) => total + (utxo.assets?.lovelace ?? 0n),
            0n
          )
        } else if (typeof lucid.utxosAt === 'function') {
          const utxos = await lucid.utxosAt(address)
          lovelace = utxos.reduce(
            (total: bigint, utxo: { assets?: { lovelace?: bigint } }) => total + (utxo.assets?.lovelace ?? 0n),
            0n
          )
        } else {
          throw new Error('No supported wallet balance method found on Lucid instance')
        }

        const ada = Number(lovelace) / 1000000
        setAdaBalance(ada.toFixed(2))
      } catch (e) {
        console.error('Failed to fetch ADA balance:', e)
      }
    }

    fetchBalance()
    const interval = setInterval(fetchBalance, 15000)
    return () => clearInterval(interval)
  }, [address, lucid])

  // Automatically trigger backend authentication if the wallet was just connected
  useEffect(() => {
    if (isConnected && !isAuthenticated && typeof window !== 'undefined') {
      const justConnected = sessionStorage.getItem('doba_just_connected')
      if (justConnected === 'true') {
        sessionStorage.removeItem('doba_just_connected')
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
      ? (window as any).cardano?.[walletName]?.icon 
      : null;

  return (
    <div className="flex items-center gap-3 relative">
      <ThemeToggle />
      {!isConnected ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              disabled={isConnecting}
              className="bg-lavender hover:bg-lavender/90 text-midnight font-bold h-10 px-6 transition-all rounded-lg flex items-center gap-2"
            >
              <IconWallet size={16} />
              {isConnecting ? 'Connecting...' : (t('signIn') || 'Sign In')}
              {!isConnecting && <IconChevronDown size={14} className="ml-1 opacity-50" />}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[240px] bg-[#FAF9F6] dark:bg-[#0D0D12] border-midnight/10 dark:border-white/10 text-midnight dark:text-white">
            {availableWallets.length > 0 && availableWallets.map((wallet) => (
              <DropdownMenuItem
                key={wallet.id}
                onClick={() => connect(wallet.id)}
                className="flex items-center gap-3 cursor-pointer hover:bg-midnight/5 dark:hover:bg-white/5 p-3 rounded-none"
              >
                {wallet.icon ? (
                  <img src={wallet.icon} alt={wallet.name} className="w-6 h-6 rounded-none" />
                ) : (
                  <div className="w-6 h-6 rounded-none bg-midnight/10 dark:bg-white/10 flex items-center justify-center">
                    <IconWallet size={14} />
                  </div>
                )}
                <span className="font-medium text-sm">{wallet.name}</span>
              </DropdownMenuItem>
            ))}
            {availableWallets.length > 0 && <DropdownMenuSeparator className="bg-midnight/10 dark:bg-white/10" />}
            <DropdownMenuItem
              onClick={async () => {
                try {
                  const { generateSeedPhrase } = await import("@lucid-evolution/utils")
                  const seed = generateSeedPhrase()
                  setGeneratedSeed(seed)
                  setIsCreateModalOpen(true)
                } catch (e) {
                  toast.error("Failed to generate seed phrase")
                }
              }}
              className="flex items-center gap-3 cursor-pointer hover:bg-midnight/5 dark:hover:bg-white/5 p-3 rounded-none"
            >
              <div className="w-6 h-6 rounded-none bg-midnight/10 dark:bg-white/10 flex items-center justify-center text-[#FF1F8A]">
                <IconPlus size={14} />
              </div>
              <span className="font-medium text-sm text-[#FF1F8A]">Create Wallet (Test Mode)</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setIsSeedModalOpen(true)}
              className="flex items-center gap-3 cursor-pointer hover:bg-midnight/5 dark:hover:bg-white/5 p-3 rounded-none"
            >
              <div className="w-6 h-6 rounded-none bg-midnight/10 dark:bg-white/10 flex items-center justify-center text-lavender">
                <IconKey size={14} />
              </div>
              <span className="font-medium text-sm text-lavender">Import Seed (Test Mode)</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <>
          {!isAuthenticated && !isCheckingAuth && (
            <AuthModal 
              isOpen={true} 
              onClose={() => {}} 
            />
          )}
          {/* Desktop version - Dropdown Menu */}
          <div className="hidden lg:block">
            <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 pl-2 pr-3 py-1.5 border border-midnight/10 dark:border-white/10 shrink-0 rounded-none bg-midnight/5 dark:bg-white/5 hover:border-cyber-pink/50 transition-colors group">
                  <img src={`https://api.dicebear.com/7.x/identicon/svg?seed=${address}`} alt="User Menu" className="w-7 h-7 object-cover opacity-80 rounded-none group-hover:opacity-100 transition-opacity" />
                  <div className="relative w-5 h-5 flex items-center justify-center">
                    <IconMenu 
                      size={20} 
                      className={`absolute text-midnight/70 dark:text-white/70 transition-all duration-300 ${isDropdownOpen ? 'opacity-0 rotate-90 scale-50' : 'opacity-100 rotate-0 scale-100'}`} 
                    />
                    <IconX 
                      size={20} 
                      className={`absolute text-midnight/70 dark:text-white/70 transition-all duration-300 ${isDropdownOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-50'}`} 
                    />
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px] bg-[#FAF9F6] dark:bg-[#0D0D12] border-midnight/10 dark:border-white/10 text-midnight dark:text-white rounded-none">
                <div className="px-3 py-3">
                  <div 
                    onClick={(e) => {
                      e.preventDefault();
                      handleCopy();
                    }}
                    className="flex items-center justify-between cursor-pointer group"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 shrink-0 bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)] animate-pulse-scale"></div>
                      <span className="font-mono text-xs font-medium text-midnight/80 dark:text-white/80 group-hover:text-midnight dark:group-hover:text-white group-hover:font-bold transition-all">
                        {formatAddress(address || '', 8, 8)}
                      </span>
                    </div>
                    {copied ? (
                      <IconCheck size={14} className="text-green-500 shrink-0 ml-2" />
                    ) : (
                      <IconCopy size={14} className="text-midnight/70 dark:text-white/40 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-2" />
                    )}
                  </div>
                </div>
                <DropdownMenuSeparator className="bg-midnight/10 dark:bg-white/10" />
                <DropdownMenuItem
                  className="flex items-center gap-2 cursor-pointer hover:bg-midnight/5 dark:hover:bg-white/5 p-2.5 rounded-none"
                  onClick={() => onNavigate?.('profile')}
                >
                  <IconUser size={16} />
                  <span>View Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="flex items-center gap-2 cursor-pointer hover:bg-midnight/5 dark:hover:bg-white/5 p-2.5 rounded-none"
                  onClick={() => setIsSettingsModalOpen(true)}
                >
                  <IconSettings size={16} />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="flex items-center gap-2 cursor-pointer hover:bg-midnight/5 dark:hover:bg-white/5 p-2.5 rounded-none"
                  onClick={() => router.push('/support')}
                >
                  <IconHelp size={16} />
                  <span>Help & Support</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-midnight/10 dark:bg-white/10" />
                <DropdownMenuItem
                  className="flex items-center gap-2 cursor-pointer hover:bg-red-500/20 text-red-400 p-2.5 rounded-none focus:text-red-400 focus:bg-red-500/20"
                  onClick={() => {
                    if (logout) logout()
                    else disconnect()
                  }}
                >
                  <IconLogout size={16} />
                  <span>Disconnect</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          {/* Mobile version - Full Menu Trigger */}
          <div className="lg:hidden">
            <button 
              onClick={onMenuClick}
              className="flex items-center gap-2 pl-2 pr-3 py-1.5 border border-midnight/10 dark:border-white/10 shrink-0 rounded-none bg-midnight/5 dark:bg-white/5 hover:border-cyber-pink/50 transition-colors group"
            >
              <img src={`https://api.dicebear.com/7.x/identicon/svg?seed=${address}`} alt="User Menu" className="w-7 h-7 object-cover opacity-80 rounded-none group-hover:opacity-100 transition-opacity" />
              <div className="relative w-5 h-5 flex items-center justify-center">
                <IconMenu 
                  size={20} 
                  className={`absolute text-midnight/70 dark:text-white/70 transition-all duration-300 ${isMenuOpen ? 'opacity-0 rotate-90 scale-50' : 'opacity-100 rotate-0 scale-100'}`} 
                />
                <IconX 
                  size={20} 
                  className={`absolute text-midnight/70 dark:text-white/70 transition-all duration-300 ${isMenuOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-50'}`} 
                />
              </div>
            </button>
          </div>
        </>
      )}

      <Dialog open={isSeedModalOpen} onOpenChange={setIsSeedModalOpen}>
        <DialogContent className="sm:max-w-md bg-[#FAF9F6] dark:bg-[#12121A] border-midnight/10 dark:border-white/10 text-midnight dark:text-white rounded-none">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-xl text-center font-bold">Import Seed Phrase</DialogTitle>
            <DialogDescription className="text-midnight/60 dark:text-white/60 text-center pt-2">
              <span className="text-red-400 font-bold block mb-1">⚠️ FOR PROTOTYPING ONLY</span>
              Enter your 12, 15, 24, or 27 word seed phrase to connect directly. Do not import a seed phrase containing real mainnet funds.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4 py-2">
            <div>
              <Input 
                placeholder="word1 word2 word3..." 
                value={seedPhrase}
                onChange={(e) => { setSeedPhrase(e.target.value); setSeedError(""); }}
                className="bg-midnight/5 dark:bg-white/5 border-midnight/10 dark:border-white/10 text-midnight dark:text-white rounded-none focus-visible:ring-lavender"
              />
              {seedError && <p className="text-red-400 text-xs font-medium mt-2 ml-1">{seedError}</p>}
            </div>
            <Button
              onClick={async () => {
                if (seedPhrase.trim().length > 0) {
                  setSeedError("");
                  try {
                    await connectFromSeed(seedPhrase.trim());
                    setIsSeedModalOpen(false);
                    setSeedPhrase("");
                  } catch (e: any) {
                    setSeedError(e.message || "Invalid seed phrase");
                  }
                }
              }}
              disabled={isConnecting || !seedPhrase.trim()}
              className="bg-lavender hover:bg-lavender/90 text-midnight font-bold rounded-none"
            >
              {isConnecting ? "Connecting..." : "Connect"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-md bg-[#FAF9F6] dark:bg-[#12121A] border-midnight/10 dark:border-white/10 text-midnight dark:text-white rounded-none">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-xl text-center font-bold">Save Your Recovery Phrase</DialogTitle>
            <DialogDescription className="text-midnight/60 dark:text-white/60 text-center pt-2">
              <span className="text-red-400 font-bold block mb-1">⚠️ FOR PROTOTYPING ONLY</span>
              Write these 24 words down and keep them safe. This is the ONLY time they will be shown. If you lose them, you will lose access to your funds forever.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4 py-2">
            <div className="bg-black/50 border border-midnight/10 dark:border-white/10 p-4 font-mono text-sm leading-relaxed text-lavender select-all rounded-none break-words">
              {generatedSeed}
            </div>
            
            <Button
              onClick={() => {
                navigator.clipboard.writeText(generatedSeed)
                toast.success("Copied to clipboard")
              }}
              variant="outline"
              className="bg-transparent border-midnight/20 dark:border-white/20 hover:bg-midnight/5 dark:hover:bg-white/5 text-midnight dark:text-white rounded-none"
            >
              <IconCopy size={16} className="mr-2" /> Copy to Clipboard
            </Button>

            <Button
              onClick={async () => {
                try {
                  await connectFromSeed(generatedSeed)
                  setIsCreateModalOpen(false)
                  setGeneratedSeed("")
                } catch (e: any) {
                  toast.error(e?.message || "Failed to import wallet from seed phrase")
                }
              }}
              disabled={isConnecting}
              className="bg-[#FF1F8A] hover:bg-[#FF1F8A]/90 text-midnight dark:text-white font-bold rounded-none mt-2"
            >
              {isConnecting ? "Connecting..." : "I have securely saved it"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isSettingsModalOpen} onOpenChange={setIsSettingsModalOpen}>
        <DialogContent className="sm:max-w-md bg-[#FAF9F6] dark:bg-[#12121A] border-midnight/10 dark:border-white/10 text-midnight dark:text-white rounded-none">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <IconSettings className="text-lavender" />
              Wallet Settings
            </DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-4 py-2">
            <div>
              <h3 className="text-sm font-semibold text-midnight/80 dark:text-white/80 mb-2 uppercase tracking-wide">Security</h3>
              {sessionSeedPhrase ? (
                <div className="bg-midnight/5 dark:bg-white/5 border border-midnight/10 dark:border-white/10 p-4 rounded-none">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-midnight/90 dark:text-white/90">Current Session Recovery Phrase</span>
                    <Button 
                      onClick={() => {
                        navigator.clipboard.writeText(sessionSeedPhrase)
                        toast.success("Copied to clipboard")
                      }}
                      variant="ghost" 
                      size="sm" 
                      className="h-8 text-xs text-lavender hover:bg-lavender/10 hover:text-lavender rounded-none"
                    >
                      <IconCopy size={14} className="mr-1" /> Copy
                    </Button>
                  </div>
                  <div className="bg-black/50 p-3 font-mono text-xs leading-relaxed text-midnight/60 dark:text-white/60 select-all break-words rounded-none">
                    {sessionSeedPhrase}
                  </div>
                  <p className="text-[10px] text-midnight/70 dark:text-white/40 mt-2">
                    Note: This phrase is only accessible during your current session. If you close or refresh this tab, it will be wiped from memory permanently.
                  </p>
                </div>
              ) : (
                <div className="bg-midnight/5 dark:bg-white/5 border border-midnight/10 dark:border-white/10 p-4 rounded-none flex items-center gap-3">
                  <IconKey className="text-midnight/70 dark:text-white/40" size={24} />
                  <p className="text-sm text-midnight/60 dark:text-white/60">
                    No recovery phrase available. You are likely connected via a browser extension wallet which securely manages your keys.
                  </p>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
