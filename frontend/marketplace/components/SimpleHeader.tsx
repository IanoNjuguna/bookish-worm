import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'

export default function SimpleHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[rgba(250,249,246,0.6)] dark:bg-[rgba(13,13,18,0.6)] backdrop-blur-xl border-b border-midnight/10 dark:border-white/10">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <Image
              src="/doba.png"
              alt="doba"
              width={32}
              height={32}
              className="w-8 h-8 dark:invert-0 invert"
            />
          </Link>
        </div>
      </div>
    </header>
  )
}
