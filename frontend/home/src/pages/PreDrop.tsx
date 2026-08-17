import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { IconUpload, IconHeartHandshake, IconPlayerPlay, IconUsers, IconCoin } from "@tabler/icons-react";
import Navbar from "@/components/doba/Navbar";
import Footer from "@/components/doba/Footer";
import VantaBackground from "@/components/doba/VantaBackground";

const artists = [
  {
    name: "Carla Alves",
    image: "/images/pre-drop/carla-alves.jpg",
    genre: "World / Jazz",
    origin: "Brazil",
    bio: "Carla brings a magnetic stage presence and cross-cultural sound to her upcoming Doba pre-drop.",
  },
  {
    name: "Red GG",
    image: "/images/pre-drop/red-gg.jpg",
    genre: "Hip-Hop / Afrofusion",
    origin: "Kenya",
    bio: "Red GG blends sharp lyricism with East African rhythms for a pre-drop built for true fans.",
  },
];

const howToSteps = [
  {
    icon: IconUpload,
    title: "Drag and drop to upload",
    description: "We handle encoding and storage so your record is ready to collect.",
  },
  {
    icon: IconUsers,
    title: "Set collaborator splits",
    description: "Revenue shares are enforced by smart contracts on Cardano.",
  },
  {
    icon: IconCoin,
    title: "Earn",
    description: "Super fans collect your music as song tokens and you get paid directly.",
  },
];

const research = [
  {
    title: "The Apple App Store (Music Streaming) Decision",
    url: "https://press.wz.uw.edu.pl/yars/vol19/iss33/9/",
    relevance: "Network effects, ecosystem lock-in, and gatekeeper power in music streaming — the dynamic Doba sidesteps by letting artists own the fan relationship.",
  },
  {
    title: "User Engagement and Music Sales on YouTube",
    url: "https://www.frontiersin.org/article/10.3389/fpsyg.2018.01880/full",
    relevance: "Empirical evidence that fan-driven engagement (previews, shares, comments) directly lifts music sales — supporting the pre-drop → funnel → streaming boost model.",
  },
  {
    title: "Revenue Sharing at Music Streaming Platforms",
    url: "https://arxiv.org/abs/2310.11861",
    relevance: "Models how value flows between platforms, artists, and listeners — a useful frame for Doba’s direct-collect compensation alternative.",
  },
  {
    title: "Artists’ Perspective on Fairness in Streaming",
    url: "https://arxiv.org/abs/2106.02415",
    relevance: "Shows how recommender systems and platform control shape consumption; Doba gives artists a channel not mediated by those algorithms.",
  },
];

