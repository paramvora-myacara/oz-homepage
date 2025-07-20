"use client";
import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { createPortal } from "react-dom";

export default function RangeSlider({ title, tooltip, min, max, step, value, onChange }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [mounted, setMounted] = useState(false);
  const titleRef = useRef(null);
  const tooltipRef = useRef(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleMouseEnter = (e) => {
    if (tooltip) setShowTooltip(true);
  };

  const handleMouseLeave = (e) => {
    if (tooltip) setShowTooltip(false);
  };

  const handleMouseMove = (e) => {
    if (!tooltip || !showTooltip) return;
    
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    
    // Calculate tooltip position relative to viewport
    let x = mouseX;
    let y = mouseY + 25; // 25px below cursor
    
    // Get tooltip dimensions if available
    if (tooltipRef.current) {
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      const tooltipWidth = tooltipRect.width;
      const tooltipHeight = tooltipRect.height;
      
      // Center tooltip horizontally with respect to cursor
      x = mouseX - (tooltipWidth / 2);
      
      // Prevent tooltip from going off-screen
      if (x + tooltipWidth > window.innerWidth - 10) {
        x = window.innerWidth - tooltipWidth - 10;
      }
      if (y + tooltipHeight > window.innerHeight - 10) {
        y = mouseY - tooltipHeight - 10;
      }
      if (x < 10) x = 10;
      if (y < 10) y = 10;
    }
    
    setTooltipPosition({ x, y });
  };

  const tooltipElement = tooltip && showTooltip && mounted ? (
    <div 
      ref={tooltipRef}
      className="fixed px-4 py-3 text-white text-sm rounded-lg shadow-xl border border-gray-700 max-w-xs pointer-events-none"
      style={{
        left: tooltipPosition.x,
        top: tooltipPosition.y,
        transform: 'none',
        backgroundColor: 'rgba(17, 24, 39, 0.8)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        zIndex: 9999
      }}
    >
      <div className="whitespace-normal leading-relaxed">
        {tooltip}
      </div>
    </div>
  ) : null;

  return (
    <>
      <div className={`relative bg-white dark:bg-gradient-to-br dark:from-gray-800/60 dark:to-gray-900/40 dark:backdrop-blur-sm rounded-2xl p-5 shadow-sm dark:shadow-[0_4px_16px_rgba(255,255,255,0.05)] border border-gray-100 dark:border-gray-600/50 dark:ring-1 dark:ring-white/10 hover:shadow-md dark:hover:shadow-[0_8px_24px_rgba(255,255,255,0.08)] transition-all duration-300`}>
        <button
          ref={titleRef}
          onClick={() => setIsExpanded(!isExpanded)}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onMouseMove={handleMouseMove}
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

      {/* Portal tooltip to document.body */}
      {mounted && typeof document !== 'undefined' && tooltipElement && 
        createPortal(tooltipElement, document.body)
      }
    </>
  );
} 