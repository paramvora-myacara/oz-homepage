"use client";
import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light'); // Default theme is light
  const [resolvedTheme, setResolvedTheme] = useState('dark');

  useEffect(() => {
    // On mount, read from localStorage or default to 'light'
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    
    const applyTheme = (theme) => {
      // Use data-theme attribute instead of classes (Tailwind v4 approach)
      root.setAttribute('data-theme', theme);
      setResolvedTheme(theme);
    };

    applyTheme(theme);
  }, [theme]);

  const setThemeAndSave = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setThemeAndSave(newTheme);
  };

  const value = {
    theme,
    resolvedTheme,
    setTheme: setThemeAndSave,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
} 