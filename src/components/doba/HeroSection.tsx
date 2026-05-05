import { IconMusic, IconUsers, IconCoin } from "@tabler/icons-react";
import AsciiDivider from "./AsciiDivider";

const steps = [
  {
    num: "01",
    icon: IconMusic,
    title: "Upload Stems",
    description: "Drag and drop your audio file. We handle encoding and storage.",
  },
  {
    num: "02",
    icon: IconUsers,
    title: "Split",
    description: "Set collaborator splits. They are enforced by smart contracts.",
  },
  {
    num: "03",
    icon: IconCoin,
    title: "Earn",
    description: "Fans collect your music as NFTs and you get paid instantly.",
  },
];

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-40 lg:pt-24 pb-12">
      <div className="container mx-auto px-6 md:px-12 lg:px-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Copy */}
          <div className="max-w-xl relative text-center mx-auto">


            {/* Subtle legibility mask - invisible but darkens the area behind text slightly */}
            <div className="absolute inset-[-40px] bg-void/40 blur-3xl rounded-full -z-10" />

            <div className="flex flex-col items-center tracking-tighter w-full">
              {/* Symmetrical Framing */}
              <div className="flex items-center gap-4 mb-4">
                <div className="h-[1px] w-6 md:w-12 bg-white/20" />
                <span className="font-sans text-xl md:text-3xl font-medium text-soft/70">

                  you are
                </span>

                <div className="h-[1px] w-6 md:w-12 bg-white/20" />
              </div>
              
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-none text-white relative">
                {/* Ghost Placeholder: Reserves space for the longest word to prevent layout shift */}
                <span className="invisible select-none" aria-hidden="true">
                  Storytelling
                </span>
                
                {/* Actual Animated Text */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="gsap-changing-text text-cyber-pink"></span>
                  <span className="w-[5px] h-[0.8em] bg-white ml-3 animate-blink"></span>
                </div>

              </h1>
            </div>
            
            <div className="gsap-hero-attribution mt-12 space-y-4 max-w-lg mx-auto md:mx-0">
              <div className="flex flex-col gap-2 text-center md:flex-row md:gap-4 md:items-start md:text-left">
                <p className="text-zinc-300 text-sm leading-relaxed">
                  100 fans invested in your success are worth more than 100,000 streams.
                </p>
              </div>
            </div>

          </div>

          {/* Right: How It Works Steps */}
          <div className="space-y-4 max-w-md w-full mx-auto">
            {steps.map((step) => (
              <div
                key={step.num}
                className="gsap-step-card glass-surface p-6 rounded-2xl relative overflow-hidden group border border-white/5"
              >
                <div className="flex items-start gap-4 relative z-10">
                  <div className="w-10 h-10 rounded-xl bg-cyber-pink/10 flex items-center justify-center shrink-0">
                    <step.icon size={18} className="text-cyber-pink" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-white mb-1">
                      {step.title}
                    </h3>
                    <p className="text-soft text-xs leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            <div className="gsap-hero-buttons pt-4">
              <button className="bg-lavender text-void w-full py-4 rounded-xl font-bold transition-all duration-300 hover:scale-[1.02] active:scale-95">
                Launch App
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
