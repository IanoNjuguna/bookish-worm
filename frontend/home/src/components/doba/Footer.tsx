import { Link } from "react-router-dom";
import { IconBrandTwitter, IconBrandDiscord, IconBrandYoutube, IconBrandTiktok, IconBrandInstagram, IconBrandLinkedin } from "@tabler/icons-react";

const Footer = () => {
  return (
    <footer className="py-12 border-t border-black/5 dark:border-white/5 bg-black/[0.01] dark:bg-white/[0.01]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Categorized Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* COMPANY */}
          <div>
            <span className="font-bold text-zinc-900/80 dark:text-white/40 uppercase tracking-widest text-[11px] block mb-2">
              COMPANY
            </span>
            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5 text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              <Link to="/about" className="hover:text-cyber-pink transition-colors">About</Link>
              <span className="text-zinc-400 dark:text-white/20">·</span>
              <Link to="/how-it-works" className="hover:text-cyber-pink transition-colors">How It Works</Link>
              <span className="text-zinc-400 dark:text-white/20">·</span>
              <Link to="/docs" className="hover:text-cyber-pink transition-colors">Docs</Link>
            </div>
          </div>

          {/* COMMUNITY */}
          <div>
            <span className="font-bold text-zinc-900/80 dark:text-white/40 uppercase tracking-widest text-[11px] block mb-2">
              COMMUNITY
            </span>
            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5 text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              <Link to="/for-artists" className="hover:text-cyber-pink transition-colors">For Artists</Link>
              <span className="text-zinc-400 dark:text-white/20">·</span>
              <Link to="/support" className="hover:text-cyber-pink transition-colors">Support</Link>
              <span className="text-zinc-400 dark:text-white/20">·</span>
              <Link to="/faq" className="hover:text-cyber-pink transition-colors">FAQ</Link>
            </div>
          </div>

          {/* LEGAL */}
          <div>
            <span className="font-bold text-zinc-900/80 dark:text-white/40 uppercase tracking-widest text-[11px] block mb-2">
              LEGAL
            </span>
            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5 text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              <Link to="/terms" className="hover:text-cyber-pink transition-colors">Terms</Link>
              <span className="text-zinc-400 dark:text-white/20">·</span>
              <Link to="/privacy" className="hover:text-cyber-pink transition-colors">Privacy</Link>
            </div>
          </div>
        </div>

        {/* Bottom Socials & Copyright */}
        <div className="pt-6 border-t border-black/5 dark:border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <img src="/doba.png" alt="Doba Logo" className="w-6 h-6 object-contain opacity-70 dark:opacity-50 dark:invert-0 invert" />
            <span className="text-zinc-700 dark:text-soft text-sm font-bold">doba</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-5 sm:gap-6">
            <a href="https://x.com/doba_DAO" target="_blank" rel="noreferrer" aria-label="doba on X (Twitter)" className="text-cyber-pink hover:text-zinc-900 dark:hover:text-white transition-colors duration-300">
              <IconBrandTwitter size={18} stroke={1.5} />
            </a>
            <a href="https://discord.gg/69sUSFQT3" target="_blank" rel="noreferrer" aria-label="doba on Discord" className="text-cyber-pink hover:text-zinc-900 dark:hover:text-white transition-colors duration-300">
              <IconBrandDiscord size={18} stroke={1.5} />
            </a>
            <a href="https://www.youtube.com/channel/UCvnigUEs0l_mIRPbqSPYLWQ" target="_blank" rel="noreferrer" aria-label="doba on YouTube" className="text-cyber-pink hover:text-zinc-900 dark:hover:text-white transition-colors duration-300">
              <IconBrandYoutube size={18} stroke={1.5} />
            </a>
            <a href="https://www.tiktok.com/@doba.world" target="_blank" rel="noreferrer" aria-label="doba on TikTok" className="text-cyber-pink hover:text-zinc-900 dark:hover:text-white transition-colors duration-300">
              <IconBrandTiktok size={18} stroke={1.5} />
            </a>
            <a href="https://www.instagram.com/doba_protocol/" target="_blank" rel="noreferrer" aria-label="doba on Instagram" className="text-cyber-pink hover:text-zinc-900 dark:hover:text-white transition-colors duration-300">
              <IconBrandInstagram size={18} stroke={1.5} />
            </a>
            <a href="https://www.linkedin.com/company/doba-world/" target="_blank" rel="noreferrer" aria-label="doba on LinkedIn" className="text-cyber-pink hover:text-zinc-900 dark:hover:text-white transition-colors duration-300">
              <IconBrandLinkedin size={18} stroke={1.5} />
            </a>
          </div>

          <div className="text-zinc-500 dark:text-soft/40 text-xs font-mono uppercase tracking-wider font-semibold">
            © {new Date().getFullYear()} doba
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
