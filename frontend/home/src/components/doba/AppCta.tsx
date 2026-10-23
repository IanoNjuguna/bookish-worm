import { IconArrowUpRight } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { useAppCta } from "@/hooks/use-app-cta";

/**
 * The navbar's right-hand action. It is the only place on the site that sends you
 * into a product, so it follows the route: see useAppCta.
 */
export const AppCta = () => {
  const { links } = useAppCta();

  return (
    <div className="flex items-center gap-1.5 sm:gap-2">
      {links.map((link, index) => (
        <a
          key={link.href}
          href={link.href}
          className={cn(
            "flex items-center gap-1.5 rounded-md px-3 py-2 text-xs font-extrabold whitespace-nowrap transition-all duration-300 hover:scale-[1.03] active:scale-95 shrink-0 sm:px-4 sm:text-sm",
            index === 0
              ? "bg-lavender text-black shadow-md"
              : "border border-midnight/10 bg-midnight/5 text-midnight dark:border-white/10 dark:bg-white/5 dark:text-white"
          )}
        >
          <span>{link.label}</span>
          <IconArrowUpRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        </a>
      ))}
    </div>
  );
};
