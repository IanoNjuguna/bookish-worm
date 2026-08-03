import Navbar from "@/components/doba/Navbar";
import Footer from "@/components/doba/Footer";
import VantaBackground from "@/components/doba/VantaBackground";

export default function ForArtists() {
  return (
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
        </div>
      </main>

      <Footer />
    </div>
  );
}
