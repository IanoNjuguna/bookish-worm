import type React from 'react'
import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'

import '../globals.css'
import { Providers } from '@/components/providers/Providers'
import { AudioProvider } from '@/components/audio'
import { ThemeProvider } from '@/components/ThemeProvider'
import { Toaster } from '@/components/ui/sonner'
import { chivo, ibmPlexMono, spaceMono, notoSansKr, RTL_LOCALES } from './layout.constants'
import type { LocaleLayoutProps } from './layout.types'

export const metadata: Metadata = {
  title: 'Doba Studio',
  icons: {
    icon: '/favicon.ico?v=2',
    shortcut: '/favicon.ico?v=2',
  },
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params

  if (!routing.locales.includes(locale as any)) {
    notFound()
  }

  const messages = await getMessages()
  const dir = RTL_LOCALES.includes(locale) ? 'rtl' : 'ltr'

  return (
    <html lang={locale} dir={dir} className={`${chivo.variable} ${spaceMono.variable} ${ibmPlexMono.variable} ${notoSansKr.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased bg-background text-midnight dark:bg-midnight dark:text-white min-h-screen" suppressHydrationWarning>
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider attribute="class" defaultTheme="dark">
            <Providers>
              <AudioProvider>
                {children}
              </AudioProvider>
            </Providers>
          </ThemeProvider>
        </NextIntlClientProvider>
        <Toaster position="bottom-right" closeButton />
      </body>
    </html>
  )
}
