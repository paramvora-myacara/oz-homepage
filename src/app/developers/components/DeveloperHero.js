'use client';
import { motion } from 'framer-motion';
import { useDeveloperSignupCta } from '../hooks/useDeveloperSignupCta';

const trustIndicators = [
  'No credit card needed',
  'Takes just 5 minutes to list',
  'Used by developers to raise $100M+',
  '60K+ Subscriber Network',
  'Full Marketing Support',
];

export default function DeveloperHero() {
  const { handleDeveloperCta } = useDeveloperSignupCta('developers_hero');

  return (
    <section className="relative z-10 min-h-screen flex flex-col justify-center items-center overflow-hidden py-20 md:py-0">
      <div className="relative z-10 w-full max-w-5xl px-6 mx-auto flex flex-col items-center text-center mt-0">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full"
        >
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 leading-none tracking-tight">
            <span className="text-gray-900 dark:text-white block">List your Project.</span>
            <span className="text-primary block">We'll Handle the Marketing.</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto leading-relaxed">
            Market your deal to thousands of qualified investors through premium listings, professional deal packages, and targeted email campaigns. Raise capital faster.
          </p>

          <div className="flex justify-center mb-10">
            <motion.button
              className="px-10 py-4 bg-primary text-white rounded-xl font-bold text-lg hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-primary/40 flex items-center justify-center gap-2"
              onClick={() => handleDeveloperCta('hero')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Start Your Project For Free
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14" />
                <path d="M12 5l7 7-7 7" />
              </svg>
            </motion.button>
          </div>

          <div className="flex flex-wrap justify-center gap-x-12 gap-y-4 text-lg md:text-xl font-medium text-gray-500 dark:text-gray-400 items-center">
            {trustIndicators.map((label) => (
              <div key={label} className="flex items-center gap-3">
                <svg width="24" height="24" viewBox="0 0 20 20" fill="none" stroke="#1E88E5" strokeWidth="2.5">
                  <path d="M5 10L8 13L15 6" />
                </svg>
                {label}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
