'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';

export default function TimelineUrgency({ onCalculate }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 180,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Key for localStorage
    const STORAGE_KEY = 'oz_deadline_timestamp';
    const DURATION_DAYS = 180;
    const DURATION_MS = DURATION_DAYS * 24 * 60 * 60 * 1000;

    // Get stored timestamp or create new one
    let targetTimestamp = localStorage.getItem(STORAGE_KEY);
    const now = Date.now();

    if (!targetTimestamp) {
      // First visit: set target to 180 days from now
      targetTimestamp = now + DURATION_MS;
      localStorage.setItem(STORAGE_KEY, targetTimestamp.toString());
    } else {
      // Parse stored timestamp
      targetTimestamp = parseInt(targetTimestamp, 10);
      
      // If deadline passed, reset (or keep at 0 depending on requirement. User said "work till user exists", "continue from there")
      // Let's assume circular/reset or just stay at 0? 
      // User said "next time ... continue from there".
      // If expired, maybe we shouldn't reset immediately, but for this demo let's keep it simple.
      if (targetTimestamp < now) {
         // Optional: Reset if expired? Or show 0?
         // Let's just show 0 if expired for now to be strictly "continue".
      }
    }

    const calculateTimeLeft = () => {
      const currentTime = Date.now();
      const difference = targetTimestamp - currentTime;

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

    // Initial calculation
    calculateTimeLeft();

    // Interval
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!mounted) return null;

  return (
    <section className="py-12 md:py-20 relative overflow-hidden">
        {/* Background blobs */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-50/50 dark:bg-blue-900/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-50" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-emerald-50/50 dark:bg-emerald-900/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 opacity-50" />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 relative z-10 flex flex-col items-center justify-center text-center">
        
        <div className="max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 text-navy dark:text-white leading-tight">Understanding Your <span className="text-primary">Investment Window.</span></h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg md:text-xl leading-relaxed mb-8 max-w-2xl mx-auto">
                To qualify for tax benefits, capital gains must be reinvested into a Qualified Opportunity Fund within 180 days of the sale date. Plan your timeline accordingly to maximize your deferral.
            </p>
            
            <div className="flex justify-center">
                <button 
                  onClick={onCalculate}
                  className="px-8 py-4 bg-primary text-white rounded-xl font-bold text-lg hover:bg-primary-dark transition-all shadow-xl hover:shadow-2xl hover:scale-105"
                >
                  Calculate Your Tax Benefits
                </button>
            </div>
        </div>

        <div className="w-full max-w-4xl mx-auto">
            <div className="flex gap-4 sm:gap-8 justify-center">
                {Object.entries(timeLeft).map(([unit, value]) => (
                    <div key={unit} className="flex flex-col items-center">
                        <div className="w-20 h-20 sm:w-32 sm:h-32 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xl flex items-center justify-center mb-4 relative overflow-hidden group">
                           <div className="absolute inset-0 bg-gray-50 dark:bg-gray-800 translate-y-full group-hover:translate-y-0 transition-transform duration-500" /> 
                           <span className="text-3xl sm:text-5xl font-black text-navy dark:text-white relative z-10 font-mono">
                               {value.toString().padStart(2, '0')}
                           </span>
                        </div>
                        <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">{unit}</span>
                    </div>
                ))}
            </div>
            <div className="text-center mt-10">
                 <p className="inline-block px-6 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full text-sm font-bold animate-pulse">
                    Your Deferral Window
                 </p>
            </div>
        </div>

      </div>
    </section>
  );
}
