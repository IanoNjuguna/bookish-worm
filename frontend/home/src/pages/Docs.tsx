import Navbar from "@/components/doba/Navbar";
import Footer from "@/components/doba/Footer";
import VantaBackground from "@/components/doba/VantaBackground";

export default function Docs() {
  return (
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
              <li>Connect a wallet (Import or create a wallet if needed)</li>
              <li>Fund your wallet with $ADA</li>
            </ul>
          </section>

          <section className="glass-surface p-6 sm:p-8 rounded-md border border-black/10 dark:border-white/5 bg-black/[0.02] dark:bg-white/5">
            <h2 className="text-2xl font-bold text-cyber-pink mb-4">2. Smart Contract Mechanics</h2>
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
  );
}
