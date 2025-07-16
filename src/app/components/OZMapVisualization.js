// src/components/OZMapVisualization.js

// Optimized OZMapVisualization.js with automatic random state cycling
"use client";
import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import * as d3 from "d3";
import { feature } from "topojson-client";

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
  const stateNames = useMemo(
    () => [
      "Alabama",
      "Alaska",
      "Arizona",
      "Arkansas",
      "California",
      "Colorado",
      "Connecticut",
      "Delaware",
      "Florida",
      "Georgia",
      "Hawaii",
      "Idaho",
      "Illinois",
      "Indiana",
      "Iowa",
      "Kansas",
      "Kentucky",
      "Louisiana",
      "Maine",
      "Maryland",
      "Massachusetts",
      "Michigan",
      "Minnesota",
      "Mississippi",
      "Missouri",
      "Montana",
      "Nebraska",
      "Nevada",
      "New Hampshire",
      "New Jersey",
      "New Mexico",
      "New York",
      "North Carolina",
      "North Dakota",
      "Ohio",
      "Oklahoma",
      "Oregon",
      "Pennsylvania",
      "Rhode Island",
      "South Carolina",
      "South Dakota",
      "Tennessee",
      "Texas",
      "Utah",
      "Vermont",
      "Virginia",
      "Washington",
      "West Virginia",
      "Wisconsin",
      "Wyoming",
    ],
    [],
  );

  // Auto-cycle through random states every 5 seconds
  useEffect(() => {
    if (!ozData) return;

    const getRandomState = () => {
      const availableStates = stateNames.filter((state) => ozData.data[state]);
      return availableStates[
        Math.floor(Math.random() * availableStates.length)
      ];
    };

    // Set initial random state
    const initialState = getRandomState();
    setHighlightedState(initialState);
    setTooltipState(initialState);

    // Set up interval to change state every 1.5 seconds with fade transition
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
    }, 5000);

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
          height: containerRef.current.clientHeight,
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
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timeoutId);
    };
  }, []);

  // Load data once
  useEffect(() => {
    Promise.all([
      fetch("https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json").then(
        (r) => r.json(),
      ),
      fetch("/data/opportunity-zones-compressed.geojson").then((r) => r.json()),
      fetch("/data/us-opportunity-zones-data.json").then((r) => r.json()),
    ])
      .then(([topoData, ozGeoData, ozJsonData]) => {
        // Convert JSON data to a lookup object keyed by state name
        const dataLookup = {};
        Object.entries(ozJsonData.states_and_territories).forEach(
          ([stateName, stateData]) => {
            dataLookup[stateName] = {
              category: stateData.category,
              totalOZSpaces: stateData.total_oz_spaces,
              activeProjects: stateData.active_projects_estimate,
              investmentVolume: stateData.investment_volume_estimate,
              investmentBillions: (
                stateData.investment_volume_estimate / 1000000000
              ).toFixed(2),
              activeProjectRate: stateData.active_project_rate,
              formattedInvestment: stateData.investment_volume_formatted,
            };
          },
        );

        setMapData({
          states: feature(topoData, topoData.objects.states),
          ozs: ozGeoData,
        });
        setOzData({ data: dataLookup, metadata: ozJsonData.metadata });
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading map data:", err);
        setLoading(false);
      });
  }, []);

  // Memoized projection
  const projection = useMemo(() => {
    if (!dimensions.width || !dimensions.height) return null;
    // Reduce scale slightly to prevent map cut-off on horizontal edges
    const scale = Math.min(dimensions.width * 1.25, dimensions.height * 1.9);
    return d3
      .geoAlbersUsa()
      .scale(scale) // Maximized scale for optimal visibility
      .translate([dimensions.width / 2, dimensions.height / 2]);
  }, [dimensions.width, dimensions.height]);

  // Create paths for optimized state-grouped OZ data
  const stateOZPaths = useMemo(() => {
    if (!mapData.ozs || !projection) return null;
    const pathGen = d3.geoPath().projection(projection);
    const acc = {};
    mapData.ozs.features.forEach((f) => {
      const stateName = f.properties.state; // optimized file uses 'state' property
      if (!stateName) return;
      const dStr = pathGen(f);
      if (!dStr) return;
      acc[stateName] = dStr; // no need to concatenate, already combined
    });
    return acc;
  }, [mapData.ozs, projection]);

  // Track theme changes using data-theme attribute (Tailwind v4)
  const [currentTheme, setCurrentTheme] = useState("light");

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const theme = document.documentElement.getAttribute("data-theme");
      setCurrentTheme(theme || "light");
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    // Set initial theme
    const theme = document.documentElement.getAttribute("data-theme");
    setCurrentTheme(theme || "light");

    return () => observer.disconnect();
  }, []);

  // Render map
  useEffect(() => {
    if (
      !dimensions.width ||
      !dimensions.height ||
      !mapData.states ||
      !projection ||
      !stateOZPaths
    )
      return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const path = d3.geoPath().projection(projection);

    // Beautiful gradient background
    const defs = svg.append("defs");

    // Check if we're in dark mode using data-theme attribute (Tailwind v4)
    const isDarkMode =
      document.documentElement.getAttribute("data-theme") === "dark";
    const bgColor = isDarkMode ? "#000000" : "#ffffff";

    // Get theme-aware colors from CSS variables (used for both OZ zones and highlights)
    const rootStyles = getComputedStyle(document.documentElement);
    const ozColor = rootStyles.getPropertyValue("--oz-zones").trim();
    const ozHighlightColor = rootStyles
      .getPropertyValue("--oz-zones-highlight")
      .trim();

    // Radial gradient for background (theme-aware)
    const bgGradient = defs
      .append("radialGradient")
      .attr("id", "bg-gradient")
      .attr("cx", "50%")
      .attr("cy", "50%")
      .attr("r", "50%");

    bgGradient.append("stop").attr("offset", "0%").attr("stop-color", bgColor);

    bgGradient
      .append("stop")
      .attr("offset", "100%")
      .attr("stop-color", bgColor);

    // Glow filter for OZ zones
    const glowFilter = defs
      .append("filter")
      .attr("id", "glow")
      .attr("x", "-50%")
      .attr("y", "-50%")
      .attr("width", "200%")
      .attr("height", "200%");

    glowFilter
      .append("feGaussianBlur")
      .attr("stdDeviation", "2")
      .attr("result", "coloredBlur");

    const feMerge = glowFilter.append("feMerge");
    feMerge.append("feMergeNode").attr("in", "coloredBlur");
    feMerge.append("feMergeNode").attr("in", "SourceGraphic");

    // Background
    svg
      .append("rect")
      .attr("width", dimensions.width)
      .attr("height", dimensions.height)
      .attr("fill", "url(#bg-gradient)");

    // Draw states with automatic highlighting
    const statesGroup = svg.append("g").attr("class", "states-layer");

    statesGroup
      .selectAll("path")
      .data(mapData.states.features)
      .enter()
      .append("path")
      .attr("d", path)
      .attr("fill", (d) =>
        highlightedState === d.properties.name
          ? `${ozHighlightColor}1a`
          : "transparent",
      ) // 1a = 10% opacity in hex
      .attr("stroke", (d) =>
        highlightedState === d.properties.name
          ? ozHighlightColor
          : isDarkMode
            ? "rgba(255, 255, 255, 0.4)"
            : "rgba(0, 0, 0, 0.3)",
      )
      .attr("stroke-width", (d) =>
        highlightedState === d.properties.name ? 3 : 1.5,
      )
      .style("transition", "all 0.3s ease");

    // Draw OZ zones grouped by state (theme-aware colors)
    const ozGroup = svg.append("g").attr("class", "oz-layer");

    Object.entries(stateOZPaths).forEach(([stateName, dStr]) => {
      ozGroup
        .append("path")
        .attr("d", dStr)
        .attr("fill", ozColor)
        .attr("fill-opacity", 0.4)
        .attr("stroke", "none")
        .attr("filter", "url(#glow)")
        .attr("data-state-name", stateName)
        .style("pointer-events", "none");
    });
  }, [
    dimensions,
    mapData,
    projection,
    stateOZPaths,
    highlightedState,
    currentTheme,
  ]);

  // Get state bounds and positioning data
  const getStatePosition = useCallback(
    (stateName) => {
      if (!mapData.states || !projection)
        return {
          centroidX: 0,
          centroidY: 0,
          leftBound: 0,
          rightBound: 0,
          topBound: 0,
          bottomBound: 0,
        };

      const stateFeature = mapData.states.features.find(
        (f) => f.properties.name === stateName,
      );
      if (!stateFeature)
        return {
          centroidX: 0,
          centroidY: 0,
          leftBound: 0,
          rightBound: 0,
          topBound: 0,
          bottomBound: 0,
        };

      const path = d3.geoPath().projection(projection);
      const centroid = path.centroid(stateFeature);
      const bounds = path.bounds(stateFeature);

      return {
        centroidX: centroid[0] || 0,
        centroidY: centroid[1] || 0,
        leftBound: bounds[0][0], // Leftmost point
        rightBound: bounds[1][0], // Rightmost point
        topBound: bounds[0][1], // Topmost point
        bottomBound: bounds[1][1], // Bottommost point
        stateWidth: bounds[1][0] - bounds[0][0],
        stateHeight: bounds[1][1] - bounds[0][1],
      };
    },
    [mapData.states, projection],
  );

  // Calculate tooltip position for current state
  const getTooltipPosition = useMemo(() => {
    if (!tooltipState || !ozData || !ozData.data[tooltipState])
      return { x: 0, y: 0 };

    const position = getStatePosition(tooltipState);

    // Calculate responsive tooltip dimensions and spacing based on screen size and aspect ratio
    const aspectRatio = dimensions.width / dimensions.height;
    const screenSize = Math.min(dimensions.width, dimensions.height);
    
    // Responsive tooltip dimensions
    const baseTooltipWidth = screenSize < 640 ? 200 : screenSize < 1024 ? 240 : 280;
    const tooltipWidth = aspectRatio > 1.5 ? baseTooltipWidth * 1.1 : baseTooltipWidth;
    const tooltipHeight = screenSize < 640 ? 160 : 200;
    
    // Responsive spacing - much closer to states, varies by screen size
    const baseSpacing = screenSize < 640 ? 20 : screenSize < 1024 ? 30 : 40;
    const spacing = aspectRatio > 1.5 ? baseSpacing * 0.8 : baseSpacing;

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
    tooltipX = Math.max(
      20,
      Math.min(tooltipX, dimensions.width - tooltipWidth - 20),
    );
    tooltipY = Math.max(
      20,
      Math.min(tooltipY, dimensions.height - tooltipHeight - 20),
    );

    return { x: tooltipX, y: tooltipY, width: tooltipWidth };
  }, [
    tooltipState,
    ozData,
    getStatePosition,
    dimensions.width,
    dimensions.height,
  ]);

  // Get current tooltip data
  const tooltipData = useMemo(() => {
    if (!tooltipState || !ozData || !ozData.data[tooltipState]) return null;
    return {
      state: tooltipState,
      stats: ozData.data[tooltipState],
    };
  }, [tooltipState, ozData]);

  return (
    <div className="flex h-full w-full flex-col bg-white transition-colors duration-300 dark:bg-black">
      {/* Map container - full height */}
      <div
        ref={containerRef}
        className="relative w-full flex-1 bg-white transition-colors duration-300 dark:bg-black"
      >
        <svg
          ref={svgRef}
          width={dimensions.width}
          height={dimensions.height}
          className="absolute inset-0"
        />
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white transition-colors duration-300 dark:bg-black">
            <div className="text-center">
              <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-2 border-blue-200 border-t-blue-600 dark:border-blue-800 dark:border-t-blue-400"></div>
              <p className="font-light text-gray-600 transition-colors duration-300 dark:text-gray-400">
                Loading opportunity zones...
              </p>
            </div>
          </div>
        )}

        {/* Automatically cycling tooltip */}
        <div
          className={`absolute z-50 rounded-xl border border-gray-200/50 bg-white/95 shadow-2xl backdrop-blur-xl transition-all duration-500 ease-in-out dark:border-gray-600/50 dark:bg-black/95 ${
            tooltipVisible && tooltipData
              ? "scale-100 opacity-100"
              : "scale-y-0 opacity-0"
          }`}
          style={{
            left: getTooltipPosition.x,
            top: getTooltipPosition.y,
            width: `${getTooltipPosition.width || (dimensions.width < 640 ? 200 : dimensions.width < 1024 ? 240 : 280)}px`,
            padding: dimensions.width < 640 ? '12px' : dimensions.width < 1024 ? '16px' : '24px',
            transformOrigin: "top center",
            willChange: "transform, opacity",
          }}
        >
          {tooltipData && (
            <>
              <h3 className="mb-4 text-xl font-bold text-gray-900 transition-colors duration-300 dark:text-white">
                {tooltipData.state}
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 transition-colors duration-300 dark:text-gray-400">
                    Opportunity Zones
                  </span>
                  <span className="text-lg font-semibold text-gray-900 transition-colors duration-300 dark:text-white">
                    {tooltipData.stats.totalOZSpaces}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 transition-colors duration-300 dark:text-gray-400">
                    Total Investment
                  </span>
                  <span className="font-semibold text-blue-600 dark:text-blue-400">
                    ${tooltipData.stats.investmentBillions}B
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 transition-colors duration-300 dark:text-gray-400">
                    Active Projects
                  </span>
                  <span className="font-semibold text-green-600 dark:text-green-400">
                    {tooltipData.stats.activeProjects}
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
