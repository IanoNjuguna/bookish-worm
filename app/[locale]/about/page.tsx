import React from 'react'
import BackButton from '@/components/BackButton'
import SimpleHeader from '@/components/SimpleHeader'

export default function AboutPage() {
  return (
    <div>
      <SimpleHeader />
      <div className="min-h-screen bg-transparent text-midnight dark:text-white px-4 py-16 pt-32">
        <div className="max-w-4xl mx-auto">
          <BackButton />
          <h1 className="text-4xl font-bold mb-8">About doba</h1>
        
        <div className="space-y-8 text-midnight/80 dark:text-white/80 leading-relaxed">
          <section>
            <h2 className="text-2xl font-semibold text-midnight dark:text-white mb-4">Our Mission</h2>
            <p className="mb-4">
              doba empowers fans to own the music they love and artists to profit from their creativity. 
              We're building a blockchain-native music platform where independent artists control their work 
              and fans directly support the creators they believe in.
            </p>
            <p>
              No middlemen. No gatekeepers. Just artists, fans, and music.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-midnight dark:text-white mb-4">For Fans</h2>
            <p className="mb-4">
              Stream music for free, own it forever. When you purchase a music NFT on doba:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>You truly own the music (stored on blockchain)</li>
              <li>Download and listen offline anytime</li>
              <li>Directly support artists you love</li>
              <li>Resell or trade your music NFTs</li>
              <li>Get early access to new releases from your favorite artists</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-midnight dark:text-white mb-4">For Artists</h2>
            <p className="mb-4">
              Take control of your music career. With doba, you can:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Upload and mint your music as NFTs</li>
              <li>Set your own prices and keep 93% of primary sales</li>
              <li>Earn 10-15% royalties on all secondary sales forever</li>
              <li>Collaborate with other artists and auto-split revenue</li>
              <li>Build direct relationships with your fans</li>
              <li>Track earnings transparently on the blockchain</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-midnight dark:text-white mb-4">Omnichain Technology</h2>
            <p className="mb-4">
              doba uses omnichain NFT technology that works across multiple blockchain networks, providing:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Low transaction fees (pennies to dollars, depending on network)</li>
              <li>Fast, reliable transactions</li>
              <li>Cross-chain interoperability</li>
              <li>Flexibility to choose your preferred network</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-midnight dark:text-white mb-4">Revenue Model</h2>
            <p className="mb-4">
              We believe in transparency. Here's how money flows on doba:
            </p>
            <div className="bg-midnight/5 dark:bg-white/5 rounded-lg p-6 space-y-3">
              <div>
                <strong className="text-midnight dark:text-white">Primary Sales (first purchase):</strong>
                <p className="ml-4 mt-1">Artist: 93% • doba: 7%</p>
              </div>
              <div>
                <strong className="text-midnight dark:text-white">Secondary Sales (resales):</strong>
                <p className="ml-4 mt-1">Seller: 84-89% • Artist: 10-15% royalty • doba: 1%</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-midnight dark:text-white mb-4">Why We Built This</h2>
            <p className="mb-4">
              The music industry is broken. Streaming platforms pay artists fractions of a penny per play. 
              Record labels take massive cuts. Independent artists struggle to make a living.
            </p>
            <p className="mb-4">
              We believe artists deserve to profit from their work and fans deserve to truly own the music 
              they love. Blockchain technology makes this possible.
            </p>
            <p>
              doba is for the artists who create music because they love it, and the fans who support them 
              because they believe in them.
            </p>
          </section>

          <section className="border-t border-midnight/10 dark:border-white/10 pt-8">
            <h2 className="text-2xl font-semibold text-midnight dark:text-white mb-4">Join Us</h2>
            <p>
              Whether you're an artist looking to mint your first music NFT or a fan ready to own music 
              you love, doba is here for you. Welcome to the future of music.
            </p>
          </section>
        </div>
      </div>
      </div>
    </div>
  )
}
