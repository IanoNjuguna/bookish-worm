'use client'

import React, { useState, useEffect } from 'react'
import { IconHome as HomeIcon, IconPlaylistAdd as Library, IconSearch as Search, IconCurrencyDollar as DollarSign, IconTrendingUp as TrendingUp, IconUser as User, IconLogout as LogOut, IconMusic as Music, IconMenu, IconX } from '@tabler/icons-react'
import { Link, usePathname } from '@/i18n/navigation'
import ConnectHeader from '@/components/ConnectHeader'
import AudioPlayer from '@/components/AudioPlayer'
import NowPlayingSidebar from '@/components/NowPlayingSidebar'
import Footer from '@/components/Footer'
import { useCardano } from '@/components/Providers'
import { useAudio } from '@/components/AudioProvider'
import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'

export default function DashboardLayoutClient({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)
  const [headerMenuOpen, setHeaderMenuOpen] = useState(false)
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(true)
  
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
        "bg-[#FAF9F6]/80 dark:bg-[#0D0D12]/80 backdrop-blur-md lg:bg-transparent lg:dark:bg-transparent lg:backdrop-blur-none"
      )}>
        {/* Header Bottom Divider */}
        <div className="absolute bottom-0 left-4 right-4 lg:left-6 lg:right-6 h-[1px] bg-midnight/[0.08] dark:bg-white/[0.08]" />

        <div className="h-full px-4 lg:px-6 flex items-center justify-between">
          <Link href="/" onClick={() => setHeaderMenuOpen(false)} className="flex items-center gap-2">
            <img src="/doba.png" alt="doba logo" className="w-8 h-8 rounded-lg object-cover dark:invert-0 invert" />
            <span className="text-midnight dark:text-white text-base sm:text-lg font-extrabold tracking-tight lowercase">doba</span>
          </Link>

          <div className="hidden lg:flex items-center gap-3">
            <ConnectHeader
              address={effectiveAddress || undefined}
              logout={handleLogout}
              onNavigate={(_view) => {
                 // Handled differently now
              }}
            />
            <button 
              onClick={() => setDesktopSidebarOpen(prev => !prev)}
              className="hidden lg:flex items-center justify-center p-1.5 transition-colors text-midnight/70 dark:text-white/70 hover:text-midnight dark:hover:text-white group relative shrink-0"
              title={desktopSidebarOpen ? "Close sidebar" : "Open sidebar"}
            >
              <div className="relative w-5 h-5 flex items-center justify-center">
                <IconMenu 
                  size={20} 
                  className={cn(
                    "absolute transition-all duration-300 transform",
                    desktopSidebarOpen ? "opacity-0 rotate-90 scale-50" : "opacity-100 rotate-0 scale-100"
                  )} 
                />
                <IconX 
                  size={20} 
                  className={cn(
                    "absolute transition-all duration-300 transform",
                    desktopSidebarOpen ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-50"
                  )} 
                />
              </div>
            </button>
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
        <div className="lg:hidden fixed inset-0 top-16 z-[60] animate-slide-in-down bg-[#FAF9F6]/80 dark:bg-[#0D0D12]/80 backdrop-blur-md overflow-hidden">
          <nav className="flex flex-col p-4 pb-32 space-y-2 h-full overflow-y-auto">
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
            {/* Mobile Footer Section */}
            <div className="border-t border-midnight/[0.08] dark:border-white/[0.08]" />
            <div className="px-4 pb-12">
              <Footer />
            </div>
          </nav>
        </div>
      )}

      {/* Main Layout */}
      <div className="flex flex-col flex-1 mt-16 min-h-0 lg:overflow-hidden">
        {/* Workspace Area: Left Sidebar + Main Content + Right Sidebar */}
        <div className="flex-1 flex flex-col lg:flex-row min-h-0 overflow-hidden relative">
          <aside className={cn(
            "hidden lg:flex flex-col bg-transparent overflow-hidden relative transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] shrink-0",
            desktopSidebarOpen 
              ? "w-[20vw] min-w-[190px] max-w-[240px] opacity-100 translate-x-0" 
              : "w-0 opacity-0 -translate-x-4 pointer-events-none"
          )}>
            <nav className="flex flex-col p-3 overflow-hidden flex-1 relative w-[20vw] min-w-[190px] max-w-[240px]">
              {/* Navigation Section */}
              <div className="relative flex flex-col space-y-0.5 pb-2">
                {/* Vertical Segment for Navigation */}
                <div className="absolute right-0 top-0 bottom-0 w-[1px] bg-midnight/[0.08] dark:bg-white/[0.08]" />
                
                <div className="pl-3 pt-0 pb-0 mb-0.5">
                  <h2 className="text-[11px] font-semibold uppercase tracking-wider text-purple-400">
                    {tNav('navigation')}
                  </h2>
                </div>
                <SidebarNavLink href="/" icon={<HomeIcon size={16} className="text-[#FF1F8A] flex-shrink-0" />} label={tNav('home')} />
                <SidebarNavLink href="/library" icon={<Library size={16} className="text-[#B794F4] flex-shrink-0" />} label={tNav('library')} />
                <SidebarNavLink href="/search" icon={<Search size={16} className="text-[#B794F4] flex-shrink-0" />} label={tNav('search')} />
              </div>
              
              {/* Horizontal Divider */}
              <div className="border-t border-midnight/[0.08] dark:border-white/[0.08] my-2 ml-3 mr-4" />
              
              {/* Creator Section */}
              <div className="relative flex flex-col space-y-0.5 pt-0 pb-2">
                {/* Vertical Segment for Creator */}
                <div className="absolute right-0 top-0 bottom-0 w-[1px] bg-midnight/[0.08] dark:bg-white/[0.08]" />
                
                <div className="pl-3 pt-1 pb-0 mb-0.5">
                  <h2 className="text-[11px] font-semibold text-[#B794F4] uppercase tracking-wider" style={{ letterSpacing: '0.04em' }}>{tNav('creator')}</h2>
                </div>
                <SidebarNavLink href="/upload" icon={<Music size={16} className="text-[#FF1F8A] flex-shrink-0" />} label={tNav('upload')} />
                <SidebarNavLink href="/earnings" icon={<DollarSign size={16} className="text-[#B794F4] flex-shrink-0" />} label={tNav('earnings')} />
                <SidebarNavLink href="/analytics" icon={<TrendingUp size={16} className="text-[#B794F4] flex-shrink-0" />} label={tNav('analytics')} />
                <SidebarNavLink href="/profile" icon={<User size={16} className="text-[#B794F4] flex-shrink-0" />} label={tNav('profile')} />
              </div>

              {/* Horizontal Divider */}
              <div className="border-t border-midnight/[0.08] dark:border-white/[0.08] my-2 ml-3 mr-4" />

              {/* Desktop Footer Section */}
              <div className="relative flex flex-col pt-1">
                {/* Vertical Segment for Footer */}
                <div className="absolute right-0 top-0 bottom-2 w-[1px] bg-midnight/[0.08] dark:bg-white/[0.08]" />
                
                <div className="pl-3 pr-4 pb-2">
                  <Footer />
                </div>
              </div>
            </nav>
          </aside>

          {/* Content Area */}
          <main className="flex-1 overflow-y-auto outline-none lg:h-full">
            <div className="p-6 pb-32 md:pb-28 max-w-7xl mx-auto">
              {children}
            </div>
          </main>

          {/* Right Sidebar */}
          <NowPlayingSidebar
            track={sidebarTrack}
            isVisible={isSidebarOpen}
            onClose={toggleSidebar}
          />
        </div>

        {/* Audio Player Footer (Positioned Below Sidebar & Main Workspace) */}
        {playerState.currentTrack && (
          <AudioPlayer playerState={playerState} />
        )}
      </div>
    </div>
  )
}

function SidebarNavLink({ href, icon, label, collapsed }: { href: string, icon: React.ReactNode, label: string, collapsed?: boolean }) {
  const pathname = usePathname()
  const isActive = pathname === href || (href !== '/' && pathname?.startsWith(href))
  
  return (
    <Link
      href={href}
      prefetch
      title={collapsed ? label : undefined}
      className={cn(
        "flex items-center gap-2.5 py-1 px-2.5 transition-all duration-200 text-midnight/70 dark:text-white/70 hover:text-midnight dark:hover:text-white md:hover:-translate-y-0.5 rounded-none",
        collapsed ? "justify-center px-0" : "px-2.5",
        isActive && "text-midnight dark:text-white font-bold -translate-y-0.5"
      )}
    >
      {icon}
      {!collapsed && <span className="text-xs truncate">{label}</span>}
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
