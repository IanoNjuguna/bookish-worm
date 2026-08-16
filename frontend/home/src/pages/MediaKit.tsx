import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/doba/Navbar";
import Footer from "@/components/doba/Footer";
import VantaBackground from "@/components/doba/VantaBackground";
import { IconDownload, IconArrowUpRight, IconMusic, IconUsers, IconCoin } from "@tabler/icons-react";


const SECTIONS: [string, string][] = [
  ["boilerplate", "Boilerplate"],
  ["logo", "Logo"],
  ["colors", "Colors"],
  ["gradients", "Gradients"],
  ["typography", "Typography"],
  ["iconography", "Iconography"],
  ["layout", "Layout"],
  ["previews", "Previews"],
  ["usage", "Usage"],
];

const colors = [
  {
    name: "Cyber Pink",
    role: "Primary action — collect, buy, active states",
    hex: "#FF1F8A",
    rgb: "255 / 31 / 138",
    hsl: "330 / 100% / 56%",
    swatch: "bg-[#FF1F8A]",
    textOn: "text-white",
  },
  {
    name: "Lavender",
    role: "Accent — secondary CTAs, labels, highlights",
    hex: "#B794F4",
    rgb: "183 / 148 / 244",
    hsl: "263 / 85% / 77%",
    swatch: "bg-[#B794F4]",
    textOn: "text-black",
  },
  {
    name: "Midnight",
    role: "Dark surface base, light-mode text",
    hex: "#0D0D12",
    rgb: "13 / 13 / 18",
    hsl: "240 / 17% / 5%",
    swatch: "bg-[#0D0D12]",
    textOn: "text-white",
  },
  {
    name: "Paper",
    role: "Light surface base, dark-mode text",
    hex: "#FAF9F6",
    rgb: "250 / 249 / 246",
    hsl: "60 / 33% / 98%",
    swatch: "bg-[#FAF9F6] border border-black/10",
    textOn: "text-black",
  },
];

const fonts = [
  {
    name: "Chivo",
    usage: "UI & body copy",
    fallback: "Arial, sans-serif",
    sample: "font-sans",
    link: "https://fonts.google.com/specimen/Chivo",
    weights: ["Light 300", "Regular 400", "Bold 700", "Black 900"],
  },
  {
    name: "Space Mono",
    usage: "Display & brand moments",
    fallback: "ui-monospace, monospace",
    sample: "font-display",
    link: "https://fonts.google.com/specimen/Space+Mono",
    weights: ["Regular 400", "Bold 700"],
  },
  {
    name: "IBM Plex Mono",
    usage: "Data — addresses, hashes, code",
    fallback: "ui-monospace, monospace",
    sample: "font-mono",
    link: "https://fonts.google.com/specimen/IBM+Plex+Mono",
    weights: ["Regular 400", "Medium 500", "SemiBold 600"],
  },
];

