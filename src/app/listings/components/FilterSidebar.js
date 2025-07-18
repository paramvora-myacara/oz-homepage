"use client";
import { useState } from "react";
import { X, Filter, ChevronDown } from "lucide-react";
import { US_STATES, FILTER_OPTIONS } from "../mockData";
import RangeSlider from "./RangeSlider";

export default function FilterSidebar({ isOpen, onClose, className = "", filters, onFilterChange, onClearAll }) {
  // Calculate active filter count properly
  const getActiveFilterCount = () => {
    let count = 0;
    
    // Count multi-select filters (states, assetType)
    count += filters.states.length;
    count += filters.assetType.length;
    
    // Count slider filters only if they're not at default values
    if (filters.irr[0] !== 5 || filters.irr[1] !== 20) count++;
    if (filters.minInvestment[0] !== 50000 || filters.minInvestment[1] !== 1000000) count++;
    if (filters.tenYearMultiple[0] !== 1.5 || filters.tenYearMultiple[1] !== 8) count++;
    
    return count;
  };
  
  const activeFilterCount = getActiveFilterCount();

  const isMobileOverlay = isOpen;
  const isDesktopEmbedded = className?.includes('relative');
  const isDesktopFixed = className?.includes('fixed');

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOverlay && !isDesktopEmbedded && !isDesktopFixed && (
        <div 
          className="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        ${isDesktopEmbedded 
          ? 'relative h-auto bg-transparent border-none shadow-none w-full' 
          : isDesktopFixed
          ? `${className} flex flex-col h-auto` // Use provided fixed classes + flex layout with auto height
          : `fixed lg:sticky top-0 left-0 h-screen lg:h-auto 
             bg-white dark:bg-gradient-to-b dark:from-gray-900/95 dark:to-black/95 dark:backdrop-blur-xl
             border-r border-gray-200/50 dark:border-gray-500/70 z-50 lg:z-auto
             transition-all duration-500 ease-out lg:transform-none
             w-80 lg:w-80 shadow-2xl dark:shadow-[0_8px_32px_rgba(255,255,255,0.08)] lg:shadow-none
             ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`
        }
        ${!isDesktopFixed ? 'overflow-y-auto' : ''}
        ${!isDesktopEmbedded && !isDesktopFixed ? className : ''}
      `}>
        {/* Header */}
        <div className={`sticky top-0 bg-white dark:bg-gradient-to-r dark:from-gray-900/95 dark:to-gray-800/95 dark:backdrop-blur-sm border-b border-gray-200/50 dark:border-gray-500/50 py-3 px-6 z-20 ${isDesktopFixed ? 'flex-shrink-0' : ''}`}>
          <div className="flex items-center justify-between h-full">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary-100 dark:bg-primary-900/50 dark:ring-1 dark:ring-primary-500/50 rounded-xl">
                <Filter className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              </div>
              <div className="mt-1 flex items-center space-x-2 flex-1 min-w-0">
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Filters
                  </h2>
                  <div className="h-5 flex items-center">
                    <p className={`text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap ${activeFilterCount > 0 ? 'visible' : 'invisible'}`}> 
                      {activeFilterCount} active
                    </p>
                  </div>
                </div>
                {activeFilterCount > 0 && (
                  <div className="relative flex-shrink-0">
                    <span className="inline-flex items-center justify-center w-8 h-8 text-sm font-bold text-black dark:text-white bg-gradient-to-r from-primary-500 to-primary-600 dark:from-primary-400 dark:to-primary-500 rounded-full shadow-lg dark:shadow-primary-400/30">
                      {activeFilterCount}
                    </span>
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-400 dark:bg-orange-300 rounded-full animate-pulse shadow-sm"></div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-2 flex-shrink-0 ml-2 sm:ml-4 lg:ml-2">
              {activeFilterCount > 0 ? (
                <button
                  onClick={onClearAll}
                  className="px-3 py-1.5 text-sm text-primary-600 hover:text-white hover:bg-primary-600 dark:text-primary-400 dark:hover:text-white dark:hover:bg-primary-500 font-medium transition-all duration-200 rounded-lg border border-primary-200 dark:border-primary-600/50 hover:border-primary-600 dark:hover:border-primary-500 whitespace-nowrap"
                >
                  Clear All
                </button>
              ) : (
                <span className="px-3 py-1.5 text-sm invisible select-none whitespace-nowrap">Clear All</span>
              )}
              {!isDesktopEmbedded && (
                <button
                  onClick={onClose}
                  className="lg:hidden p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800/50 rounded-lg transition-all duration-200"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Filter Content */}
        <div className={`p-6 pt-5 space-y-5 ${isDesktopFixed ? 'overflow-y-auto' : ''}`}>
          {/* Location Filter */}
          <FilterSection 
            title="Location"
            options={US_STATES}
            selectedValues={filters.states}
            onFilterChange={(value, checked) => onFilterChange('states', value, checked)}
            searchable
          />
        
          {/* Fund Type Filter */}
          <FilterSection 
            title="Fund Type"
            options={FILTER_OPTIONS.assetType.map(option => option.label)}
            selectedValues={filters.assetType}
            onFilterChange={(value, checked) => onFilterChange('assetType', value, checked)}
          />

          {/* Minimum Investment Filter */}
          <RangeSlider 
            title="Minimum Investment"
            min={50000}
            max={1000000}
            step={10000}
            value={filters.minInvestment}
            onChange={value => onFilterChange('minInvestment', value, true)}
          />

          {/* 10-Year Multiple Filter */}
          <RangeSlider 
            title="10-Year Multiple"
            min={1.5}
            max={8}
            step={0.1}
            value={filters.tenYearMultiple}
            onChange={value => onFilterChange('tenYearMultiple', value, true)}
          />

          {/* IRR Filter */}
          <RangeSlider 
            title="Internal Rate of Return (IRR)"
            min={5}
            max={20}
            step={0.1}
            value={filters.irr}
            onChange={value => onFilterChange('irr', value, true)}
          />
        </div>
      </div>
    </>
  );
}

function FilterSection({ title, options, selectedValues, onFilterChange, searchable = false }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const filteredOptions = searchable 
    ? options.filter(option => 
        option.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : options;

  const selectedCount = selectedValues.length;

  // Show selected states as chips
  const selectedStates = selectedValues.map(state => (
    <button
      key={state}
      onClick={() => onFilterChange(state, false)}
      className="inline-flex items-center px-3 py-1.5 text-sm font-medium bg-blue-500 dark:bg-primary-500 text-white rounded-full border border-blue-600 dark:border-primary-400 shadow-md dark:shadow-primary-500/30 hover:bg-blue-600 dark:hover:bg-primary-600 transition-all duration-200 mr-1 mb-1"
    >
      {state}
      <svg className="w-3 h-3 ml-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  ));

  return (
    <div className={`relative bg-white dark:bg-gradient-to-br dark:from-gray-800/60 dark:to-gray-900/40 dark:backdrop-blur-sm rounded-2xl p-5 shadow-sm dark:shadow-[0_4px_16px_rgba(255,255,255,0.05)] border border-gray-100 dark:border-gray-600/50 dark:ring-1 dark:ring-white/10 hover:shadow-md dark:hover:shadow-[0_8px_24px_rgba(255,255,255,0.08)] transition-all duration-300 ${searchable && showDropdown ? 'z-10' : ''}`}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full text-left group"
      >
        <div className="flex items-center space-x-3">
          <h3 className="text-base font-bold text-gray-900 dark:text-white">
            {title}
          </h3>
          {selectedCount > 0 && (
            <span className="inline-flex items-center justify-center min-w-[1.5rem] h-6 px-2 text-xs font-bold text-gray-900 dark:text-white bg-primary-500 dark:bg-primary-400 rounded-full shadow-md dark:shadow-primary-400/30">
              {selectedCount}
            </span>
          )}
        </div>
        <ChevronDown className={`w-5 h-5 text-gray-500 dark:text-gray-400 transition-all duration-300 group-hover:text-primary-500 dark:group-hover:text-primary-400 ${
          isExpanded ? 'rotate-180' : ''
        }`} />
      </button>

      {isExpanded && (
        <div className="space-y-4 mt-4">
          {searchable ? (
            <div className="space-y-3">
              {/* Search Input */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search states..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowDropdown(e.target.value.length > 0);
                  }}
                  onFocus={() => setShowDropdown(true)}
                  onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                  className="w-full pl-4 pr-10 py-3 text-sm border border-gray-200 dark:border-gray-500/50 rounded-xl bg-gray-100 dark:bg-gray-800/70 dark:backdrop-blur-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 dark:focus:ring-primary-400 focus:border-transparent focus:bg-white dark:focus:bg-gray-800/90 transition-all duration-200 dark:shadow-[0_2px_8px_rgba(255,255,255,0.05)]"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>

                {/* Dropdown */}
                {showDropdown && (
                  <div className="absolute z-15 w-full left-0 top-full mt-1">
                    <div className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                      {filteredOptions.length > 0 ? (
                        filteredOptions.map((option) => (
                          <button
                            key={option}
                            onClick={() => {
                              onFilterChange(option, !selectedValues.includes(option));
                              setSearchQuery("");
                              setShowDropdown(false);
                            }}
                            className={`w-full px-4 py-3 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors rounded-lg ${
                              selectedValues.includes(option)
                                ? 'bg-blue-100 text-primary-800 dark:bg-gray-700 dark:text-primary-300'
                                : 'text-gray-900 dark:text-gray-100'
                            }`}
                          >
                            {option}
                          </button>
                        ))
                      ) : (
                        <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                          No states found matching "{searchQuery}"
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Selected States */}
              {selectedStates.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {selectedStates}
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {filteredOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => onFilterChange(option, !selectedValues.includes(option))}
                  className={`px-3 py-2 text-sm font-medium rounded-full transition-all duration-200 border ${
                    selectedValues.includes(option)
                      ? 'bg-blue-500 dark:bg-primary-500 text-white border-blue-600 dark:border-primary-400 shadow-md dark:shadow-primary-500/30 hover:bg-blue-600 dark:hover:bg-primary-600'
                      : 'bg-gray-100 dark:bg-gray-700/50 dark:backdrop-blur-sm text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600/50 hover:bg-gray-200 dark:hover:bg-gray-600/50 dark:hover:border-gray-500/50'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
} 