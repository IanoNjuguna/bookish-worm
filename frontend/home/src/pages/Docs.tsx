import { Helmet } from "react-helmet-async";
import Navbar from "@/components/doba/Navbar";
import Footer from "@/components/doba/Footer";
import VantaBackground from "@/components/doba/VantaBackground";

export default function Docs() {
  return (
    <>
      <Helmet>
        <title>Docs | pre-drop your music on doba</title>
        <meta name="description" content="Get started on doba with social login, or set up Eternl, Vespr, or Lace. Plus how doba works on Cardano." />
        <meta property="og:title" content="Documentation | Doba" />
        <meta property="og:description" content="Read the doba documentation: wallet setup, smart contracts, and how the platform works." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://doba.world/docs" />
        <meta property="og:image" content="https://doba.world/doba-og.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Documentation | Doba" />
        <meta name="twitter:description" content="Read the doba documentation: wallet setup, smart contracts, and how the platform works." />
        <meta name="twitter:image" content="https://doba.world/doba-og.png" />
        <link rel="canonical" href="https://doba.world/docs" />
      </Helmet>

      <div className="min-h-screen relative overflow-hidden flex flex-col justify-between">
      <VantaBackground />
      <Navbar />

      <main className="pt-32 sm:pt-40 pb-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">

        <h1 className="text-4xl sm:text-5xl font-black mb-4 text-foreground tracking-tight">
          Documentation
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 mb-8 font-medium">
          Everything you need to know about using doba on the Cardano blockchain.
        </p>

        <div className="space-y-8 text-zinc-700 dark:text-zinc-300 leading-relaxed font-medium">
          <section className="glass-surface p-6 sm:p-8 rounded-md border border-black/10 dark:border-white/5 bg-black/[0.02] dark:bg-white/5">
            <h2 className="text-2xl font-bold text-cyber-pink mb-4">1. Getting Started</h2>
            <p className="mb-4">
              To interact with doba:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-2 sm:ml-4 text-sm">
              <li>
                <strong>Recommended:</strong> Sign up with your email, Discord, or Twitter account — no seed phrase or extension required.
              </li>
              <li>Or connect an existing self-custody wallet such as Eternl, Vespr, or Lace.</li>
              <li>Fund your wallet with $ADA to collect or release music.</li>
            </ul>
          </section>

          <section className="glass-surface p-6 sm:p-8 rounded-md border border-black/10 dark:border-white/5 bg-black/[0.02] dark:bg-white/5">
            <h2 className="text-2xl font-bold text-cyber-pink mb-4">2. Wallet Setup</h2>
            <p className="mb-4">
              If you prefer to use your own wallet instead of the one created through social login, set up one of these self-custody wallets:
            </p>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-foreground mb-2">
                  <a href="https://eternl.io" target="_blank" rel="noreferrer" className="text-cyber-pink hover:underline">Eternl</a>{" "}
                  (browser extension)
                </h3>
                <ol className="list-decimal list-inside space-y-1 ml-2 sm:ml-4 text-sm text-zinc-600 dark:text-zinc-300">
                  <li>Install the Eternl extension from the Chrome Web Store or{" "}<a href="https://eternl.io" target="_blank" rel="noreferrer" className="text-cyber-pink hover:underline">eternl.io</a>.</li>
                  <li>Open Eternl and select <strong>Create Wallet</strong> (or <strong>Restore</strong> if you already have a seed phrase).</li>
                  <li>Write down your 24-word recovery phrase and store it somewhere safe and offline.</li>
                  <li>Set a strong spending password.</li>
                  <li>Copy your wallet’s receive address.</li>
                  <li>Buy ADA on an exchange and withdraw it to your receive address.</li>
                </ol>
              </div>

              <div>
                <h3 className="text-lg font-bold text-foreground mb-2">
                  <a href="https://vespr.xyz" target="_blank" rel="noreferrer" className="text-cyber-pink hover:underline">Vespr</a>{" "}
                  (mobile, desktop & browser)
                </h3>
                <ol className="list-decimal list-inside space-y-1 ml-2 sm:ml-4 text-sm text-zinc-600 dark:text-zinc-300">
                  <li>Download Vespr from the{" "}<a href="https://vespr.xyz" target="_blank" rel="noreferrer" className="text-cyber-pink hover:underline">official site</a>{" "}or your app store.</li>
                  <li>Tap <strong>Create New Wallet</strong> and follow the onboarding prompts.</li>
                  <li>Securely back up your recovery phrase.</li>
                  <li>Enable biometric lock if available.</li>
                  <li>Copy your Cardano receive address.</li>
                  <li>Send ADA to that address from an exchange or another wallet.</li>
                </ol>
              </div>

              <div>
                <h3 className="text-lg font-bold text-foreground mb-2">
                  <a href="https://www.lace.io" target="_blank" rel="noreferrer" className="text-cyber-pink hover:underline">Lace</a>{" "}
                  (browser extension by IOG)
                </h3>
                <ol className="list-decimal list-inside space-y-1 ml-2 sm:ml-4 text-sm text-zinc-600 dark:text-zinc-300">
                  <li>Install Lace from{" "}<a href="https://www.lace.io" target="_blank" rel="noreferrer" className="text-cyber-pink hover:underline">lace.io</a>{" "}or the Chrome Web Store.</li>
                  <li>Launch the extension and choose <strong>Create Wallet</strong>.</li>
                  <li>Save your recovery phrase in a secure, offline location.</li>
                  <li>Set a password.</li>
                  <li>Open the wallet and copy your receive address.</li>
                  <li>Fund the wallet with ADA from an exchange.</li>
                </ol>
              </div>
            </div>

            <p className="mt-6 text-sm text-zinc-500 dark:text-zinc-400">
              <strong>Security note:</strong> Doba will never ask for your recovery phrase or private keys. Store them offline and never share them.
            </p>
          </section>

          <section className="glass-surface p-6 sm:p-8 rounded-md border border-black/10 dark:border-white/5 bg-black/[0.02] dark:bg-white/5">
            <h2 className="text-2xl font-bold text-cyber-pink mb-4">3. Smart Contract Mechanics</h2>
            <p className="mb-4">
              Doba uses smart contracts to enforce:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-2 sm:ml-4 text-sm">
              <li><strong>Collaborator Splits:</strong> Revenue is split deterministically during purchase.</li>
              <li><strong>Perpetual Royalties:</strong> Secondary sale royalties are locked during purchase.</li>
            </ul>
          </section>
        </div>
      </main>

      <Footer />
    </div>
    </>
  );
}
