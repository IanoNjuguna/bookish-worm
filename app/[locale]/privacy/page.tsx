import React from 'react'
import BackButton from '@/components/BackButton'
import SimpleHeader from '@/components/SimpleHeader'

export default function PrivacyPage() {
  return (
    <div>
      <SimpleHeader />
      <div className="min-h-screen bg-transparent text-midnight dark:text-white px-4 py-16 pt-32">
        <div className="max-w-4xl mx-auto">
          <BackButton />
          <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
        <p className="text-midnight/70 dark:text-white/70 mb-2">Last updated: February 10, 2026</p>
        <p className="text-midnight/70 dark:text-white/70 mb-12">Your privacy matters. Here's how we handle your data.</p>
        
        <div className="space-y-12">
          
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-semibold text-[#FF1F8A] mb-4">1. Introduction</h2>
            <p className="text-midnight/80 dark:text-white/80 mb-4">
              doba ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains what information 
              we collect, how we use it, and your rights regarding your data.
            </p>
            <p className="text-midnight/80 dark:text-white/80">
              Because doba is built on blockchain technology, some information is inherently public and cannot be deleted. 
              We'll explain what's public and what's private below.
            </p>
          </section>

          {/* Information We Collect */}
          <section className="border-t border-midnight/10 dark:border-white/10 pt-12">
            <h2 className="text-2xl font-semibold text-[#FF1F8A] mb-4">2. Information We Collect</h2>
            
            <h3 className="text-lg font-semibold text-midnight dark:text-white mb-3">2.1 Information You Provide</h3>
            <div className="bg-midnight/5 dark:bg-white/5 rounded-lg p-6 border border-midnight/10 dark:border-white/10 mb-6">
              <ul className="space-y-3 text-midnight/80 dark:text-white/80">
                <li className="flex items-start gap-2">
                  <span className="text-[#FF1F8A] flex-shrink-0">•</span>
                  <span><strong>Wallet Address:</strong> Your public Cardano wallet address when you connect</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#FF1F8A] flex-shrink-0">•</span>
                  <span><strong>Profile Information:</strong> Username, bio, profile picture (if you set one)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#FF1F8A] flex-shrink-0">•</span>
                  <span><strong>Music Uploads:</strong> Audio files, cover art, metadata (title, artist name, description, tags)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#FF1F8A] flex-shrink-0">•</span>
                  <span><strong>Email Address:</strong> If you choose to provide it for notifications or support</span>
                </li>
              </ul>
            </div>

            <h3 className="text-lg font-semibold text-midnight dark:text-white mb-3">2.2 Information Collected Automatically</h3>
            <div className="bg-midnight/5 dark:bg-white/5 rounded-lg p-6 border border-midnight/10 dark:border-white/10 mb-6">
              <ul className="space-y-3 text-midnight/80 dark:text-white/80">
                <li className="flex items-start gap-2">
                  <span className="text-[#FF1F8A] flex-shrink-0">•</span>
                  <span><strong>Usage Data:</strong> Pages visited, features used, time spent on Platform</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#FF1F8A] flex-shrink-0">•</span>
                  <span><strong>Device Information:</strong> Browser type, operating system, device type</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#FF1F8A] flex-shrink-0">•</span>
                  <span><strong>IP Address:</strong> For analytics and security purposes</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#FF1F8A] flex-shrink-0">•</span>
                  <span><strong>Cookies:</strong> Essential cookies for functionality, analytics cookies (with consent)</span>
                </li>
              </ul>
            </div>

            <h3 className="text-lg font-semibold text-midnight dark:text-white mb-3">2.3 Blockchain Data (Publicly Visible)</h3>
            <div className="bg-blue-500/10 rounded-lg p-6 border border-blue-500/30">
              <p className="text-midnight/80 dark:text-white/80 mb-3">
                <strong className="text-blue-200">🔗 These are permanently stored on the blockchain and publicly visible:</strong>
              </p>
              <ul className="space-y-2 text-midnight/80 dark:text-white/80 ml-4">
                <li>• Your wallet address</li>
                <li>• NFT transactions (purchases, sales, transfers) on the Cardano network</li>
                <li>• NFT metadata (song titles, artist names, cover art links)</li>
                <li>• Smart contract interactions</li>
                <li>• Revenue splits for collaborations</li>
              </ul>
              <p className="text-midnight/60 dark:text-white/60 text-sm mt-4">
                This data is stored on the Cardano blockchain, not by doba. We cannot delete or modify blockchain data.
              </p>
            </div>
          </section>

          {/* How We Use Information */}
          <section className="border-t border-midnight/10 dark:border-white/10 pt-12">
            <h2 className="text-2xl font-semibold text-[#FF1F8A] mb-4">3. How We Use Your Information</h2>
            
            <div className="space-y-4">
              <div className="bg-midnight/5 dark:bg-white/5 rounded-lg p-4 border border-midnight/10 dark:border-white/10">
                <h3 className="font-semibold text-midnight dark:text-white mb-2">🎵 Provide the Platform</h3>
                <p className="text-sm text-midnight/80 dark:text-white/80">Enable music uploads, NFT minting, marketplace functionality, and streaming.</p>
              </div>

              <div className="bg-midnight/5 dark:bg-white/5 rounded-lg p-4 border border-midnight/10 dark:border-white/10">
                <h3 className="font-semibold text-midnight dark:text-white mb-2">📊 Improve Services</h3>
                <p className="text-sm text-midnight/80 dark:text-white/80">Analyze usage patterns to improve features, fix bugs, and optimize performance.</p>
              </div>

              <div className="bg-midnight/5 dark:bg-white/5 rounded-lg p-4 border border-midnight/10 dark:border-white/10">
                <h3 className="font-semibold text-midnight dark:text-white mb-2">🔒 Security and Fraud Prevention</h3>
                <p className="text-sm text-midnight/80 dark:text-white/80">Detect suspicious activity, prevent abuse, enforce our Terms of Service.</p>
              </div>

              <div className="bg-midnight/5 dark:bg-white/5 rounded-lg p-4 border border-midnight/10 dark:border-white/10">
                <h3 className="font-semibold text-midnight dark:text-white mb-2">📧 Communications</h3>
                <p className="text-sm text-midnight/80 dark:text-white/80">Send important updates, notifications, and support responses (if you provided email).</p>
              </div>

              <div className="bg-midnight/5 dark:bg-white/5 rounded-lg p-4 border border-midnight/10 dark:border-white/10">
                <h3 className="font-semibold text-midnight dark:text-white mb-2">⚖️ Legal Compliance</h3>
                <p className="text-sm text-midnight/80 dark:text-white/80">Respond to legal requests, enforce our policies, protect our rights.</p>
              </div>
            </div>
          </section>

          {/* Information Sharing */}
          <section className="border-t border-midnight/10 dark:border-white/10 pt-12">
            <h2 className="text-2xl font-semibold text-[#FF1F8A] mb-4">4. Information Sharing</h2>
            
            <h3 className="text-lg font-semibold text-midnight dark:text-white mb-3">4.1 We DO NOT Sell Your Data</h3>
            <p className="text-midnight/80 dark:text-white/80 mb-6">
              We will never sell your personal information to third parties. Your data is not a product.
            </p>

            <h3 className="text-lg font-semibold text-midnight dark:text-white mb-3">4.2 When We Share Information</h3>
            <div className="space-y-4">
              <div className="bg-midnight/5 dark:bg-white/5 rounded-lg p-4 border border-midnight/10 dark:border-white/10">
                <h4 className="font-semibold text-midnight dark:text-white mb-2">Service Providers</h4>
                <p className="text-sm text-midnight/80 dark:text-white/80 mb-2">We may share data with trusted third-party services that help us operate doba:</p>
                <ul className="list-disc list-inside space-y-1 text-sm text-midnight/70 dark:text-white/70 ml-4">
                  <li>Cloud storage providers (for music files and images)</li>
                  <li>Analytics services (to understand usage patterns)</li>
                  <li>Email service providers (if you opt-in to notifications)</li>
                  <li>Blockchain infrastructure providers (RPC nodes, indexers, cross-chain bridges)</li>
                </ul>
                <p className="text-xs text-midnight/60 dark:text-white/60 mt-2">These providers are bound by confidentiality agreements and can only use data as instructed.</p>
              </div>

              <div className="bg-midnight/5 dark:bg-white/5 rounded-lg p-4 border border-midnight/10 dark:border-white/10">
                <h4 className="font-semibold text-midnight dark:text-white mb-2">Public Blockchain</h4>
                <p className="text-sm text-midnight/80 dark:text-white/80">Transaction data is publicly visible across all blockchain networks. Anyone can see wallet addresses, NFT sales, and metadata.</p>
              </div>

              <div className="bg-midnight/5 dark:bg-white/5 rounded-lg p-4 border border-midnight/10 dark:border-white/10">
                <h4 className="font-semibold text-midnight dark:text-white mb-2">Legal Requirements</h4>
                <p className="text-sm text-midnight/80 dark:text-white/80">We may disclose information if required by law, court order, or government request.</p>
              </div>

              <div className="bg-midnight/5 dark:bg-white/5 rounded-lg p-4 border border-midnight/10 dark:border-white/10">
                <h4 className="font-semibold text-midnight dark:text-white mb-2">Business Transfers</h4>
                <p className="text-sm text-midnight/80 dark:text-white/80">If doba is acquired or merged, your information may be transferred to the new owner (you'll be notified).</p>
              </div>
            </div>
          </section>

          {/* Data Security */}
          <section className="border-t border-midnight/10 dark:border-white/10 pt-12">
            <h2 className="text-2xl font-semibold text-[#FF1F8A] mb-4">5. Data Security</h2>
            <p className="text-midnight/80 dark:text-white/80 mb-4">
              We implement industry-standard security measures to protect your data:
            </p>
            <ul className="list-disc list-inside space-y-2 text-midnight/80 dark:text-white/80 ml-4 mb-6">
              <li>Encrypted data transmission (HTTPS/TLS)</li>
              <li>Secure cloud storage with encryption at rest</li>
              <li>Regular security audits and monitoring</li>
              <li>Access controls and authentication</li>
            </ul>

            <div className="bg-yellow-500/10 rounded-lg p-6 border border-yellow-500/30">
              <h3 className="text-lg font-semibold mb-3 text-yellow-200">⚠️ Your Responsibility</h3>
              <p className="text-midnight/80 dark:text-white/80 mb-3">
                <strong>We do not store your private keys or seed phrases.</strong> You are solely responsible for securing your wallet. If you lose your seed phrase, we cannot recover your funds or NFTs.
              </p>
              <p className="text-midnight/80 dark:text-white/80">
                No system is 100% secure. While we do our best to protect your data, we cannot guarantee absolute security.
              </p>
            </div>
          </section>

          {/* Data Retention */}
          <section className="border-t border-midnight/10 dark:border-white/10 pt-12">
            <h2 className="text-2xl font-semibold text-[#FF1F8A] mb-4">6. Data Retention</h2>
            
            <h3 className="text-lg font-semibold text-midnight dark:text-white mb-3">6.1 Off-Chain Data</h3>
            <p className="text-midnight/80 dark:text-white/80 mb-4">
              We retain your profile information and uploaded content as long as your account is active. If you delete your account, we will delete your data within 90 days, except:
            </p>
            <ul className="list-disc list-inside space-y-2 text-midnight/80 dark:text-white/80 ml-4 mb-6">
              <li>Data required for legal compliance (e.g., tax records, DMCA claims)</li>
              <li>Anonymized analytics data</li>
              <li>Backup copies (deleted within 180 days)</li>
            </ul>

            <h3 className="text-lg font-semibold text-midnight dark:text-white mb-3">6.2 Blockchain Data</h3>
            <p className="text-midnight/80 dark:text-white/80">
              Blockchain data is permanent and cannot be deleted. This includes wallet addresses, transactions, and NFT metadata. Even if doba shuts down, this data will remain on the blockchain forever.
            </p>
          </section>

          {/* Your Rights */}
          <section className="border-t border-midnight/10 dark:border-white/10 pt-12">
            <h2 className="text-2xl font-semibold text-[#FF1F8A] mb-4">7. Your Privacy Rights</h2>
            <p className="text-midnight/80 dark:text-white/80 mb-4">Depending on your location, you may have the following rights:</p>
            
            <div className="space-y-4">
              <div className="bg-midnight/5 dark:bg-white/5 rounded-lg p-4 border border-midnight/10 dark:border-white/10">
                <h3 className="font-semibold text-midnight dark:text-white mb-2">Access</h3>
                <p className="text-sm text-midnight/80 dark:text-white/80">Request a copy of the personal data we hold about you.</p>
              </div>

              <div className="bg-midnight/5 dark:bg-white/5 rounded-lg p-4 border border-midnight/10 dark:border-white/10">
                <h3 className="font-semibold text-midnight dark:text-white mb-2">Correction</h3>
                <p className="text-sm text-midnight/80 dark:text-white/80">Update or correct inaccurate information (you can do this in your profile settings).</p>
              </div>

              <div className="bg-midnight/5 dark:bg-white/5 rounded-lg p-4 border border-midnight/10 dark:border-white/10">
                <h3 className="font-semibold text-midnight dark:text-white mb-2">Deletion</h3>
                <p className="text-sm text-midnight/80 dark:text-white/80">Request deletion of your account and data (except blockchain data, which is permanent).</p>
              </div>

              <div className="bg-midnight/5 dark:bg-white/5 rounded-lg p-4 border border-midnight/10 dark:border-white/10">
                <h3 className="font-semibold text-midnight dark:text-white mb-2">Data Portability</h3>
                <p className="text-sm text-midnight/80 dark:text-white/80">Request a copy of your data in a machine-readable format.</p>
              </div>

              <div className="bg-midnight/5 dark:bg-white/5 rounded-lg p-4 border border-midnight/10 dark:border-white/10">
                <h3 className="font-semibold text-midnight dark:text-white mb-2">Opt-Out</h3>
                <p className="text-sm text-midnight/80 dark:text-white/80">Unsubscribe from marketing emails or disable analytics cookies.</p>
              </div>
            </div>

            <p className="text-midnight/80 dark:text-white/80 mt-6">
              To exercise these rights, contact us at <a href="mailto:iano@doba.world" className="text-[#FF1F8A] hover:underline">iano@doba.world</a>. 
              We'll respond within 30 days.
            </p>
          </section>

          {/* Cookies */}
          <section className="border-t border-midnight/10 dark:border-white/10 pt-12">
            <h2 className="text-2xl font-semibold text-[#FF1F8A] mb-4">8. Cookies and Tracking</h2>
            <p className="text-midnight/80 dark:text-white/80 mb-4">
              We use cookies and similar technologies to improve your experience on doba.
            </p>
            
            <div className="space-y-4">
              <div className="bg-midnight/5 dark:bg-white/5 rounded-lg p-4 border border-midnight/10 dark:border-white/10">
                <h3 className="font-semibold text-midnight dark:text-white mb-2">Essential Cookies</h3>
                <p className="text-sm text-midnight/80 dark:text-white/80">Required for basic functionality (wallet connection, preferences). Cannot be disabled.</p>
              </div>

              <div className="bg-midnight/5 dark:bg-white/5 rounded-lg p-4 border border-midnight/10 dark:border-white/10">
                <h3 className="font-semibold text-midnight dark:text-white mb-2">Analytics Cookies</h3>
                <p className="text-sm text-midnight/80 dark:text-white/80">Help us understand usage patterns (Google Analytics, etc.). You can opt-out in browser settings.</p>
              </div>

              <div className="bg-midnight/5 dark:bg-white/5 rounded-lg p-4 border border-midnight/10 dark:border-white/10">
                <h3 className="font-semibold text-midnight dark:text-white mb-2">Third-Party Cookies</h3>
                <p className="text-sm text-midnight/80 dark:text-white/80">Some services (wallet providers, blockchain explorers) may set their own cookies.</p>
              </div>
            </div>

            <p className="text-midnight/80 dark:text-white/80 mt-4 text-sm">
              Most browsers allow you to control cookies through settings. Disabling cookies may limit Platform functionality.
            </p>
          </section>

          {/* Children's Privacy */}
          <section className="border-t border-midnight/10 dark:border-white/10 pt-12">
            <h2 className="text-2xl font-semibold text-[#FF1F8A] mb-4">9. Children's Privacy</h2>
            <p className="text-midnight/80 dark:text-white/80 mb-4">
              doba is not intended for users under 18 years old. We do not knowingly collect personal information from children.
            </p>
            <p className="text-midnight/80 dark:text-white/80">
              If you believe we have collected information from a child, please contact us immediately at <a href="mailto:iano@doba.world" className="text-[#FF1F8A] hover:underline">iano@doba.world</a> and we will delete it.
            </p>
          </section>

          {/* International Users */}
          <section className="border-t border-midnight/10 dark:border-white/10 pt-12">
            <h2 className="text-2xl font-semibold text-[#FF1F8A] mb-4">10. International Users</h2>
            <p className="text-midnight/80 dark:text-white/80 mb-4">
              doba operates globally. If you're outside [Primary Jurisdiction TBD], your data may be transferred to and processed in other countries where our servers are located.
            </p>
            <p className="text-midnight/80 dark:text-white/80">
              By using doba, you consent to the transfer of your information to countries that may have different data protection laws than your own.
            </p>
          </section>

          {/* Changes to Policy */}
          <section className="border-t border-midnight/10 dark:border-white/10 pt-12">
            <h2 className="text-2xl font-semibold text-[#FF1F8A] mb-4">11. Changes to This Privacy Policy</h2>
            <p className="text-midnight/80 dark:text-white/80 mb-4">
              We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated "Last updated" date.
            </p>
            <p className="text-midnight/80 dark:text-white/80">
              For significant changes affecting your rights, we'll notify you via email (if provided) or a prominent notice on the Platform.
            </p>
          </section>

          {/* Contact */}
          <section className="border-t border-midnight/10 dark:border-white/10 pt-12">
            <h2 className="text-2xl font-semibold text-[#FF1F8A] mb-4">12. Contact Us</h2>
            <p className="text-midnight/80 dark:text-white/80 mb-4">
              Questions, concerns, or requests about your privacy?
            </p>
            <div className="bg-midnight/5 dark:bg-white/5 rounded-lg p-6 border border-midnight/10 dark:border-white/10">
              <p className="text-midnight/80 dark:text-white/80 mb-2"><strong>Email:</strong> <a href="mailto:iano@doba.world" className="text-[#FF1F8A] hover:underline">iano@doba.world</a></p>
              <p className="text-midnight/60 dark:text-white/60 text-sm mt-4">
                We'll respond to all privacy inquiries within 30 days.
              </p>
            </div>
          </section>

          {/* Final */}
          <section className="border-t border-midnight/10 dark:border-white/10 pt-12">
            <div className="bg-midnight/5 dark:bg-white/5 rounded-lg p-6 border border-midnight/10 dark:border-white/10">
              <p className="text-midnight/80 dark:text-white/80 text-sm">
                By using doba, you acknowledge that you have read and understood this Privacy Policy.
              </p>
            </div>
          </section>
        </div>
        </div>
      </div>
    </div>
  )
}
