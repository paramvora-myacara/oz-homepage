"use client";
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { motion } from 'framer-motion';

const ThemeSwitcher = () => {
  const { theme, toggleTheme } = useTheme();

  const getIcon = () => {
    return theme === 'light' ? Sun : Moon;
  };

  const getLabel = () => {
    return theme === 'light' ? 'Light' : 'Dark';
  };

  const getNextLabel = () => {
    return theme === 'light' ? 'Dark' : 'Light';
  };

  const IconComponent = getIcon();

  return (
    <motion.button
      onClick={toggleTheme}
      className="p-2 w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-600 transition-all duration-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1e88e5] focus:ring-offset-2 dark:focus:ring-offset-gray-900"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      title={`Switch to ${getNextLabel()} mode`}
      aria-label={`Current theme: ${getLabel()}. Click to switch to ${getNextLabel()} mode.`}
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