import { Helmet } from "react-helmet-async";
import Navbar from "@/components/doba/Navbar";
import Footer from "@/components/doba/Footer";
import VantaBackground from "@/components/doba/VantaBackground";

const faqs = [
  {
    q: "What wallet do I need to sign in?",
    a: "You need a compatible wallet seed phrase or an email address."
  },
  {
    q: "How do artists get paid?",
    a: "Payments are settled instantly in $ADA when a fan purchases a music NFT."
  }
];

export default function FAQ() {
  return (
    <>
      <Helmet>
        <title>FAQ | pre-drop your music on doba</title>
        <meta name="description" content="Find answers to frequently asked questions about doba wallets, payments, and music NFTs." />
        <meta property="og:title" content="FAQ | Doba" />
        <meta property="og:description" content="Answers to common questions about using doba." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://doba.world/faq" />
        <meta property="og:image" content="https://doba.world/doba-og.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="FAQ | Doba" />
        <meta name="twitter:description" content="Answers to common questions about using doba." />
        <meta name="twitter:image" content="https://doba.world/doba-og.png" />
        <link rel="canonical" href="https://doba.world/faq" />
      </Helmet>

      <div className="min-h-screen relative overflow-hidden flex flex-col justify-between">
      <VantaBackground />
      <Navbar />

      <main className="pt-32 sm:pt-40 pb-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">

        <h1 className="text-4xl sm:text-5xl font-black mb-8 text-foreground tracking-tight">
          Frequently Asked Questions
        </h1>

        <div className="space-y-4 text-zinc-700 dark:text-zinc-300 leading-relaxed font-medium">
          {faqs.map((faq, idx) => (
            <div key={idx} className="glass-surface p-6 rounded-md border border-black/10 dark:border-white/5 bg-black/[0.02] dark:bg-white/5">
              <h2 className="text-xl font-bold text-foreground mb-2">{faq.q}</h2>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">{faq.a}</p>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
    </>
  );
}
