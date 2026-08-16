import { Link } from "react-router-dom";
import { IconMusic, IconUsers, IconCoin } from "@tabler/icons-react";

const steps = [
  {
    icon: IconMusic,
    title: "Drag and drop to upload your music record",
    description: "We handle encoding and storage.",
  },
  {
    icon: IconUsers,
    title: "Set collaborator splits",
    description: "They are enforced by smart contracts.",
  },
  {
    icon: IconCoin,
    title: "Earn",
    description: "Super fans collect your music as NFTs and you get paid (no intermediaries).",
  },
];

const PreDropSection = () => {
  return (
    <section className="pt-32 sm:pt-40 lg:pt-44 pb-20 sm:pb-28 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto text-center">
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground mb-10 tracking-tight">
        how to pre-drop on doba
      </h2>

      <div className="space-y-3.5 sm:space-y-4 mb-10 text-left">
        {steps.map((step) => (
          <div
            key={step.title}
            className="glass-surface p-4 sm:p-5 rounded-2xl border border-black/10 dark:border-white/5 bg-white/70 dark:bg-glass shadow-sm flex items-start gap-3.5 sm:gap-4"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-cyber-pink/10 flex items-center justify-center shrink-0">
              <step.icon size={18} className="text-cyber-pink" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-white mb-0.5">
                {step.title}
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400 text-xs font-medium leading-relaxed">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      <Link
        to="/pre-drop"
        className="inline-flex items-center h-11 px-6 rounded-lg bg-cyber-pink hover:bg-cyber-pink/90 text-black font-bold text-xs uppercase tracking-widest transition-all duration-300 hover:scale-[1.03] active:scale-95 shadow-md"
      >
        what is a pre-drop?
      </Link>
    </section>
  );
};

export default PreDropSection;