export default function MediaKit() {
  const [activeSection, setActiveSection] = useState<string>(SECTIONS[0][0]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: "-25% 0px -65% 0px" }
    );
    SECTIONS.forEach(([id]) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <Helmet>
        <title>Media Kit | pre-drop your music on doba</title>
        <meta name="description" content="Download doba brand assets, logos, colors, typography, and usage guidelines for press and partnerships." />
        <meta property="og:title" content="Media Kit | Doba" />
        <meta property="og:description" content="Official doba brand assets and guidelines for press, partners, and creators." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://doba.world/media-kit" />
        <meta property="og:image" content="https://doba.world/doba-og.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Media Kit | Doba" />
        <meta name="twitter:description" content="Official doba brand assets and guidelines for press, partners, and creators." />
        <meta name="twitter:image" content="https://doba.world/doba-og.png" />
        <link rel="canonical" href="https://doba.world/media-kit" />
      </Helmet>

      <div className="min-h-screen relative overflow-x-hidden flex flex-col justify-between">
      <VantaBackground />
      <Navbar />

      {/* Side nav pill (xl screens) */}
      <nav aria-label="Media kit sections" className="hidden xl:flex fixed right-6 top-1/2 -translate-y-1/2 z-40 flex-col gap-0.5 glass-surface bg-white/80 dark:bg-[#0D0D12]/85 border border-black/10 dark:border-white/15 rounded-2xl p-2 shadow-lg dark:shadow-2xl">
        {SECTIONS.map(([id, label]) => (
          <a
            key={id}
            href={`#${id}`}
            aria-current={activeSection === id ? "true" : undefined}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeSection === id
                ? "text-cyber-pink font-bold bg-cyber-pink/5 dark:bg-cyber-pink/10"
                : "text-zinc-600 dark:text-zinc-300 hover:text-cyber-pink hover:bg-black/5 dark:hover:bg-white/10"
            }`}
          >
            {label}
          </a>
        ))}
      </nav>

      <main className="pt-32 sm:pt-40 pb-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full space-y-14">
        {/* Mobile section nav (< xl) */}
        <nav aria-label="Media kit sections" className="xl:hidden sticky top-3 z-40 -mx-4 sm:-mx-6 px-4 sm:px-6 flex gap-1.5 overflow-x-auto no-scrollbar">
          {SECTIONS.map(([id, label]) => (
            <a
              key={id}
              href={`#${id}`}
              aria-current={activeSection === id ? "true" : undefined}
              className={`whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors glass-surface ${
                activeSection === id
                  ? "text-cyber-pink font-bold border-cyber-pink/30 bg-cyber-pink/10"
                  : "text-zinc-600 dark:text-zinc-300 border-black/10 dark:border-white/15 bg-white/80 dark:bg-[#0D0D12]/85"
              }`}
            >
              {label}
            </a>
          ))}
        </nav>
        {/* Header */}
        <div>
          <h1 className="text-4xl sm:text-5xl font-black mb-4 text-foreground tracking-tight">
            Media Kit
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 font-medium max-w-2xl leading-relaxed">
            Brand assets and guidelines for doba. Everything below reflects the live
            design system.
          </p>
        </div>

        {/* Voice */}
        <section className="glass-surface p-6 sm:p-8 rounded-md border border-black/10 dark:border-white/5 bg-black/[0.02] dark:bg-white/5">
          <h2 id="boilerplate" className="text-2xl font-bold text-foreground mb-3 scroll-mt-28">Boilerplate</h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 font-medium mb-6 leading-relaxed">
            Pre-approved copy at every length — quote it verbatim. The name is always lowercase:{" "}
            <span className="font-mono">doba</span>. Never "Doba", "DOBA", or "Doba Protocol" in copy;
            "doba protocol" only when the technical context demands it.
          </p>
          <div className="space-y-5">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-lavender block mb-1.5">Tagline — bios &amp; captions</span>
              <p className="text-lg sm:text-xl font-display font-bold text-cyber-pink">
                "100 invested fans outperform 100,000 streams."
              </p>
            </div>
            <div className="border-t border-black/5 dark:border-white/5 pt-5">
              <span className="text-[10px] font-bold uppercase tracking-widest text-lavender block mb-1.5">One-liner — press &amp; headlines</span>
              <p className="text-sm sm:text-base text-foreground font-semibold leading-relaxed">
                "doba is the only marketplace where artists upload their music and get paid instantly once their music is collected. Everything is settled on-chain."
              </p>
            </div>
            <div className="border-t border-black/5 dark:border-white/5 pt-5">
              <span className="text-[10px] font-bold uppercase tracking-widest text-lavender block mb-1.5">Paragraph — about sections</span>
              <p className="text-sm text-zinc-600 dark:text-zinc-300 font-medium leading-relaxed">
                "Artists release music as fan-owned digital assets.
                No distributors, no payout thresholds, no rented audiences."
              </p>
            </div>
            <div className="border-t border-black/5 dark:border-white/5 pt-5">
              <span className="text-[10px] font-bold uppercase tracking-widest text-lavender block mb-1.5">Short form — social &amp; footers</span>
              <p className="text-sm text-foreground font-semibold">
                "made with love, by doba"
              </p>
            </div>
          </div>
        </section>

        {/* Logo */}
        <section>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-6 scroll-mt-28" id="logo">Logo</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div className="glass-surface rounded-md border border-black/10 bg-[#FAF9F6] p-10 flex items-center justify-center">
              <img src="/doba.png" alt="doba logo on light" className="w-20 h-20 object-contain invert" />
            </div>
            <div className="glass-surface rounded-md border border-white/10 bg-[#0D0D12] p-10 flex items-center justify-center">
              <img src="/doba.png" alt="doba logo on dark" className="w-20 h-20 object-contain" />
            </div>
            <div className="glass-surface rounded-md border border-black/10 bg-[#FAF9F6] p-10 flex items-center justify-center gap-3">
              <img src="/doba.png" alt="doba mark" className="w-10 h-10 object-contain invert" />
              <span className="font-sans text-3xl font-extrabold tracking-tight lowercase text-black">doba</span>
            </div>
            <div className="glass-surface rounded-md border border-white/10 bg-[#0D0D12] p-10 flex items-center justify-center gap-3">
              <img src="/doba.png" alt="doba mark" className="w-10 h-10 object-contain" />
              <span className="font-sans text-3xl font-extrabold tracking-tight lowercase text-white">doba</span>
            </div>
          </div>
          <div className="glass-surface rounded-md border border-black/10 dark:border-white/5 bg-black/[0.02] dark:bg-white/5 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
            <img src="/doba-banner.png" alt="doba banner" className="max-h-16 object-contain rounded-md" />
            <div className="flex flex-wrap gap-3">
              <a href="/doba.png" download className="glow-button inline-flex items-center gap-2 text-sm">
                <IconDownload size={16} /> Logo PNG
              </a>
              <a href="/doba-banner.png" download className="outline-button inline-flex items-center gap-2 text-sm">
                <IconDownload size={16} /> Banner PNG
              </a>
            </div>
          </div>
          <ul className="mt-4 space-y-1.5 text-sm text-zinc-600 dark:text-zinc-400 font-medium list-disc list-inside">
            <li>Maintain clearspace around the logo equal to at least half the logo's width on all sides.</li>
            <li>Minimum size: 24 px digital, 10 mm print. Below that, the mark loses legibility.</li>
            <li>The mark may stand alone; the lowercase wordmark should always accompany it at first mention.</li>
            <li>The lockup pairs the mark with "doba" set in Chivo ExtraBold, lowercase, tight tracking — never any other typeface.</li>
          </ul>
        </section>

        {/* Colors */}
        <section>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-6 scroll-mt-28" id="colors">Colors</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {colors.map((c) => (
              <div key={c.name} className="glass-surface rounded-md border border-black/10 dark:border-white/5 bg-black/[0.02] dark:bg-white/5 overflow-hidden">
                <div className={`h-24 ${c.swatch} flex items-end p-3`}>
                  <span className={`text-xs font-bold ${c.textOn} opacity-90`}>{c.name}</span>
                </div>
                <div className="p-4 space-y-1">
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 font-medium">{c.role}</p>
                  <p className="text-sm font-mono text-foreground">{c.hex}</p>
                  <p className="text-xs font-mono text-zinc-500 dark:text-zinc-400">RGB {c.rgb} · HSL {c.hsl}</p>
                </div>
              </div>
            ))}
          </div>
          <h3 className="text-lg font-bold text-foreground mt-8 mb-3">Functional Colors</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { name: "Pink 600", role: "Light-mode indicators (visualizer, active)", hex: "#DB2777", cls: "bg-[#DB2777]" },
              { name: "Purple 600", role: "Light-mode lavender text (artists, tickers)", hex: "#9333EA", cls: "bg-[#9333EA]" },
              { name: "Emerald 500", role: "Collected / success states", hex: "#10B981", cls: "bg-[#10B981]" },
              { name: "Red 400", role: "Warnings & inline errors", hex: "#F87171", cls: "bg-[#F87171]" },
            ].map((c) => (
              <div key={c.name} className="glass-surface rounded-md border border-black/10 dark:border-white/5 bg-black/[0.02] dark:bg-white/5 overflow-hidden">
                <div className={`h-12 ${c.cls}`} />
                <div className="p-3">
                  <p className="text-xs font-bold text-foreground">{c.name}</p>
                  <p className="text-[11px] text-zinc-600 dark:text-zinc-400 font-medium">{c.role}</p>
                  <p className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400">{c.hex}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Gradients */}
        <section>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-6 scroll-mt-28" id="gradients">Gradients</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="glass-surface rounded-md border border-black/10 dark:border-white/5 bg-black/[0.02] dark:bg-white/5 overflow-hidden">
              <div className="h-24 bg-gradient-to-r from-cyber-pink via-lavender to-cyber-pink" />
              <div className="p-4 space-y-1">
                <p className="text-sm font-bold text-foreground">Brand Gradient</p>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 font-medium">Headlines &amp; gradient text — cyber-pink through lavender.</p>
                <p className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400">from #FF1F8A via #B794F4 to #FF1F8A</p>
                <p className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400">.gradient-text · 8s shimmer loop</p>
              </div>
            </div>
            <div className="glass-surface rounded-md border border-black/10 dark:border-white/5 bg-black/[0.02] dark:bg-white/5 overflow-hidden">
              <div className="h-24 relative bg-[#FAF9F6] dark:bg-[#0d0d12]">
                <div className="absolute top-1 left-1/2 -translate-x-1/2 w-24 h-24 bg-cyber-pink/20 dark:bg-cyber-pink/10 blur-2xl rounded-full" />
                <div className="absolute bottom-0 right-1 w-14 h-14 bg-lavender/30 dark:bg-lavender/5 blur-xl rounded-full" />
              </div>
              <div className="p-4 space-y-1">
                <p className="text-sm font-bold text-foreground">Ambient Background</p>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 font-medium">Page backdrop on every surface — flat base + two blurred orbs over a soft band.</p>
                <p className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400">band #EDE4F9 / #140B19</p>
                <p className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400">orbs: cyber-pink 20/10% · lavender 30/5%</p>
              </div>
            </div>
          </div>
          <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400 font-medium">
            Rule: gradients are atmospheric, never informational. Text never sits on the brand gradient
            except as <span className="font-mono">.gradient-text</span> display type.
          </p>
        </section>

        {/* Typography */}
        <section>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-6 scroll-mt-28" id="typography">Typography</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {fonts.map((f) => (
              <a
                key={f.name}
                href={f.link}
                target="_blank"
                rel="noreferrer"
                className="glass-surface-hover rounded-md border border-black/10 dark:border-white/5 bg-black/[0.02] dark:bg-white/5 p-6 block group"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-bold text-foreground">{f.name}</span>
                  <IconArrowUpRight size={16} className="text-zinc-400 group-hover:text-cyber-pink transition-colors" />
                </div>
                <p className={`${f.sample} text-2xl text-foreground mb-1`}>AaBbCc 0123</p>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 font-medium mb-3">{f.usage}</p>
                <p className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400">{f.weights.join(" · ")}</p>
                <p className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400">Fallback: {f.fallback}</p>
              </a>
            ))}
          </div>
        </section>

        {/* Iconography */}
        <section>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-6 scroll-mt-28" id="iconography">Iconography</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="glass-surface rounded-md border border-black/10 dark:border-white/5 bg-black/[0.02] dark:bg-white/5 p-5">
              <p className="text-sm font-bold text-foreground mb-2">Library</p>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed">
                <span className="font-mono">@tabler/icons-react</span> — the only icon set across every doba
                surface. Never mix in lucide, heroicons, or inline SVGs.
              </p>
              <div className="flex items-center gap-4 mt-4 text-zinc-700 dark:text-zinc-300">
                <IconMusic size={16} />
                <IconUsers size={18} />
                <IconCoin size={22} />
                <IconArrowUpRight size={24} />
              </div>
              <p className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400 mt-2">16 · 18 · 22 · 24</p>
            </div>
            <div className="glass-surface rounded-md border border-black/10 dark:border-white/5 bg-black/[0.02] dark:bg-white/5 p-5">
              <p className="text-sm font-bold text-foreground mb-2">Conventions</p>
              <ul className="space-y-1.5 text-xs text-zinc-600 dark:text-zinc-400 font-medium list-disc list-inside leading-relaxed">
                <li>14 px inline labels · 16 px nav &amp; buttons · 18–20 px list items · 22 px header icon buttons · 24–28 px feature &amp; playback</li>
                <li>Default stroke for UI icons; <span className="font-mono">stroke=&#123;1.5&#125;</span> for social brand marks</li>
                <li>Icon buttons: <span className="font-mono">p-2 rounded-md</span> + hover wash; active states in cyber-pink</li>
                <li>One custom mark only: <span className="font-mono">DobaVisualizer</span> (the playing indicator)</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Layout */}
        <section>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-6 scroll-mt-28" id="layout">Layout</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                title: "Breakpoints",
                lines: ["sm 640 · md 768 · lg 1024", "Mobile-first; the dashboard shell pivots at lg."],
              },
              {
                title: "Containers",
                lines: ["App content: max-w-7xl · Home: max-w-4xl (text) / max-w-6xl (hero)", "Shell padding: px-4 sm:px-6 lg:px-8"],
              },
              {
                title: "Pill Shell",
                lines: ["Header, sidebar & player float as frosted-glass pills:", ".glass-surface + 60/50% tint + rounded-2xl + shadow-xl", "No full-bleed slabs, no shell edge borders."],
              },
              {
                title: "Rhythm",
                lines: ["4px spacing scale · cards p-5 to p-6", "Sections: space-y-6 to space-y-10 · radius --radius: 0.75rem"],
              },
            ].map((b) => (
              <div key={b.title} className="glass-surface rounded-md border border-black/10 dark:border-white/5 bg-black/[0.02] dark:bg-white/5 p-5">
                <p className="text-sm font-bold text-foreground mb-2">{b.title}</p>
                {b.lines.map((l) => (
                  <p key={l} className="text-xs text-zinc-600 dark:text-zinc-400 font-medium font-mono leading-relaxed">{l}</p>
                ))}
              </div>
            ))}
          </div>
        </section>

        {/* Link Previews */}
        <section>
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-6 scroll-mt-28" id="previews">Link Previews</h2>
          <div className="glass-surface rounded-md border border-black/10 dark:border-white/5 bg-black/[0.02] dark:bg-white/5 p-6 sm:p-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm font-medium leading-relaxed text-zinc-700 dark:text-zinc-300">
              <ul className="space-y-2">
                <li><span className="text-lavender font-bold">RULE 1</span> Every shareable URL ships Open Graph + Twitter metadata: site-wide defaults in the root layout, per-track overrides on song pages.</li>
                <li><span className="text-lavender font-bold">RULE 2</span> Image URLs are always absolute — resolved via <span className="font-mono">metadataBase</span> (<span className="font-mono">app.doba.world</span>) or hardcoded origin. Never relative.</li>
              </ul>
              <ul className="space-y-2">
                <li><span className="text-lavender font-bold">RULE 3</span> Site image: the composed default card (<span className="font-mono">doba-og.png</span>, 1200×630 — mark, wordmark, tagline on the brand background). Track pages: a composed 1200×630 share card (cover, title, artist, price on the brand background), generated per track via <span className="font-mono">opengraph-image.tsx</span>.</li>
                <li><span className="text-lavender font-bold">RULE 4</span> Required fields: <span className="font-mono">title, description, image, type, url, siteName</span>, <span className="font-mono">twitter:card = summary_large_image</span>, <span className="font-mono">@doba_DAO</span>.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Usage Guidelines */}
        <section className="glass-surface p-6 sm:p-8 rounded-md border border-black/10 dark:border-white/5 bg-black/[0.02] dark:bg-white/5">
          <h2 className="text-2xl font-bold text-foreground mb-4 scroll-mt-28" id="usage">Usage Guidelines</h2>

          <h3 className="text-sm font-bold text-lavender uppercase tracking-widest mb-3">By Screen Size</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
            {[
              {
                size: "Phone",
                range: "< 640px",
                notes: ["Mark alone is fine in tight headers (min 24 px)", "Single-column cards, full-width pills (12 px inset)", "Drawers become full-page sheets below the header"],
              },
              {
                size: "Tablet",
                range: "640–1024px",
                notes: ["Prefer the lockup (mark + wordmark)", "Two-column grids open up", "Pills keep 12 px insets"],
              },
              {
                size: "Desktop",
                range: "> 1024px",
                notes: ["Full lockup; mark at 32 px in the header pill", "Multi-column grids; sidebar & panel pills visible (16 px insets)", "Ambient background orbs fully visible — keep surfaces glass so they read through"],
              },
            ].map((s) => (
              <div key={s.size} className="rounded-md border border-black/10 dark:border-white/5 bg-black/[0.02] dark:bg-white/5 p-4">
                <p className="text-sm font-bold text-foreground">{s.size} <span className="font-mono text-[11px] font-medium text-zinc-500 dark:text-zinc-400">{s.range}</span></p>
                <ul className="mt-2 space-y-1.5 text-xs text-zinc-600 dark:text-zinc-400 font-medium list-disc list-inside">
                  {s.notes.map((n) => <li key={n}>{n}</li>)}
                </ul>
              </div>
            ))}
          </div>

          <h3 className="text-sm font-bold text-lavender uppercase tracking-widest mb-3">Do's &amp; Don'ts</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm font-medium leading-relaxed">
            <ul className="space-y-2 text-zinc-700 dark:text-zinc-300">
              <li><span className="text-lavender font-bold">DO</span> use only the brand colors above.</li>
              <li><span className="text-lavender font-bold">DO</span> keep the clearspace and minimum sizes.</li>
              <li><span className="text-lavender font-bold">DO</span> place the mark on Midnight or Paper surfaces for full contrast.</li>
              <li><span className="text-lavender font-bold">DO</span> write "doba" lowercase, always.</li>
            </ul>
            <ul className="space-y-2 text-zinc-700 dark:text-zinc-300">
              <li><span className="text-cyber-pink font-bold">DON'T</span> stretch, rotate, recolor, or add effects to the logo.</li>
              <li><span className="text-cyber-pink font-bold">DON'T</span> use the wordmark without the mark.</li>
              <li><span className="text-cyber-pink font-bold">DON'T</span> revive the retired angular/clip-path visual language — the system is rounded glass.</li>
              <li><span className="text-cyber-pink font-bold">DON'T</span> imply partnership or endorsement without written agreement.</li>
            </ul>
          </div>
        </section>

        <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium text-center">
          Press, partnerships, or asset requests: reach us on{" "}
          <a href="https://discord.gg/69sUSFQT3" target="_blank" rel="noreferrer" className="text-cyber-pink hover:underline font-semibold">Discord</a>{" "}
          or{" "}
          <a href="https://x.com/doba_DAO" target="_blank" rel="noreferrer" className="text-cyber-pink hover:underline font-semibold">X</a>.
        </p>
      </main>

      <Footer />
    </div>
    </>
  );
}
