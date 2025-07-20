'use client';

import Link from 'next/link';
import { useEffect } from 'react';

export default function ActionButtons() {
  // Cleanup any orphaned tooltips on component unmount
  useEffect(() => {
    const cleanupTooltips = () => {
      const existingTooltips = document.querySelectorAll('[data-actionbutton-tooltip="true"]');
      existingTooltips.forEach(tooltip => tooltip.remove());
    };

    const handleBeforeUnload = () => cleanupTooltips();
    const handleVisibilityChange = () => {
      if (document.hidden) {
        cleanupTooltips();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      cleanupTooltips();
    };
  }, []);

  const createTooltipHandlers = (tooltipText) => {
    const handleMouseEnter = (e) => {
      const tooltip = document.createElement('div');
      tooltip.setAttribute('data-actionbutton-tooltip', 'true');
      tooltip.className = 'fixed px-4 py-3 text-white text-sm rounded-lg shadow-xl border border-gray-700 max-w-xs pointer-events-none';
      tooltip.innerHTML = `<div class="whitespace-normal leading-relaxed">${tooltipText}</div>`;
      tooltip.style.position = 'fixed';
      tooltip.style.left = (e.clientX + 10) + 'px';
      tooltip.style.top = (e.clientY + 25) + 'px';
      tooltip.style.backgroundColor = 'rgba(17, 24, 39, 0.9)';
      tooltip.style.backdropFilter = 'blur(8px)';
      tooltip.style.webkitBackdropFilter = 'blur(8px)';
      tooltip.style.zIndex = '9999';
      document.body.appendChild(tooltip);
      e.currentTarget._actionButtonTooltip = tooltip;
    };

    const handleMouseMove = (e) => {
      if (e.currentTarget._actionButtonTooltip) {
        let x = e.clientX + 10;
        let y = e.clientY + 25;
        
        const tooltipRect = e.currentTarget._actionButtonTooltip.getBoundingClientRect();
        
        // Center tooltip horizontally with respect to cursor
        x = e.clientX - (tooltipRect.width / 2);
        
        // Prevent tooltip from going off-screen
        if (x + tooltipRect.width > window.innerWidth) {
          x = e.clientX - tooltipRect.width - 10;
        }
        if (y + tooltipRect.height > window.innerHeight) {
          y = e.clientY - tooltipRect.height - 10;
        }
        if (x < 0) x = 10;
        if (y < 0) y = 10;
        
        e.currentTarget._actionButtonTooltip.style.left = x + 'px';
        e.currentTarget._actionButtonTooltip.style.top = y + 'px';
      }
    };

    const handleMouseLeave = (e) => {
      if (e.currentTarget._actionButtonTooltip) {
        e.currentTarget._actionButtonTooltip.remove();
        e.currentTarget._actionButtonTooltip = null;
      }
    };

    const handleClick = (e) => {
      // Clean up tooltip immediately when clicked
      if (e.currentTarget._actionButtonTooltip) {
        e.currentTarget._actionButtonTooltip.remove();
        e.currentTarget._actionButtonTooltip = null;
      }
      // Also clean up any orphaned tooltips
      const existingTooltips = document.querySelectorAll('[data-actionbutton-tooltip="true"]');
      existingTooltips.forEach(tooltip => tooltip.remove());
    };

    return { handleMouseEnter, handleMouseMove, handleMouseLeave, handleClick };
  };

  const developmentTooltipHandlers = createTooltipHandlers("Enter your property address or coordinates to instantly verify if it's located within an official Opportunity Zone boundary.");
  const investorTooltipHandlers = createTooltipHandlers("Quick qualification check to confirm you meet accredited investor requirements for Opportunity Zone investments.");
  const taxTooltipHandlers = createTooltipHandlers("Calculate your potential tax savings from capital gains deferral and elimination through OZ investments.");

  return (
    <div className="flex items-center justify-center py-2 sm:py-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-4 xl:gap-6 w-full animate-fadeIn">
        <Link href="/check-oz">
          <button
            className="w-full border-2 border-black dark:border-white px-4 sm:px-6 lg:px-4 xl:px-6 py-3 sm:py-4 rounded-full text-black dark:text-white text-base sm:text-lg lg:text-base xl:text-lg font-medium focus:outline-none focus:ring-2 focus:ring-black/40 dark:focus:ring-white/40 transition-all backdrop-blur-md bg-white/80 dark:bg-white/5 hover:bg-[#28b34f] dark:hover:bg-[#28b34f] hover:border-[#28b34f] dark:hover:border-[#28b34f] hover:text-white dark:hover:text-white text-center leading-tight"
            onMouseEnter={developmentTooltipHandlers.handleMouseEnter}
            onMouseMove={developmentTooltipHandlers.handleMouseMove}
            onMouseLeave={developmentTooltipHandlers.handleMouseLeave}
            onClick={developmentTooltipHandlers.handleClick}
          >
            Check if your <i>Development</i> is in an OZ
          </button>
        </Link>
        <Link href="/check-investor-eligibility">
          <button
            className="w-full border-2 border-black dark:border-white px-4 sm:px-6 lg:px-4 xl:px-6 py-3 sm:py-4 rounded-full text-black dark:text-white text-base sm:text-lg lg:text-base xl:text-lg font-medium focus:outline-none focus:ring-2 focus:ring-black/40 dark:focus:ring-white/40 transition-all backdrop-blur-md bg-white/80 dark:bg-white/5 hover:bg-[#28b34f] dark:hover:bg-[#28b34f] hover:border-[#28b34f] dark:hover:border-[#28b34f] hover:text-white dark:hover:text-white text-center leading-tight"
            onMouseEnter={investorTooltipHandlers.handleMouseEnter}
            onMouseMove={investorTooltipHandlers.handleMouseMove}
            onMouseLeave={investorTooltipHandlers.handleMouseLeave}
            onClick={investorTooltipHandlers.handleClick}
          >
            Check if you can <i>Invest</i> in an OZ
          </button>
        </Link>
        <Link href="/tax-calculator">
          <button
            className="w-full border-2 border-black dark:border-white px-4 sm:px-6 lg:px-4 xl:px-6 py-3 sm:py-4 rounded-full text-black dark:text-white text-base sm:text-lg lg:text-base xl:text-lg font-medium focus:outline-none focus:ring-2 focus:ring-black/40 dark:focus:ring-white/40 transition-all backdrop-blur-md bg-white/80 dark:bg-white/5 hover:bg-[#28b34f] dark:hover:bg-[#28b34f] hover:border-[#28b34f] dark:hover:border-[#28b34f] hover:text-white dark:hover:text-white text-center leading-tight sm:col-span-2 lg:col-span-1"
            onMouseEnter={taxTooltipHandlers.handleMouseEnter}
            onMouseMove={taxTooltipHandlers.handleMouseMove}
            onMouseLeave={taxTooltipHandlers.handleMouseLeave}
            onClick={taxTooltipHandlers.handleClick}
          >
            Check how much <i>Tax</i> you can save
          </button>
        </Link>
      </div>
    </div>
  );
} 