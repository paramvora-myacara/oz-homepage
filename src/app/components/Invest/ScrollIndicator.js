'use client';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

export default function ScrollIndicator({ scrollToId }) {
  const handleClick = () => {
    if (scrollToId) {
      document.getElementById(scrollToId)?.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
    }
  };
  return (
    <motion.div 
      className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 cursor-pointer z-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1, duration: 1 }}
      onClick={handleClick}
    >
      <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-widest">
        Scroll to Explore
      </span>
      <div className="w-6 h-10 rounded-full border-2 border-gray-300 dark:border-gray-600 flex justify-center p-1">
        <motion.div 
          className="w-1 h-2 bg-primary rounded-full"
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
      <motion.div
        animate={{ y: [0, 5, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
      >
        <ChevronDown className="w-4 h-4 text-gray-400" />
      </motion.div>
    </motion.div>
  );
}
