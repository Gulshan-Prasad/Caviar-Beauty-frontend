import { create } from 'zustand';

const getInitialTheme = () => {
  if (typeof window === 'undefined') return false;
  const stored = localStorage.getItem('theme');
  if (stored) return stored === 'dark';
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
};

export const useThemeStore = create((set) => ({
  isDark: getInitialTheme(),
  toggle: () => set((s) => {
    const newDark = !s.isDark;
    if (newDark) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', newDark ? 'dark' : 'light');
    return { isDark: newDark };
  }),
}));
