import { IconArrowUpRight } from "@tabler/icons-react";

export const AuthButton = () => {
  const appUrl = import.meta.env.VITE_APP_URL || "https://doba.world";

  return (
    <a
      href={appUrl}
      className="flex items-center gap-1.5 sm:gap-2 bg-lavender text-black px-3.5 sm:px-6 py-2 sm:py-2.5 rounded-md text-xs sm:text-sm font-extrabold whitespace-nowrap transition-all duration-300 hover:scale-[1.03] active:scale-95 shadow-md shrink-0"
    >
      <span>Launch App</span>
      <IconArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 text-black" />
    </a>
  );
};
