import React from 'react'
import BackButton from '@/components/BackButton'
import SimpleHeader from '@/components/SimpleHeader'

export default function DocsPage() {
  return (
    <div>
      <SimpleHeader />
      <div className="min-h-screen bg-transparent text-midnight dark:text-white px-4 py-16 pt-32">
        <div className="max-w-4xl mx-auto">
          <BackButton />
          <h1 className="text-4xl font-bold mb-4">Documentation</h1>
          <p className="text-midnight/70 dark:text-white/70 mb-12">Everything you need to know about using doba on the Cardano blockchain.</p>
          
          <div className="space-y-12">
            
            {/* Getting Started */}
            <section>
              <h2 className="text-3xl font-semibold text-[#FF1F8A] mb-6">Getting Started with Crypto</h2>
              <p className="text-midnight/80 dark:text-white/80 mb-6">New to Cardano and cryptocurrency? Don't worry—we'll walk you through everything step by step.</p>
              
              <div className="space-y-6">
                <div className="bg-midnight/5 dark:bg-white/5 rounded-lg p-6 border border-midnight/10 dark:border-white/10">
                  <h3 className="text-xl font-semibold mb-4">1. What is Cryptocurrency?</h3>
                  <p className="text-midnight/80 dark:text-white/80 mb-4">
                    Cryptocurrency is digital money that works without banks. Instead of a bank keeping track of your balance, 
                    a network of computers (the blockchain) keeps a permanent, tamper-proof record of all transactions.
                  </p>
                  <p className="text-midnight/80 dark:text-white/80">
                    <strong className="text-midnight dark:text-white">ADA (Cardano)</strong> is the native cryptocurrency used on doba. Think of it like digital cash for the internet.
                  </p>
                </div>

                <div className="bg-midnight/5 dark:bg-white/5 rounded-lg p-6 border border-midnight/10 dark:border-white/10">
                  <h3 className="text-xl font-semibold mb-4">2. What is a Wallet?</h3>
                  <p className="text-midnight/80 dark:text-white/80 mb-4">
                    A crypto wallet is like a digital bank account, but you control it completely—no bank involved. 
                    Your wallet holds your ADA tokens and music NFTs.
                  </p>
                  <div className="bg-black/30 rounded-lg p-4 space-y-2 text-sm">
                    <p><strong className="text-midnight dark:text-white">Important:</strong></p>
                    <ul className="list-disc list-inside space-y-1 ml-4 text-midnight/70 dark:text-white/70">
                      <li>You control your wallet with a secret phrase (seed phrase)</li>
                      <li>Never share your seed phrase with anyone</li>
                      <li>If you lose your seed phrase, you lose access forever</li>
                      <li>doba never asks for your seed phrase</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-midnight/5 dark:bg-white/5 rounded-lg p-6 border border-midnight/10 dark:border-white/10">
                  <h3 className="text-xl font-semibold mb-4">3. What is a Music NFT?</h3>
                  <p className="text-midnight/80 dark:text-white/80 mb-4">
                    NFT = Non-Fungible Token. It's a digital certificate of ownership stored on the Cardano blockchain.
                  </p>
                  <p className="text-midnight/80 dark:text-white/80 mb-4">
                    When you buy a music NFT on doba, you get:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4 text-midnight/80 dark:text-white/80">
                    <li>Proof you own that specific copy of the music on-chain</li>
                    <li>High-quality audio files you can download</li>
                    <li>The ability to resell or trade your NFT</li>
                    <li>Permanent ownership—no third party can take it away</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Setting Up Your Wallet */}
            <section className="border-t border-midnight/10 dark:border-white/10 pt-12">
              <h2 className="text-3xl font-semibold text-[#FF1F8A] mb-6">Setting Up Your Wallet</h2>
              
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-[#FF1F8A]/10 to-[#B794F4]/10 rounded-lg p-6 border border-midnight/10 dark:border-white/10">
                  <h3 className="text-xl font-semibold mb-4">Step 1: Choose a Cardano Wallet</h3>
                  <p className="text-midnight/80 dark:text-white/80 mb-4">We recommend one of these CIP-30 compatible Cardano wallets for doba:</p>
                  
                  <div className="space-y-4">
                    <div className="bg-black/30 rounded-lg p-4">
                      <h4 className="font-semibold text-midnight dark:text-white mb-2">Eternl (Powerful & Feature-Rich)</h4>
                      <p className="text-sm text-midnight/70 dark:text-white/70 mb-2">The most popular power-user wallet for Cardano. Highly customizable and excellent dApp connector support.</p>
                      <a href="https://eternl.io" target="_blank" rel="noopener noreferrer" className="text-[#FF1F8A] hover:underline text-sm">
                        Get Eternl Wallet →
                      </a>
                    </div>

                    <div className="bg-black/30 rounded-lg p-4">
                      <h4 className="font-semibold text-midnight dark:text-white mb-2">Vespr (Beautiful & Mobile-First)</h4>
                      <p className="text-sm text-midnight/70 dark:text-white/70 mb-2">A sleek, secure mobile wallet designed specifically for Cardano DeFi and NFTs.</p>
                      <a href="https://vespr.xyz" target="_blank" rel="noopener noreferrer" className="text-[#FF1F8A] hover:underline text-sm">
                        Get Vespr Wallet →
                      </a>
                    </div>

                    <div className="bg-black/30 rounded-lg p-4">
                      <h4 className="font-semibold text-midnight dark:text-white mb-2">Lace (Official & Light)</h4>
                      <p className="text-sm text-midnight/70 dark:text-white/70 mb-2">Developed by IOG, the creators of Cardano. Simple, lightweight, and secure.</p>
                      <a href="https://www.lace.io" target="_blank" rel="noopener noreferrer" className="text-[#FF1F8A] hover:underline text-sm">
                        Get Lace Wallet →
                      </a>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-[#FF1F8A]/10 to-[#B794F4]/10 rounded-lg p-6 border border-midnight/10 dark:border-white/10">
                  <h3 className="text-xl font-semibold mb-4">Step 2: Connect to Network</h3>
                  <p className="text-midnight/80 dark:text-white/80 mb-4">
                    doba runs on the Cardano Preprod testnet (for developers/testing) and Cardano Mainnet. Make sure your wallet is set to the correct network in its settings before connecting.
                  </p>
                </div>

                <div className="bg-gradient-to-r from-[#FF1F8A]/10 to-[#B794F4]/10 rounded-lg p-6 border border-midnight/10 dark:border-white/10">
                  <h3 className="text-xl font-semibold mb-4">Step 3: Buy ADA</h3>
                  <p className="text-midnight/80 dark:text-white/80 mb-4">You need ADA to purchase music and pay minor blockchain network fees.</p>
                  
                  <div className="space-y-3">
                    <div className="bg-black/30 rounded-lg p-4">
                      <h4 className="font-semibold text-midnight dark:text-white mb-2 flex items-center justify-between">
                        <span>Option A: Buy with Credit Card via UTxO On-Ramp</span>
                        <span className="text-[10px] bg-[#FF1F8A]/20 text-[#FF1F8A] px-2 py-0.5 font-mono uppercase tracking-wider">Recommended</span>
                      </h4>
                      <p className="text-sm text-midnight/70 dark:text-white/70 mb-3">Buy ADA instantly using credit card, Apple Pay, Google Pay, or bank transfer.</p>
                      <a href="https://utxos.dev/onramp" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-[#FF1F8A] hover:underline text-sm font-semibold">
                        Launch UTxO Cardano On-Ramp →
                      </a>
                    </div>

                    <div className="bg-black/30 rounded-lg p-4">
                      <h4 className="font-semibold text-midnight dark:text-white mb-2">Option B: Buy on a Centralized Exchange</h4>
                      <ol className="list-decimal list-inside space-y-1 text-sm text-midnight/70 dark:text-white/70 ml-4">
                        <li>Buy ADA on Coinbase, Binance, Kraken, or another exchange</li>
                        <li>Send ADA to your connected wallet address</li>
                      </ol>
                    </div>

                    <div className="bg-black/30 rounded-lg p-4">
                      <h4 className="font-semibold text-midnight dark:text-white mb-2">Option C: Use a Testnet Faucet (Preprod Only)</h4>
                      <p className="text-sm text-midnight/70 dark:text-white/70 mb-2">If you are testing on Preprod, get free mock ADA:</p>
                      <a href="https://docs.cardano.org/cardano-testnet/tools/faucet/" target="_blank" rel="noopener noreferrer" className="text-[#FF1F8A] hover:underline text-sm font-semibold">
                        Go to Cardano Faucet →
                      </a>
                    </div>
                  </div>

                  <p className="text-sm text-midnight/60 dark:text-white/60 mt-4">
                    💡 <strong>Tip:</strong> Start with 20-50 ADA. That's more than enough to collect several songs and cover transaction fees.
                  </p>
                </div>
              </div>
            </section>

            {/* Using doba */}
            <section className="border-t border-midnight/10 dark:border-white/10 pt-12">
              <h2 className="text-3xl font-semibold text-[#FF1F8A] mb-6">Using doba</h2>
              
              <div className="space-y-6">
                <div className="bg-midnight/5 dark:bg-white/5 rounded-lg p-6 border border-midnight/10 dark:border-white/10">
                  <h3 className="text-xl font-semibold mb-4">Connecting Your Wallet</h3>
                  <ol className="list-decimal list-inside space-y-2 text-midnight/80 dark:text-white/80 ml-4">
                    <li>Click "Connect Wallet" in the top right of doba</li>
                    <li>Choose your wallet (e.g. Eternl, Vespr, Lace, Nami) from the popup</li>
                    <li>Approve the read connection in your wallet extension/app</li>
                    <li>Done! Your wallet address and balance will show in the header</li>
                  </ol>
                  <p className="text-sm text-midnight/60 dark:text-white/60 mt-4">
                    ✅ doba never gets access to your private keys or seed phrase. Connecting just allows the app to request transactions and verify NFT ownership.
                  </p>
                </div>

                <div className="bg-midnight/5 dark:bg-white/5 rounded-lg p-6 border border-midnight/10 dark:border-white/10">
                  <h3 className="text-xl font-semibold mb-4">Buying Music</h3>
                  <ol className="list-decimal list-inside space-y-2 text-midnight/80 dark:text-white/80 ml-4">
                    <li>Browse the marketplace and find music you love</li>
                    <li>Stream for free to preview the track</li>
                    <li>Click the price button (e.g., "5 ADA") to buy</li>
                    <li>Sign the transaction with your wallet when prompted</li>
                    <li>Wait a few seconds for blockchain confirmation (usually 10-20 seconds on Cardano)</li>
                    <li>Done! The NFT is now in "My Studio" and you can download the full-quality files</li>
                  </ol>
                </div>

                <div className="bg-midnight/5 dark:bg-white/5 rounded-lg p-6 border border-midnight/10 dark:border-white/10">
                  <h3 className="text-xl font-semibold mb-4">Understanding Transaction Fees</h3>
                  <p className="text-midnight/80 dark:text-white/80 mb-4">
                    Cardano transaction fees (often called min fees or gas) are paid directly to the network node validators to process your transactions.
                  </p>
                  <div className="bg-black/30 rounded-lg p-4 space-y-2 text-sm">
                    <p className="text-midnight/80 dark:text-white/80"><strong>Typical transaction fees:</strong></p>
                    <ul className="list-disc list-inside space-y-1 ml-4 text-midnight/70 dark:text-white/70">
                      <li>Buying music: ~0.17 - 0.20 ADA</li>
                      <li>Minting music: ~0.20 - 0.30 ADA</li>
                    </ul>
                    <p className="text-midnight/60 dark:text-white/60 mt-2">Cardano transaction fees are deterministic and remain incredibly low regardless of network congestion.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* For Artists */}
            <section className="border-t border-midnight/10 dark:border-white/10 pt-12">
              <h2 className="text-3xl font-semibold text-[#B794F4] mb-6">For Artists</h2>
              
              <div className="space-y-6">
                <div className="bg-midnight/5 dark:bg-white/5 rounded-lg p-6 border border-midnight/10 dark:border-white/10">
                  <h3 className="text-xl font-semibold mb-4">Minting Your First Track</h3>
                  <ol className="list-decimal list-inside space-y-2 text-midnight/80 dark:text-white/80 ml-4">
                    <li>Connect your wallet and sign in</li>
                    <li>Click "Upload" in the navigation</li>
                    <li>Upload your audio file (WAV or FLAC recommended)</li>
                    <li>Add cover art (1000x1000px minimum)</li>
                    <li>Fill in track details (title, description, genre)</li>
                    <li>Set your price in ADA</li>
                    <li>Add collaborators if applicable (optional)</li>
                    <li>Click "Mint" and sign the transaction</li>
                    <li>Wait for confirmation—your track is now live!</li>
                  </ol>
                </div>

                <div className="bg-midnight/5 dark:bg-white/5 rounded-lg p-6 border border-midnight/10 dark:border-white/10">
                  <h3 className="text-xl font-semibold mb-4">Setting Up Collaborations</h3>
                  <p className="text-midnight/80 dark:text-white/80 mb-4">When minting a collaborative track:</p>
                  <ol className="list-decimal list-inside space-y-2 text-midnight/80 dark:text-white/80 ml-4">
                    <li>Click "Add Collaborator"</li>
                    <li>Enter each collaborator's Cardano wallet address (`addr1...`)</li>
                    <li>Set their revenue percentage</li>
                    <li>Ensure total percentages add up to 100%</li>
                    <li>Mint the track—revenue splits are permanently hardcoded and automated</li>
                  </ol>
                  <p className="text-sm text-midnight/60 dark:text-white/60 mt-4">
                    💡 Get wallet addresses from your collaborators before minting. Splits cannot be modified after the NFT is minted!
                  </p>
                </div>

                <div className="bg-midnight/5 dark:bg-white/5 rounded-lg p-6 border border-midnight/10 dark:border-white/10">
                  <h3 className="text-xl font-semibold mb-4">Tracking Your Earnings</h3>
                  <p className="text-midnight/80 dark:text-white/80 mb-4">All earnings go directly to your wallet instantly. To view analytics:</p>
                  <ul className="list-disc list-inside space-y-2 text-midnight/80 dark:text-white/80 ml-4">
                    <li>Go to the "My Studio" tab</li>
                    <li>Click "View Revenue" on any track</li>
                    <li>See total earnings, number of sales, and royalties</li>
                    <li>Check your wallet's ADA balance</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Security */}
            <section className="border-t border-midnight/10 dark:border-white/10 pt-12">
              <h2 className="text-3xl font-semibold text-[#FF1F8A] mb-6">Security Best Practices</h2>
              
              <div className="bg-yellow-500/10 rounded-lg p-6 border border-yellow-500/30">
                <h3 className="text-xl font-semibold mb-4 text-yellow-200">🔒 Keep Your Wallet Safe</h3>
                <ul className="space-y-3 text-midnight/80 dark:text-white/80">
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-200 flex-shrink-0">•</span>
                    <span><strong>Never share your seed phrase</strong> - Not even with doba support. We'll never ask for it.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-200 flex-shrink-0">•</span>
                    <span><strong>Write down your seed phrase</strong> - Store it somewhere safe, offline. If you lose it, your funds and NFTs are lost forever.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-200 flex-shrink-0">•</span>
                    <span><strong>Double-check addresses</strong> - Before sending ADA, verify the wallet address is correct. Cardano addresses are long, so always copy-paste or scan QR codes.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-200 flex-shrink-0">•</span>
                    <span><strong>Beware of scams</strong> - doba will never send you direct messages asking for ADA or seed phrases.</span>
                  </li>
                </ul>
              </div>
            </section>

            {/* Troubleshooting */}
            <section className="border-t border-midnight/10 dark:border-white/10 pt-12">
              <h2 className="text-3xl font-semibold text-[#FF1F8A] mb-6">Troubleshooting</h2>
              
              <div className="space-y-4">
                <div className="bg-midnight/5 dark:bg-white/5 rounded-lg p-4 border border-midnight/10 dark:border-white/10">
                  <h3 className="font-semibold mb-2">Transaction failed / timed out</h3>
                  <p className="text-sm text-midnight/80 dark:text-white/80">Make sure your wallet has enough ADA to cover both the song price and the transaction network fee, plus at least 2 ADA for Cardano's UTXO min-ADA requirements.</p>
                </div>

                <div className="bg-midnight/5 dark:bg-white/5 rounded-lg p-4 border border-midnight/10 dark:border-white/10">
                  <h3 className="font-semibold mb-2">Wallet won't connect</h3>
                  <p className="text-sm text-midnight/80 dark:text-white/80">Ensure your browser extension is unlocked. If you are on a testnet, confirm your wallet network is set to "Preprod" or "Preview" rather than "Mainnet".</p>
                </div>

                <div className="bg-midnight/5 dark:bg-white/5 rounded-lg p-4 border border-midnight/10 dark:border-white/10">
                  <h3 className="font-semibold mb-2">Don't see my NFT after purchase</h3>
                  <p className="text-sm text-midnight/80 dark:text-white/80">Cardano block times are ~20 seconds. Wait 30-60 seconds for the next block to be minted, then refresh the page and check the "My Studio" tab.</p>
                </div>
              </div>

              <p className="text-midnight/60 dark:text-white/60 text-sm mt-6">
                Still stuck? <a href="/support" className="text-[#FF1F8A] hover:underline">Contact support</a> and we'll help you out.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
