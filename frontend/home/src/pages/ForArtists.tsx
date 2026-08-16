import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Navbar from "@/components/doba/Navbar";
import Footer from "@/components/doba/Footer";
import VantaBackground from "@/components/doba/VantaBackground";

export default function ForArtists() {
  return (
    <>
      <Helmet>
        <title>For Artists | pre-drop your music on doba</title>
        <meta name="description" content="Release music as collectible song tokens on Doba. Keep 90% of primary sales, earn 5% on resales, and build direct fan relationships on Cardano." />
        <meta property="og:title" content="For Artists | Doba" />
        <meta property="og:description" content="Keep 90% of primary sales and earn perpetual royalties on Cardano." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://doba.world/for-artists" />
        <meta property="og:image" content="https://doba.world/doba-og.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="For Artists | Doba" />
        <meta name="twitter:description" content="Keep 90% of primary sales and earn perpetual royalties on Cardano." />
        <meta name="twitter:image" content="https://doba.world/doba-og.png" />
        <link rel="canonical" href="https://doba.world/for-artists" />
      </Helmet>

      <div className="min-h-screen relative overflow-hidden flex flex-col justify-between">
        <VantaBackground />
        <Navbar />

        <main className="pt-32 sm:pt-40 pb-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">

          <h1 className="text-4xl sm:text-5xl font-black mb-4 text-foreground tracking-tight">
            For Artists
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 mb-8 font-medium">
            Build a sustainable career with direct fan support, instant payouts, and zero middlemen.
          </p>

          <div className="space-y-6 text-zinc-700 dark:text-zinc-300 leading-relaxed font-medium">
            <section className="glass-surface p-6 sm:p-8 rounded-md border border-black/10 dark:border-white/5 bg-black/[0.02] dark:bg-white/5">
              <h2 className="text-2xl font-bold text-foreground mb-3">90% Direct Revenue</h2>
              <p className="text-sm">Keep 90% of every primary sale directly in your Cardano wallet without waiting months for streaming royalty payouts.</p>
            </section>

            <section className="glass-surface p-6 sm:p-8 rounded-md border border-black/10 dark:border-white/5 bg-black/[0.02] dark:bg-white/5">
              <h2 className="text-2xl font-bold text-foreground mb-3">Perpetual Royalties</h2>
              <p className="text-sm">Earn 5% on every secondary marketplace sale for the life of your music token on Cardano.</p>
            </section>

            <section className="glass-surface p-6 sm:p-8 rounded-md border border-black/10 dark:border-white/5 bg-black/[0.02] dark:bg-white/5">
              <h2 className="text-2xl font-bold text-foreground mb-3">Automated Collaborator Splits</h2>
              <p className="text-sm">Set revenue percentages for producers, vocalists, and featured artists. Smart contracts handle payouts automatically.</p>
            </section>

            <section className="glass-surface p-6 sm:p-8 rounded-md border border-black/10 dark:border-white/5 bg-black/[0.02] dark:bg-white/5">
              <h2 className="text-2xl font-bold text-foreground mb-3">Pre-drop while you wait</h2>
              <p className="text-sm mb-4">
                Release early on Doba, let super fans claim your song token, and funnel them when the full drop lands.
              </p>
              <Link
                to="/pre-drop"
                className="inline-flex items-center text-sm font-bold uppercase tracking-widest text-cyber-pink hover:underline"
              >
                Learn about pre-drops →
              </Link>
            </section>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
