"use client";
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { motion } from 'framer-motion';
import './ThemeSwitcher.css'; // Import the CSS file

const ThemeSwitcher = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div
      onClick={toggleTheme}
      className="theme-switcher"
      title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} mode`}
      aria-label={`Current theme: ${theme}. Click to switch to ${theme === 'light' ? 'Dark' : 'Light'} mode.`}
    >
      <div className={`toggle-wrapper ${theme}`}>
        <motion.div
          className={`toggle-handle ${theme}`}
          layout
          transition={{ type: 'spring', stiffness: 700, damping: 30 }}
        >
          {theme === 'light' ? (
            <Sun size={16} className="text-yellow-500" />
          ) : (
            <Moon size={16} className="text-[#1e88e5]" />
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ThemeSwitcher; 