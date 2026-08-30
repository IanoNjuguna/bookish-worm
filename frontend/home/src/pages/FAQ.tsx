import { Helmet } from "react-helmet-async";
import PageLayout from "@/components/doba/PageLayout";

const faqs = [
  {
    q: "What is a pre-drop?",
    a: "A pre-drop is a release of music on doba before it is officially distributed on major streaming platforms. Artists build momentum with super fans, and fans collect the track as a song token."
  },
  {
    q: "How do I sign in?",
    a: "You can sign up with your email, Discord, or Twitter account. If you already have a self-custody wallet, you can connect Eternl, Vespr, or Lace instead."
  },
  {
    q: "Do I need a Cardano wallet?",
    a: "Not to get started. Social login creates a wallet behind the scenes. If you prefer full self-custody, you can connect your own Cardano wallet at any time."
  },
  {
    q: "How do artists get paid?",
    a: "Artists keep 90% of primary sales and earn 5% royalties on every secondary resale. Payments settle instantly in ADA through smart contracts."
  },
  {
    q: "What blockchain does doba use?",
    a: "Doba runs on Cardano. We use native eUTXO smart contracts for deterministic revenue splits and royalty enforcement."
  },
  {
    q: "Can I resell music I collect?",
    a: "Yes. Every song token can be traded on secondary marketplaces that support Cardano NFTs. The original artist earns a royalty on each resale."
  },
  {
    q: "Is doba free for fans?",
    a: "Streaming on doba is free. Collecting a song token requires purchasing it in ADA, which supports the artist directly."
  }
];

export default function FAQ() {
  return (
    <>
      <Helmet>
        <title>FAQ | pre-drop your music on doba</title>
        <meta name="description" content="Find answers about pre-drops, social login, wallets, payments, and music NFTs on doba." />
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

      <PageLayout>

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
      </PageLayout>
    </>
  );
}
