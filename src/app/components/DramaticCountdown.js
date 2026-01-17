'use client';
import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function DramaticCountdown({ targetDate, showUrgencyText = true }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!targetDate) return;

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const target = new Date(targetDate).getTime();
      const difference = target - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  if (!isClient) return null;

  return (
    <div className="w-full max-w-4xl mx-auto relative px-2 sm:px-4">
      <div className="flex justify-center gap-2 sm:gap-6 md:gap-8 mb-6">
        {Object.entries(timeLeft).map(([unit, value]) => (
          <div key={unit} className="flex flex-col items-center group">
            <div className="relative p-3 sm:p-6 md:p-8 rounded-xl sm:rounded-2xl bg-white/60 dark:bg-white/10 backdrop-blur-xl border border-white/60 dark:border-white/20 border-b-blue-500 dark:border-b-blue-400 shadow-[0_10px_40px_-5px_rgba(59,130,246,0.3)] hover:shadow-[0_15px_50px_-5px_rgba(59,130,246,0.5)] transition-all duration-300 transform hover:-translate-y-1">
              <span className="text-3xl sm:text-6xl md:text-7xl font-black text-navy dark:text-white font-mono tracking-tighter drop-shadow-sm select-none">
                {value.toString().padStart(2, '0')}
              </span>

              {/* Decorative gloss effect */}
              <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-br from-white/80 to-transparent pointer-events-none opacity-20"></div>

              {/* Bottom Glow Line - Intensified */}
              <div className="absolute bottom-0 left-2 right-2 sm:left-4 sm:right-4 h-[2px] sm:h-[3px] bg-blue-500 blur-[3px] sm:blur-[4px]"></div>
            </div>

            {/* Unit label below */}
            <span className="mt-2 sm:mt-3 text-[10px] sm:text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest px-1 sm:px-3 py-1">
              {unit}
            </span>
          </div>
        ))}
      </div>

      {/* Required Urgency Text */}
      {showUrgencyText && (
        <div className="flex items-center justify-center gap-2 mt-8 px-4 text-center">
          <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 animate-pulse flex-shrink-0" />
          <p className="text-base sm:text-lg md:text-xl font-medium text-gray-600 dark:text-gray-300">
            To qualify for benefits, gains must be reinvested within <span className="font-bold text-gray-900 dark:text-white whitespace-nowrap">180 days</span> of sale.
          </p>
        </div>
      )}
    </div>
  );
}
