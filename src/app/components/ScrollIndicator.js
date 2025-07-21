"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const ScrollIndicator = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      
      // Hide indicator when user has scrolled past the first viewport
      if (scrollY > windowHeight * 0.3) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.div
      className="absolute bottom-12 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center cursor-pointer"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
      transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
      onClick={() => {
        window.scrollTo({
          top: window.innerHeight,
          behavior: 'smooth'
        });
      }}
    >
      {/* Scroll text */}
      <motion.p
        className="text-lg font-bold tracking-widest text-gray-700 transition-colors duration-300 hover:text-[#1e88e5] dark:text-gray-200 dark:hover:text-[#3b82f6]"
        animate={{ 
          opacity: [0.8, 1, 0.8]
        }}
        transition={{ 
          duration: 2, 
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        SCROLL
      </motion.p>
      
      {/* Larger arrow */}
      <motion.div
        className="mt-3"
        animate={{
          y: [0, 12, 0],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: [0.4, 0, 0.6, 1],
        }}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          className="text-gray-700 transition-colors duration-300 hover:text-[#1e88e5] dark:text-gray-200 dark:hover:text-[#3b82f6]"
        >
          <motion.path
            d="M7 10L12 15L17 10"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            animate={{
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: [0.4, 0, 0.6, 1],
            }}
          />
        </svg>
      </motion.div>
    </motion.div>
  );
};

export default ScrollIndicator; 