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

  /*********************************************/
  /*  FACTORY THAT BUILDS HANDLERS PER BUTTON  */
  /*********************************************/
  const createTooltipHandlers = (protectedPath, eventType) => {
    const handleClick = async (e) => {
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

    return { handleClick };
  };

  /*******************/
  /*  HANDLER SETS   */
  /*******************/
  const development = createTooltipHandlers(
    '/check-oz',
    'oz_check_button_clicked'
  );
  const investor = createTooltipHandlers(
    '/tax-calculator',
    'tax_calculator_button_clicked'
  );

  /**************/
  /*  RENDER    */
  /**************/
  return (
    <div className="flex items-center justify-center py-2 sm:py-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 w-full animate-fadeIn">
        {/* Investor/Tax button */}
        <div className="group relative p-6 rounded-2xl bg-gradient-to-br from-blue-50/90 to-indigo-100/90 dark:from-blue-900/20 dark:to-indigo-900/20 backdrop-blur-lg border-2 border-blue-200/60 dark:border-blue-700/40 hover:border-blue-300/80 dark:hover:border-blue-600/60 hover:shadow-2xl hover:shadow-blue-500/20 hover:scale-105 hover:-translate-y-1 transition-all duration-300 cursor-pointer text-center">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-primary/15 to-indigo-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <button
            className="relative z-10 w-full flex flex-col items-center justify-center focus:outline-none transition-all"
            onClick={investor.handleClick}
          >
            <span className="text-blue-900 dark:text-blue-100 text-lg sm:text-xl font-bold leading-tight group-hover:text-blue-700 dark:group-hover:text-blue-200 mb-1">
              Calculate Your Tax Savings
            </span>
            <span className="text-sm text-blue-800/70 dark:text-blue-200/60 font-medium">
              Estimate your returns with our OZ Calculator
            </span>
          </button>
        </div>

        {/* Development button */}
        <div className="group relative p-6 rounded-2xl bg-gradient-to-br from-blue-50/90 to-indigo-100/90 dark:from-blue-900/20 dark:to-indigo-900/20 backdrop-blur-lg border-2 border-blue-200/60 dark:border-blue-700/40 hover:border-blue-300/80 dark:hover:border-blue-600/60 hover:shadow-2xl hover:shadow-blue-500/20 hover:scale-105 hover:-translate-y-1 transition-all duration-300 cursor-pointer text-center">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-primary/15 to-indigo-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <button
            className="relative z-10 w-full flex flex-col items-center justify-center focus:outline-none transition-all"
            onClick={development.handleClick}
          >
            <span className="text-blue-900 dark:text-blue-100 text-lg sm:text-xl font-bold leading-tight group-hover:text-blue-700 dark:group-hover:text-blue-200 mb-1">
              Check Property Eligibility
            </span>
            <span className="text-sm text-blue-800/70 dark:text-blue-200/60 font-medium">
              Verify if your development is in an OZ
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
