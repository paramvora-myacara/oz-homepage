"use client";

const Disclaimer = () => {
  return (
    <div className="relative z-50 bg-white dark:bg-black px-4 py-3 rounded-lg shadow-sm min-h-[80px] w-full flex items-center">
      <div className="absolute inset-0 bg-white dark:bg-black rounded-lg"></div>
      <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed relative z-10">
        Disclaimer: This graph is for illustrative purposes only and does not represent actual or guaranteed results. All assumptions are hypothetical. Opportunity Zone investments carry risk, including possible loss of principal. Consult your financial, tax, and legal advisors before investing.
      </p>
    </div>
  );
};

export default Disclaimer; 