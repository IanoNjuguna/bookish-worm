import { Helmet } from "react-helmet-async";
import Navbar from "@/components/doba/Navbar";
import Footer from "@/components/doba/Footer";
import VantaBackground from "@/components/doba/VantaBackground";

export default function About() {
  return (
    <>
      <Helmet>
        <title>About | pre-drop your music on doba</title>
        <meta name="description" content="Learn how doba helps artists release music as collectible song tokens and fans stream free, own tracks, and support creators directly." />
        <meta property="og:title" content="About doba" />
        <meta property="og:description" content="Learn how doba empowers artists and fans through blockchain music collectibles." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://doba.world/about" />
        <meta property="og:image" content="https://doba.world/doba-og.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="About doba" />
        <meta name="twitter:description" content="Learn how doba empowers artists and fans through blockchain music collectibles." />
        <meta name="twitter:image" content="https://doba.world/doba-og.png" />
        <link rel="canonical" href="https://doba.world/about" />
      </Helmet>

      <div className="min-h-screen relative overflow-hidden flex flex-col justify-between">
      <VantaBackground />
      <Navbar />

      <main className="pt-32 sm:pt-40 pb-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">

        <h1 className="text-4xl sm:text-5xl font-black mb-8 text-foreground tracking-tight">
          About doba
        </h1>

        <div className="space-y-8 text-zinc-700 dark:text-zinc-300 leading-relaxed font-medium">
          <section className="glass-surface p-6 sm:p-8 rounded-md border border-black/10 dark:border-white/5 bg-black/[0.02] dark:bg-white/5 shadow-sm">
            <h2 className="text-2xl font-bold text-foreground mb-4">Our Mission</h2>
            <p className="mb-4">
              doba empowers fans to own the music they love and artists to profit from their creativity. 
              We're building a blockchain-native music platform where independent artists control their work 
              and fans directly support the creators they believe in.
            </p>
            <p>
              No middlemen. No gatekeepers. Just artists, fans, and music.
            </p>
          </section>

          <section className="glass-surface p-6 sm:p-8 rounded-md border border-black/10 dark:border-white/5 bg-black/[0.02] dark:bg-white/5 shadow-sm">
            <h2 className="text-2xl font-bold text-foreground mb-4">For Artists</h2>
            <p className="mb-4">
              With doba world, you:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-2 sm:ml-4 text-zinc-600 dark:text-zinc-300">
              <li>Upload and mint your music as NFTs</li>
              <li>Set your own prices and keep 90% of primary sales</li>
              <li>Earn 5% royalties on all secondary sales forever</li>
              <li>Collaborate with other artists and auto-split revenue</li>
              <li>Build direct relationships with your super fans</li>
              <li>Track earnings transparently</li>
            </ul>
          </section>

          <section className="glass-surface p-6 sm:p-8 rounded-md border border-black/10 dark:border-white/5 bg-black/[0.02] dark:bg-white/5 shadow-sm">
            <h2 className="text-2xl font-bold text-foreground mb-4">For Fans</h2>
            <p className="mb-4">
              Stream music for free, own it forever. When you purchase a music NFT on doba:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-2 sm:ml-4 text-zinc-600 dark:text-zinc-300">
              <li>Download and listen offline anytime</li>
              <li>Resell or trade your music NFTs on secondary marketplaces</li>
              <li>Get early access to new releases from your favorite artists</li>
            </ul>
          </section>

          <section className="glass-surface p-6 sm:p-8 rounded-md border border-black/10 dark:border-white/5 bg-black/[0.02] dark:bg-white/5 shadow-sm">
            <h2 className="text-2xl font-bold text-foreground mb-4">The Cardano Network</h2>
            <p className="mb-4">
              doba uses native Cardano eUTXO smart contracts, providing:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-2 sm:ml-4 text-zinc-600 dark:text-zinc-300">
              <li>Ultra-low transaction fees (pennies in ADA)</li>
              <li>Instant, reliable, and deterministically split transactions</li>
              <li>Deterministic secondary royalty enforcement</li>
            </ul>
          </section>

          <section className="glass-surface p-6 sm:p-8 rounded-md border border-black/10 dark:border-white/5 bg-black/[0.02] dark:bg-white/5 shadow-sm">
            <h2 className="text-2xl font-bold text-foreground mb-4">Revenue Model</h2>
            <p className="mb-4">
              Here's how money flows on doba:
            </p>
            <div className="bg-black/5 dark:bg-white/5 rounded-md p-5 space-y-3 border border-black/5 dark:border-white/5">
              <div>
                <strong className="text-foreground font-bold">Primary Sales (first purchase):</strong>
                <p className="ml-4 mt-1">Artist: 90% • doba: 10%</p>
              </div>
              <div>
                <strong className="text-foreground font-bold">Secondary Sales (resales):</strong>
                <p className="ml-4 mt-1">Seller: 92% • Artist: 5% royalty • doba: 3%</p>
              </div>
            </div>
          </section>

          <section className="glass-surface p-6 sm:p-8 rounded-md border border-black/10 dark:border-white/5 bg-black/[0.02] dark:bg-white/5 shadow-sm">
            <h2 className="text-2xl font-bold text-foreground mb-4">Why We Built This</h2>
            <p className="mb-4">
              The music industry is broken. Streaming platforms pay artists fractions of a penny per play. 
              Record labels take massive cuts. Independent artists struggle to make a living.
            </p>
            <p className="mb-4">
              We believe artists deserve to profit from their work and fans deserve to truly own the music 
              they love. Blockchain technology makes this possible.
            </p>
            <p>
              doba is for the artists who create music because they love it, and the fans who believe in them.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
    </>
  );
}
