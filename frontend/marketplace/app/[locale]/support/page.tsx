import React from 'react'
import BackButton from '@/components/BackButton'
import SimpleHeader from '@/components/SimpleHeader'
import { IconMail, IconBrandGithub, IconBrandTwitter, IconBug, IconQuestionMark, IconShieldCheck, IconCoin } from '@tabler/icons-react'

export default function SupportPage() {
  return (
    <div>
      <SimpleHeader />
      <div className="min-h-screen bg-transparent text-midnight dark:text-white px-4 py-16 pt-32">
        <div className="max-w-4xl mx-auto">
          <BackButton />
          <h1 className="text-4xl font-bold mb-4">Support</h1>
        <p className="text-midnight/70 dark:text-white/70 mb-12">Need help? We're here for you. Get support for technical issues, account questions, or general inquiries.</p>
        
        <div className="space-y-12">
          
          {/* Contact Options */}
          <section>
            <h2 className="text-2xl font-semibold text-[#FF1F8A] mb-6">Get in Touch</h2>
            
            <div className="grid md:grid-cols-2 gap-4">
              <a 
                href="mailto:iano@doba.world" 
                className="block bg-gradient-to-br from-[#FF1F8A]/20 to-[#FF1F8A]/5 rounded-lg p-6 border border-[#FF1F8A]/30 hover:border-[#FF1F8A]/50 transition-all group"
              >
                <div className="flex items-start gap-4">
                  <div className="bg-[#FF1F8A]/20 p-3 rounded-lg group-hover:bg-[#FF1F8A]/30 transition-colors">
                    <IconMail className="w-6 h-6 text-[#FF1F8A]" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-midnight dark:text-white mb-2">Email Support</h3>
                    <p className="text-sm text-midnight/70 dark:text-white/70 mb-3">Best for detailed questions, bug reports, and account issues.</p>
                    <p className="text-[#FF1F8A] font-mono text-sm">iano@doba.world</p>
                    <p className="text-midnight/50 dark:text-white/50 text-xs mt-2">Response time: 24-48 hours</p>
                  </div>
                </div>
              </a>

              <div className="bg-midnight/5 dark:bg-white/5 rounded-lg p-6 border border-midnight/10 dark:border-white/10">
                <div className="flex items-start gap-4">
                  <div className="bg-midnight/10 dark:bg-white/10 p-3 rounded-lg">
                    <IconBrandTwitter className="w-6 h-6 text-midnight/70 dark:text-white/70" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-midnight dark:text-white mb-2">Social Media</h3>
                    <p className="text-sm text-midnight/70 dark:text-white/70 mb-3">Follow us for updates and quick questions.</p>
                    <p className="text-midnight/50 dark:text-white/50 text-sm">Coming soon...</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Common Issues */}
          <section className="border-t border-midnight/10 dark:border-white/10 pt-12">
            <h2 className="text-2xl font-semibold text-[#FF1F8A] mb-6">Common Issues</h2>
            <p className="text-midnight/70 dark:text-white/70 mb-6">Quick solutions for the most common problems. Try these before reaching out!</p>
            
            <div className="space-y-4">
              <div className="bg-midnight/5 dark:bg-white/5 rounded-lg p-6 border border-midnight/10 dark:border-white/10">
                <div className="flex items-start gap-3">
                  <IconQuestionMark className="w-5 h-5 text-[#FF1F8A] flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-midnight dark:text-white mb-2">Wallet won't connect</h3>
                    <ul className="text-sm text-midnight/80 dark:text-white/80 space-y-1 ml-4 list-disc list-inside">
                      <li>doba will prompt you to connect to supported networks</li>
                      <li>Try refreshing the page and reconnecting</li>
                      <li>Clear your browser cache and cookies</li>
                      <li>Try a different browser or wallet</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-midnight/5 dark:bg-white/5 rounded-lg p-6 border border-midnight/10 dark:border-white/10">
                <div className="flex items-start gap-3">
                  <IconCoin className="w-5 h-5 text-[#FF1F8A] flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-midnight dark:text-white mb-2">Transaction failed or stuck</h3>
                    <ul className="text-sm text-midnight/80 dark:text-white/80 space-y-1 ml-4 list-disc list-inside">
                      <li>Check if you have enough crypto for gas fees</li>
                      <li>Increase gas limit in your wallet settings</li>
                      <li>Wait a few minutes and try again</li>
                      <li>Check your network's block explorer for transaction status</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-midnight/5 dark:bg-white/5 rounded-lg p-6 border border-midnight/10 dark:border-white/10">
                <div className="flex items-start gap-3">
                  <IconBug className="w-5 h-5 text-[#FF1F8A] flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-midnight dark:text-white mb-2">Music won't play or upload</h3>
                    <ul className="text-sm text-midnight/80 dark:text-white/80 space-y-1 ml-4 list-disc list-inside">
                      <li>Check file format (WAV, MP3, FLAC supported)</li>
                      <li>Ensure file size is under 100MB</li>
                      <li>Try a different browser (Chrome/Brave recommended)</li>
                      <li>Disable browser extensions that might block audio</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-midnight/5 dark:bg-white/5 rounded-lg p-6 border border-midnight/10 dark:border-white/10">
                <div className="flex items-start gap-3">
                  <IconShieldCheck className="w-5 h-5 text-[#FF1F8A] flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-midnight dark:text-white mb-2">Don't see my NFT after purchase</h3>
                    <ul className="text-sm text-midnight/80 dark:text-white/80 space-y-1 ml-4 list-disc list-inside">
                      <li>Wait 30-60 seconds for blockchain confirmation</li>
                      <li>Refresh the page</li>
                      <li>Check "My Studio" tab</li>
                      <li>Verify transaction completed on your network's block explorer</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Support Categories */}
          <section className="border-t border-midnight/10 dark:border-white/10 pt-12">
            <h2 className="text-2xl font-semibold text-[#FF1F8A] mb-6">What can we help you with?</h2>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-midnight/5 dark:bg-white/5 rounded-lg p-5 border border-midnight/10 dark:border-white/10">
                <h3 className="font-semibold text-midnight dark:text-white mb-2">🐛 Bug Reports</h3>
                <p className="text-sm text-midnight/70 dark:text-white/70 mb-3">Found a bug or something not working correctly?</p>
                <p className="text-xs text-midnight/60 dark:text-white/60 mb-2">Please include:</p>
                <ul className="text-xs text-midnight/50 dark:text-white/50 space-y-1 ml-4 list-disc list-inside">
                  <li>What you were trying to do</li>
                  <li>What happened (vs. what should have happened)</li>
                  <li>Browser and OS</li>
                  <li>Screenshots if possible</li>
                </ul>
              </div>

              <div className="bg-midnight/5 dark:bg-white/5 rounded-lg p-5 border border-midnight/10 dark:border-white/10">
                <h3 className="font-semibold text-midnight dark:text-white mb-2">🔒 Account Issues</h3>
                <p className="text-sm text-midnight/70 dark:text-white/70 mb-3">Problems with your account, profile, or login?</p>
                <p className="text-xs text-midnight/60 dark:text-white/60 mb-2">We can help with:</p>
                <ul className="text-xs text-midnight/50 dark:text-white/50 space-y-1 ml-4 list-disc list-inside">
                  <li>Profile updates or deletions</li>
                  <li>Wallet connection problems</li>
                  <li>Account recovery (note: we can't recover lost seed phrases)</li>
                </ul>
              </div>

              <div className="bg-midnight/5 dark:bg-white/5 rounded-lg p-5 border border-midnight/10 dark:border-white/10">
                <h3 className="font-semibold text-midnight dark:text-white mb-2">💰 Payment & Transaction Issues</h3>
                <p className="text-sm text-midnight/70 dark:text-white/70 mb-3">Problems with purchases, sales, or earnings?</p>
                <p className="text-xs text-midnight/60 dark:text-white/60 mb-2">We can help with:</p>
                <ul className="text-xs text-midnight/50 dark:text-white/50 space-y-1 ml-4 list-disc list-inside">
                  <li>Failed or stuck transactions</li>
                  <li>Missing NFTs or earnings</li>
                  <li>Revenue split questions</li>
                  <li>Gas fee issues</li>
                </ul>
              </div>

              <div className="bg-midnight/5 dark:bg-white/5 rounded-lg p-5 border border-midnight/10 dark:border-white/10">
                <h3 className="font-semibold text-midnight dark:text-white mb-2">⚖️ Copyright / DMCA</h3>
                <p className="text-sm text-midnight/70 dark:text-white/70 mb-3">Report copyright infringement or unauthorized uploads?</p>
                <p className="text-xs text-midnight/60 dark:text-white/60 mb-2">See our <a href="/terms" className="text-[#FF1F8A] hover:underline">Terms of Service</a> for DMCA process.</p>
                <p className="text-xs text-midnight/50 dark:text-white/50">Include proof of ownership and links to infringing content.</p>
              </div>

              <div className="bg-midnight/5 dark:bg-white/5 rounded-lg p-5 border border-midnight/10 dark:border-white/10">
                <h3 className="font-semibold text-midnight dark:text-white mb-2">🎨 Artist Onboarding</h3>
                <p className="text-sm text-midnight/70 dark:text-white/70 mb-3">Need help minting or managing your music?</p>
                <p className="text-xs text-midnight/60 dark:text-white/60 mb-2">Check out:</p>
                <ul className="text-xs text-midnight/50 dark:text-white/50 space-y-1 ml-4 list-disc list-inside">
                  <li><a href="/for-artists" className="text-[#FF1F8A] hover:underline">For Artists</a> - Complete guide</li>
                  <li><a href="/docs" className="text-[#FF1F8A] hover:underline">Docs</a> - Minting tutorials</li>
                  <li><a href="/faq" className="text-[#FF1F8A] hover:underline">FAQ</a> - Common questions</li>
                </ul>
              </div>

              <div className="bg-midnight/5 dark:bg-white/5 rounded-lg p-5 border border-midnight/10 dark:border-white/10">
                <h3 className="font-semibold text-midnight dark:text-white mb-2">❓ General Questions</h3>
                <p className="text-sm text-midnight/70 dark:text-white/70 mb-3">Questions about how doba works or features?</p>
                <p className="text-xs text-midnight/60 dark:text-white/60 mb-2">Try these resources first:</p>
                <ul className="text-xs text-midnight/50 dark:text-white/50 space-y-1 ml-4 list-disc list-inside">
                  <li><a href="/how-it-works" className="text-[#FF1F8A] hover:underline">How It Works</a></li>
                  <li><a href="/faq" className="text-[#FF1F8A] hover:underline">FAQ</a></li>
                  <li><a href="/docs" className="text-[#FF1F8A] hover:underline">Documentation</a></li>
                </ul>
              </div>
            </div>
          </section>

          {/* Before You Contact */}
          <section className="border-t border-midnight/10 dark:border-white/10 pt-12">
            <h2 className="text-2xl font-semibold text-[#FF1F8A] mb-6">Before You Contact Us</h2>
            
            <div className="bg-blue-500/10 rounded-lg p-6 border border-blue-500/30">
              <h3 className="text-lg font-semibold mb-4 text-blue-200">📚 Check Our Resources First</h3>
              <p className="text-midnight/80 dark:text-white/80 mb-4">Many questions are already answered in our documentation:</p>
              
              <div className="grid md:grid-cols-2 gap-3">
                <a href="/faq" className="block bg-black/30 rounded-lg p-3 hover:bg-black/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-midnight dark:text-white">FAQ</span>
                    <span className="text-[#FF1F8A] text-xs">→</span>
                  </div>
                </a>

                <a href="/docs" className="block bg-black/30 rounded-lg p-3 hover:bg-black/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-midnight dark:text-white">Documentation</span>
                    <span className="text-[#FF1F8A] text-xs">→</span>
                  </div>
                </a>

                <a href="/how-it-works" className="block bg-black/30 rounded-lg p-3 hover:bg-black/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-midnight dark:text-white">How It Works</span>
                    <span className="text-[#FF1F8A] text-xs">→</span>
                  </div>
                </a>

                <a href="/for-artists" className="block bg-black/30 rounded-lg p-3 hover:bg-black/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-midnight dark:text-white">For Artists</span>
                    <span className="text-[#FF1F8A] text-xs">→</span>
                  </div>
                </a>
              </div>
            </div>
          </section>

          {/* Email Tips */}
          <section className="border-t border-midnight/10 dark:border-white/10 pt-12">
            <h2 className="text-2xl font-semibold text-[#FF1F8A] mb-6">Writing a Good Support Email</h2>
            
            <div className="bg-midnight/5 dark:bg-white/5 rounded-lg p-6 border border-midnight/10 dark:border-white/10">
              <p className="text-midnight/80 dark:text-white/80 mb-4">To help us resolve your issue quickly, please include:</p>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <span className="text-[#FF1F8A] flex-shrink-0">✓</span>
                  <div>
                    <strong className="text-midnight dark:text-white">Clear subject line</strong>
                    <p className="text-sm text-midnight/70 dark:text-white/70">Example: "Transaction failed - can't mint NFT"</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="text-[#FF1F8A] flex-shrink-0">✓</span>
                  <div>
                    <strong className="text-midnight dark:text-white">Wallet address</strong>
                    <p className="text-sm text-midnight/70 dark:text-white/70">So we can look up your transactions and account</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="text-[#FF1F8A] flex-shrink-0">✓</span>
                  <div>
                    <strong className="text-midnight dark:text-white">Step-by-step description</strong>
                    <p className="text-sm text-midnight/70 dark:text-white/70">What you did, what happened, what you expected</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="text-[#FF1F8A] flex-shrink-0">✓</span>
                  <div>
                    <strong className="text-midnight dark:text-white">Screenshots or error messages</strong>
                    <p className="text-sm text-midnight/70 dark:text-white/70">Visuals help us understand the problem faster</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="text-[#FF1F8A] flex-shrink-0">✓</span>
                  <div>
                    <strong className="text-midnight dark:text-white">Browser and device info</strong>
                    <p className="text-sm text-midnight/70 dark:text-white/70">Example: "Chrome on Windows 11"</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-midnight/10 dark:border-white/10">
                <p className="text-sm text-midnight/60 dark:text-white/60">
                  <strong className="text-yellow-200">⚠️ Security reminder:</strong> Never share your seed phrase or private keys with anyone, including doba support. We will never ask for them.
                </p>
              </div>
            </div>
          </section>

          {/* Response Time */}
          <section className="border-t border-midnight/10 dark:border-white/10 pt-12">
            <h2 className="text-2xl font-semibold text-[#FF1F8A] mb-6">Response Times</h2>
            
            <div className="space-y-4">
              <div className="bg-midnight/5 dark:bg-white/5 rounded-lg p-4 border border-midnight/10 dark:border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-midnight dark:text-white">Email Support</h3>
                    <p className="text-sm text-midnight/70 dark:text-white/70 mt-1">General questions and issues</p>
                  </div>
                  <span className="text-midnight/60 dark:text-white/60 text-sm">24-48 hours</span>
                </div>
              </div>

              <div className="bg-midnight/5 dark:bg-white/5 rounded-lg p-4 border border-midnight/10 dark:border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-midnight dark:text-white">Critical Issues</h3>
                    <p className="text-sm text-midnight/70 dark:text-white/70 mt-1">Security, payment failures, data loss</p>
                  </div>
                  <span className="text-midnight/60 dark:text-white/60 text-sm">6-12 hours</span>
                </div>
              </div>

              <div className="bg-midnight/5 dark:bg-white/5 rounded-lg p-4 border border-midnight/10 dark:border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-midnight dark:text-white">DMCA Takedowns</h3>
                    <p className="text-sm text-midnight/70 dark:text-white/70 mt-1">Copyright infringement reports</p>
                  </div>
                  <span className="text-midnight/60 dark:text-white/60 text-sm">1-3 business days</span>
                </div>
              </div>
            </div>

            <p className="text-midnight/60 dark:text-white/60 text-sm mt-6">
              💡 <strong>Tip:</strong> Response times may be longer during weekends and holidays. We appreciate your patience!
            </p>
          </section>

          {/* Contact CTA */}
          <section className="border-t border-midnight/10 dark:border-white/10 pt-12">
            <div className="bg-gradient-to-r from-[#FF1F8A]/20 to-[#B794F4]/20 rounded-lg p-8 border border-midnight/20 dark:border-white/20 text-center">
              <h2 className="text-2xl font-semibold text-midnight dark:text-white mb-3">Ready to Get Help?</h2>
              <p className="text-midnight/70 dark:text-white/70 mb-6">Send us an email and we'll get back to you as soon as possible.</p>
              <a 
                href="mailto:iano@doba.world" 
                className="inline-flex items-center gap-2 bg-[#FF1F8A] hover:bg-[#FF1F8A]/90 text-midnight dark:text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                <IconMail className="w-5 h-5" />
                Email Support
              </a>
            </div>
          </section>
        </div>
        </div>
      </div>
    </div>
  )
}