export default function PreDrop() {
  return (
    <>
      <Helmet>
        <title>Pre-drop your music on doba | for artists and super fans</title>
        <meta name="description" content="Doba lets artists pre-drop music while waiting on Spotify, Apple Music, and Deezer. Fans collect song tokens, stream for free, and support early releases." />
        <meta property="og:title" content="Pre-drop your music on Doba" />
        <meta property="og:description" content="Release music before the streaming platforms. Fans collect, stream free, and boost your launch." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://doba.world/pre-drop" />
        <meta property="og:image" content="https://doba.world/doba-og.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Pre-drop your music on Doba" />
        <meta name="twitter:description" content="Release music before the streaming platforms. Fans collect, stream free, and boost your launch." />
        <meta name="twitter:image" content="https://doba.world/doba-og.png" />
        <link rel="canonical" href="https://doba.world/pre-drop" />
      </Helmet>

      <div className="min-h-screen relative overflow-hidden flex flex-col justify-between">
        <VantaBackground />
        <Navbar />

        <main className="pt-32 sm:pt-40 pb-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
          {/* Hero */}
          <section className="text-center mb-16 sm:mb-24">
            <h1 className="text-4xl sm:text-6xl font-black mb-6 text-foreground tracking-tight">
              pre-drop your music on doba
            </h1>
            <p className="text-lg sm:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto mb-8 font-medium">
              Doba is the best place to publish your music while you&apos;re on waitlists elsewhere. Super fans get the earliest access, you build momentum, and everyone streams for free. W.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/for-artists"
                className="inline-flex items-center justify-center h-12 px-8 rounded-lg bg-cyber-pink hover:bg-cyber-pink/90 text-black font-bold text-sm uppercase tracking-widest transition-all duration-300 hover:scale-[1.03] active:scale-95 shadow-md"
              >
                For Artists
              </Link>
            </div>
          </section>

          {/* How it works */}
          <section className="mb-16 sm:mb-24">
            <h2 className="text-2xl sm:text-3xl font-bold text-center text-foreground mb-10">
              How a pre-drop works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="glass-surface p-6 sm:p-8 rounded-md border border-black/10 dark:border-white/5 bg-black/[0.02] dark:bg-white/5 text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-cyber-pink/10 flex items-center justify-center">
                  <IconUpload size={24} className="text-cyber-pink" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">Upload</h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  Release your track on Doba while it&apos;s still in review or waitlisted on other platforms.
                </p>
              </div>
              <div className="glass-surface p-6 sm:p-8 rounded-md border border-black/10 dark:border-white/5 bg-black/[0.02] dark:bg-white/5 text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-cyber-pink/10 flex items-center justify-center">
                  <IconHeartHandshake size={24} className="text-cyber-pink" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">Collectors</h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  Super fans collect your song token, download the track, and stream it free offline or on Doba.
                </p>
              </div>
              <div className="glass-surface p-6 sm:p-8 rounded-md border border-black/10 dark:border-white/5 bg-black/[0.02] dark:bg-white/5 text-center">
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-cyber-pink/10 flex items-center justify-center">
                  <IconPlayerPlay size={24} className="text-cyber-pink" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">Funnel</h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  When your track goes live on Spotify, Apple Music, or Deezer, your super fans boost you.
                </p>
              </div>
            </div>
          </section>

          {/* How to pre-drop on Doba */}
          <section className="mb-16 sm:mb-24">
            <h2 className="text-2xl sm:text-3xl font-bold text-center text-foreground mb-10">
              How to pre-drop on doba
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {howToSteps.map((step) => (
                <div
                  key={step.title}
                  className="glass-surface p-6 sm:p-8 rounded-md border border-black/10 dark:border-white/5 bg-black/[0.02] dark:bg-white/5 text-center"
                >
                  <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-cyber-pink/10 flex items-center justify-center">
                    <step.icon size={24} className="text-cyber-pink" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2">{step.title}</h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">{step.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Artist spotlights */}
          <section className="mb-16 sm:mb-24">
            <h2 className="text-2xl sm:text-3xl font-bold text-center text-foreground mb-10">
              Upcoming pre-drops
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {artists.map((artist) => (
                <div
                  key={artist.name}
                  className="glass-surface rounded-md border border-black/10 dark:border-white/5 bg-black/[0.02] dark:bg-white/5 overflow-hidden"
                >
                  <div className="aspect-square bg-zinc-200 dark:bg-zinc-800">
                    <img
                      src={artist.image}
                      alt={artist.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.currentTarget;
                        target.style.display = "none";
                        target.parentElement?.classList.add("flex", "items-center", "justify-center");
                        const initials = document.createElement("span");
                        initials.className = "text-4xl font-black text-zinc-400 dark:text-zinc-600";
                        initials.textContent = artist.name.split(" ").map((n) => n[0]).join("");
                        target.parentElement?.appendChild(initials);
                      }}
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-foreground mb-1">{artist.name}</h3>
                    <p className="text-xs text-cyber-pink font-bold uppercase tracking-widest mb-3">
                      {artist.genre} · {artist.origin}
                    </p>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">{artist.bio}</p>
                    <span className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-emerald-500">
                      Upcoming pre-drop
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Research */}
          <section className="mb-16 sm:mb-24">
            <h2 className="text-2xl sm:text-3xl font-bold text-center text-foreground mb-10">
              Why pre-drops work
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {research.map((paper) => (
                <a
                  key={paper.url}
                  href={paper.url}
                  target="_blank"
                  rel="noreferrer"
                  className="block glass-surface p-6 rounded-md border border-black/10 dark:border-white/5 bg-black/[0.02] dark:bg-white/5 hover:border-cyber-pink/30 transition-colors group"
                >
                  <h3 className="text-base font-bold text-foreground mb-2 group-hover:text-cyber-pink transition-colors">
                    {paper.title}
                  </h3>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {paper.relevance}
                  </p>
                </a>
              ))}
            </div>
            <div className="mt-6 text-center">
              <Link
                to="/research"
                className="inline-flex items-center text-sm font-bold uppercase tracking-widest text-cyber-pink hover:underline"
              >
                read the research papers
              </Link>
            </div>
          </section>

        </main>

        <Footer />
      </div>
    </>
  );
}
