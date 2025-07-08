// src/components/OZMapVisualization.js

// Optimized OZMapVisualization.js with automatic random state cycling
'use client';
import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import * as d3 from 'd3';
import { feature } from 'topojson-client';

export default function OZMapVisualization() {
  const svgRef = useRef(null);
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [highlightedState, setHighlightedState] = useState(null);
  const [tooltipState, setTooltipState] = useState(null);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [mapData, setMapData] = useState({ states: null, ozs: null });
  const [ozData, setOzData] = useState(null);

  // List of all US states for random selection
  const stateNames = useMemo(() => [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut',
    'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
    'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan',
    'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
    'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio',
    'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
    'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia',
    'Wisconsin', 'Wyoming'
  ], []);

  // Auto-cycle through random states every 5 seconds
  useEffect(() => {
    if (!ozData) return;

    const getRandomState = () => {
      const availableStates = stateNames.filter(state => ozData.data[state]);
      return availableStates[Math.floor(Math.random() * availableStates.length)];
    };

    // Set initial random state
    const initialState = getRandomState();
    setHighlightedState(initialState);
    setTooltipState(initialState);

    // Set up interval to change state every 3.5 seconds with fade transition
    const interval = setInterval(() => {
      const newState = getRandomState();
      
      // Fade out current tooltip
      setTooltipVisible(false);
      
      setTimeout(() => {
        // Change highlighted state and tooltip state
        setHighlightedState(newState);
        setTooltipState(newState);
        
        setTimeout(() => {
          // Expand new tooltip
          setTooltipVisible(true);
        }, 150); // Small delay to ensure state change and positioning is complete
      }, 500); // Collapse duration
    }, 3500);

    // Show initial tooltip
    setTimeout(() => setTooltipVisible(true), 100);

    return () => clearInterval(interval);
  }, [ozData, stateNames]);

  // Resize handling (debounced to avoid rapid re-renders)
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight
        });
      }
    };

    // Debounce resize events to 150 ms
    let timeoutId;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(updateDimensions, 150);
    };

    updateDimensions();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
    };
  }, []);

  // Load data once
  useEffect(() => {
    Promise.all([
      fetch('https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json').then(r => r.json()),
      fetch('/data/opportunity-zones-compressed.geojson').then(r => r.json()),
      fetch('/data/us-opportunity-zones-data.json').then(r => r.json())
    ]).then(([topoData, ozGeoData, ozJsonData]) => {
      // Convert JSON data to a lookup object keyed by state name
      const dataLookup = {};
      Object.entries(ozJsonData.states_and_territories).forEach(([stateName, stateData]) => {
        dataLookup[stateName] = {
          category: stateData.category,
          totalOZSpaces: stateData.total_oz_spaces,
          activeProjects: stateData.active_projects_estimate,
          investmentVolume: stateData.investment_volume_estimate,
          investmentBillions: (stateData.investment_volume_estimate / 1000000000).toFixed(2),
          activeProjectRate: stateData.active_project_rate,
          formattedInvestment: stateData.investment_volume_formatted
        };
      });
            
      setMapData({
        states: feature(topoData, topoData.objects.states),
        ozs: ozGeoData
      });
      setOzData({ data: dataLookup, metadata: ozJsonData.metadata });
      setLoading(false);
    }).catch(err => {
      console.error('Error loading map data:', err);
      setLoading(false);
    });
  }, []);

  // Memoized projection
  const projection = useMemo(() => {
    if (!dimensions.width || !dimensions.height) return null;
    // Calculate scale based on both width and height to maximize map size
    const scale = Math.min(dimensions.width * 1.4, dimensions.height * 2.0);
    return d3.geoAlbersUsa()
      .scale(scale) // Maximized scale for optimal visibility
      .translate([dimensions.width / 2, dimensions.height / 2]);
  }, [dimensions.width, dimensions.height]);

  // Create paths for optimized state-grouped OZ data
  const stateOZPaths = useMemo(() => {
    if (!mapData.ozs || !projection) return null;
    const pathGen = d3.geoPath().projection(projection);
    const acc = {};
    mapData.ozs.features.forEach(f => {
      const stateName = f.properties.state; // optimized file uses 'state' property
      if (!stateName) return;
      const dStr = pathGen(f);
      if (!dStr) return;
      acc[stateName] = dStr; // no need to concatenate, already combined
    });
    return acc;
  }, [mapData.ozs, projection]);

  // Render map
  useEffect(() => {
    if (!dimensions.width || !dimensions.height || !mapData.states || !projection || !stateOZPaths) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const path = d3.geoPath().projection(projection);

    // Beautiful gradient background
    const defs = svg.append('defs');
    
    // Radial gradient for background (light mode only)
    const bgGradient = defs.append('radialGradient')
      .attr('id', 'bg-gradient')
      .attr('cx', '50%')
      .attr('cy', '50%')
      .attr('r', '50%');
    
    bgGradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#ffffff');
    
    bgGradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#ffffff');

    // Glow filter for OZ zones
    const glowFilter = defs.append('filter')
      .attr('id', 'glow')
      .attr('x', '-50%')
      .attr('y', '-50%')
      .attr('width', '200%')
      .attr('height', '200%');
    
    glowFilter.append('feGaussianBlur')
      .attr('stdDeviation', '2')
      .attr('result', 'coloredBlur');
    
    const feMerge = glowFilter.append('feMerge');
    feMerge.append('feMergeNode').attr('in', 'coloredBlur');
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    // Background
    svg.append('rect')
      .attr('width', dimensions.width)
      .attr('height', dimensions.height)
      .attr('fill', 'url(#bg-gradient)');

    // Draw states with automatic highlighting
    const statesGroup = svg.append('g').attr('class', 'states-layer');
    
    statesGroup.selectAll('path')
      .data(mapData.states.features)
      .enter()
      .append('path')
      .attr('d', path)
      .attr('fill', d => highlightedState === d.properties.name ? 'rgba(30, 136, 229, 0.1)' : 'transparent')
      .attr('stroke', d => highlightedState === d.properties.name ? '#1e88e5' : 'rgba(0, 0, 0, 0.15)')
      .attr('stroke-width', d => highlightedState === d.properties.name ? 2 : 1)
      .style('transition', 'all 0.3s ease');

    // Draw OZ zones grouped by state (using blue instead of green)
    const ozGroup = svg.append('g').attr('class', 'oz-layer');

    Object.entries(stateOZPaths).forEach(([stateName, dStr]) => {
      ozGroup.append('path')
        .attr('d', dStr)
        .attr('fill', '#1e88e5') // Blue color from OZ Listings logo
        .attr('fill-opacity', 0.4)
        .attr('stroke', 'none')
        .attr('filter', 'url(#glow)')
        .attr('data-state-name', stateName)
        .style('pointer-events', 'none');
    });
  }, [dimensions, mapData, projection, stateOZPaths, highlightedState]);

  // Get state bounds and positioning data
  const getStatePosition = useCallback((stateName) => {
    if (!mapData.states || !projection) return { 
      centroidX: 0, centroidY: 0, 
      leftBound: 0, rightBound: 0, topBound: 0, bottomBound: 0 
    };
    
    const stateFeature = mapData.states.features.find(f => f.properties.name === stateName);
    if (!stateFeature) return { 
      centroidX: 0, centroidY: 0, 
      leftBound: 0, rightBound: 0, topBound: 0, bottomBound: 0 
    };
    
    const path = d3.geoPath().projection(projection);
    const centroid = path.centroid(stateFeature);
    const bounds = path.bounds(stateFeature);
    
    return {
      centroidX: centroid[0] || 0,
      centroidY: centroid[1] || 0,
      leftBound: bounds[0][0],   // Leftmost point
      rightBound: bounds[1][0],  // Rightmost point  
      topBound: bounds[0][1],    // Topmost point
      bottomBound: bounds[1][1], // Bottommost point
      stateWidth: bounds[1][0] - bounds[0][0],
      stateHeight: bounds[1][1] - bounds[0][1]
    };
  }, [mapData.states, projection]);

  // Calculate tooltip position for current state
  const getTooltipPosition = useMemo(() => {
    if (!tooltipState || !ozData || !ozData.data[tooltipState]) return { x: 0, y: 0 };
    
    const position = getStatePosition(tooltipState);
    
    // Calculate optimal tooltip position well outside actual state boundaries
    const tooltipWidth = 280;
    const tooltipHeight = 200;
    const spacing = 80; // Generous spacing from state edges
    
    // Try positioning on the right side of the state first
    let tooltipX = position.rightBound + spacing;
    let tooltipY = position.centroidY - tooltipHeight / 2;
    
    // If tooltip goes off right edge, try left side
    if (tooltipX + tooltipWidth > dimensions.width - 20) {
      tooltipX = position.leftBound - spacing - tooltipWidth;
    }
    
    // If tooltip goes off left edge, try above
    if (tooltipX < 20) {
      tooltipX = position.centroidX - tooltipWidth / 2;
      tooltipY = position.topBound - spacing - tooltipHeight;
      
      // If tooltip goes off top, try below
      if (tooltipY < 20) {
        tooltipY = position.bottomBound + spacing;
      }
    }
    
    // Final screen bounds checking
    tooltipX = Math.max(20, Math.min(tooltipX, dimensions.width - tooltipWidth - 20));
    tooltipY = Math.max(20, Math.min(tooltipY, dimensions.height - tooltipHeight - 20));

    return { x: tooltipX, y: tooltipY };
  }, [tooltipState, ozData, getStatePosition, dimensions.width, dimensions.height]);

  // Get current tooltip data
  const tooltipData = useMemo(() => {
    if (!tooltipState || !ozData || !ozData.data[tooltipState]) return null;
    return {
      state: tooltipState,
      stats: ozData.data[tooltipState]
    };
  }, [tooltipState, ozData]);

  return (
    <div className="w-full h-full flex flex-col bg-white">
      {/* Map container - full height */}
      <div 
        ref={containerRef} 
        className="relative flex-1 w-full bg-white"
      >
        <svg
          ref={svgRef}
          width={dimensions.width}
          height={dimensions.height}
          className="absolute inset-0"
        />
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white">
            <div className="text-center">
              <div className="w-12 h-12 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4 mx-auto"></div>
              <p className="text-gray-600 font-light">Loading opportunity zones...</p>
            </div>
          </div>
        )}
        
        {/* Automatically cycling tooltip */}
        <div 
          className={`absolute z-50 bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl p-6 min-w-[280px] border border-gray-200/50 transition-all duration-500 ease-in-out ${
            tooltipVisible && tooltipData ? 'scale-100 opacity-100' : 'scale-y-0 opacity-0'
          }`}
          style={{
            left: getTooltipPosition.x,
            top: getTooltipPosition.y,
            transformOrigin: 'top center',
            willChange: 'transform, opacity'
          }}
        >
          {tooltipData && (
            <>
              <h3 className="text-xl font-bold text-gray-900 mb-4">{tooltipData.state}</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Opportunity Zones</span>
                  <span className="font-semibold text-lg text-gray-900">{tooltipData.stats.totalOZSpaces}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Investment</span>
                  <span className="font-semibold text-blue-600">${tooltipData.stats.investmentBillions}B</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Active Projects</span>
                  <span className="font-semibold text-green-600">{tooltipData.stats.activeProjects}</span>
                </div>
              </div>
              <button className="mt-4 w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 rounded-lg hover:shadow-lg transition-all">
                View Details →
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}