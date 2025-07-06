// src/components/OZMapVisualization.js

// Optimized OZMapVisualization.js for slide deck usage
'use client';
import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import * as d3 from 'd3';
import { feature } from 'topojson-client';


export default function OZMapVisualization() {
  const svgRef = useRef(null);
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [hoveredState, setHoveredState] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [loading, setLoading] = useState(true);
  const [mapData, setMapData] = useState({ states: null, ozs: null });

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
      fetch('/data/opportunity-zones-compressed.geojson').then(r => r.json())
    ]).then(([topoData, ozData]) => {
            
      setMapData({
        states: feature(topoData, topoData.objects.states),
        ozs: ozData
      });
      setLoading(false);
    }).catch(err => {
      console.error('Error loading map data:', err);
      setLoading(false);
    });
  }, []);

  // Throttled mouse tracking (max ~60 fps)
  const lastMoveRef = useRef(0);

  // Memoized projection
  const projection = useMemo(() => {
    if (!dimensions.width || !dimensions.height) return null;
    // Account for header space (roughly 160px) by adjusting the map's vertical position
    const headerSpace = 160;
    const availableHeight = dimensions.height - headerSpace;
    return d3.geoAlbersUsa()
      .scale(dimensions.width * 1.2) // Slightly reduced scale to fit better
      .translate([dimensions.width / 2, (availableHeight / 2) + headerSpace]);
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

  // Check if dark mode is active
  const isDarkMode = typeof window !== 'undefined' && document.documentElement.classList.contains('dark');

  // Render map
  useEffect(() => {
    if (!dimensions.width || !dimensions.height || !mapData.states || !projection || !stateOZPaths) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const path = d3.geoPath().projection(projection);

    // Beautiful gradient background
    const defs = svg.append('defs');
    
    // Radial gradient for background (different for light/dark mode)
    const bgGradient = defs.append('radialGradient')
      .attr('id', 'bg-gradient')
      .attr('cx', '50%')
      .attr('cy', '50%')
      .attr('r', '50%');
    
    if (isDarkMode) {
      bgGradient.append('stop')
        .attr('offset', '0%')
        .attr('stop-color', '#0a0a0a');
      
      bgGradient.append('stop')
        .attr('offset', '100%')
        .attr('stop-color', '#000000');
    } else {
      bgGradient.append('stop')
        .attr('offset', '0%')
        .attr('stop-color', '#ffffff');
      
      bgGradient.append('stop')
        .attr('offset', '100%')
        .attr('stop-color', '#ffffff');
    }

    // Glow filter for OZ zones
    const glowFilter = defs.append('filter')
      .attr('id', 'glow')
      .attr('x', '-50%')
      .attr('y', '-50%')
      .attr('width', '200%')
      .attr('height', '200%');
    
    glowFilter.append('feGaussianBlur')
      .attr('stdDeviation', '3')
      .attr('result', 'coloredBlur');
    
    const feMerge = glowFilter.append('feMerge');
    feMerge.append('feMergeNode').attr('in', 'coloredBlur');
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    // Background
    svg.append('rect')
      .attr('width', dimensions.width)
      .attr('height', dimensions.height)
      .attr('fill', 'url(#bg-gradient)');

    // Draw states with subtle styling (different for light/dark mode)
    const statesGroup = svg.append('g').attr('class', 'states-layer');
    
    statesGroup.selectAll('path')
      .data(mapData.states.features)
      .enter()
      .append('path')
      .attr('d', path)
      .attr('fill', isDarkMode ? 'rgba(255, 255, 255, 0.04)' : 'transparent')
      .attr('stroke', isDarkMode ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.15)')
      .attr('stroke-width', 1)
      .style('cursor', 'pointer')

    // Draw OZ zones grouped by state (one path per state)
    const ozGroup = svg.append('g').attr('class', 'oz-layer');

    Object.entries(stateOZPaths).forEach(([stateName, dStr]) => {
      ozGroup.append('path')
        .attr('d', dStr)
        .attr('fill', '#30d158')
        .attr('fill-opacity', 0.4)
        .attr('stroke', 'none')
        .attr('filter', 'url(#glow)')
        .attr('data-state-name', stateName)
        .style('pointer-events', 'none');
    });
  }, [dimensions, mapData, projection, stateOZPaths, isDarkMode]);

  return (
    <div className="w-full h-full flex flex-col bg-white dark:bg-black">
      {/* Map container - full height */}
      <div 
        ref={containerRef} 
        className="relative flex-1 w-full bg-white dark:bg-black"
      >
        <svg
          ref={svgRef}
          width={dimensions.width}
          height={dimensions.height}
          className="absolute inset-0"
        />
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white dark:bg-black">
            <div className="text-center">
              <div className="w-12 h-12 border-2 border-black/20 dark:border-white/20 border-t-black/60 dark:border-t-white/60 rounded-full animate-spin mb-4 mx-auto"></div>
              <p className="text-black/60 dark:text-white/60 font-light">Loading opportunity zones...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}