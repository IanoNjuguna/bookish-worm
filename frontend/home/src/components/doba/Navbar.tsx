import { Link } from "react-router-dom";
import { AuthButton } from "./AuthButton";
import { ThemeToggle } from "./ThemeToggle";

const Navbar = () => {
  return (
    <nav className="fixed top-3 left-3 right-3 lg:top-4 lg:left-6 lg:right-6 z-50 h-16 rounded-2xl glass-surface bg-midnight/[0.02] dark:bg-white/[0.02] backdrop-blur-2xl shadow-lg">
      <div className="h-full px-4 lg:px-6 flex items-center justify-between gap-3">
        <a href="/" className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-full overflow-hidden">
            <img src="/doba.png" alt="Doba" className="w-full h-full object-cover invert dark:invert-0" />
          </div>
          <span className="hidden sm:inline md:hidden text-midnight dark:text-white text-base font-extrabold tracking-tight lowercase">doba</span>
          <span className="hidden md:inline text-midnight dark:text-white text-base sm:text-lg font-extrabold tracking-tight lowercase">doba world</span>
        </a>

        <div className="hidden md:flex items-center gap-6">
          <Link to="/pre-drop" className="text-sm font-bold text-midnight/70 dark:text-white/70 hover:text-cyber-pink dark:hover:text-cyber-pink transition-colors">
            Pre-drop
          </Link>
          <Link to="/for-artists" className="text-sm font-bold text-midnight/70 dark:text-white/70 hover:text-cyber-pink dark:hover:text-cyber-pink transition-colors">
            For Artists
          </Link>
          <Link to="/research" className="text-sm font-bold text-midnight/70 dark:text-white/70 hover:text-cyber-pink dark:hover:text-cyber-pink transition-colors">
            Research
          </Link>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <ThemeToggle />
          <AuthButton />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
