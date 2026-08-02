'use client'

import { useTranslations } from 'next-intl'
import LanguageSwitcher from './LanguageSwitcher'
import { Link } from '@/i18n/navigation'

const IconInstagram = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
)

const IconTwitter = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.713 5.88zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
)

const IconLinkedIn = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
  </svg>
)

const IconTikTok = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.06-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.9-.32-1.98-.23-2.81.31-.72.42-1.24 1.16-1.41 1.97-.22.86-.06 1.84.45 2.56.55.85 1.58 1.34 2.59 1.25 1.25-.03 2.39-.77 2.91-1.9.15-.41.22-.84.22-1.27.02-3.8.01-7.61.01-11.42z" />
  </svg>
)

export default function Footer() {
  const t = useTranslations('footer')

  const socials = [
    { icon: <IconTwitter />, href: 'https://x.com/doba_DAO', label: 'X (Twitter)' },
    { icon: <IconInstagram />, href: 'https://instagram.com/doba_protocol', label: 'Instagram' },
    { icon: <IconLinkedIn />, href: 'https://www.linkedin.com/company/doba-world/', label: 'LinkedIn' },
    { icon: <IconTikTok />, href: 'https://www.tiktok.com/@doba.world', label: 'TikTok' },
  ]

  return (
    <div className="w-full text-midnight/70 dark:text-white/70 text-xs flex flex-col gap-4">
      {/* Flattened categorized links */}
      <div className="space-y-3">
        <div>
          <span className="font-bold text-midnight/70 dark:text-white/40 uppercase tracking-widest text-[9px] block mb-1">Company</span>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-midnight/60 dark:text-white/60">
            <Link href="/about" className="hover:text-[#FF1F8A] dark:hover:text-[#FF1F8A] transition-colors">{t('about')}</Link>
            <span className="text-midnight/50 dark:text-white/20">·</span>
            <Link href="/how-it-works" className="hover:text-[#FF1F8A] dark:hover:text-[#FF1F8A] transition-colors">{t('howItWorks')}</Link>
            <span className="text-midnight/50 dark:text-white/20">·</span>
            <Link href="/docs" className="hover:text-[#FF1F8A] dark:hover:text-[#FF1F8A] transition-colors">{t('docs')}</Link>
          </div>
        </div>
        
        <div>
          <span className="font-bold text-midnight/70 dark:text-white/40 uppercase tracking-widest text-[9px] block mb-1">Community</span>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-midnight/60 dark:text-white/60">
            <Link href="/for-artists" className="hover:text-[#FF1F8A] dark:hover:text-[#FF1F8A] transition-colors">{t('forArtists')}</Link>
            <span className="text-midnight/50 dark:text-white/20">·</span>
            <Link href="/support" className="hover:text-[#FF1F8A] dark:hover:text-[#FF1F8A] transition-colors">{t('support')}</Link>
            <span className="text-midnight/50 dark:text-white/20">·</span>
            <Link href="/faq" className="hover:text-[#FF1F8A] dark:hover:text-[#FF1F8A] transition-colors">{t('faq')}</Link>
          </div>
        </div>

        <div>
          <span className="font-bold text-midnight/70 dark:text-white/40 uppercase tracking-widest text-[9px] block mb-1">Legal</span>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-midnight/60 dark:text-white/60">
            <Link href="/terms" className="hover:text-[#FF1F8A] dark:hover:text-[#FF1F8A] transition-colors">{t('terms')}</Link>
            <span className="text-midnight/50 dark:text-white/20">·</span>
            <Link href="/privacy" className="hover:text-[#FF1F8A] dark:hover:text-[#FF1F8A] transition-colors">{t('privacy')}</Link>
          </div>
        </div>
      </div>

      {/* Social links row */}
      <div className="flex items-center gap-2 mt-1">
        {socials.map((s) => (
          <a
            key={s.label}
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={s.label}
            className="w-8 h-8 border border-midnight/10 dark:border-white/10 hover:bg-midnight/5 dark:hover:bg-white/5 flex items-center justify-center text-midnight/60 dark:text-white/60 hover:text-midnight dark:hover:text-white transition-colors"
          >
            {s.icon}
          </a>
        ))}
      </div>

      {/* Language selector and copyright */}
      <div className="flex flex-col gap-2 pt-3 mt-1 border-t border-midnight/[0.06] dark:border-white/[0.06]">
        <div className="flex items-center gap-2 text-midnight/50 dark:text-white/50">
          <span>{t('language')}:</span>
          <LanguageSwitcher />
        </div>
        <p className="text-[10px] text-midnight/70 dark:text-white/40 mt-1">
          © {new Date().getFullYear()} doba
        </p>
      </div>
    </div>
  )
}
