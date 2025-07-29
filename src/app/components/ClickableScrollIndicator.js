
"use client";
import { motion } from "framer-motion";

const ClickableScrollIndicator = () => {
  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30">
      <motion.div
        className="text-center"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <p className="text-sm text-[#1e88e5] dark:text-[#90caf9] mb-2">
          Scroll to explore
        </p>
        <div className="relative mx-auto h-10 w-6 rounded-full border-2 border-[#1e88e5]">
          <motion.div
            className="absolute left-1/2 top-2 h-2 w-1 -translate-x-1/2 transform rounded-full bg-[#1e88e5]"
            animate={{ y: [0, 16, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </div>
  );
};

export default ClickableScrollIndicator; 