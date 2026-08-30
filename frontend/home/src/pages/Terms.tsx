import { Helmet } from "react-helmet-async";
import PageLayout from "@/components/doba/PageLayout";

export default function Terms() {
  return (
    <>
      <Helmet>
        <title>Terms | pre-drop your music on doba</title>
        <meta name="description" content="Read the doba Terms of Service, including accounts, ownership, transactions, fees, and platform use." />
        <meta property="og:title" content="Terms of Service | Doba" />
        <meta property="og:description" content="doba Terms of Service for artists, fans, and collectors." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://doba.world/terms" />
        <meta property="og:image" content="https://doba.world/doba-og.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Terms of Service | Doba" />
        <meta name="twitter:description" content="doba Terms of Service for artists, fans, and collectors." />
        <meta name="twitter:image" content="https://doba.world/doba-og.png" />
        <link rel="canonical" href="https://doba.world/terms" />
      </Helmet>

      <PageLayout>

        <h1 className="text-4xl sm:text-5xl font-black mb-8 text-foreground tracking-tight">
          Terms of Service
        </h1>

        <div className="space-y-6 text-zinc-700 dark:text-zinc-300 leading-relaxed font-medium">
          <section className="glass-surface p-6 sm:p-8 rounded-md border border-black/10 dark:border-white/5 bg-black/[0.02] dark:bg-white/5">
            <h2 className="text-xl font-bold text-foreground mb-3">1. Acceptance</h2>
            <p className="text-sm">By accessing or using doba, you agree to these Terms of Service and our Privacy Policy. If you do not agree, do not use the platform.</p>
          </section>

          <section className="glass-surface p-6 sm:p-8 rounded-md border border-black/10 dark:border-white/5 bg-black/[0.02] dark:bg-white/5">
            <h2 className="text-xl font-bold text-foreground mb-3">2. Eligibility</h2>
            <p className="text-sm">You must be at least 18 years old to use doba. By using the platform, you represent that you meet this requirement and have the legal capacity to enter into these terms.</p>
          </section>

          <section className="glass-surface p-6 sm:p-8 rounded-md border border-black/10 dark:border-white/5 bg-black/[0.02] dark:bg-white/5">
            <h2 className="text-xl font-bold text-foreground mb-3">3. Permissionless Protocol</h2>
            <p className="text-sm">We operate on the Cardano blockchain, a public, permissionless network. We do not own, control, or operate the blockchain. Once content or assets are published on-chain, we cannot delete, censor, reverse, or modify them. We only control our own frontend, indexing, and interface.</p>
          </section>

          <section className="glass-surface p-6 sm:p-8 rounded-md border border-black/10 dark:border-white/5 bg-black/[0.02] dark:bg-white/5">
            <h2 className="text-xl font-bold text-foreground mb-3">4. Accounts & Custody</h2>
            <p className="text-sm">You can sign up using social login or connect a self-custody Cardano wallet. You are responsible for maintaining the security of your account credentials and for all activity that occurs under your account. We never hold or recover private keys, recovery phrases, or on-chain assets. Any assets associated with your wallet remain under your control.</p>
          </section>

          <section className="glass-surface p-6 sm:p-8 rounded-md border border-black/10 dark:border-white/5 bg-black/[0.02] dark:bg-white/5">
            <h2 className="text-xl font-bold text-foreground mb-3">5. Ownership & Intellectual Property</h2>
            <p className="text-sm">Artists retain full copyright and ownership of their audio recordings and artwork. Purchasing or collecting a music NFT grants non-exclusive personal listening, display, and trading rights only. Collectors do not acquire the underlying copyright or commercial usage rights unless expressly stated by the artist.</p>
          </section>

          <section className="glass-surface p-6 sm:p-8 rounded-md border border-black/10 dark:border-white/5 bg-black/[0.02] dark:bg-white/5">
            <h2 className="text-xl font-bold text-foreground mb-3">6. Fees & Payments</h2>
            <p className="text-sm">All payments are settled in ADA on the Cardano network. We retain a platform fee on primary and secondary sales. Artists receive 90% of primary sales and 5% royalties on secondary sales. Exact fees may be displayed at the point of purchase and are subject to change with notice.</p>
          </section>

          <section className="glass-surface p-6 sm:p-8 rounded-md border border-black/10 dark:border-white/5 bg-black/[0.02] dark:bg-white/5">
            <h2 className="text-xl font-bold text-foreground mb-3">7. Transactions</h2>
            <p className="text-sm">All blockchain transactions are final and non-refundable once confirmed on-chain. We cannot reverse, cancel, or refund completed transactions. You are responsible for verifying transaction details before confirming.</p>
          </section>

          <section className="glass-surface p-6 sm:p-8 rounded-md border border-black/10 dark:border-white/5 bg-black/[0.02] dark:bg-white/5">
            <h2 className="text-xl font-bold text-foreground mb-3">8. Prohibited Conduct</h2>
            <p className="text-sm">You may not use doba to upload, sell, or distribute infringing, illegal, harmful, or fraudulent content. You may not manipulate prices, abuse the platform, or interfere with other users’ accounts or transactions. We may remove offending content or accounts from our frontend, but we cannot remove content or transactions from the Cardano blockchain.</p>
          </section>

          <section className="glass-surface p-6 sm:p-8 rounded-md border border-black/10 dark:border-white/5 bg-black/[0.02] dark:bg-white/5">
            <h2 className="text-xl font-bold text-foreground mb-3">9. Disclaimers</h2>
            <p className="text-sm">Our platform is provided “as is” without warranties of any kind. Because we are built on a permissionless blockchain, we do not guarantee uninterrupted service, specific availability of content, or future value of any collectible. Blockchain networks are subject to congestion, fees, and technical risks outside our control.</p>
          </section>

          <section className="glass-surface p-6 sm:p-8 rounded-md border border-black/10 dark:border-white/5 bg-black/[0.02] dark:bg-white/5">
            <h2 className="text-xl font-bold text-foreground mb-3">10. Termination</h2>
            <p className="text-sm">We may suspend or terminate your access to the doba frontend for violations of these terms or for legal or operational reasons. Suspension or termination affects only your use of the doba interface; it does not affect ownership, transferability, or visibility of assets that already exist on the Cardano blockchain.</p>
          </section>

          <section className="glass-surface p-6 sm:p-8 rounded-md border border-black/10 dark:border-white/5 bg-black/[0.02] dark:bg-white/5">
            <h2 className="text-xl font-bold text-foreground mb-3">11. Changes</h2>
            <p className="text-sm">We may update these Terms of Service from time to time. Continued use of doba after changes constitutes acceptance of the updated terms.</p>
          </section>
        </div>
      </PageLayout>
    </>
  );
}
