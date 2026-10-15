const KEY = 'chygodwin_theme';

/** Returns 'dark' | 'light' — stored choice wins, else OS preference. */
export function getStoredTheme() {
  try {
    const saved = localStorage.getItem(KEY);
    if (saved === 'dark' || saved === 'light') return saved;
  } catch { /* storage unavailable */ }
  return window.matchMedia?.('(prefers-color-scheme: dark)')?.matches ? 'dark' : 'light';
}

/** Applies the theme to <html data-theme> and persists the choice. */
export function applyTheme(theme, persist = true) {
  document.documentElement.setAttribute('data-theme', theme);
  document.documentElement.style.colorScheme = theme;
  if (persist) {
    try {
      localStorage.setItem(KEY, theme);
    } catch { /* storage unavailable */ }
  }
}

/** Flips the current theme, applies + persists it, and returns the new theme. */
export function toggleTheme() {
  const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  return next;
}