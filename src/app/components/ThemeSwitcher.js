"use client";
import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { motion } from 'framer-motion';

const ThemeSwitcher = () => {
  const { theme, setTheme, resetTheme } = useTheme();

  const themes = [
    { name: 'light', icon: Sun, label: 'Light' },
    { name: 'dark', icon: Moon, label: 'Dark' },
    { name: 'system', icon: Monitor, label: 'System' }
  ];

  const currentThemeIndex = themes.findIndex(t => t.name === theme);
  const currentTheme = themes[currentThemeIndex];

  const handleThemeChange = () => {
    const nextIndex = (currentThemeIndex + 1) % themes.length;
    setTheme(themes[nextIndex].name);
  };

  const IconComponent = currentTheme?.icon || Sun;

  return (
    <motion.button
      onClick={handleThemeChange}
      onDoubleClick={resetTheme}
      className="p-2 rounded-lg transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1e88e5] focus:ring-offset-2 dark:focus:ring-offset-gray-900"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      title={`Switch to ${themes[(currentThemeIndex + 1) % themes.length].label} theme (Double-click to reset)`}
      aria-label={`Current theme: ${currentTheme?.label || 'Light'}. Click to switch theme, double-click to reset.`}
    >
      <motion.div
        key={theme}
        initial={{ opacity: 0, rotate: -180 }}
        animate={{ opacity: 1, rotate: 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <IconComponent 
          size={20} 
          className="text-gray-700 dark:text-gray-300 transition-colors duration-300" 
        />
      </motion.div>
    </motion.button>
  );
};

export default ThemeSwitcher; 