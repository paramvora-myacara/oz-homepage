'use client';

import { useEffect } from 'react';
import { useAuthNavigation } from '../../lib/auth/useAuthNavigation';
import { trackUserEvent } from '../../lib/analytics/trackUserEvent';
import { useAuth } from '../../lib/auth/AuthProvider';

export default function ActionButtons() {
  /********************/
  /*  AUTH NAVIGATION */
  /********************/
  const { navigateWithAuth } = useAuthNavigation();
  const { user } = useAuth();

  /************************************/
  /*  GLOBAL TOOLTIP CLEAN-UP HELPERS */
  /************************************/
  const cleanupTooltips = () => {
    document
      .querySelectorAll('[data-actionbutton-tooltip="true"]')
      .forEach((el) => el.remove());
  };

  useEffect(() => {
    const handleBeforeUnload = () => cleanupTooltips();
    const handleVisibilityChange = () => {
      if (document.hidden) cleanupTooltips();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      cleanupTooltips();
    };
  }, []);

  /*********************************************/
  /*  FACTORY THAT BUILDS HANDLERS PER BUTTON  */
  /*********************************************/
  const createTooltipHandlers = (tooltipText, protectedPath, eventType) => {
    const handleMouseEnter = (e) => {
      const tooltip = document.createElement('div');
      tooltip.setAttribute('data-actionbutton-tooltip', 'true');
      tooltip.className =
        'fixed px-4 py-3 text-white text-sm rounded-lg shadow-xl border border-gray-700 max-w-xs pointer-events-none';
      tooltip.innerHTML = `<div class="whitespace-normal leading-relaxed">${tooltipText}</div>`;

      tooltip.style.position = 'fixed';
      tooltip.style.left = `${e.clientX + 10}px`;
      tooltip.style.top = `${e.clientY + 25}px`;
      tooltip.style.backgroundColor = 'rgba(17,24,39,0.9)';
      tooltip.style.backdropFilter = 'blur(8px)';
      // @ts-ignore – Safari
      tooltip.style.webkitBackdropFilter = 'blur(8px)';
      tooltip.style.zIndex = '9999';

      document.body.appendChild(tooltip);
      e.currentTarget._actionButtonTooltip = tooltip;
    };

    const handleMouseMove = (e) => {
      const tooltip = e.currentTarget
        ?._actionButtonTooltip;
      if (!tooltip) return;

      let x = e.clientX - tooltip.getBoundingClientRect().width / 2;
      let y = e.clientY + 25;

      // keep inside viewport
      if (x + tooltip.offsetWidth > window.innerWidth) {
        x = e.clientX - tooltip.offsetWidth - 10;
      }
      if (y + tooltip.offsetHeight > window.innerHeight) {
        y = e.clientY - tooltip.offsetHeight - 10;
      }
      if (x < 0) x = 10;
      if (y < 0) y = 10;

      tooltip.style.left = `${x}px`;
      tooltip.style.top = `${y}px`;
    };

    const handleMouseLeave = (e) => {
      const tooltip = e.currentTarget
        ?._actionButtonTooltip;
      if (tooltip) tooltip.remove();
      e.currentTarget._actionButtonTooltip = null;
    };

    const handleClick = async (e) => {
      // remove the active tooltip + any orphans
      handleMouseLeave(e);
      cleanupTooltips();

      // Track the click event
      await trackUserEvent(eventType, {
        source: 'action_buttons',
        destination_path: protectedPath,
        screen_width: window.innerWidth,
        screen_height: window.innerHeight,
        user_agent: navigator.userAgent,
        timestamp: new Date().toISOString()
      });

      // navigate via auth-guard
      navigateWithAuth(protectedPath);
    };

    return { handleMouseEnter, handleMouseMove, handleMouseLeave, handleClick };
  };

  /*******************/
  /*  HANDLER SETS   */
  /*******************/
  const development = createTooltipHandlers(
    "Enter your property address or coordinates to instantly verify if it's located within an official Opportunity Zone boundary.",
    '/check-oz',
    'oz_check_button_clicked'
  );
  const investor = createTooltipHandlers(
    'Calculate your potential tax savings from capital gains deferral through OZ investments.',
    '/tax-calculator',
    'tax_calculator_button_clicked'
  );

  /**************/
  /*  RENDER    */
  /**************/
  return (
    <div className="flex items-center justify-center py-2 sm:py-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 w-full animate-fadeIn">
        {/* Investor/Tax button - now first (left) - merged functionality */}
        <div className="group relative p-6 rounded-2xl bg-gradient-to-br from-blue-50/90 to-indigo-100/90 dark:from-blue-900/20 dark:to-indigo-900/20 backdrop-blur-lg border-2 border-blue-200/60 dark:border-blue-700/40 hover:border-blue-300/80 dark:hover:border-blue-600/60 hover:shadow-2xl hover:shadow-blue-500/20 hover:scale-105 hover:-translate-y-1 transition-all duration-300 cursor-pointer text-center">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-primary/15 to-indigo-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <button
            className="relative z-10 w-full text-blue-900 dark:text-blue-100 text-base sm:text-lg lg:text-base xl:text-lg font-semibold focus:outline-none transition-all text-center leading-tight group-hover:text-blue-700 dark:group-hover:text-blue-200"
            onMouseEnter={investor.handleMouseEnter}
            onMouseMove={investor.handleMouseMove}
            onMouseLeave={investor.handleMouseLeave}
            onClick={investor.handleClick}
          >
            Check how much <i>Tax</i> you can save
          </button>
        </div>

        {/* Development button - now second (right) */}
        <div className="group relative p-6 rounded-2xl bg-gradient-to-br from-blue-50/90 to-indigo-100/90 dark:from-blue-900/20 dark:to-indigo-900/20 backdrop-blur-lg border-2 border-blue-200/60 dark:border-blue-700/40 hover:border-blue-300/80 dark:hover:border-blue-600/60 hover:shadow-2xl hover:shadow-blue-500/20 hover:scale-105 hover:-translate-y-1 transition-all duration-300 cursor-pointer text-center">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-primary/15 to-indigo-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <button
            className="relative z-10 w-full text-blue-900 dark:text-blue-100 text-base sm:text-lg lg:text-base xl:text-lg font-semibold focus:outline-none transition-all text-center leading-tight group-hover:text-blue-700 dark:group-hover:text-blue-200"
            onMouseEnter={development.handleMouseEnter}
            onMouseMove={development.handleMouseMove}
            onMouseLeave={development.handleMouseLeave}
            onClick={development.handleClick}
          >
            Check if your <i>Development</i> is in an OZ
          </button>
        </div>
      </div>
    </div>
  );
}
