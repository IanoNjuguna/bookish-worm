import React from 'react'
import BackButton from '@/components/BackButton'
import SimpleHeader from '@/components/SimpleHeader'

export default function TermsPage() {
  return (
    <div>
      <SimpleHeader />
      <div className="min-h-screen bg-transparent text-midnight dark:text-white px-4 py-16 pt-32">
        <div className="max-w-4xl mx-auto">
          <BackButton />
          <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
        <p className="text-midnight/70 dark:text-white/70 mb-2">Last updated: February 10, 2026</p>
        <p className="text-midnight/70 dark:text-white/70 mb-12">Please read these terms carefully before using doba.</p>
        
        <div className="space-y-12">
          
          {/* Agreement */}
          <section>
            <h2 className="text-2xl font-semibold text-[#FF1F8A] mb-4">1. Agreement to Terms</h2>
            <p className="text-midnight/80 dark:text-white/80 mb-4">
              By accessing or using doba ("the Platform"), you agree to be bound by these Terms of Service ("Terms"). 
              If you disagree with any part of the Terms, you may not access the Platform.
            </p>
            <p className="text-midnight/80 dark:text-white/80">
              doba is a decentralized music platform that enables artists to mint music NFTs and fans to own music. 
              The Platform operates on multiple blockchain networks using omnichain NFT technology.
            </p>
          </section>

          {/* Eligibility */}
          <section className="border-t border-midnight/10 dark:border-white/10 pt-12">
            <h2 className="text-2xl font-semibold text-[#FF1F8A] mb-4">2. Eligibility</h2>
            <p className="text-midnight/80 dark:text-white/80 mb-4">You must be at least 18 years old to use doba. By using the Platform, you represent that you:</p>
            <ul className="list-disc list-inside space-y-2 text-midnight/80 dark:text-white/80 ml-4">
              <li>Are at least 18 years of age</li>
              <li>Have the legal capacity to enter into these Terms</li>
              <li>Will comply with all applicable laws and regulations</li>
              <li>Will not use the Platform for any illegal or unauthorized purpose</li>
            </ul>
          </section>

          {/* Copyright & Content */}
          <section className="border-t border-midnight/10 dark:border-white/10 pt-12">
            <h2 className="text-2xl font-semibold text-[#FF1F8A] mb-4">3. Copyright and Content Ownership</h2>
            
            <div className="bg-yellow-500/10 rounded-lg p-6 border border-yellow-500/30 mb-6">
              <h3 className="text-lg font-semibold mb-3 text-yellow-200">⚠️ Important Copyright Notice</h3>
              <p className="text-midnight/80 dark:text-white/80 mb-3">
                <strong>doba is an MVP (Minimum Viable Product) platform.</strong> We currently operate on an honor system for copyright compliance. 
                We do not verify ownership of music before it is uploaded.
              </p>
              <p className="text-midnight/80 dark:text-white/80">
                By uploading music to doba, you represent and warrant that you own all rights to the music or have obtained all necessary 
                permissions, licenses, and clearances to upload and mint it as an NFT.
              </p>
            </div>

            <h3 className="text-lg font-semibold text-midnight dark:text-white mb-3">3.1 Artist Responsibilities</h3>
            <p className="text-midnight/80 dark:text-white/80 mb-4">As an artist uploading music to doba, you agree that:</p>
            <ul className="list-disc list-inside space-y-2 text-midnight/80 dark:text-white/80 ml-4 mb-6">
              <li>You own the copyright to the music you upload, OR you have explicit permission from the copyright owner</li>
              <li>Your music does not infringe on any third party's intellectual property rights</li>
              <li>You have obtained all necessary permissions for samples, beats, or other copyrighted material</li>
              <li>You will not upload music that you do not have the rights to distribute</li>
              <li>You understand that uploading copyrighted material without permission is illegal and may result in legal action</li>
            </ul>

            <h3 className="text-lg font-semibold text-midnight dark:text-white mb-3">3.2 DMCA Takedown Process</h3>
            <p className="text-midnight/80 dark:text-white/80 mb-4">
              If you believe your copyrighted work has been uploaded to doba without permission, you may submit a DMCA takedown notice.
            </p>
            <div className="bg-midnight/5 dark:bg-white/5 rounded-lg p-4 border border-midnight/10 dark:border-white/10">
              <p className="text-sm text-midnight/80 dark:text-white/80 mb-3"><strong>To file a DMCA takedown, email us at:</strong></p>
              <p className="text-[#FF1F8A] font-mono text-sm mb-3">iano@doba.world</p>
              <p className="text-sm text-midnight/80 dark:text-white/80 mb-2">Include the following information:</p>
              <ul className="list-disc list-inside space-y-1 text-sm text-midnight/70 dark:text-white/70 ml-4">
                <li>Your contact information (name, email, phone number)</li>
                <li>Description of the copyrighted work being infringed</li>
                <li>Link to the infringing content on doba</li>
                <li>Statement that you have a good faith belief the use is not authorized</li>
                <li>Statement that the information is accurate and you are the copyright owner or authorized to act</li>
                <li>Your physical or electronic signature</li>
              </ul>
            </div>
            <p className="text-midnight/60 dark:text-white/60 text-sm mt-4">
              We will investigate all DMCA claims and remove infringing content. Repeat infringers will be banned from the Platform.
            </p>

            <h3 className="text-lg font-semibold text-midnight dark:text-white mb-3 mt-6">3.3 User Responsibilities</h3>
            <p className="text-midnight/80 dark:text-white/80">
              Users purchasing music NFTs should be aware that doba does not verify copyright ownership. By purchasing an NFT, 
              you are acquiring ownership of that specific NFT, not the underlying copyright to the music. Copyright remains with the original creator.
            </p>
          </section>

          {/* Wallet & Blockchain */}
          <section className="border-t border-midnight/10 dark:border-white/10 pt-12">
            <h2 className="text-2xl font-semibold text-[#FF1F8A] mb-4">4. Wallet Connection and Blockchain Transactions</h2>
            
            <h3 className="text-lg font-semibold text-midnight dark:text-white mb-3">4.1 Wallet Custody</h3>
            <p className="text-midnight/80 dark:text-white/80 mb-4">
              doba is a non-custodial platform. We do not store, hold, or have access to your cryptocurrency or private keys. 
              You are solely responsible for maintaining the security of your wallet and private keys.
            </p>
            
            <h3 className="text-lg font-semibold text-midnight dark:text-white mb-3">4.2 Transaction Irreversibility</h3>
            <p className="text-midnight/80 dark:text-white/80 mb-4">
              Blockchain transactions are final and irreversible. Once you mint an NFT or purchase music, the transaction cannot be undone. 
              doba cannot refund, reverse, or cancel blockchain transactions.
            </p>

            <h3 className="text-lg font-semibold text-midnight dark:text-white mb-3">4.3 Gas Fees</h3>
            <p className="text-midnight/80 dark:text-white/80">
              You are responsible for paying all gas fees (network transaction fees) required to use doba. These fees go to the blockchain network, 
              not to doba. Gas fees are non-refundable.
            </p>
          </section>

          {/* Fees & Payments */}
          <section className="border-t border-midnight/10 dark:border-white/10 pt-12">
            <h2 className="text-2xl font-semibold text-[#FF1F8A] mb-4">5. Platform Fees and Revenue Sharing</h2>
            
            <div className="bg-midnight/5 dark:bg-white/5 rounded-lg p-6 border border-midnight/10 dark:border-white/10 mb-4">
              <h3 className="text-lg font-semibold mb-3">5.1 Primary Sales (Initial Purchase)</h3>
              <ul className="space-y-2 text-midnight/80 dark:text-white/80">
                <li>• Artist receives: <strong className="text-midnight dark:text-white">93%</strong> of sale price</li>
                <li>• doba platform fee: <strong className="text-midnight dark:text-white">7%</strong> of sale price</li>
              </ul>
            </div>

            <div className="bg-midnight/5 dark:bg-white/5 rounded-lg p-6 border border-midnight/10 dark:border-white/10 mb-4">
              <h3 className="text-lg font-semibold mb-3">5.2 Secondary Sales (Resales)</h3>
              <ul className="space-y-2 text-midnight/80 dark:text-white/80">
                <li>• Artist royalty: <strong className="text-midnight dark:text-white">10-15%</strong> of resale price (set by artist)</li>
                <li>• doba platform fee: <strong className="text-midnight dark:text-white">1%</strong> of resale price</li>
                <li>• Seller receives: <strong className="text-midnight dark:text-white">84-89%</strong> of resale price</li>
              </ul>
            </div>

            <p className="text-midnight/80 dark:text-white/80 mb-4">
              These fees are automatically enforced by the smart contract and cannot be changed once an NFT is minted.
            </p>

            <h3 className="text-lg font-semibold text-midnight dark:text-white mb-3">5.3 Payment Processing</h3>
            <p className="text-midnight/80 dark:text-white/80">
              All transactions occur directly on the blockchain. Payments go directly to artists' wallets. doba does not process or hold funds.
            </p>
          </section>

          {/* Prohibited Conduct */}
          <section className="border-t border-midnight/10 dark:border-white/10 pt-12">
            <h2 className="text-2xl font-semibold text-[#FF1F8A] mb-4">6. Prohibited Conduct</h2>
            <p className="text-midnight/80 dark:text-white/80 mb-4">You agree not to:</p>
            <ul className="list-disc list-inside space-y-2 text-midnight/80 dark:text-white/80 ml-4">
              <li>Upload music you don't own or have rights to</li>
              <li>Infringe on anyone's intellectual property rights</li>
              <li>Upload illegal, harmful, hateful, or obscene content</li>
              <li>Manipulate prices or engage in wash trading</li>
              <li>Impersonate other artists or users</li>
              <li>Attempt to hack, exploit, or disrupt the Platform</li>
              <li>Use the Platform for money laundering or other illegal activities</li>
              <li>Create multiple accounts to abuse the system</li>
              <li>Scrape or automate interactions with the Platform without permission</li>
            </ul>
            <p className="text-midnight/80 dark:text-white/80 mt-4">
              Violation of these terms may result in account suspension, content removal, and legal action.
            </p>
          </section>

          {/* NFT Ownership */}
          <section className="border-t border-midnight/10 dark:border-white/10 pt-12">
            <h2 className="text-2xl font-semibold text-[#FF1F8A] mb-4">7. NFT Ownership and Rights</h2>
            
            <h3 className="text-lg font-semibold text-midnight dark:text-white mb-3">7.1 What You Own</h3>
            <p className="text-midnight/80 dark:text-white/80 mb-4">
              When you purchase a music NFT on doba, you own the NFT itself—a unique token on the blockchain. This grants you:
            </p>
            <ul className="list-disc list-inside space-y-2 text-midnight/80 dark:text-white/80 ml-4 mb-4">
              <li>The right to access and download the music files</li>
              <li>The right to resell or transfer the NFT</li>
              <li>Personal, non-commercial listening rights</li>
            </ul>

            <h3 className="text-lg font-semibold text-midnight dark:text-white mb-3">7.2 What You Don't Own</h3>
            <p className="text-midnight/80 dark:text-white/80 mb-4">
              Owning a music NFT does <strong>NOT</strong> transfer the copyright or commercial rights to the music. You may not:
            </p>
            <ul className="list-disc list-inside space-y-2 text-midnight/80 dark:text-white/80 ml-4">
              <li>Use the music in commercial projects (ads, films, games, etc.) without artist permission</li>
              <li>Claim you created the music</li>
              <li>Create derivative works (remixes, edits) for commercial use without permission</li>
              <li>Distribute copies of the music files (sharing the NFT itself is allowed)</li>
            </ul>
            <p className="text-midnight/80 dark:text-white/80 mt-4">
              Copyright remains with the artist unless explicitly transferred in writing.
            </p>
          </section>

          {/* Disclaimers */}
          <section className="border-t border-midnight/10 dark:border-white/10 pt-12">
            <h2 className="text-2xl font-semibold text-[#FF1F8A] mb-4">8. Disclaimers and Limitation of Liability</h2>
            
            <div className="bg-red-500/10 rounded-lg p-6 border border-red-500/30">
              <h3 className="text-lg font-semibold mb-3 text-red-200">⚠️ No Warranties</h3>
              <p className="text-midnight/80 dark:text-white/80 mb-3">
                doba is provided "AS IS" and "AS AVAILABLE" without warranties of any kind. We do not guarantee:
              </p>
              <ul className="list-disc list-inside space-y-2 text-midnight/80 dark:text-white/80 ml-4">
                <li>The Platform will be available, error-free, or secure at all times</li>
                <li>NFT values will increase or maintain their value</li>
                <li>Copyright ownership of uploaded music</li>
                <li>Accuracy of artist information or metadata</li>
                <li>Compatibility with all wallets or browsers</li>
              </ul>
            </div>

            <h3 className="text-lg font-semibold text-midnight dark:text-white mb-3 mt-6">8.2 Limitation of Liability</h3>
            <p className="text-midnight/80 dark:text-white/80 mb-4">
              To the maximum extent permitted by law, doba and its team shall not be liable for:
            </p>
            <ul className="list-disc list-inside space-y-2 text-midnight/80 dark:text-white/80 ml-4">
              <li>Loss of funds due to wallet security failures</li>
              <li>NFT value fluctuations or losses</li>
              <li>Smart contract bugs or exploits</li>
              <li>Blockchain network failures or congestion</li>
              <li>Copyright infringement by users</li>
              <li>Unauthorized access to your account or wallet</li>
              <li>Any indirect, incidental, or consequential damages</li>
            </ul>

            <h3 className="text-lg font-semibold text-midnight dark:text-white mb-3 mt-6">8.3 Assumption of Risk</h3>
            <p className="text-midnight/80 dark:text-white/80">
              You acknowledge that using blockchain technology, cryptocurrency, and NFTs carries inherent risks including but not limited to: 
              technical failures, regulatory changes, loss of private keys, volatility, and smart contract vulnerabilities. You accept these risks.
            </p>
          </section>

          {/* Termination */}
          <section className="border-t border-midnight/10 dark:border-white/10 pt-12">
            <h2 className="text-2xl font-semibold text-[#FF1F8A] mb-4">9. Termination</h2>
            <p className="text-midnight/80 dark:text-white/80 mb-4">
              We reserve the right to suspend or terminate your access to doba at any time, with or without notice, for violations of these Terms or any other reason.
            </p>
            <p className="text-midnight/80 dark:text-white/80">
              Upon termination, your NFTs remain on the blockchain and in your wallet. We cannot remove them. However, we may remove your profile and uploaded content from the Platform interface.
            </p>
          </section>

          {/* Changes to Terms */}
          <section className="border-t border-midnight/10 dark:border-white/10 pt-12">
            <h2 className="text-2xl font-semibold text-[#FF1F8A] mb-4">10. Changes to Terms</h2>
            <p className="text-midnight/80 dark:text-white/80 mb-4">
              We may update these Terms from time to time. Changes will be posted on this page with an updated "Last updated" date. 
              Continued use of doba after changes constitutes acceptance of the new Terms.
            </p>
            <p className="text-midnight/80 dark:text-white/80">
              For significant changes, we will make reasonable efforts to notify users via email or Platform announcement.
            </p>
          </section>

          {/* Governing Law */}
          <section className="border-t border-midnight/10 dark:border-white/10 pt-12">
            <h2 className="text-2xl font-semibold text-[#FF1F8A] mb-4">11. Governing Law and Disputes</h2>
            <p className="text-midnight/80 dark:text-white/80 mb-4">
              These Terms are governed by the laws of [Jurisdiction TBD], without regard to its conflict of law provisions.
            </p>
            <p className="text-midnight/80 dark:text-white/80">
              Any disputes arising from these Terms or use of doba shall be resolved through binding arbitration, except where prohibited by law.
            </p>
          </section>

          {/* Contact */}
          <section className="border-t border-midnight/10 dark:border-white/10 pt-12">
            <h2 className="text-2xl font-semibold text-[#FF1F8A] mb-4">12. Contact Information</h2>
            <p className="text-midnight/80 dark:text-white/80 mb-4">
              For questions about these Terms, DMCA takedowns, or legal inquiries, contact us at:
            </p>
            <div className="bg-midnight/5 dark:bg-white/5 rounded-lg p-4 border border-midnight/10 dark:border-white/10">
              <p className="text-midnight/80 dark:text-white/80"><strong>Email:</strong> <a href="mailto:iano@doba.world" className="text-[#FF1F8A] hover:underline">iano@doba.world</a></p>
            </div>
          </section>

          {/* Final */}
          <section className="border-t border-midnight/10 dark:border-white/10 pt-12">
            <div className="bg-midnight/5 dark:bg-white/5 rounded-lg p-6 border border-midnight/10 dark:border-white/10">
              <p className="text-midnight/80 dark:text-white/80 text-sm">
                By using doba, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
              </p>
            </div>
          </section>
        </div>
        </div>
      </div>
    </div>
  )
}
