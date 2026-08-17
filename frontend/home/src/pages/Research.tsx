import { Helmet } from "react-helmet-async";
import Navbar from "@/components/doba/Navbar";
import Footer from "@/components/doba/Footer";
import VantaBackground from "@/components/doba/VantaBackground";

const papers = [
  {
    title: "The Apple App Store (Music Streaming) Decision",
    url: "https://press.wz.uw.edu.pl/yars/vol19/iss33/9/",
    source: "Yearbook of Antitrust and Regulatory Studies, 2026",
    relevance:
      "Documents network effects, ecosystem lock-in, and gatekeeper power in music streaming. This is the exact dynamic Doba sidesteps by letting artists own the fan relationship.",
  },
  {
    title: "Revenue Sharing at Music Streaming Platforms",
    url: "https://arxiv.org/abs/2310.11861",
    source: "arXiv, 2023",
    relevance:
      "Models how value flows between platforms, artists, and listeners. It provides a useful frame for Doba’s direct-collect compensation alternative.",
  },
  {
    title: "Artists’ Perspective on Fairness in Streaming",
    url: "https://arxiv.org/abs/2106.02415",
    source: "arXiv, 2021",
    relevance:
      "Shows how recommender systems and platform control shape consumption. Doba gives artists a channel that is not mediated by those algorithms.",
  },
  {
    title: "User Engagement and Music Sales on YouTube",
    url: "https://www.frontiersin.org/article/10.3389/fpsyg.2018.01880/full",
    source: "Frontiers in Psychology, 2018",
    relevance:
      "Provides empirical evidence that fan-driven engagement directly lifts music sales. This supports the pre-drop to funnel to streaming boost model.",
  },
  {
    title: "Affordance and Item Adoption on Streaming Platforms",
    url: "https://arxiv.org/abs/2109.03538",
    source: "arXiv, 2021",
    relevance:
      "Compares organic, algorithmic, and editorial access modes. A Doba pre-drop is a new organic access mode for superfans.",
  },
  {
    title: "Song Comments and Music Listening Experience",
    url: "https://arxiv.org/abs/2308.04022",
    source: "arXiv, 2023",
    relevance:
      "Shows that social features around music increase engagement and retention. This is relevant to building community around pre-drops.",
  },
];

export default function Research() {
  return (
    <>
      <Helmet>
        <title>Research | pre-drop your music on doba</title>
        <meta name="description" content="Academic research and published papers that inform doba's approach to artist-fan relationships and platform economics." />
        <meta property="og:title" content="Research | Doba" />
        <meta property="og:description" content="Research behind Doba: platform economics, network effects, and artist-fan relationships." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://doba.world/research" />
        <meta property="og:image" content="https://doba.world/doba-og.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Research | Doba" />
        <meta name="twitter:description" content="Research behind Doba: platform economics, network effects, and artist-fan relationships." />
        <meta name="twitter:image" content="https://doba.world/doba-og.png" />
        <link rel="canonical" href="https://doba.world/research" />
      </Helmet>

      <div className="min-h-screen relative overflow-hidden flex flex-col justify-between">
      <VantaBackground />
      <Navbar />

      <main className="pt-32 sm:pt-40 pb-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        <h1 className="text-4xl sm:text-5xl font-black mb-4 text-foreground tracking-tight">
          Research
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 mb-8 font-medium">
          Published work that shapes how we think about artist-fan relationships, platform economics, and network effects in music.
        </p>

        <div className="space-y-4">
          {papers.map((paper) => (
            <a
              key={paper.url}
              href={paper.url}
              target="_blank"
              rel="noreferrer"
              className="block glass-surface p-6 sm:p-8 rounded-md border border-black/10 dark:border-white/5 bg-black/[0.02] dark:bg-white/5 hover:border-cyber-pink/30 transition-colors group"
            >
              <h2 className="text-lg sm:text-xl font-bold text-foreground mb-1 group-hover:text-cyber-pink transition-colors">
                {paper.title}
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 font-mono uppercase tracking-wider mb-3">
                {paper.source}
              </p>
              <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed">
                {paper.relevance}
              </p>
            </a>
          ))}
        </div>
      </main>

      <Footer />
    </div>
    </>
  );
}
