import type { Metadata, Viewport } from 'next'

export const metadata: Metadata = {
  title: 'Doba Studio',
  description: 'Upload, manage, and earn from your music on Doba.',
  icons: {
    icon: '/favicon.ico?v=2',
    shortcut: '/favicon.ico?v=2',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0D0D12',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">{children}</body>
    </html>
  )
}
