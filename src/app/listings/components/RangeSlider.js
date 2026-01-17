"use client";
import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { createPortal } from "react-dom";

export default function RangeSlider({ title, tooltip, min, max, step, value, onChange, formatValue }) {
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
    let x = mouseX;
    let y = mouseY + 25;

    if (tooltipRef.current) {
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      const tooltipWidth = tooltipRect.width;
      const tooltipHeight = tooltipRect.height;
      x = mouseX - (tooltipWidth / 2);
      if (x + tooltipWidth > window.innerWidth - 10) x = window.innerWidth - tooltipWidth - 10;
      if (y + tooltipHeight > window.innerHeight - 10) y = mouseY - tooltipHeight - 10;
      if (x < 10) x = 10;
      if (y < 10) y = 10;
    }
    setTooltipPosition({ x, y });
  };

  const tooltipElement = tooltip && showTooltip && mounted ? (
    <div
      ref={tooltipRef}
      className="fixed px-3 py-2 text-white text-xs font-medium rounded-lg shadow-xl bg-navy/90 backdrop-blur-md pointer-events-none z-[100]"
      style={{ left: tooltipPosition.x, top: tooltipPosition.y }}
    >
      {tooltip}
    </div>
  ) : null;

  // Formatter for display
  const formatDisplay = (val) => {
    if (formatValue) return formatValue(val);
    // Default fallback logic based on title if no formatter provided
    if (title === "Minimum Investment") {
      return val >= 1000000
        ? `$${(val / 1000000).toFixed(0)}M`
        : `$${(val / 1000).toFixed(0)}k`;
    }
    if (title.includes("IRR")) return `${val.toFixed(1)}%`;
    if (title.includes("Multiple")) return `${val.toFixed(1)}x`;
    return val;
  };

  return (
    <>
      <div className="py-2">
        <button
          ref={titleRef}
          onClick={() => setIsExpanded(!isExpanded)}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onMouseMove={handleMouseMove}
          className="flex items-center justify-between w-full text-left group mb-3"
        >
          <div className="flex items-center space-x-3">
            <h3 className="text-sm font-bold text-navy group-hover:text-primary transition-colors">
              {title}
            </h3>
          </div>
          <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''
            }`} />
        </button>

        {isExpanded && (
          <div className="px-1">
            <Slider
              range
              min={min}
              max={max}
              step={step}
              value={value}
              onChange={onChange}
              trackStyle={[{ backgroundColor: '#1E88E5' }]}
              handleStyle={[
                { backgroundColor: '#1E88E5', border: '2px solid white', width: '18px', height: '18px', marginTop: '-7px', opacity: 1, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' },
                { backgroundColor: '#1E88E5', border: '2px solid white', width: '18px', height: '18px', marginTop: '-7px', opacity: 1, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }
              ]}
              railStyle={{ backgroundColor: '#e5e7eb' }}
            />
            <div className="flex justify-between text-xs font-medium text-gray-500 mt-3">
              <span>{formatDisplay(value[0])}</span>
              <span>{formatDisplay(value[1])}</span>
            </div>
          </div>
        )}
      </div>

      {mounted && typeof document !== 'undefined' && tooltipElement &&
        createPortal(tooltipElement, document.body)
      }
    </>
  );
} 