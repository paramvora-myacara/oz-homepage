
"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const ClickableScrollIndicator = ({ position = "center" }) => {
  const containerRef = useRef();
  const { scrollYProgress } = useScroll();
  
  // Fade out the indicator as we approach the bottom
  const opacity = useTransform(scrollYProgress, [0, 0.85, 0.95], [0.9, 0.9, 0]);

  const getPositionClasses = () => {
    switch (position) {
      case "card":
        return "absolute bottom-32 left-1/2 -translate-x-1/2 md:bottom-32 bottom-20";
      case "center":
      default:
        return "fixed bottom-8 left-1/2 -translate-x-1/2 md:bottom-8 bottom-16";
    }
  };

  return (
    <motion.div 
      ref={containerRef}
      className={`${getPositionClasses()} z-0`}
      style={{ opacity }}
    >
      <motion.div
        className="text-center"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <p className="text-xs md:text-sm text-[#1e88e5] dark:text-[#90caf9] mb-1 md:mb-2">
          Scroll to explore
        </p>
        <div className="relative mx-auto h-6 w-4 md:h-10 md:w-6 rounded-full border-2 border-[#1e88e5]">
          <motion.div
            className="absolute left-1/2 top-1 md:top-2 h-1 w-0.5 md:h-2 md:w-1 -translate-x-1/2 transform rounded-full bg-[#1e88e5]"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ClickableScrollIndicator; 