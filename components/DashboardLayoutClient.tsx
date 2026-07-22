'use client'

import React, { useState, useEffect } from 'react'
import { IconHome as HomeIcon, IconPlaylistAdd as Library, IconSearch as Search, IconCurrencyDollar as DollarSign, IconTrendingUp as TrendingUp, IconUser as User, IconLogout as LogOut, IconPlus, IconMusic as Music, IconCoins } from '@tabler/icons-react'
import { Link, usePathname } from '@/i18n/navigation'
import ConnectHeader from '@/components/ConnectHeader'
import AudioPlayer from '@/components/AudioPlayer'
import NowPlayingSidebar from '@/components/NowPlayingSidebar'
import Footer from '@/components/Footer'
import { useCardano } from '@/components/Providers'
import { cn } from '@/lib/utils'
import { useTranslations } from 'next-intl'
import { useAudio } from '@/components/AudioProvider'

export default function DashboardLayoutClient({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)
  const [headerMenuOpen, setHeaderMenuOpen] = useState(false)
  
  const { disconnect } = useCardano()
  const {
    playerState,
    effectiveAddress,
    sidebarTrack,
    isSidebarOpen,
    toggleSidebar,
    logout: backendLogout,
  } = useAudio()

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleLogout = React.useCallback(() => {
    try {
      backendLogout()
      disconnect()
    } catch (e) {
      console.error('Logout failed', e)
    }
  }, [disconnect, backendLogout])

  const tNav = useTranslations('nav')

  if (!mounted) return <div className="min-h-[100dvh]" />

  return (
    <div className="h-[100dvh] text-midnight dark:text-white flex flex-col">
      {/* Header */}
      <header className={cn(
        "fixed top-0 left-0 right-0 z-50 h-16 transition-colors duration-200",
        headerMenuOpen
          ? "bg-[rgba(250,249,246,0.95)] dark:bg-[rgba(13,13,18,0.95)] backdrop-blur-md"
          : "bg-transparent backdrop-blur-none"
      )}>
        {/* Mobile Continuous Divider */}
        <div className="lg:hidden absolute bottom-0 left-4 right-4 h-[1px] bg-midnight/[0.08] dark:bg-white/[0.08]" />
        
        {/* Desktop Split Divider - Left Segment */}
        <div className="hidden lg:block absolute bottom-0 left-6 right-[calc(100%-20vw+40px)] h-[1px] bg-midnight/[0.08] dark:bg-white/[0.08]" />
        
        {/* Desktop Split Divider - Middle Segment */}
        <div className={cn(
          "hidden lg:block absolute bottom-0 left-[calc(20vw+8px)] h-[1px] bg-midnight/[0.08] dark:bg-white/[0.08]",
          (isSidebarOpen && playerState.currentTrack) ? "right-[calc(20rem+24px)]" : "right-6"
        )} />

        {/* Desktop Split Divider - Right Segment */}
        {(isSidebarOpen && playerState.currentTrack) && (
          <div className="hidden lg:block absolute bottom-0 left-[calc(100%-20rem+24px)] right-6 h-[1px] bg-midnight/[0.08] dark:bg-white/[0.08]" />
        )}
        <div className="h-full px-4 lg:px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <img src="/doba.png" alt="doba logo" className="w-8 h-8 rounded-lg object-cover dark:invert-0 invert" />
          </Link>

          <div className="hidden lg:flex items-center gap-3">
            <ConnectHeader
              address={effectiveAddress || undefined}
              logout={handleLogout}
              onNavigate={(_view) => {
                 // You'd need router.push(`/${view}`) here, but handled differently now
              }}
            />
          </div>

          <div className="lg:hidden flex items-center gap-2">
            <ConnectHeader
              address={effectiveAddress || undefined}
              logout={handleLogout}
              onMenuClick={() => setHeaderMenuOpen(!headerMenuOpen)}
              isMenuOpen={headerMenuOpen}
            />
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {headerMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-16 z-[60] animate-slide-in-down bg-[rgba(250,249,246,0.95)] dark:bg-[rgba(13,13,18,0.95)] backdrop-blur-md overflow-hidden">
          <nav className="mobile-menu-scroll flex flex-col p-4 pb-32 space-y-2 h-full">
            <div className="px-0 py-2">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-purple-400">
                {tNav('navigation')}
              </h2>
            </div>
            <MobileNavLink href="/" icon={<HomeIcon size={18} className="text-red-500 flex-shrink-0" />} label={tNav('home')} setMenuOpen={setHeaderMenuOpen} />
            <MobileNavLink href="/library" icon={<Library size={18} className="text-purple-400 flex-shrink-0" />} label={tNav('library')} setMenuOpen={setHeaderMenuOpen} />
            <MobileNavLink href="/search" icon={<Search size={18} className="text-purple-400 flex-shrink-0" />} label={tNav('search')} setMenuOpen={setHeaderMenuOpen} />
            <div className="border-t border-midnight/[0.08] dark:border-white/[0.08]" />
            
            <div className="px-0 py-2">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-purple-400">
                {tNav('creator')}
              </h2>
            </div>
            <MobileNavLink href="/upload" icon={<Music size={18} className="text-red-500 flex-shrink-0" />} label={tNav('upload')} setMenuOpen={setHeaderMenuOpen} />
            <MobileNavLink href="/earnings" icon={<DollarSign size={18} className="text-purple-400 flex-shrink-0" />} label={tNav('earnings')} setMenuOpen={setHeaderMenuOpen} />
            <MobileNavLink href="/analytics" icon={<TrendingUp size={18} className="text-purple-400 flex-shrink-0" />} label={tNav('analytics')} setMenuOpen={setHeaderMenuOpen} />
            <MobileNavLink href="/profile" icon={<User size={18} className="text-purple-400 flex-shrink-0" />} label={tNav('profile')} setMenuOpen={setHeaderMenuOpen} />
            <div className="border-t border-midnight/[0.08] dark:border-white/[0.08]" />

            <div className="px-0 py-2">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-[#B794F4]">
                {tNav('wallet')}
              </h2>
            </div>
            <MobileNavLink href="/send-money" icon={<DollarSign size={18} className="text-[#FF1F8A] flex-shrink-0" />} label={tNav('sendMoney')} setMenuOpen={setHeaderMenuOpen} />
            <MobileNavLink href="/deposit" icon={<IconPlus size={18} className="text-[#B794F4] flex-shrink-0" />} label={tNav('deposit')} setMenuOpen={setHeaderMenuOpen} />
            <MobileNavLink href="/assets" icon={<IconCoins size={18} className="text-[#B794F4] flex-shrink-0" />} label={tNav('assets')} setMenuOpen={setHeaderMenuOpen} />


            {/* Footer Section */}
            <div className="border-t border-midnight/[0.08] dark:border-white/[0.08] my-4 pt-4" />
            <div className="px-4 pb-12">
              <Footer />
            </div>
          </nav>
        </div>
      )}

      {/* Main Layout */}
      <div className="flex flex-col lg:flex-row flex-1 mt-16 lg:overflow-hidden">
        <aside className="hidden lg:flex w-[20vw] flex-col bg-transparent overflow-y-auto overflow-x-hidden relative">
          <nav className="sidebar-scroll flex flex-col p-4 overflow-x-hidden flex-1 relative">
            {/* Navigation Section */}
            <div className="relative flex flex-col space-y-1 pb-4">
              {/* Vertical Segment for Navigation */}
              <div className="absolute right-0 top-0 bottom-0 w-[1px] bg-midnight/[0.08] dark:bg-white/[0.08]" />
              
              <div className="pl-4 pt-0 pb-0 mb-1">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-purple-400">
                  {tNav('navigation')}
                </h2>
              </div>
              <SidebarNavLink href="/" icon={<HomeIcon size={18} className="text-[#FF1F8A] flex-shrink-0" />} label={tNav('home')} />
              <SidebarNavLink href="/library" icon={<Library size={18} className="text-[#B794F4] flex-shrink-0" />} label={tNav('library')} />
              <SidebarNavLink href="/search" icon={<Search size={18} className="text-[#B794F4] flex-shrink-0" />} label={tNav('search')} />
            </div>
            
            {/* Horizontal Divider */}
            <div className="border-t border-midnight/[0.08] dark:border-white/[0.08] my-4 ml-4 mr-6" />
            
            {/* Creator Section */}
            <div className="relative flex flex-col space-y-1 pt-0 pb-4">
              {/* Vertical Segment for Creator */}
              <div className="absolute right-0 top-0 bottom-0 w-[1px] bg-midnight/[0.08] dark:bg-white/[0.08]" />
              
              <div className="pl-4 pt-2 pb-0 mb-1">
                <h2 className="text-sm font-semibold text-[#B794F4] uppercase tracking-wider" style={{ letterSpacing: '0.04em' }}>{tNav('creator')}</h2>
              </div>
              <SidebarNavLink href="/upload" icon={<Music size={18} className="text-[#FF1F8A] flex-shrink-0" />} label={tNav('upload')} />
              <SidebarNavLink href="/earnings" icon={<DollarSign size={18} className="text-[#B794F4] flex-shrink-0" />} label={tNav('earnings')} />
              <SidebarNavLink href="/analytics" icon={<TrendingUp size={18} className="text-[#B794F4] flex-shrink-0" />} label={tNav('analytics')} />
              <SidebarNavLink href="/profile" icon={<User size={18} className="text-[#B794F4] flex-shrink-0" />} label={tNav('profile')} />
            </div>

            {/* Horizontal Divider */}
            <div className="border-t border-midnight/[0.08] dark:border-white/[0.08] my-4 ml-4 mr-6" />
            
            {/* Wallet Section */}
            <div className="relative flex flex-col space-y-1 pt-0 pb-4">
              {/* Vertical Segment for Wallet */}
              <div className="absolute right-0 top-0 bottom-0 w-[1px] bg-midnight/[0.08] dark:bg-white/[0.08]" />
              
              <div className="pl-4 pt-2 pb-0 mb-1">
                <h2 className="text-sm font-semibold text-[#B794F4] uppercase tracking-wider" style={{ letterSpacing: '0.04em' }}>{tNav('wallet')}</h2>
              </div>
              <SidebarNavLink href="/send-money" icon={<DollarSign size={18} className="text-[#FF1F8A] flex-shrink-0" />} label={tNav('sendMoney')} />
              <SidebarNavLink href="/deposit" icon={<IconPlus size={18} className="text-[#B794F4] flex-shrink-0" />} label={tNav('deposit')} />
              <SidebarNavLink href="/assets" icon={<IconCoins size={18} className="text-[#B794F4] flex-shrink-0" />} label={tNav('assets')} />
            </div>

            {/* Horizontal Divider */}
            <div className="border-t border-midnight/[0.08] dark:border-white/[0.08] my-4 ml-4 mr-6" />

            {/* Footer Section */}
            <div className="relative flex flex-col pt-2">
              {/* Vertical Segment for Footer */}
              <div className="absolute right-0 top-0 bottom-6 w-[1px] bg-midnight/[0.08] dark:bg-white/[0.08]" />
              
              <div className="pl-4 pr-6 pb-6">
                <Footer />
              </div>
            </div>
          </nav>
        </aside>

        {/* Content Area wrapper */}
        <div className="flex-1 flex flex-col min-w-0 relative lg:min-h-0">
          <div className="flex-1 flex flex-row min-w-0 relative lg:min-h-0">
            <main className="flex-1 overflow-y-auto outline-none lg:h-full">
              <div className="p-6 pb-24 md:pb-12 max-w-7xl mx-auto">
                {children}
              </div>

              {/* Footer removed and moved to sidebar/menu */}
            </main>

            {/* Right Sidebar */}
            <NowPlayingSidebar
              track={sidebarTrack}
              isVisible={isSidebarOpen}
              onClose={toggleSidebar}
            />
          </div>

          {/* Audio Player Footer */}
          {playerState.currentTrack && (
            <AudioPlayer playerState={playerState} />
          )}
        </div>
      </div>
    </div>
  )
}

