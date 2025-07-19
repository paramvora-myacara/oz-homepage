"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

export default function RangeSlider({ title, min, max, step, value, onChange }) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className={`relative bg-white dark:bg-gradient-to-br dark:from-gray-800/60 dark:to-gray-900/40 dark:backdrop-blur-sm rounded-2xl p-5 shadow-sm dark:shadow-[0_4px_16px_rgba(255,255,255,0.05)] border border-gray-100 dark:border-gray-600/50 dark:ring-1 dark:ring-white/10 hover:shadow-md dark:hover:shadow-[0_8px_24px_rgba(255,255,255,0.08)] transition-all duration-300`}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full text-left group"
      >
        <div className="flex items-center space-x-3">
          <h3 className="text-base font-bold text-gray-900 dark:text-white">
            {title}
          </h3>
        </div>
        <ChevronDown className={`w-5 h-5 text-gray-500 dark:text-gray-400 transition-all duration-300 group-hover:text-primary-500 dark:group-hover:text-primary-400 ${
          isExpanded ? 'rotate-180' : ''
        }`} />
      </button>

      {isExpanded && (
        <div className="mt-4 px-2">
          <Slider
            range
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={onChange}
            trackStyle={[{ backgroundColor: '#3b82f6' }]}
            handleStyle={[
                { backgroundColor: '#3b82f6', border: 'none', width: '16px', height: '16px', marginTop: '-6px', cursor: 'default', boxShadow: 'none', opacity: 1 },
                { backgroundColor: '#3b82f6', border: 'none', width: '16px', height: '16px', marginTop: '-6px', cursor: 'default', boxShadow: 'none', opacity: 1 }
            ]}
            railStyle={{ backgroundColor: '#d1d5db' }}
          />
          <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mt-2">
            <span>
              {title === "Minimum Investment" 
                ? value[0] >= 1000000 
                  ? `$${(value[0] / 1000000).toFixed(0)}M`
                  : `$${(value[0] / 1000).toFixed(0)}k`
                : title === "Internal Rate of Return (IRR)"
                ? `${value[0].toFixed(1)}%`
                : title === "10-Year Multiple"
                ? `${value[0].toFixed(1)}x`
                : value[0]
              }
            </span>
            <span>
              {title === "Minimum Investment" 
                ? value[1] >= 1000000 
                  ? `$${(value[1] / 1000000).toFixed(0)}M`
                  : `$${(value[1] / 1000).toFixed(0)}k`
                : title === "Internal Rate of Return (IRR)"
                ? `${value[1].toFixed(1)}%`
                : title === "10-Year Multiple"
                ? `${value[1].toFixed(1)}x`
                : value[1]
              }
            </span>
          </div>
        </div>
      )}
    </div>
  );
} 