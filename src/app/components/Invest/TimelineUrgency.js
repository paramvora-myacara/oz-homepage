'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import DramaticCountdown from '../DramaticCountdown';

export default function TimelineUrgency({ onCalculate }) {
  const [targetDate, setTargetDate] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Key for localStorage
    const STORAGE_KEY = 'oz_deadline_timestamp';
    const DURATION_DAYS = 180;
    const DURATION_MS = DURATION_DAYS * 24 * 60 * 60 * 1000;

    // Get stored timestamp or create new one
    let storedTimestamp = localStorage.getItem(STORAGE_KEY);
    const now = Date.now();
    let finalTimestamp;

    if (!storedTimestamp) {
      finalTimestamp = now + DURATION_MS;
      localStorage.setItem(STORAGE_KEY, finalTimestamp.toString());
    } else {
      finalTimestamp = parseInt(storedTimestamp, 10);
    }
    
    setTargetDate(finalTimestamp);
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
            <div className="flex justify-center">
                <DramaticCountdown targetDate={targetDate} showUrgencyText={false} />
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
