import { useState, useEffect } from "react";
import { IconSun, IconMoon } from "@tabler/icons-react";

export const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const savedTheme = localStorage.getItem("doba-home-theme");
    const initialDark = savedTheme ? savedTheme === "dark" : true;
    setIsDark(initialDark);

    if (initialDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    localStorage.setItem("doba-home-theme", nextDark ? "dark" : "light");

    if (nextDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-md text-midnight dark:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-all duration-300 flex items-center justify-center shrink-0"
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      aria-label="Toggle theme"
    >
      {isDark ? (
        <IconSun className="w-5 h-5 text-yellow-400 transition-transform duration-300 hover:rotate-90" />
      ) : (
        <IconMoon className="w-5 h-5 text-zinc-700 transition-transform duration-300 hover:-rotate-12" />
      )}
    </button>
  );
};
