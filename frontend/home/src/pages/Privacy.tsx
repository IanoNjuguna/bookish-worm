import { Helmet } from "react-helmet-async";
import PageLayout from "@/components/doba/PageLayout";

export default function Privacy() {
  return (
    <>
      <Helmet>
        <title>Privacy | pre-drop your music on doba</title>
        <meta name="description" content="Read the doba Privacy Policy: what data we collect, how we use it, and your rights." />
        <meta property="og:title" content="Privacy Policy | Doba" />
        <meta property="og:description" content="doba Privacy Policy: what data we collect, how we use it, and your rights." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://doba.world/privacy" />
        <meta property="og:image" content="https://doba.world/doba-og.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Privacy Policy | Doba" />
        <meta name="twitter:description" content="doba Privacy Policy: what data we collect, how we use it, and your rights." />
        <meta name="twitter:image" content="https://doba.world/doba-og.png" />
        <link rel="canonical" href="https://doba.world/privacy" />
      </Helmet>

      <PageLayout>

        <h1 className="text-4xl sm:text-5xl font-black mb-8 text-foreground tracking-tight">
          Privacy Policy
        </h1>

        <div className="space-y-6 text-zinc-700 dark:text-zinc-300 leading-relaxed font-medium">
          <section className="glass-surface p-6 sm:p-8 rounded-md border border-black/10 dark:border-white/5 bg-black/[0.02] dark:bg-white/5">
            <h2 className="text-xl font-bold text-foreground mb-3">1. Overview</h2>
            <p className="text-sm">This Privacy Policy explains what information doba collects, how we use it, and your rights. By using doba, you consent to the practices described here.</p>
          </section>

          <section className="glass-surface p-6 sm:p-8 rounded-md border border-black/10 dark:border-white/5 bg-black/[0.02] dark:bg-white/5">
            <h2 className="text-xl font-bold text-foreground mb-3">2. Information We Collect</h2>
            <ul className="list-disc list-inside space-y-2 text-sm text-zinc-600 dark:text-zinc-300">
              <li><strong>Authentication data:</strong> If you sign up with social login, we receive a verified identifier from the provider (such as email, Discord, or Twitter) and a corresponding Cardano wallet address.</li>
              <li><strong>Wallet addresses:</strong> If you connect a self-custody wallet, we collect your public Cardano wallet address. We do not collect or store private keys or recovery phrases.</li>
              <li><strong>Blockchain data:</strong> Transactions, token ownership, and other on-chain activity are public by design and visible to anyone.</li>
              <li><strong>Usage data:</strong> We may collect technical data such as IP address, browser type, device information, and pages visited to maintain and improve the platform.</li>
            </ul>
          </section>

          <section className="glass-surface p-6 sm:p-8 rounded-md border border-black/10 dark:border-white/5 bg-black/[0.02] dark:bg-white/5">
            <h2 className="text-xl font-bold text-foreground mb-3">3. How We Use Information</h2>
            <ul className="list-disc list-inside space-y-2 text-sm text-zinc-600 dark:text-zinc-300">
              <li>To authenticate you and secure your account.</li>
              <li>To display your collected music, releases, and transaction history.</li>
              <li>To process transactions and distribute payments on the Cardano network.</li>
              <li>To improve the platform, detect abuse, and provide support.</li>
              <li>To communicate important updates about the service.</li>
            </ul>
          </section>

          <section className="glass-surface p-6 sm:p-8 rounded-md border border-black/10 dark:border-white/5 bg-black/[0.02] dark:bg-white/5">
            <h2 className="text-xl font-bold text-foreground mb-3">4. Third-Party Services</h2>
            <p className="text-sm">We use third-party services for authentication, wallet creation, hosting, and analytics. These providers have their own privacy policies and may process data on our behalf. We do not sell your personal information.</p>
          </section>

          <section className="glass-surface p-6 sm:p-8 rounded-md border border-black/10 dark:border-white/5 bg-black/[0.02] dark:bg-white/5">
            <h2 className="text-xl font-bold text-foreground mb-3">5. Blockchain Data</h2>
            <p className="text-sm">Because doba operates on a public blockchain, any transaction, wallet address, or token metadata you publish is publicly visible and cannot be deleted by doba. Please be mindful of what you choose to publish on-chain.</p>
          </section>

          <section className="glass-surface p-6 sm:p-8 rounded-md border border-black/10 dark:border-white/5 bg-black/[0.02] dark:bg-white/5">
            <h2 className="text-xl font-bold text-foreground mb-3">6. Security</h2>
            <p className="text-sm">We take reasonable measures to protect your information. However, no online service is completely secure. You are responsible for safeguarding your account credentials and recovery phrases for any self-custody wallet you use.</p>
          </section>

          <section className="glass-surface p-6 sm:p-8 rounded-md border border-black/10 dark:border-white/5 bg-black/[0.02] dark:bg-white/5">
            <h2 className="text-xl font-bold text-foreground mb-3">7. Your Rights</h2>
            <p className="text-sm">Depending on your location, you may have the right to access, correct, or delete personal data we hold about you. Because blockchain data is immutable, we cannot delete public on-chain records. To exercise your rights, contact us at the address below.</p>
          </section>

          <section className="glass-surface p-6 sm:p-8 rounded-md border border-black/10 dark:border-white/5 bg-black/[0.02] dark:bg-white/5">
            <h2 className="text-xl font-bold text-foreground mb-3">8. Changes</h2>
            <p className="text-sm">We may update this Privacy Policy from time to time. Continued use of doba after changes constitutes acceptance of the updated policy.</p>
          </section>

          <section className="glass-surface p-6 sm:p-8 rounded-md border border-black/10 dark:border-white/5 bg-black/[0.02] dark:bg-white/5">
            <h2 className="text-xl font-bold text-foreground mb-3">9. Contact</h2>
            <p className="text-sm">If you have questions about this Privacy Policy, please contact us at <a href="mailto:iano@doba.world" className="text-cyber-pink hover:underline">iano@doba.world</a>.</p>
          </section>
        </div>
      </PageLayout>
    </>
  );
}
