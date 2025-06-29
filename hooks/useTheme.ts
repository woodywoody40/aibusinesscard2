import { useEffect, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage.ts';

type Theme = 'light' | 'dark';

export function useTheme() {
  // Initialize with null to signify that the theme is not yet determined.
  const [theme, setTheme] = useLocalStorage<Theme | null>('theme', null);

  useEffect(() => {
    // Determine the effective theme: stored theme, or fallback to system preference.
    const effectiveTheme = theme ?? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

    const root = document.documentElement;
    // Apply the theme to the root element.
    if (effectiveTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    
    // If the theme was not explicitly set (i.e., it was derived from system pref),
    // update the stored theme value.
    if (theme !== effectiveTheme) {
      setTheme(effectiveTheme);
    }
  }, [theme, setTheme]);

  const toggleTheme = useCallback(() => {
    // When toggling, explicitly set to the opposite of the current theme.
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  }, [theme, setTheme]);

  // Return the current theme (defaulting to 'light' on initial server render or if undetermined)
  // and the toggle function.
  return [theme ?? 'light', toggleTheme] as const;
}