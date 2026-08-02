import { useState, useEffect, useMemo } from "react";
import { IconMusic, IconUsers, IconCoin, IconArrowUpRight } from "@tabler/icons-react";
import adjectives from "@/data/adjectives.json";

const steps = [
  {
    num: "01",
    icon: IconMusic,
    title: "Drag and drop your audio file",
    description: "We handle encoding and storage.",
  },
  {
    num: "02",
    icon: IconUsers,
    title: "Set collaborator splits",
    description: "They are enforced by smart contracts.",
  },
  {
    num: "03",
    icon: IconCoin,
    title: "Earn",
    description: "Fans collect your music as NFTs and you get paid instantly.",
  },
];

const AnimatedTitleText = () => {
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [reverse, setReverse] = useState(false);

  const longestWord = useMemo(() => {
    return adjectives.reduce((longest, current) =>
      current.length > longest.length ? current : longest
    , adjectives[0] || "");
  }, []);

  useEffect(() => {
    if (!adjectives.length) return;

    if (subIndex === adjectives[index].length + 1 && !reverse) {
      const pauseTimer = setTimeout(() => setReverse(true), 1800);
      return () => clearTimeout(pauseTimer);
    }

    if (subIndex === 0 && reverse) {
      setReverse(false);
      setIndex((prev) => (prev + 1) % adjectives.length);
      return;
    }

    const interval = setTimeout(
      () => {
        setSubIndex((prev) => prev + (reverse ? -1 : 1));
      },
      reverse ? 55 : 110
    );

    return () => clearTimeout(interval);
  }, [subIndex, index, reverse]);

  return (
    <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-none text-foreground relative flex items-center justify-center">
      {/* Ghost text reserves container layout height/width to prevent layout shift */}
      <span className="invisible select-none" aria-hidden="true">
        {longestWord}
      </span>
      <span className="absolute inset-0 flex items-center justify-center">
        <span className="text-cyber-pink">
          {adjectives[index]?.substring(0, subIndex)}
        </span>
        <span className="w-[4px] h-[0.75em] bg-zinc-900 dark:bg-white ml-1.5 sm:ml-2 animate-pulse" />
      </span>
    </h1>
  );
};

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-32 sm:pt-40 lg:pt-36 pb-16">
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left: Copy */}
          <div className="max-w-xl relative text-center mx-auto">
            {/* Subtle legibility mask */}
            <div className="absolute inset-[-40px] bg-void/40 blur-3xl rounded-full -z-10" />

            <div className="flex flex-col items-center justify-center tracking-tighter w-full">
              {/* Symmetrical Framing */}
              <div className="flex items-center justify-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                <div className="h-[1px] w-6 md:w-12 bg-zinc-900/20 dark:bg-white/20" />
                <span className="font-sans text-lg sm:text-2xl md:text-3xl font-bold text-zinc-900 dark:text-zinc-200">
                  doba is
                </span>
                <div className="h-[1px] w-6 md:w-12 bg-zinc-900/20 dark:bg-white/20" />
              </div>

              <AnimatedTitleText />
            </div>

            <div className="mt-8 sm:mt-12 space-y-4 max-w-lg mx-auto text-center">
              <p className="text-zinc-600 dark:text-zinc-300 text-xs sm:text-sm font-medium leading-relaxed mx-auto text-center">
                100 fans invested in your success are worth more than 100,000 streams.
              </p>
            </div>
          </div>

          {/* Right: How It Works Steps */}
          <div className="space-y-3.5 sm:space-y-4 max-w-md w-full mx-auto lg:ml-auto lg:mr-0">
            {steps.map((step) => (
              <div
                key={step.num}
                className="glass-surface p-5 sm:p-6 rounded-md relative overflow-hidden group border border-black/10 dark:border-white/5 bg-black/[0.03] dark:bg-white/5 shadow-sm dark:shadow-none"
              >
                <div className="flex items-start gap-3.5 sm:gap-4 relative z-10">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-md bg-cyber-pink/10 flex items-center justify-center shrink-0">
                    <step.icon size={18} className="text-cyber-pink" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-white mb-1">
                      {step.title}
                    </h3>
                    <p className="text-zinc-600 dark:text-zinc-400 text-xs font-medium leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            <div className="pt-2 sm:pt-4">
              <a
                href={import.meta.env.VITE_APP_URL || "https://app.doba.world"}
                className="flex items-center justify-center gap-2 bg-lavender text-black w-full py-3.5 sm:py-4 rounded-md font-extrabold text-sm sm:text-base transition-all duration-300 hover:scale-[1.02] active:scale-95 shadow-md"
              >
                <span>Get Started</span>
                <IconArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 text-black" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
