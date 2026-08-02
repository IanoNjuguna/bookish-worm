import { IconBrandTwitter, IconBrandDiscord, IconBrandYoutube, IconBrandTiktok, IconBrandInstagram, IconBrandLinkedin } from "@tabler/icons-react";

const Footer = () => {
  return (
    <footer className="py-12">
      <div className="max-w-6xl mx-auto px-12 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <img src="/doba.png" alt="Doba Logo" className="w-6 h-6 object-contain opacity-50" />
          <span className="text-soft text-sm font-medium">doba protocol</span>
        </div>
        <div className="flex items-center gap-6">
          <a href="https://x.com/doba_DAO" target="_blank" rel="noreferrer" aria-label="doba on X (Twitter)" className="text-cyber-pink hover:text-white transition-colors duration-300">
            <IconBrandTwitter size={18} stroke={1.5} />
          </a>
          <a href="https://discord.gg/mkqtpVcu3" target="_blank" rel="noreferrer" aria-label="doba on Discord" className="text-cyber-pink hover:text-white transition-colors duration-300">
            <IconBrandDiscord size={18} stroke={1.5} />
          </a>
          <a href="https://www.youtube.com/channel/UCvnigUEs0l_mIRPbqSPYLWQ" target="_blank" rel="noreferrer" aria-label="doba on YouTube" className="text-cyber-pink hover:text-white transition-colors duration-300">
            <IconBrandYoutube size={18} stroke={1.5} />
          </a>
          <a href="https://www.tiktok.com/@doba.world" target="_blank" rel="noreferrer" aria-label="doba on TikTok" className="text-cyber-pink hover:text-white transition-colors duration-300">
            <IconBrandTiktok size={18} stroke={1.5} />
          </a>
          <a href="https://www.instagram.com/doba_protocol/" target="_blank" rel="noreferrer" aria-label="doba on Instagram" className="text-cyber-pink hover:text-white transition-colors duration-300">
            <IconBrandInstagram size={18} stroke={1.5} />
          </a>
          <a href="https://www.linkedin.com/company/doba-world/" target="_blank" rel="noreferrer" aria-label="doba on LinkedIn" className="text-cyber-pink hover:text-white transition-colors duration-300">
            <IconBrandLinkedin size={18} stroke={1.5} />
          </a>
        </div>
        
        <div className="text-soft/40 text-xs font-mono uppercase tracking-wider">
          © {new Date().getFullYear()}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
