import type { Metadata } from 'next';
import { Chivo, IBM_Plex_Mono } from 'next/font/google';
import { themeScript } from '@/components/theme-toggle';
import './globals.css';

const chivo = Chivo({ subsets: ['latin'], variable: '--font-chivo', display: 'swap' });
const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-ibm-plex-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'doba admin',
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`dark ${chivo.variable} ${ibmPlexMono.variable}`}
      data-theme="dark"
      suppressHydrationWarning
    >
      <head>
        {/* runs before paint so the first frame is the stored theme, never a flash */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="font-sans">{children}</body>
    </html>
  );
}
