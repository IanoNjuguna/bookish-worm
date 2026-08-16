import { Helmet } from "react-helmet-async";
import Navbar from "@/components/doba/Navbar";
import Footer from "@/components/doba/Footer";
import VantaBackground from "@/components/doba/VantaBackground";

export default function Privacy() {
  return (
    <>
      <Helmet>
        <title>Privacy | pre-drop your music on doba</title>
        <meta name="description" content="Read the doba Privacy Policy. We do not collect personal emails or passwords; authentication uses Cardano wallet addresses." />
        <meta property="og:title" content="Privacy Policy | Doba" />
        <meta property="og:description" content="doba Privacy Policy: no personal emails, no passwords, cryptographic wallet auth." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://doba.world/privacy" />
        <meta property="og:image" content="https://doba.world/doba-og.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Privacy Policy | Doba" />
        <meta name="twitter:description" content="doba Privacy Policy: no personal emails, no passwords, cryptographic wallet auth." />
        <meta name="twitter:image" content="https://doba.world/doba-og.png" />
        <link rel="canonical" href="https://doba.world/privacy" />
      </Helmet>

      <div className="min-h-screen relative overflow-hidden flex flex-col justify-between">
      <VantaBackground />
      <Navbar />

      <main className="pt-32 sm:pt-40 pb-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">

        <h1 className="text-4xl sm:text-5xl font-black mb-8 text-foreground tracking-tight">
          Privacy Policy
        </h1>

        <div className="space-y-6 text-zinc-700 dark:text-zinc-300 leading-relaxed font-medium">
          <section className="glass-surface p-6 sm:p-8 rounded-md border border-black/10 dark:border-white/5 bg-black/[0.02] dark:bg-white/5">
            <h2 className="text-xl font-bold text-foreground mb-3">Data Protection</h2>
            <p className="text-sm">doba does not collect personal emails, names, or passwords. Authentication is handled cryptographically via public Cardano wallet addresses.</p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
    </>
  );
}
