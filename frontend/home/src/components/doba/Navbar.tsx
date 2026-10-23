import { Link, NavLink } from "react-router-dom";
import { AppCta } from "./AppCta";
import { ThemeToggle } from "./ThemeToggle";
import { cn } from "@/lib/utils";

interface NavItem {
  to: string;
  label: string;
}

/** The two products, in the order the house lists them. */
const PRODUCT_LINKS: NavItem[] = [
  { to: "/music", label: "Music" },
  { to: "/paps", label: "paps" },
];

/** Pages that support a product rather than being one. Kept to two at md+. */
const SECONDARY_LINKS: NavItem[] = [
  { to: "/for-artists", label: "For Artists" },
  { to: "/research", label: "Research" },
];

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    "text-sm font-bold transition-colors",
    isActive
      ? "text-cyber-pink"
      : "text-midnight/70 dark:text-white/70 hover:text-cyber-pink dark:hover:text-cyber-pink"
  );

const Navbar = () => {
  return (
    <nav className="fixed top-3 left-3 right-3 lg:top-4 lg:left-6 lg:right-6 z-50 h-16 rounded-2xl glass-surface bg-midnight/[0.02] dark:bg-white/[0.02] backdrop-blur-2xl shadow-lg">
      <div className="h-full px-4 lg:px-6 flex items-center justify-between gap-3">
        <Link to="/" className="flex items-center gap-2 shrink-0" aria-label="doba, home">
          <div className="w-8 h-8 rounded-full overflow-hidden">
            <img src="/doba.png" alt="" className="w-full h-full object-cover invert dark:invert-0" />
          </div>
          <span className="hidden sm:inline text-midnight dark:text-white text-base sm:text-lg font-extrabold tracking-tight lowercase">
            doba
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-5">
          {PRODUCT_LINKS.map((item) => (
            <NavLink key={item.to} to={item.to} className={navLinkClass}>
              {item.label}
            </NavLink>
          ))}

          <span className="h-4 w-[1px] bg-midnight/10 dark:bg-white/10" aria-hidden="true" />

          {SECONDARY_LINKS.map((item) => (
            <NavLink key={item.to} to={item.to} className={navLinkClass}>
              {item.label}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <ThemeToggle />
          <AppCta />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
