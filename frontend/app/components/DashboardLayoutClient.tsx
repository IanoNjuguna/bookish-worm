'use client'

import React, { useState, useEffect } from 'react'
import { IconHome as HomeIcon, IconPlaylistAdd as Library, IconSearch as Search, IconCurrencyDollar as DollarSign, IconChartBar as ChartBar, IconUser as User, IconLogout as LogOut, IconMusic as Music, IconMenu, IconX } from '@tabler/icons-react'
import { Link, usePathname } from '@/i18n/navigation'
import ConnectHeader from '@/components/ConnectHeader'
import AudioPlayer from '@/components/AudioPlayer'
import NowPlayingSidebar from '@/components/NowPlayingSidebar'
import Footer from '@/components/Footer'
import OnboardingChecklist from '@/components/OnboardingChecklist'
import { useCardano } from '@/components/Providers'
import { useAudio } from '@/components/AudioProvider'
import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { useHasUploads } from '@/hooks/use-has-uploads'
import { useArtistMode } from '@/hooks/use-artist-mode'

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

  const hasUploads = useHasUploads()
  const { artistMode } = useArtistMode()
  const showStudioNav = hasUploads || artistMode

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
        "fixed top-3 left-3 right-3 lg:top-4 lg:left-6 lg:right-6 z-50 h-16 rounded-2xl transition-colors duration-200",
        "glass-surface bg-midnight/[0.02] dark:bg-white/[0.02] backdrop-blur-2xl shadow-lg"
      )}>

        <div className="h-full px-4 lg:px-6 flex items-center justify-between">
          <Link href="/" onClick={() => setHeaderMenuOpen(false)} className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 rounded-full overflow-hidden">
              <img src="/doba.png" alt="Doba" className="w-full h-full object-cover invert dark:invert-0" />
            </div>
            <span className="hidden sm:inline md:hidden text-midnight dark:text-white text-base font-extrabold tracking-tight lowercase">doba</span>
            <span className="hidden md:inline text-midnight dark:text-white text-base sm:text-lg font-extrabold tracking-tight lowercase">doba world</span>
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
              onMenuClick={() => {
                const opening = !headerMenuOpen
                setHeaderMenuOpen(opening)
                if (opening && isSidebarOpen) toggleSidebar()
              }}
              isMenuOpen={headerMenuOpen}
            />
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {headerMenuOpen && (
        <div className="lg:hidden fixed inset-x-3 top-20 bottom-3 z-[60] animate-slide-in-down glass-surface bg-background/95 dark:bg-midnight/80 rounded-2xl shadow-xl overflow-hidden">
          <nav className="flex flex-col p-4 pb-32 h-full overflow-y-auto">
            <div className="space-y-1">
              <MobileNavLink href="/" icon={<HomeIcon size={18} className="text-pink-600 dark:text-cyber-pink flex-shrink-0" />} label={tNav('home')} setMenuOpen={setHeaderMenuOpen} />
              <MobileNavLink href="/library" icon={<Library size={18} className="text-pink-600 dark:text-cyber-pink flex-shrink-0" />} label={tNav('library')} setMenuOpen={setHeaderMenuOpen} />
              <MobileNavLink href="/search" icon={<Search size={18} className="text-pink-600 dark:text-cyber-pink flex-shrink-0" />} label={tNav('search')} setMenuOpen={setHeaderMenuOpen} />
              <div className="h-[1px] rounded-full bg-gradient-to-r from-transparent via-midnight/[0.08] dark:via-white/[0.08] to-transparent my-1" />
              <MobileNavLink href="/upload" icon={<Music size={18} className="text-pink-600 dark:text-cyber-pink flex-shrink-0" />} label={tNav('upload')} setMenuOpen={setHeaderMenuOpen} />
              {showStudioNav && (
                <>
                  <MobileNavLink href="/earnings" icon={<DollarSign size={18} className="text-pink-600 dark:text-cyber-pink flex-shrink-0" />} label={tNav('earnings')} setMenuOpen={setHeaderMenuOpen} />
                  <MobileNavLink href="/analytics" icon={<ChartBar size={18} className="text-pink-600 dark:text-cyber-pink flex-shrink-0" />} label={tNav('analytics')} setMenuOpen={setHeaderMenuOpen} />
                </>
              )}
              <MobileNavLink href="/profile" icon={<User size={18} className="text-pink-600 dark:text-cyber-pink flex-shrink-0" />} label={tNav('profile')} setMenuOpen={setHeaderMenuOpen} />
            </div>

            <div className="pt-6 border-t border-midnight/[0.08] dark:border-white/[0.08]">
              <OnboardingChecklist />
            </div>

            <div className="pt-4">
              <div className="px-4 pb-12">
                <Footer />
              </div>
            </div>
          </nav>
        </div>
      )}

      {/* Main Layout */}
      <div className="flex flex-col flex-1 min-h-0 lg:overflow-hidden">
        {/* Workspace Area: Left Sidebar + Main Content + Right Sidebar */}
        <div className="flex-1 flex flex-col lg:flex-row min-h-0 overflow-hidden relative">
          <aside className={cn(
            "hidden lg:flex flex-col overflow-hidden relative transition-all duration-300 ease-in-out shrink-0 glass-surface bg-background/80 dark:bg-midnight/60 rounded-2xl shadow-xl min-h-0",
            desktopSidebarOpen 
              ? "w-60 opacity-100 translate-x-0 mt-20 lg:mt-24 mr-0 mb-28 ml-4" 
              : "w-0 opacity-0 -translate-x-4 pointer-events-none m-0"
          )}>
            {/* Feathered vertical edge rule */}
            <div className="absolute right-0 top-4 bottom-4 w-[1px] rounded-full bg-gradient-to-b from-transparent via-midnight/[0.08] dark:via-white/[0.08] to-transparent" />
            <nav className="flex flex-col p-3 overflow-y-auto no-scrollbar flex-1 relative w-60 min-h-0 space-y-6">
              <div className="flex flex-col space-y-0.5">
                <SidebarNavLink href="/" icon={<HomeIcon size={16} />} label={tNav('home')} />
                <div id="side-nav-library">
                  <SidebarNavLink href="/library" icon={<Library size={16} />} label={tNav('library')} />
                </div>
                <SidebarNavLink href="/search" icon={<Search size={16} />} label={tNav('search')} />
                <div className="h-[1px] rounded-full bg-gradient-to-r from-transparent via-midnight/[0.08] dark:via-white/[0.08] to-transparent my-1" />
                <SidebarNavLink href="/upload" icon={<Music size={16} />} label={tNav('upload')} />
                {showStudioNav && (
                  <>
                    <SidebarNavLink href="/earnings" icon={<DollarSign size={16} />} label={tNav('earnings')} />
                    <SidebarNavLink href="/analytics" icon={<ChartBar size={16} />} label={tNav('analytics')} />
                  </>
                )}
                <SidebarNavLink href="/profile" icon={<User size={16} />} label={tNav('profile')} />
              </div>

              {/* Onboarding checklist + Footer */}
              <div className="pt-6 border-t border-midnight/[0.08] dark:border-white/[0.08]">
                <div className="px-1 pb-3">
                  <OnboardingChecklist />
                </div>
                <div className="pt-4 border-t border-midnight/[0.04] dark:border-white/[0.04]">
                  <div className="pl-3 pr-4 pb-2">
                    <Footer />
                  </div>
                </div>
              </div>

            </nav>
          </aside>

          {/* Content Area */}
          <main className="flex-1 overflow-y-auto outline-none lg:h-full">
            <div className="pt-20 lg:pt-24 px-6 pb-24 max-w-7xl mx-auto">
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
        "group relative flex items-center gap-2.5 rounded-lg py-2 px-3 select-none transition-colors duration-150",
        isActive
          ? "bg-cyber-pink/5 dark:bg-cyber-pink/10 text-cyber-pink font-bold"
          : "text-midnight/80 dark:text-white/70 hover:bg-midnight/[0.03] dark:hover:bg-white/[0.03] hover:text-midnight dark:hover:text-white"
      )}
    >
      <span className={cn(
        "shrink-0 transition-colors duration-150",
        isActive ? "text-cyber-pink" : "text-midnight/60 dark:text-white/50 group-hover:text-midnight dark:group-hover:text-white"
      )}>
        {icon}
      </span>
      {!collapsed && <span className="text-xs transition-colors duration-150">{label}</span>}
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
        "flex items-center gap-3 px-4 py-2 transition-all duration-200 text-midnight/90 dark:text-white/80 hover:text-midnight dark:hover:text-white md:hover:-translate-y-0.5 md:hover:font-semibold",
        isActive && "text-midnight dark:text-white font-bold -translate-y-0.5"
      )}
    >
      {icon}
      <span className="text-sm">{label}</span>
    </Link>
  )
}
