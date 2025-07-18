"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { X, Filter, ChevronDown } from "lucide-react";
import { US_STATES, FILTER_OPTIONS } from "../mockData";

export default function FilterSidebar({ isOpen, onClose, className = "" }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [filters, setFilters] = useState({
    states: [],
    irr: [],
    minInvestment: [],
    tenYearMultiple: [],
    assetType: []
  });

  // Load filters from URL on component mount
  useEffect(() => {
    const urlFilters = {
      states: searchParams.get('states')?.split(',').filter(Boolean) || [],
      irr: searchParams.get('irr')?.split(',').filter(Boolean) || [],
      minInvestment: searchParams.get('minInvestment')?.split(',').filter(Boolean) || [],
      tenYearMultiple: searchParams.get('tenYearMultiple')?.split(',').filter(Boolean) || [],
      assetType: searchParams.get('assetType')?.split(',').filter(Boolean) || []
    };
    setFilters(urlFilters);
  }, [searchParams]);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, values]) => {
      if (values.length > 0) {
        params.set(key, values.join(','));
      }
    });
    
    const newUrl = params.toString() ? `?${params.toString()}` : '/listings';
    router.replace(newUrl, { scroll: false });
  }, [filters, router]);

  const handleFilterChange = (filterType, value, checked) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: checked 
        ? [...prev[filterType], value]
        : prev[filterType].filter(item => item !== value)
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      states: [],
      irr: [],
      minInvestment: [],
      tenYearMultiple: [],
      assetType: []
    });
  };

  const activeFilterCount = Object.values(filters).flat().length;

  const isMobileOverlay = isOpen;
  const isDesktopEmbedded = className?.includes('relative');
  const isDesktopFixed = className?.includes('fixed');

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOverlay && !isDesktopEmbedded && !isDesktopFixed && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
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
             bg-white dark:bg-gray-900
             border-r border-gray-200/50 dark:border-gray-500/70 z-50 lg:z-auto
             transition-all duration-500 ease-out lg:transform-none
             w-80 lg:w-80 shadow-2xl lg:shadow-none
             ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`
        }
        ${!isDesktopFixed ? 'overflow-y-auto' : ''}
        ${!isDesktopEmbedded && !isDesktopFixed ? className : ''}
      `}>
        {/* Header */}
        <div className={`${isDesktopEmbedded || isDesktopFixed ? '' : 'sticky top-0'} bg-white dark:bg-gray-900 border-b border-gray-200/50 dark:border-gray-500/70 py-3 px-6 z-10 ${isDesktopFixed ? 'flex-shrink-0' : ''}`}>
          <div className="flex items-center justify-between h-full">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary-100 dark:bg-primary-900/30 rounded-xl">
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
                    <span className="inline-flex items-center justify-center w-8 h-8 text-sm font-bold text-black dark:text-white bg-gradient-to-r from-primary-500 to-primary-600 rounded-full shadow-lg">
                      {activeFilterCount}
                    </span>
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-400 rounded-full animate-pulse"></div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-2 flex-shrink-0 ml-2 sm:ml-4 lg:ml-2">
              {activeFilterCount > 0 ? (
                <button
                  onClick={clearAllFilters}
                  className="px-3 py-1.5 text-sm text-primary-600 hover:text-white hover:bg-primary-600 font-medium transition-all duration-200 rounded-lg border border-primary-200 dark:border-primary-600 hover:border-primary-600 whitespace-nowrap"
                >
                  Clear All
                </button>
              ) : (
                <span className="px-3 py-1.5 text-sm invisible select-none whitespace-nowrap">Clear All</span>
              )}
              {!isDesktopEmbedded && (
                <button
                  onClick={onClose}
                  className="lg:hidden p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Filter Content */}
        <div className={`p-6 pt-5 space-y-5 ${isDesktopFixed ? 'overflow-y-auto' : ''}`}>
          {/* IRR Filter */}
          <FilterSection 
            title="Internal Rate of Return (IRR)"
            options={FILTER_OPTIONS.irr.map(option => option.label)}
            selectedValues={filters.irr}
            onFilterChange={(value, checked) => handleFilterChange('irr', value, checked)}
          />

          {/* Minimum Investment Filter */}
          <FilterSection 
            title="Minimum Investment"
            options={FILTER_OPTIONS.minInvestment.map(option => option.label)}
            selectedValues={filters.minInvestment}
            onFilterChange={(value, checked) => handleFilterChange('minInvestment', value, checked)}
          />

          {/* 10-Year Multiple Filter */}
          <FilterSection 
            title="10-Year Multiple"
            options={FILTER_OPTIONS.tenYearMultiple.map(option => option.label)}
            selectedValues={filters.tenYearMultiple}
            onFilterChange={(value, checked) => handleFilterChange('tenYearMultiple', value, checked)}
          />

          {/* Asset Type Filter */}
          <FilterSection 
            title="Asset Type"
            options={FILTER_OPTIONS.assetType.map(option => option.label)}
            selectedValues={filters.assetType}
            onFilterChange={(value, checked) => handleFilterChange('assetType', value, checked)}
          />

          {/* Location Filter */}
          <FilterSection 
            title="Location"
            options={US_STATES}
            selectedValues={filters.states}
            onFilterChange={(value, checked) => handleFilterChange('states', value, checked)}
            searchable
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
      className="inline-flex items-center px-3 py-1.5 text-sm font-medium bg-blue-500 text-white rounded-full border border-blue-600 dark:border-blue-400 shadow-md hover:bg-blue-600 transition-all duration-200 mr-2 mb-2"
    >
      {state}
      <svg className="w-3 h-3 ml-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  ));

  return (
    <div className="bg-white dark:bg-gray-800/50 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-600/70 hover:shadow-md transition-all duration-300">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full text-left group"
      >
        <div className="flex items-center space-x-3">
          <h3 className="text-base font-bold text-gray-900 dark:text-white">
            {title}
          </h3>
          {selectedCount > 0 && (
            <span className="inline-flex items-center justify-center min-w-[1.5rem] h-6 px-2 text-xs font-bold text-white bg-primary-500 rounded-full">
              {selectedCount}
            </span>
          )}
        </div>
        <ChevronDown className={`w-5 h-5 text-gray-500 dark:text-gray-400 transition-all duration-300 group-hover:text-primary-500 ${
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
                  className="w-full pl-4 pr-10 py-3 text-sm border border-gray-200 dark:border-gray-500 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-1 focus:ring-gray-800 dark:focus:ring-gray-200 focus:border-transparent focus:bg-white dark:focus:bg-gray-800 transition-all duration-200"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>

              {/* Selected States */}
              {selectedStates.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {selectedStates}
                </div>
              )}

              {/* Dropdown */}
              {showDropdown && (
                <div className="relative">
                  <div className="absolute z-10 w-full mt-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl shadow-lg max-h-48 overflow-y-auto -mx-2 px-2 pb-2">
                    {filteredOptions.length > 0 ? (
                      filteredOptions.map((option) => (
                        <button
                          key={option}
                          onClick={() => {
                            onFilterChange(option, !selectedValues.includes(option));
                            setSearchQuery("");
                            setShowDropdown(false);
                          }}
                          className={`w-full px-4 py-3 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                            selectedValues.includes(option)
                              ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
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
          ) : (
            <div className="flex flex-wrap gap-2">
              {filteredOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => onFilterChange(option, !selectedValues.includes(option))}
                  className={`px-3 py-2 text-sm font-medium rounded-full transition-all duration-200 border ${
                    selectedValues.includes(option)
                      ? 'bg-blue-500 text-white border-blue-600 dark:border-blue-400 shadow-md hover:bg-blue-600'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600'
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