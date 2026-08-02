import React from 'react'
import BackButton from '@/components/BackButton'
import SimpleHeader from '@/components/SimpleHeader'

export default function HowItWorksPage() {
  return (
    <div>
      <SimpleHeader />
      <div className="min-h-screen bg-transparent text-midnight dark:text-white px-4 py-16 pt-32">
        <div className="max-w-4xl mx-auto">
          <BackButton />
          <h1 className="text-4xl font-bold mb-8">How It Works</h1>
        
        <div className="space-y-12 text-midnight/80 dark:text-white/80 leading-relaxed">
          {/* For Fans */}
          <section>
            <h2 className="text-3xl font-semibold text-midnight dark:text-white mb-6">For Fans</h2>
            
            <div className="space-y-8">
              <div className="bg-midnight/5 dark:bg-white/5 rounded-lg p-6 border border-midnight/10 dark:border-white/10">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#FF1F8A] flex items-center justify-center text-2xl font-bold">
                    1
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-midnight dark:text-white mb-2">Discover Music</h3>
                    <p>Browse doba's marketplace to discover music from independent artists. Stream any song for free to preview before you buy.</p>
                  </div>
                </div>
              </div>

              <div className="bg-midnight/5 dark:bg-white/5 rounded-lg p-6 border border-midnight/10 dark:border-white/10">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#FF1F8A] flex items-center justify-center text-2xl font-bold">
                    2
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-midnight dark:text-white mb-2">Set Up Your Cardano Wallet</h3>
                    <p className="mb-3">To own music, you'll need a Cardano wallet. Don't worry—it's easier than it sounds!</p>
                    <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                      <li>We recommend Eternl, Vespr, or Lace</li>
                      <li>Make sure your wallet is funded with Cardano (ADA)</li>
                      <li>Add some ADA to pay for music and transaction fees</li>
                    </ul>
                    <p className="mt-3 text-sm text-midnight/60 dark:text-white/60">
                      New to crypto? Check our <a href="/docs" className="text-[#FF1F8A] hover:underline">Docs</a> for step-by-step guides.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-midnight/5 dark:bg-white/5 rounded-lg p-6 border border-midnight/10 dark:border-white/10">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#FF1F8A] flex items-center justify-center text-2xl font-bold">
                    3
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-midnight dark:text-white mb-2">Purchase Music NFTs</h3>
                    <p className="mb-3">When you find a song you love, click the price button to purchase it as a Cardano NFT. You'll pay:</p>
                    <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                      <li>The artist's listed price in ADA</li>
                      <li>A tiny network transaction fee (typically around 0.17 - 0.20 ADA)</li>
                    </ul>
                    <p className="mt-3">Your purchase goes directly to the artist—no middlemen taking cuts.</p>
                  </div>
                </div>
              </div>

              <div className="bg-midnight/5 dark:bg-white/5 rounded-lg p-6 border border-midnight/10 dark:border-white/10">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#FF1F8A] flex items-center justify-center text-2xl font-bold">
                    4
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-midnight dark:text-white mb-2">Own & Enjoy</h3>
                    <p className="mb-3">Once you own a music NFT:</p>
                    <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                      <li>Download the high-quality audio file (WAV or FLAC)</li>
                      <li>Listen offline anytime, anywhere</li>
                      <li>View your collection in "My Studio"</li>
                      <li>Resell or trade your NFTs on Cardano secondary marketplaces</li>
                    </ul>
                    <p className="mt-3 text-sm text-midnight/60 dark:text-white/60">
                      You truly own this music. It's stored on the Cardano blockchain and cannot be taken away.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* For Artists */}
          <section className="border-t border-midnight/10 dark:border-white/10 pt-12">
            <h2 className="text-3xl font-semibold text-midnight dark:text-white mb-6">For Artists</h2>
            
            <div className="space-y-8">
              <div className="bg-midnight/5 dark:bg-white/5 rounded-lg p-6 border border-midnight/10 dark:border-white/10">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#B794F4] flex items-center justify-center text-2xl font-bold">
                    1
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-midnight dark:text-white mb-2">Connect Your Wallet</h3>
                    <p className="mb-3">Sign in to doba with your Cardano wallet. This is how you'll receive payments and manage your music.</p>
                    <p className="text-sm text-midnight/60 dark:text-white/60">
                      No wallet? Set one up in minutes—see our <a href="/docs" className="text-[#B794F4] hover:underline">Docs</a>.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-midnight/5 dark:bg-white/5 rounded-lg p-6 border border-midnight/10 dark:border-white/10">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#B794F4] flex items-center justify-center text-2xl font-bold">
                    2
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-midnight dark:text-white mb-2">Upload Your Music</h3>
                    <p className="mb-3">Upload your audio file, add cover art, and set your price in ADA. You can upload:</p>
                    <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                      <li>Single tracks</li>
                      <li>Full albums or EPs</li>
                      <li>Collaborative projects with automatic revenue splits</li>
                    </ul>
                    <p className="mt-3 text-sm bg-midnight/5 dark:bg-white/5 border border-midnight/10 dark:border-white/10 rounded p-3">
                      <strong className="text-midnight dark:text-white">Important:</strong> By uploading, you confirm you own or have rights to this music. 
                      See our <a href="/terms" className="text-[#B794F4] hover:underline">Terms</a> for details.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-midnight/5 dark:bg-white/5 rounded-lg p-6 border border-midnight/10 dark:border-white/10">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#B794F4] flex items-center justify-center text-2xl font-bold">
                    3
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-midnight dark:text-white mb-2">Mint Your NFT</h3>
                    <p className="mb-3">Click "Mint" to publish your music to the blockchain. You'll pay a small Cardano network fee (typically around 0.2 - 0.3 ADA).</p>
                    <p>Once minted, your music is live on doba and fans can discover and purchase it.</p>
                  </div>
                </div>
              </div>

              <div className="bg-midnight/5 dark:bg-white/5 rounded-lg p-6 border border-midnight/10 dark:border-white/10">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#B794F4] flex items-center justify-center text-2xl font-bold">
                    4
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-midnight dark:text-white mb-2">Earn & Grow</h3>
                    <p className="mb-3">When fans buy your music:</p>
                    <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                      <li>You keep 93% of the sale price</li>
                      <li>Earnings go directly to your wallet</li>
                      <li>No waiting for payouts or dealing with labels</li>
                    </ul>
                    <p className="mt-3">
                      Plus, you earn 10-15% royalties every time your NFT is resold on-chain.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-midnight/5 dark:bg-white/5 rounded-lg p-6 border border-midnight/10 dark:border-white/10">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[#B794F4] flex items-center justify-center text-2xl font-bold">
                    5
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-midnight dark:text-white mb-2">Track Your Success</h3>
                    <p className="mb-3">View real-time analytics in "My Studio":</p>
                    <ul className="list-disc list-inside space-y-1 ml-4 text-sm">
                      <li>Total earnings per track</li>
                      <li>Number of collectors</li>
                      <li>Secondary sale royalties</li>
                      <li>Revenue breakdown for collaborations</li>
                    </ul>
                    <p className="mt-3 text-sm text-midnight/60 dark:text-white/60">
                      Everything is on the blockchain—100% transparent, 100% verifiable.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Collaborations */}
          <section className="border-t border-midnight/10 dark:border-white/10 pt-12">
            <h2 className="text-3xl font-semibold text-midnight dark:text-white mb-6">Collaborative Projects</h2>
            <div className="bg-midnight/5 dark:bg-white/5 rounded-lg p-6 border border-midnight/10 dark:border-white/10">
              <p className="mb-4">
                Working with other artists? doba makes revenue splits automatic and transparent.
              </p>
              <p className="mb-4">
                When uploading a collaborative track, simply add collaborator Cardano wallet addresses (`addr1...`) and set 
                each person's revenue percentage. When the NFT sells, earnings are automatically split 
                and sent to each collaborator's wallet—no manual calculations or payments needed.
              </p>
              <p className="text-sm text-midnight/60 dark:text-white/60">
                This applies to both primary sales and secondary sale royalties.
              </p>
            </div>
          </section>

          {/* Questions */}
          <section className="border-t border-midnight/10 dark:border-white/10 pt-12">
            <h2 className="text-3xl font-semibold text-midnight dark:text-white mb-6">Still Have Questions?</h2>
            <div className="space-y-4">
              <a href="/faq" className="block bg-midnight/5 dark:bg-white/5 rounded-lg p-4 border border-midnight/10 dark:border-white/10 hover:bg-midnight dark:hover:bg-white transition-colors">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Check our FAQ</span>
                  <span className="text-[#FF1F8A]">→</span>
                </div>
              </a>
              <a href="/docs" className="block bg-midnight/5 dark:bg-white/5 rounded-lg p-4 border border-midnight/10 dark:border-white/10 hover:bg-midnight dark:hover:bg-white transition-colors">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Read the Docs</span>
                  <span className="text-[#FF1F8A]">→</span>
                </div>
              </a>
              <a href="/support" className="block bg-midnight/5 dark:bg-white/5 rounded-lg p-4 border border-midnight/10 dark:border-white/10 hover:bg-midnight dark:hover:bg-white transition-colors">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Contact Support</span>
                  <span className="text-[#FF1F8A]">→</span>
                </div>
              </a>
            </div>
          </section>
        </div>
        </div>
      </div>
    </div>
  )
}