function SidebarNavLink({ href, icon, label }: { href: string, icon: React.ReactNode, label: string }) {
  const pathname = usePathname()
  const isActive = pathname === href || (href !== '/' && pathname?.startsWith(href))
  
  return (
    <Link
      href={href}
      prefetch
      className={cn(
        "flex items-center gap-3 px-4 py-2 transition-all duration-200 text-midnight/70 dark:text-white/70 hover:text-midnight dark:hover:text-white md:hover:-translate-y-0.5 md:hover:font-semibold",
        isActive && "text-midnight dark:text-white font-bold -translate-y-0.5"
      )}
    >
      {icon}
      <span className="text-sm">{label}</span>
    </Link>
  )
}

function MobileNavLink({ href, icon, label, setMenuOpen }: { href: string, icon: React.ReactNode, label: string, setMenuOpen: (o: boolean) => void }) {
  const pathname = usePathname()
  const isActive = pathname === href || (href !== '/' && pathname?.startsWith(href))
  
  return (
    <Link
      href={href}
      prefetch
      onClick={() => setMenuOpen(false)}
      className={cn(
        "flex items-center gap-3 px-4 py-2 transition-all duration-200 text-midnight/70 dark:text-white/70 hover:text-midnight dark:hover:text-white md:hover:-translate-y-0.5 md:hover:font-semibold",
        isActive && "text-midnight dark:text-white font-bold -translate-y-0.5"
      )}
    >
      {icon}
      <span className="text-sm">{label}</span>
    </Link>
  )
}
