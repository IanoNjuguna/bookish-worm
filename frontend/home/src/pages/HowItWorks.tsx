import Navbar from "@/components/doba/Navbar";
import Footer from "@/components/doba/Footer";
import VantaBackground from "@/components/doba/VantaBackground";

export default function HowItWorks() {
  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col justify-between">
      <VantaBackground />
      <Navbar />

      <main className="pt-32 sm:pt-40 pb-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">

        <h1 className="text-4xl sm:text-5xl font-black mb-8 text-foreground tracking-tight">
          How It Works
        </h1>

        <div className="space-y-10 text-zinc-700 dark:text-zinc-300 leading-relaxed font-medium">
          {/* For Fans */}
          <section className="space-y-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">For Fans</h2>
            
            <div className="space-y-4">
              <div className="glass-surface p-6 rounded-md border border-black/10 dark:border-white/5 bg-black/[0.02] dark:bg-white/5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-md bg-cyber-pink text-white flex items-center justify-center text-lg font-bold shrink-0">
                    1
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-1">Discover Music</h3>
                    <p className="text-sm">Browse doba's marketplace to discover music from independent artists. Stream any song for free to preview before you buy.</p>
                  </div>
                </div>
              </div>

              <div className="glass-surface p-6 rounded-md border border-black/10 dark:border-white/5 bg-black/[0.02] dark:bg-white/5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-md bg-cyber-pink text-white flex items-center justify-center text-lg font-bold shrink-0">
                    2
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-1">Set Up Your Cardano Wallet</h3>
                    <p className="text-sm mb-3">To own music, you'll need a Cardano wallet. We recommend Eternl, Vespr, or Lace funded with ADA.</p>
                    <Link to="/docs" className="text-cyber-pink hover:underline text-sm font-bold">
                      Read Step-by-Step Wallet Guide →
                    </Link>
                  </div>
                </div>
              </div>

              <div className="glass-surface p-6 rounded-md border border-black/10 dark:border-white/5 bg-black/[0.02] dark:bg-white/5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-md bg-cyber-pink text-white flex items-center justify-center text-lg font-bold shrink-0">
                    3
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-1">Purchase Music NFTs</h3>
                    <p className="text-sm mb-2">When you find a song you love, click to purchase it as a Cardano NFT. Your payment goes directly to the artist via smart contracts.</p>
                  </div>
                </div>
              </div>

              <div className="glass-surface p-6 rounded-md border border-black/10 dark:border-white/5 bg-black/[0.02] dark:bg-white/5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-md bg-cyber-pink text-white flex items-center justify-center text-lg font-bold shrink-0">
                    4
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-1">Own & Enjoy</h3>
                    <p className="text-sm">Download lossless audio files (WAV/FLAC), listen offline, and hold or trade your music NFTs anytime.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* For Artists */}
          <section className="border-t border-black/10 dark:border-white/10 pt-10 space-y-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">For Artists</h2>
            
            <div className="space-y-4">
              <div className="glass-surface p-6 rounded-md border border-black/10 dark:border-white/5 bg-black/[0.02] dark:bg-white/5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-md bg-lavender text-black flex items-center justify-center text-lg font-extrabold shrink-0">
                    1
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-1">Connect Wallet</h3>
                    <p className="text-sm">Sign in with your Cardano wallet to manage releases and receive payouts.</p>
                  </div>
                </div>
              </div>

              <div className="glass-surface p-6 rounded-md border border-black/10 dark:border-white/5 bg-black/[0.02] dark:bg-white/5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-md bg-lavender text-black flex items-center justify-center text-lg font-extrabold shrink-0">
                    2
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-1">Upload & Set Splits</h3>
                    <p className="text-sm">Upload audio files, artwork, and set automated collaborator revenue splits.</p>
                  </div>
                </div>
              </div>

              <div className="glass-surface p-6 rounded-md border border-black/10 dark:border-white/5 bg-black/[0.02] dark:bg-white/5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-md bg-lavender text-black flex items-center justify-center text-lg font-extrabold shrink-0">
                    3
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-1">Earn Instantly</h3>
                    <p className="text-sm">Keep 93% of primary sales and earn 10-15% perpetual secondary royalties paid directly to your wallet.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
