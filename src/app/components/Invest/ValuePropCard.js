'use client';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function ValuePropCard({ icon, title, description, ctaText, onClick, animationProps, iconAnimation }) {
  return (
    <motion.div
      className="group relative p-12 rounded-2xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border border-gray-200 dark:border-gray-800 hover:shadow-2xl transition-all duration-500 cursor-pointer text-center flex flex-col h-full"
      whileHover={{ y: -8, scale: 1.02 }}
      onClick={onClick}
      {...animationProps}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="flex-grow flex flex-col">
        <div className="flex-shrink-0">
          {/* Icon */}
          <motion.div
            className="w-20 h-20 mb-8 bg-primary rounded-full flex items-center justify-center relative mx-auto"
            {...iconAnimation}
          >
            {icon}
          </motion.div>

          {/* Title */}
          <h3 className="text-4xl font-bold mb-6 min-h-[5rem] flex justify-center">{title}</h3>
        </div>

        {/* Description */}
        <p className="text-xl text-gray-600 dark:text-gray-400 flex-grow">
          {description}
        </p>
      </div>
      
      {/* CTA */}
      <div className="flex-shrink-0 mt-8">
          <div className="flex items-center text-xl text-primary font-semibold group-hover:gap-4 gap-2 transition-all duration-300 justify-center">
            {ctaText} <ArrowRight className="w-5 h-5" />
          </div>
      </div>
    </motion.div>
  );
} 