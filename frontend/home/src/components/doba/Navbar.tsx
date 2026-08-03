import { AuthButton } from "./AuthButton";
import { ThemeToggle } from "./ThemeToggle";

const Navbar = () => {
  return (
    <nav className="absolute top-4 sm:top-6 inset-x-0 z-50 w-full max-w-6xl mx-auto px-3 sm:px-6 lg:px-8">
      <div className="glass-surface bg-white/70 dark:bg-glass border border-black/10 dark:border-white/5 rounded-md shadow-lg dark:shadow-2xl overflow-hidden px-4 sm:px-8 py-3 sm:py-5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 sm:gap-8 min-w-0 shrink">
          <a href="#" className="flex items-center gap-2 text-base sm:text-lg font-bold tracking-tight whitespace-nowrap">
            <img src="/doba.png" alt="Doba Logo" className="w-6 h-6 sm:w-8 sm:h-8 object-contain shrink-0 dark:invert-0 invert" />
            <span className="text-zinc-900 dark:text-white text-base sm:text-xl font-extrabold tracking-tight lowercase">doba</span>
          </a>
        </div>
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          <ThemeToggle />
          <AuthButton />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
