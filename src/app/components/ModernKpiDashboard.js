// src/components/ModernKpiDashboard.js

'use client';
import { useState, useLayoutEffect, useRef } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, Filler, ArcElement } from 'chart.js';
import AnnotationPlugin from 'chartjs-plugin-annotation';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import { TrendingUp, Building2, MapPin, Home, BarChart3, CheckCircle, Target, Users } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, Filler, ArcElement, AnnotationPlugin);

const THEME = {
  cardBg: 'bg-gradient-to-br from-[#F8FAFC] to-[#EFF6FF] dark:from-slate-900 dark:to-slate-800 border border-blue-100/50 dark:border-white/5',
  iconBg: 'bg-white dark:bg-white/5 shadow-sm',
  iconColor: 'text-primary',
  text: 'text-navy dark:text-white',
  subtext: 'text-slate-600 dark:text-slate-400',
  highlight: 'text-primary',
  chartPrimary: '#0071e3', // Primary Blue
  chartSecondary: '#60a5fa', // Lighter Blue
  chartTertiary: '#93c5fd', // Even Lighter Blue
  chartSlate: '#94a3b8', // Slate for variety
};

export default function ModernKpiDashboard() {
    const [activeTab, setActiveTab] = useState('overview');
    
    // Standardized Chart Colors
    const primaryColor = THEME.chartPrimary;
    const primaryBg = 'rgba(0, 113, 227, 0.1)';
    const secondaryColor = THEME.chartSecondary;
    const secondaryBg = 'rgba(96, 165, 250, 0.2)';

    const tabs = [
      { id: 'overview', label: 'Overview', icon: BarChart3 },
      { id: 'qof-performance', label: 'QOF Performance', icon: TrendingUp },
      { id: 'geographic', label: 'Geographic Analysis', icon: MapPin },
      { id: 'social-impact', label: 'Social Impact', icon: Users },
      { id: 'compliance', label: 'Compliance', icon: CheckCircle },
      { id: 'market-intelligence', label: 'Market Intelligence', icon: Target }
    ];

    // Chart Data Construction
    const investmentGrowthData = {
      labels: ['2018', '2019', '2020', '2021', '2022', '2023', '2024'],
      datasets: [
        {
          label: 'Total Investment ($B)',
          data: [4.0, 28.0, 48.0, 65.0, 89.0, 100.0, 110.0],
          borderColor: primaryColor,
          backgroundColor: primaryBg,
          fill: true,
          tension: 0.4
        }
      ]
    };

    const sectorAllocationData = {
      labels: ['Residential', 'Commercial RE', 'Mixed Use', 'Operating Business', 'Infrastructure', 'Other'],
      datasets: [{
        data: [68.2, 21.1, 7.7, 2.0, 0.9, 0.1],
        backgroundColor: [
          'rgba(0, 113, 227, 0.9)',   // Primary
          'rgba(59, 130, 246, 0.8)',  // Blue-500
          'rgba(96, 165, 250, 0.8)',  // Blue-400
          'rgba(147, 197, 253, 0.8)', // Blue-300
          'rgba(203, 213, 225, 0.8)', // Slate-300
          'rgba(148, 163, 184, 0.8)'  // Slate-400
        ],
        borderWidth: 0
      }]
    };

    const qofPerformanceData = {
      labels: ['2018', '2019', '2020', '2021', '2022', '2023', '2024'],
      datasets: [
        {
          label: 'Number of QOFs',
          data: [1300, 5800, 7800, 9500, 11000, 12500, 14000],
          borderColor: primaryColor,
          backgroundColor: primaryBg,
          fill: false,
          yAxisID: 'y'
        },
        {
          label: 'Average QOF Size ($M)',
          data: [3.1, 4.8, 6.2, 6.8, 8.1, 8.0, 7.9],
          borderColor: secondaryColor,
          backgroundColor: secondaryBg,
          fill: false,
          yAxisID: 'y1'
        }
      ]
    };

    // Geographic: Monochromatic Blue Scale
    const geographicData = {
        labels: ['CA', 'FL', 'TX', 'NY', 'CO', 'OR', 'AZ', 'UT', 'NC', 'GA'],
        datasets: [
          {
            label: 'Investment ($B)',
            data: [25.2, 18.5, 15.8, 12.3, 8.7, 6.9, 6.2, 5.8, 4.9, 4.3],
            backgroundColor: 'rgba(0, 113, 227, 0.8)',
            borderRadius: 8
          }
        ]
      };

    const socialImpactData = {
      labels: ['Poverty Rate', 'Median Income', 'Minority Share', 'No High School', 'Bachelor\'s Degree', 'Not Working'],
      datasets: [
        {
          label: 'Opportunity Zones',
          data: [26.4, 49.9, 56.9, 20.5, 18.6, 30.0],
          backgroundColor: 'rgba(0, 113, 227, 0.8)', // Primary
          borderRadius: 4
        },
        {
          label: 'National Average',
          data: [13.4, 77.3, 39.3, 12.0, 32.1, 21.5],
          backgroundColor: 'rgba(148, 163, 184, 0.5)', // Slate
          borderRadius: 4
        }
      ]
    };

    const complianceData = {
        labels: ['2019', '2020', '2021', '2022', '2023', '2024'],
        datasets: [
          {
            label: 'Compliance Rate (%)',
            data: [94.2, 93.8, 94.5, 95.1, 94.7, 95.3],
            borderColor: primaryColor,
            backgroundColor: primaryBg,
            fill: true,
            tension: 0.4
          }
        ]
      };

    const propertyTrendsData = {
      labels: ['Q1 2023', 'Q2 2023', 'Q3 2023', 'Q4 2023', 'Q1 2024', 'Q2 2024', 'Q3 2024', 'Q4 2024'],
      datasets: [
        {
          label: 'OZ Median Home Value ($K)',
          data: [195, 198, 201, 205, 210, 215, 218, 220],
          backgroundColor: 'rgba(0, 113, 227, 0.8)', // Primary
          borderRadius: 8
        },
        {
          label: 'National Median ($K)',
          data: [350, 355, 358, 360, 365, 370, 372, 375],
          backgroundColor: 'rgba(148, 163, 184, 0.5)', // Slate
          borderRadius: 8
        }
      ]
    };


    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              color: typeof window !== 'undefined' && document.documentElement.classList.contains('dark') 
                ? 'rgb(229, 231, 235)' 
                : 'rgb(75, 85, 99)',
              usePointStyle: true,
              pointStyle: 'circle'
            }
          },
          title: { display: false }
        },
        scales: {
          x: {
            grid: {
              color: typeof window !== 'undefined' && document.documentElement.classList.contains('dark') 
                ? 'rgba(255, 255, 255, 0.05)' 
                : 'rgba(0, 0, 0, 0.05)'
            },
            ticks: {
              color: typeof window !== 'undefined' && document.documentElement.classList.contains('dark') 
                ? 'rgb(156, 163, 175)' 
                : 'rgb(75, 85, 99)'
            }
          },
          y: {
            grid: {
              color: typeof window !== 'undefined' && document.documentElement.classList.contains('dark') 
                ? 'rgba(255, 255, 255, 0.05)' 
                : 'rgba(0, 0, 0, 0.05)'
            },
            ticks: {
              color: typeof window !== 'undefined' && document.documentElement.classList.contains('dark') 
                ? 'rgb(156, 163, 175)' 
                : 'rgb(75, 85, 99)'
            }
          }
        }
      };


    // Duplicate logic specifically for dual axis (simplified here: same theme)
    const dualAxisOptions = { ...chartOptions }; // In real app, deep merge properly or re-declare
    // Overriding scales for dual axis
    dualAxisOptions.scales = {
        x: chartOptions.scales.x,
        y: {
            type: 'linear',
            display: true,
            position: 'left',
            grid: chartOptions.scales.y.grid,
            ticks: chartOptions.scales.y.ticks
          },
          y1: {
            type: 'linear',
            display: true,
            position: 'right',
            grid: {
              drawOnChartArea: false,
            },
            ticks: chartOptions.scales.y.ticks
          }
    };


    // Detect when the button row overflows (desktop only) and switch to a grid layout
    const btnContainerRef = useRef(null);
    const [useGridLayout, setUseGridLayout] = useState(false);

    useLayoutEffect(() => {
      const updateLayout = () => {
        if (!btnContainerRef.current) return;
        const { scrollWidth, clientWidth } = btnContainerRef.current;
        const shouldUseGrid = window.innerWidth >= 768 && scrollWidth > clientWidth;
        setUseGridLayout(shouldUseGrid);
      };

      updateLayout();
      window.addEventListener('resize', updateLayout);
      return () => window.removeEventListener('resize', updateLayout);
    }, []);

    // Helper component for standardized card
    const StatCard = ({ title, value, subtext, icon: Icon }) => (
        <div className={`${THEME.cardBg} p-6 rounded-2xl w-full`}>
            <div className="flex items-center justify-between mb-2">
                <h4 className={`font-semibold ${THEME.text}`}>{title}</h4>
                <div className={`p-2 rounded-xl ${THEME.iconBg}`}>
                    <Icon className={`w-5 h-5 ${THEME.iconColor}`} />
                </div>
            </div>
            <p className={`text-3xl font-bold ${THEME.highlight}`}>{value}</p>
            <p className={`text-sm ${THEME.subtext} mt-1`}>{subtext}</p>
        </div>
    );

    return (
      <div className="h-full px-3 md:px-8 pb-2 flex items-center justify-center">
        <div className="w-full max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-8 md:mb-12 animate-fadeIn">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-black dark:text-white tracking-tight mb-4">Market Overview</h2>
            <p className="text-base md:text-lg text-black/60 dark:text-white/60 font-light">
                <span className="hidden md:inline">Comprehensive view of the $110+ billion Opportunity Zone marketplace</span>
                <span className="md:hidden">Comprehensive view of the $110B+ OZ marketplace</span>
            </p>
          </div>

          {/* Charts Section */}
          <div className="space-y-3 md:space-y-4">
            <div
              ref={btnContainerRef}
              className={`${useGridLayout ? 'columns-2 lg:columns-3 w-max mx-auto' : 'flex flex-wrap'} gap-2 md:gap-3 mb-3 md:mb-4 justify-center ${useGridLayout ? 'overflow-visible' : 'overflow-x-auto pb-2'} md:overflow-visible`}
            >
              {tabs.map(tab => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-3 md:px-6 py-3.5 rounded-full text-sm font-medium transition-all flex items-center space-x-2.5 ${
                      activeTab === tab.id
                        ? 'bg-primary text-white shadow-md'
                        : 'glass-card text-slate-600 dark:text-white/70 hover:text-primary dark:hover:text-white bg-white/80 dark:bg-black/20 border border-slate-200 dark:border-white/20'
                    }`}
                  >
                    <IconComponent className={`w-4 h-4 ${activeTab === tab.id ? 'text-white' : 'text-primary'}`} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="glass-card rounded-3xl p-4 md:p-5 bg-white/80 dark:bg-black/20 border border-black/10 dark:border-white/20">
              {activeTab === 'overview' && (
                <div className="space-y-3">
                  <h3 className={`text-xl md:text-2xl font-semibold ${THEME.text} mb-2 md:mb-3`}>Investment Overview</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-3 md:mb-4">
                    <StatCard title="Total Investment" value="$110B+" subtext="Since 2018" icon={TrendingUp} />
                    <StatCard title="Active QOFs" value="14,000+" subtext="Nationwide" icon={Building2} />
                    <StatCard title="Investment Growth" value="+15%" subtext="YoY Growth" icon={TrendingUp} />
                    <StatCard title="Zones with Investment" value="68%" subtext="Of total OZ areas" icon={MapPin} />
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-5">
                    <div className="h-56 md:h-64 lg:h-[280px] flex flex-col">
                      <h4 className={`text-lg font-medium ${THEME.text} mb-2 flex-shrink-0`}>Investment Growth Trend</h4>
                      <div className="flex-1 min-h-0">
                        <Line data={investmentGrowthData} options={chartOptions} />
                      </div>
                    </div>
                    <div className="h-56 md:h-64 lg:h-[280px] flex flex-col">
                      <h4 className={`text-lg font-medium ${THEME.text} mb-2 flex-shrink-0`}>Sector Allocation</h4>
                      <div className="flex-1 min-h-0">
                        <Doughnut data={sectorAllocationData} options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: { 
                              position: 'right',
                              labels: {
                                color: typeof window !== 'undefined' && document.documentElement.classList.contains('dark') 
                                  ? 'rgb(229, 231, 235)' 
                                  : 'rgb(75, 85, 99)'
                              }
                            }
                          }
                        }} />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'qof-performance' && (
                <div className="space-y-3">
                  <h3 className={`text-xl md:text-2xl font-semibold ${THEME.text} mb-2 md:mb-3`}>QOF Performance Intelligence</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 mb-3 md:mb-4">
                    <StatCard title="Average Fund Size" value="$7.9M" subtext="+15% vs 2023" icon={Building2} />
                    <StatCard title="Investment Velocity" value="$1.2B" subtext="Monthly Average" icon={TrendingUp} />
                    <StatCard title="Fund Formation Rate" value="125" subtext="New QOFs/Month" icon={CheckCircle} />
                  </div>

                  <div className="h-56 md:h-64 lg:h-[280px] flex flex-col">
                    <h4 className={`text-lg font-medium ${THEME.text} mb-2 flex-shrink-0`}>QOF Growth & Formation Trends</h4>
                    <div className="flex-1 min-h-0">
                      <Line data={qofPerformanceData} options={dualAxisOptions} />
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'geographic' && (
                <div className="space-y-3">
                  <h3 className={`text-xl md:text-2xl font-semibold ${THEME.text} mb-2 md:mb-3`}>Geographic Investment Analysis</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 mb-3 md:mb-4">
                    <StatCard title="Leading State" value="California" subtext="$25.2B invested" icon={MapPin} />
                    <StatCard title="Highest Per-Zone" value="Utah" subtext="$126.1M average" icon={TrendingUp} />
                    <StatCard title="Rural vs Urban" value="35% / 65%" subtext="Investment split" icon={Home} />
                  </div>

                  <div className="h-56 md:h-64 lg:h-[280px] flex flex-col">
                    <h4 className={`text-lg font-medium ${THEME.text} mb-2 flex-shrink-0`}>Top 10 States by Investment Volume</h4>
                    <div className="flex-1 min-h-0">
                      <Bar 
                        data={geographicData} 
                        options={{
                            ...chartOptions,
                            onClick: (event, elements) => {
                              if (elements.length > 0) {
                                const index = elements[0].index;
                                const state = geographicData.labels[index];
                                window.location.href = `/listings?state=${state}`;
                              }
                            },
                            onHover: (event, chartElement) => {
                              event.native.target.style.cursor = chartElement[0] ? 'pointer' : 'default';
                            }
                          }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'social-impact' && (
                <div className="space-y-3">
                  <h3 className={`text-xl md:text-2xl font-semibold ${THEME.text} mb-2 md:mb-3`}>Social Impact Analytics</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 mb-3 md:mb-4">
                    <StatCard title="Poverty Reduction" value="-2.3%" subtext="Since program start" icon={TrendingUp} />
                    <StatCard title="Employment Growth" value="+145K" subtext="New jobs created" icon={Users} />
                    <StatCard title="Business Formation" value="+18%" subtext="New businesses" icon={Building2} />
                  </div>

                  <div className="h-56 md:h-64 lg:h-[280px] flex flex-col">
                    <h4 className={`text-lg font-medium ${THEME.text} mb-2 flex-shrink-0`}>Socioeconomic Comparison</h4>
                    <div className="flex-1 min-h-0">
                      <Bar data={socialImpactData} options={chartOptions} />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'compliance' && (
                <div className="space-y-3">
                  <h3 className={`text-xl md:text-2xl font-semibold ${THEME.text} mb-2 md:mb-3`}>Regulatory Compliance</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 mb-3 md:mb-4">
                    <StatCard title="Overall Compliance Rate" value="95.3%" subtext="Excellent" icon={CheckCircle} />
                    <StatCard title="Form 8996 Filings" value="13,200" subtext="2024 filings" icon={Target} />
                    <StatCard title="Penalty Calculations" value="621" subtext="Monitor" icon={TrendingUp} />
                  </div>

                  <div className="h-56 md:h-64 lg:h-[280px] flex flex-col">
                    <h4 className={`text-lg font-medium ${THEME.text} mb-2 flex-shrink-0`}>Compliance Rate Trends</h4>
                    <div className="flex-1 min-h-0">
                      <Line data={complianceData} options={chartOptions} />
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'market-intelligence' && (
                <div className="space-y-3">
                  <h3 className={`text-xl md:text-2xl font-semibold ${THEME.text} mb-2 md:mb-3`}>Market Intelligence</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 mb-3 md:mb-4">
                    <StatCard title="Median OZ Home Value" value="$220,000" subtext="+9.1% YoY" icon={Home} />
                    <StatCard title="National Comparison" value="41% discount" subtext="vs $375K national" icon={BarChart3} />
                    <StatCard title="Price Appreciation" value="61%" subtext="of zones increasing" icon={TrendingUp} />
                  </div>

                  <div className="h-56 md:h-64 lg:h-[280px] flex flex-col">
                    <h4 className={`text-lg font-medium ${THEME.text} mb-2 flex-shrink-0`}>Property Value Trends</h4>
                    <div className="flex-1 min-h-0">
                      <Bar data={propertyTrendsData} options={chartOptions} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
}