'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { formatCurrency } from '../../lib/taxCalculator';

export default function RangeSlider({ 
  option, 
  isOpen, 
  onToggle, 
  onValueChange, 
  selectedValue 
}) {
  const [localValue, setLocalValue] = useState(selectedValue || option.value);
  const sliderRef = useRef(null);

  useEffect(() => {
    if (selectedValue !== undefined) {
      setLocalValue(selectedValue);
    }
  }, [selectedValue]);

  const handleSliderChange = (e) => {
    const newValue = parseInt(e.target.value);
    setLocalValue(newValue);
    onValueChange(newValue);
  };

  const handleHeaderClick = () => {
    onToggle(option.id);
  };

  const handleSliderAreaClick = (e) => {
    e.stopPropagation();
  };

  const percentage = ((localValue - option.min) / (option.max - option.min)) * 100;

  return (
    <div className="w-full">
      <div className="w-full p-6 text-left glass-card rounded-2xl border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-300 group">
        <div 
          onClick={handleHeaderClick}
          className="flex items-center justify-between cursor-pointer"
        >
          <div className="flex-1">
            <div className="text-xl font-semibold text-black dark:text-white mb-1">
              {option.label}
            </div>
            <div className="text-sm text-black/60 dark:text-white/60">
              {option.display}
            </div>
          </div>
          <div className="flex items-center gap-2 text-black/60 dark:text-white/60 group-hover:text-primary transition-colors">
            {isOpen ? (
              <ChevronUp className="w-5 h-5" />
            ) : (
              <ChevronDown className="w-5 h-5" />
            )}
          </div>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden"
              onClick={handleSliderAreaClick}
            >
              <div className="space-y-4 pt-4 border-t border-black/10 dark:border-white/10">
                <div className="flex justify-between text-sm text-black/60 dark:text-white/60">
                  <span>{formatCurrency(option.min)}</span>
                  <span>{formatCurrency(option.max)}</span>
                </div>
                
                <div className="relative">
                  <input
                    ref={sliderRef}
                    type="range"
                    min={option.min}
                    max={option.max}
                    value={localValue}
                    onChange={handleSliderChange}
                    step={Math.max(1000, Math.floor((option.max - option.min) / 100))}
                    className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                    style={{
                      background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${percentage}%, #e5e7eb ${percentage}%, #e5e7eb 100%)`
                    }}
                  />
                </div>

                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {formatCurrency(localValue)}
                  </div>
                  <div className="text-sm text-black/60 dark:text-white/60 mt-1">
                    Capital gain amount
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
} 