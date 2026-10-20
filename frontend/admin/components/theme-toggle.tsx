'use client';

import { useEffect, useState } from 'react';
import { applyTheme, resolveTheme, THEME_KEY, type Theme } from '@/lib/theme';

/**
 * Runs before paint, in <head>, so the first frame is already the right theme.
 * The toggle below only ever changes what this script has applied.
 */
export const themeScript = `(() => {
  try {
    const stored = localStorage.getItem('${THEME_KEY}');
    const dark = stored !== 'light';
    document.documentElement.classList.toggle('dark', dark);
    document.documentElement.dataset.theme = dark ? 'dark' : 'light';
  } catch {
    document.documentElement.classList.add('dark');
  }
})();`;

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('dark');

  useEffect(() => {
    const stored = typeof window === 'undefined' ? null : localStorage.getItem(THEME_KEY);
    setTheme(resolveTheme(stored));
  }, []);

  function flip() {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    applyTheme(next);
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {
      /* storage can be blocked; the class is already applied */
    }
  }

  return (
    <button
      type="button"
      onClick={flip}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
      className="rounded-full border border-midnight/[0.08] px-2 py-0.5 font-mono text-[11px] text-midnight/60 transition-colors hover:text-midnight dark:border-white/[0.1] dark:text-white/60 dark:hover:text-white"
    >
      {theme === 'dark' ? 'dark' : 'light'}
    </button>
  );
}
