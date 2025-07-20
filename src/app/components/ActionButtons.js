'use client';

import { useAuthNavigation } from '../../lib/auth/useAuthNavigation';

export default function ActionButtons() {
  const { navigateWithAuth } = useAuthNavigation();

  return (
    <div className="flex items-center justify-center py-2 sm:py-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-4 xl:gap-6 w-full animate-fadeIn">
        <button
          onClick={() => navigateWithAuth('/check-oz')}
          className="w-full border-2 border-black dark:border-white px-4 sm:px-6 lg:px-4 xl:px-6 py-3 sm:py-4 rounded-full text-black dark:text-white text-base sm:text-lg lg:text-base xl:text-lg font-medium focus:outline-none focus:ring-2 focus:ring-black/40 dark:focus:ring-white/40 transition-all backdrop-blur-md bg-white/80 dark:bg-white/5 hover:bg-[#28b34f] dark:hover:bg-[#28b34f] hover:border-[#28b34f] dark:hover:border-[#28b34f] hover:text-white dark:hover:text-white text-center leading-tight"
        >
          Check if your <i>Development</i> is in an OZ
        </button>
        <button
          onClick={() => navigateWithAuth('/check-investor-eligibility')}
          className="w-full border-2 border-black dark:border-white px-4 sm:px-6 lg:px-4 xl:px-6 py-3 sm:py-4 rounded-full text-black dark:text-white text-base sm:text-lg lg:text-base xl:text-lg font-medium focus:outline-none focus:ring-2 focus:ring-black/40 dark:focus:ring-white/40 transition-all backdrop-blur-md bg-white/80 dark:bg-white/5 hover:bg-[#28b34f] dark:hover:bg-[#28b34f] hover:border-[#28b34f] dark:hover:border-[#28b34f] hover:text-white dark:hover:text-white text-center leading-tight"
        >
          Check if you can <i>Invest</i> in an OZ
        </button>
        <button
          onClick={() => navigateWithAuth('/tax-calculator')}
          className="w-full border-2 border-black dark:border-white px-4 sm:px-6 lg:px-4 xl:px-6 py-3 sm:py-4 rounded-full text-black dark:text-white text-base sm:text-lg lg:text-base xl:text-lg font-medium focus:outline-none focus:ring-2 focus:ring-black/40 dark:focus:ring-white/40 transition-all backdrop-blur-md bg-white/80 dark:bg-white/5 hover:bg-[#28b34f] dark:hover:bg-[#28b34f] hover:border-[#28b34f] dark:hover:border-[#28b34f] hover:text-white dark:hover:text-white text-center leading-tight sm:col-span-2 lg:col-span-1"
        >
          Check how much <i>Tax</i> you can save
        </button>
      </div>
    </div>
  );
} 