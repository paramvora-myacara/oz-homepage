"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ChevronDown } from "lucide-react";

export default function EdgeChevronsIndicator({ position = "bottom-right" }) {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll();

  const opacity = useTransform(scrollYProgress, [0, 0.85, 0.95], [0.95, 0.95, 0]);

  const positionClasses = position === "bottom-left"
    ? "fixed bottom-6 left-6"
    : "fixed bottom-6 right-6";

  return (
    <motion.div
      ref={containerRef}
      className={`${positionClasses} z-40 pointer-events-none select-none`}
      style={{ opacity }}
      aria-hidden="true"
    >
      {/* Soft glow */}
      <motion.div
        className="absolute inset-0 translate-y-1/2"
        animate={{ opacity: [0.25, 0.45, 0.25], scale: [1, 1.06, 1] }}
        transition={{ duration: 2.2, repeat: Infinity }}
        style={{ filter: "blur(10px)" }}
      />

      <div className="relative flex flex-col items-center text-[#1e88e5] dark:text-[#90caf9]">
        <div className="rounded-full bg-white/80 dark:bg-gray-900/50 backdrop-blur-md ring-1 ring-[#1e88e5]/20 shadow-lg px-3.5 py-3">
          <motion.div
            animate={{ y: [0, 14, 0], opacity: [0.75, 1, 0.75] }}
            transition={{ duration: 1.4, repeat: Infinity }}
          >
            <ChevronDown size={34} strokeWidth={3} />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
} 