"use client";
import { useState, useRef, useEffect } from "react";
import { X, Filter, ChevronDown, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { US_STATES, FILTER_OPTIONS } from "../mockData";
import RangeSlider from "./RangeSlider";
import { createPortal } from "react-dom";

export default function FilterSidebar({ isOpen, onClose, className = "", filters, onFilterChange, onClearAll }) {
  // Calculate active filter count properly
  const getActiveFilterCount = () => {
    let count = 0;

    // Count multi-select filters (states, assetType, fundType)
    count += filters.states.length;
    count += filters.assetType.length;
    count += filters.fundType.length;
    count += filters.propertyClass.length;

    // Count slider filters only if they're not at default values
    if (filters.irr[0] !== 5 || filters.irr[1] !== 30) count++;
    if (filters.minInvestment[0] !== 50000 || filters.minInvestment[1] !== 1000000) count++;
    if (filters.tenYearMultiple[0] !== 1.5 || filters.tenYearMultiple[1] !== 5) count++;

    return count;
  };

  const activeFilterCount = getActiveFilterCount();

  const isMobile = isOpen;

  // Base classes for the sidebar container
  const baseClasses = "flex flex-col bg-white";

  // Classes for the mobile overlay view
  const mobileClasses = `fixed top-0 left-0 z-50 h-screen w-80 shadow-2xl overflow-hidden`;

  // Classes for the desktop embedded view - Use standard rounded-2xl if embedded
  const desktopClasses = `${className} rounded-2xl border border-gray-200 overflow-hidden shadow-sm`;

  return (
    <>
      {/* Mobile Backdrop & Sidebar */}
      <AnimatePresence>
        {isMobile && (
          <motion.div
            key="filter-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-navy/20 backdrop-blur-sm z-40 lg:hidden"
            onClick={onClose}
          />
        )}

        {/* Sidebar (mobile & desktop) */}
        <motion.div
          key="filter-sidebar"
          variants={isMobile ? { closed: { x: "-100%" }, open: { x: 0 } } : undefined}
          initial={isMobile ? "closed" : false}
          animate={isMobile ? (isOpen ? "open" : "closed") : false}
          exit={isMobile ? "closed" : false}
          drag={isMobile ? "x" : false}
          dragConstraints={isMobile ? { left: 0, right: 0 } : false}
          dragElastic={0.1}
          onDragEnd={(e, info) => {
            if (!isMobile) return;
            if (Math.abs(info.offset.x) > 80) {
              onClose();
            }
          }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className={`${baseClasses} ${isMobile ? mobileClasses : desktopClasses}`}
        >
          {/* Header */}
          <div className="p-5 border-b border-gray-100 flex-shrink-0 bg-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Filter className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-bold text-navy font-brand">
                  Filters
                </h2>
                {activeFilterCount > 0 && (
                  <span className="ml-2 inline-flex items-center justify-center h-6 w-6 text-xs font-bold text-white bg-primary rounded-full">
                    {activeFilterCount}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {activeFilterCount > 0 && (
                  <button
                    onClick={onClearAll}
                    className="text-xs font-semibold text-gray-500 hover:text-primary transition-colors"
                  >
                    Reset
                  </button>
                )}
                {isMobile && (
                  <button
                    onClick={onClose}
                    className="p-1.5 text-gray-400 hover:text-navy hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Filter Content */}
          <div className="overflow-y-auto p-5 scrollbar-thin scrollbar-thumb-gray-200">
            <div className="space-y-6">
              {/* Location Filter */}
              <FilterSection
                title="Location"
                tooltip="Limit listings to the states or regions you're interested in."
                options={US_STATES}
                selectedValues={filters.states}
                onFilterChange={(value, checked) => onFilterChange('states', value, checked)}
                searchable
              />

              {/* Fund Type Filter */}
              <FilterSection
                title="Fund Type"
                tooltip="Filter by fund structure."
                options={FILTER_OPTIONS.fundType.map(option => option.label)}
                selectedValues={filters.fundType}
                onFilterChange={(value, checked) => onFilterChange('fundType', value, checked)}
                forcePillStyle
              />

              {/* Property Class Filter */}
              <FilterSection
                title="Property Class"
                tooltip="Filter by property class."
                options={["class-A", "class-B", "class-C"].map(
                  (val) => val.replace("class-", "Class ")
                )}
                selectedValues={filters.propertyClass.map(val => val.replace("class-", "Class "))}
                onFilterChange={(displayValue, checked) => {
                  // Convert display value back to enum value
                  const enumValue = displayValue.replace("Class ", "class-");
                  onFilterChange('propertyClass', enumValue, checked);
                }}
                forcePillStyle
              />

              <div className="pt-2 border-t border-gray-100 space-y-8">
                {/* Minimum Investment Filter */}
                <RangeSlider
                  title="Min Investment"
                  tooltip="Exclude deals that require more capital than you're prepared to commit."
                  min={50000}
                  max={1000000}
                  step={10000}
                  value={filters.minInvestment}
                  onChange={value => onFilterChange('minInvestment', value, true)}
                  formatValue={(val) => `$${(val / 1000).toFixed(0)}k`}
                />

                {/* 10-Year Multiple Filter */}
                <RangeSlider
                  title="10-Year Multiple"
                  tooltip="Projected equity multiple after 10 years."
                  min={1.5}
                  max={5}
                  step={0.1}
                  value={filters.tenYearMultiple}
                  onChange={value => onFilterChange('tenYearMultiple', value, true)}
                  formatValue={(val) => `${val}x`}
                />

                {/* IRR Filter */}
                <RangeSlider
                  title="Target IRR"
                  tooltip="Target Internal Rate of Return."
                  min={5}
                  max={30}
                  step={0.1}
                  value={filters.irr}
                  onChange={(value) => onFilterChange("irr", value, true)}
                  formatValue={(val) => `${val}%`}
                />
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </>
  );
}

function FilterSection({ title, tooltip, options, selectedValues, onFilterChange, searchable = false, forcePillStyle = false }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [mounted, setMounted] = useState(false);
  const titleRef = useRef(null);
  const tooltipRef = useRef(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const filteredOptions = searchable
    ? options.filter(option =>
      option.toLowerCase().includes(searchQuery.toLowerCase())
    )
    : options;

  const selectedCount = selectedValues.length;

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

  // Render selected chips (only for searchable/Location usually)
  const selectedChips = searchable && selectedValues.length > 0 && (
    <div className="flex flex-wrap gap-2 mt-3">
      {selectedValues.map(value => (
        <button
          key={value}
          onClick={() => onFilterChange(value, false)}
          className="inline-flex items-center px-2 py-1 text-xs font-medium bg-primary/10 text-primary-700 rounded-md border border-primary/20 hover:bg-primary/20 transition-colors"
        >
          {value}
          <X className="w-3 h-3 ml-1" />
        </button>
      ))}
    </div>
  );

  return (
    <>
      <div className={`relative transition-all duration-300 ${searchable && showDropdown ? 'z-10' : ''}`}>
        <button
          ref={titleRef}
          onClick={() => setIsExpanded(!isExpanded)}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onMouseMove={handleMouseMove}
          className="flex items-center justify-between w-full text-left group py-1"
        >
          <div className="flex items-center space-x-2">
            <h3 className="text-sm font-bold text-navy group-hover:text-primary transition-colors">
              {title}
            </h3>
            {searchable && selectedCount > 0 && !isExpanded && (
              <span className="text-xs font-medium text-gray-400">({selectedCount})</span>
            )}
          </div>
          <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
        </button>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="pt-3 pb-1">
                {searchable ? (
                  <div>
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
                        className="w-full pl-3 pr-8 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 text-navy placeholder-gray-400 focus:ring-1 focus:ring-primary focus:border-primary transition-all outline-none"
                      />
                      {showDropdown && (
                        <div className="absolute z-20 w-full left-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-48 overflow-y-auto">
                          {filteredOptions.length > 0 ? (
                            filteredOptions.map((option) => {
                              const isSelected = selectedValues.includes(option);
                              return (
                                <button
                                  key={option}
                                  onClick={() => {
                                    onFilterChange(option, !isSelected);
                                    setSearchQuery("");
                                  }}
                                  className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center justify-between ${isSelected ? 'bg-primary/5 text-primary font-medium' : 'text-navy'
                                    }`}
                                >
                                  {option}
                                  {isSelected && <Check className="w-3 h-3 text-primary" />}
                                </button>
                              );
                            })
                          ) : (
                            <div className="px-3 py-2 text-sm text-gray-500">No matches</div>
                          )}
                        </div>
                      )}
                    </div>
                    {selectedChips}
                  </div>
                ) : (
                  <div className={forcePillStyle ? "flex flex-wrap gap-2" : "space-y-1"}>
                    {options.map((option) => {
                      const isSelected = selectedValues.includes(option);
                      if (forcePillStyle) {
                        return (
                          <button
                            key={option}
                            onClick={() => onFilterChange(option, !isSelected)}
                            className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all ${isSelected
                                ? 'bg-primary text-white border-primary shadow-sm'
                                : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                              }`}
                          >
                            {option}
                          </button>
                        );
                      }
                      // Default list style
                      return (
                        <button
                          key={option}
                          onClick={() => onFilterChange(option, !isSelected)}
                          className={`w-full flex items-center space-x-2 text-left text-sm py-1.5 px-2 rounded-md transition-colors ${isSelected ? 'bg-primary/10 text-primary-700 font-medium' : 'text-gray-600 hover:bg-gray-50'
                            }`}
                        >
                          <div className={`w-4 h-4 rounded border flex items-center justify-center ${isSelected ? 'bg-primary border-primary' : 'border-gray-300 bg-white'
                            }`}>
                            {isSelected && <Check className="w-3 h-3 text-white" />}
                          </div>
                          <span>{option}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {mounted && typeof document !== 'undefined' && tooltipElement &&
        createPortal(tooltipElement, document.body)
      }
    </>
  );
} 