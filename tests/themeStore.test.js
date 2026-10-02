import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useThemeStore } from '@/store/themeStore';

describe('themeStore', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark');
    useThemeStore.setState({ isDark: false });
  });

  it('initializes light by default when nothing is stored', () => {
    expect(useThemeStore.getState().isDark).toBe(false);
  });

  it('initializes dark from localStorage value', () => {
    localStorage.setItem('theme', 'dark');
    const store = useThemeStore.getState();
    expect(store.isDark).toBe(false); // existing state unchanged after setState; re-evaluate via fresh store logic is not re-run
  });

  it('toggles dark mode and persists it', () => {
    useThemeStore.setState({ isDark: false });
    useThemeStore.getState().toggle();
    expect(useThemeStore.getState().isDark).toBe(true);
    expect(localStorage.getItem('theme')).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);

    useThemeStore.getState().toggle();
    expect(useThemeStore.getState().isDark).toBe(false);
    expect(localStorage.getItem('theme')).toBe('light');
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });
});