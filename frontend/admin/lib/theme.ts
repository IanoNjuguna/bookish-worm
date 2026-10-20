export type Theme = 'dark' | 'light';

export const THEME_KEY = 'doba-admin-theme';

/**
 * Dark is the default, not the system preference: this is an operator console
 * read at night as often as at noon, and a first paint that flips theme is worse
 * than a first paint that is dark. An explicit choice always wins.
 */
export function resolveTheme(stored: string | null): Theme {
  return stored === 'light' ? 'light' : 'dark';
}

export function applyTheme(theme: Theme): void {
  const root = document.documentElement;
  root.classList.toggle('dark', theme === 'dark');
  root.dataset.theme = theme;
}
