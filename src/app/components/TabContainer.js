'use client';

import { useState, useRef, useEffect } from 'react';

export default function TabContainer({ tabs, defaultTab = 0, className = '' }) {
  const [activeTabIndex, setActiveTabIndex] = useState(defaultTab);
  const [sliderStyle, setSliderStyle] = useState({});
  const containerRef = useRef(null);
  const tabsRef = useRef([]);

  // Calculate and update slider position
  const updateSliderPosition = (index) => {
    if (!containerRef.current || !tabsRef.current[index]) return;
    
    const container = containerRef.current;
    const activeTab = tabsRef.current[index];
    const containerRect = container.getBoundingClientRect();
    const tabRect = activeTab.getBoundingClientRect();
    
    const left = tabRect.left - containerRect.left;
    const width = tabRect.width;
    
    setSliderStyle({
      transform: `translateX(${left}px)`,
      width: `${width}px`,
      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
    });
  };

  // Update slider position when active tab changes
  useEffect(() => {
    updateSliderPosition(activeTabIndex);
  }, [activeTabIndex]);

  // Update slider position on window resize
  useEffect(() => {
    const handleResize = () => {
      updateSliderPosition(activeTabIndex);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [activeTabIndex]);

  return (
    <div className={`w-full ${className}`}>
      {/* Tab Navigation */}
      <div className="w-full mb-8 animate-fadeIn">
        <div 
          ref={containerRef}
          className="glass-card rounded-3xl p-2 bg-white/80 dark:bg-black/20 border border-black/10 dark:border-white/10 flex w-full relative overflow-hidden"
        >
          {/* Sliding blue bar with modern effects */}
          <div
            className="absolute top-2 bottom-2 bg-gradient-to-r from-[#0071e3] to-[#42a5f5] rounded-2xl z-10 backdrop-blur-sm"
            style={sliderStyle}
          />
          
          {tabs.map((tab, index) => (
            <button
              key={tab.id || index}
              ref={(el) => (tabsRef.current[index] = el)}
              onClick={() => setActiveTabIndex(index)}
              className={`flex-1 px-6 py-3 rounded-2xl font-medium transition-all duration-300 relative z-20 hover:scale-[1.02] active:scale-[0.98] ${
                activeTabIndex === index
                  ? 'text-white font-semibold'
                  : 'text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="w-full">
        {tabs[activeTabIndex] && tabs[activeTabIndex].content}
      </div>
    </div>
  );
} 