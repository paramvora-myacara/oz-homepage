'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const ResultsDisplay = ({ result }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!result) return null;

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={`glass-card rounded-3xl p-8 mb-8 animate-fadeIn ${
      result.isInOZ 
        ? 'bg-[#30d158]/5 border border-[#30d158]/20' 
        : 'bg-[#ff9500]/5 border border-[#ff9500]/20'
    }`}>
      {/* Header - Always Visible */}
      <div 
        className="flex items-center justify-between cursor-pointer" 
        onClick={toggleExpanded}
      >
        <div className="flex items-center">
          <div className={`text-3xl mr-4 ${result.isInOZ ? 'text-[#30d158]' : 'text-[#ff9500]'}`}>
            {result.isInOZ ? '✅' : '❌'}
          </div>
          <div>
            <h3 className={`text-2xl font-semibold ${result.isInOZ ? 'text-[#30d158]' : 'text-[#ff9500]'} mb-1`}>
              {result.isInOZ ? 'Opportunity Zone Qualified!' : 'Not in an Opportunity Zone'}
            </h3>
            <p className={`text-lg ${result.isInOZ ? 'text-[#30d158]/80' : 'text-[#ff9500]/80'} font-light`}>
              {result.isInOZ 
                ? 'This development may qualify for Opportunity Zone tax benefits' 
                : 'This location does not qualify for Opportunity Zone benefits'
              }
            </p>
          </div>
        </div>
        
        {/* Dropdown Arrow */}
        <div className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
          <ChevronDown className={`w-6 h-6 ${result.isInOZ ? 'text-[#30d158]' : 'text-[#ff9500]'}`} />
        </div>
      </div>

      {/* Expandable Details */}
      <div 
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isExpanded 
            ? 'max-h-[800px] opacity-100 mt-6' 
            : 'max-h-0 opacity-0 mt-0'
        }`}
      >
        <div className={`transform transition-transform duration-300 ease-in-out ${
          isExpanded ? 'translate-y-0' : '-translate-y-4'
        }`}>
          {/* Result Details */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-black/60 dark:text-white/60 block mb-1">Location:</label>
              <p className="text-black dark:text-white font-light text-lg">{result.matchedAddress || result.address}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-black/60 dark:text-white/60 block mb-1">Census Tract GEOID:</label>
              <p className="text-black dark:text-white font-mono text-lg">{result.geoid}</p>
            </div>

            {result.coordinates && (
              <div>
                <label className="text-sm font-medium text-black/60 dark:text-white/60 block mb-1">Coordinates:</label>
                <p className="text-black dark:text-white font-mono text-lg">
                  {result.coordinates.lat.toFixed(6)}, {result.coordinates.lng.toFixed(6)}
                </p>
              </div>
            )}

            {result.censusData && (
              <div>
                <label className="text-sm font-medium text-black/60 dark:text-white/60 block mb-1">Census Information:</label>
                <p className="text-black dark:text-white font-light text-lg">
                  State: {result.censusData.state} | County: {result.censusData.county} | Tract: {result.censusData.tract}
                </p>
              </div>
            )}
          </div>

          {/* Additional Information */}
          {result.isInOZ && (
            <div className="mt-8 glass-card p-6 bg-[#0071e3]/5 rounded-2xl border border-[#0071e3]/20">
              <h4 className="font-semibold text-[#0071e3] mb-4 text-lg">Next Steps:</h4>
              <ul className="text-black/80 dark:text-white/80 space-y-2 font-light">
                <li>• Consult with a qualified tax professional about OZ benefits</li>
                <li>• Consider establishing or investing through a Qualified Opportunity Fund</li>
                <li>• Verify current OZ designation status before proceeding</li>
                <li>• Review compliance requirements for OZ investments</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResultsDisplay; 