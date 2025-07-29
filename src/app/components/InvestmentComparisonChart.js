
"use client";

import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';


ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  annotationPlugin
);

const InvestmentComparisonChart = () => {
  const [capitalGain, setCapitalGain] = useState(1000000);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [],
  });

  const calculateInvestmentValues = (initialInvestment) => {
    const years = 10;
    const labels = Array.from({ length: years + 1 }, (_, i) => `Year ${i}`);
    
    const withoutOzMultiple = 1.69;
    const withOzMultiple = 3.5;

    const generateFluctuatingValues = (start, end, steps) => {
        const values = [start];
        for (let i = 1; i <= steps; i++) {
            const randomFactor = 0.9 + Math.random() * 0.2;
            const progress = i / steps;
            const linearValue = start + (end - start) * progress;
            const fluctuatingValue = linearValue * randomFactor;
            values.push(fluctuatingValue);
        }
        values[steps] = end;
        return values;
    };
    
    const withoutOzValues = generateFluctuatingValues(initialInvestment, initialInvestment * withoutOzMultiple, years);
    const withOzValues = generateFluctuatingValues(initialInvestment, initialInvestment * withOzMultiple, years);

    return {
      labels,
      withOzValues,
      withoutOzValues,
    };
  };

  useEffect(() => {
    const { labels, withOzValues, withoutOzValues } = calculateInvestmentValues(capitalGain);

    setChartData({
      labels,
      datasets: [
        {
          label: 'With OZ',
          data: withOzValues,
          borderColor: '#22c55e',
          backgroundColor: 'rgba(34, 197, 94, 0.2)',
          fill: 1, // Fill to the 'Without OZ' dataset at index 1
          tension: 0.4,
          pointBackgroundColor: '#22c55e',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: '#22c55e',
        },
        {
          label: 'Without OZ',
          data: withoutOzValues,
          borderColor: '#ef4444',
          backgroundColor: 'rgba(239, 68, 68, 0.2)',
          fill: true, // Fill to origin
          tension: 0.4,
          pointBackgroundColor: '#ef4444',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: '#ef4444',
        },
      ],
    });
  }, [capitalGain]);

  const finalWithOz = capitalGain * 3.5;
  const finalWithoutOz = capitalGain * 1.69;
  const difference = finalWithOz - finalWithoutOz;
  const annotation = {
    type: 'arrow',
    xMin: 10,
    xMax: 10,
    yMin: finalWithoutOz,
    yMax: finalWithOz,
    borderColor: 'black',
    borderWidth: 2,
    label: {
        content: `Difference: ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(difference)}`,
        enabled: true,
        position: 'center',
        backgroundColor: 'rgba(0,0,0,0.7)',
        color: 'white',
        borderRadius: 6,
        padding: 6,
    }
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: typeof window !== 'undefined' && document.documentElement.classList.contains('dark') ? '#e5e7eb' : '#4b5563',
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 20,
          font: {
            family: 'var(--font-articulat-normal)',
            size: 14,
          }
        },
      },
      title: {
        display: false,
      },
      tooltip: {
        enabled: true,
        backgroundColor: 'rgba(0,0,0,0.8)',
        titleFont: {
            family: 'var(--font-articulat-bold)',
        },
        bodyFont: {
            family: 'var(--font-articulat-normal)',
        },
        callbacks: {
            label: function(context) {
                let label = context.dataset.label || '';
                if (label) {
                    label += ': ';
                }
                if (context.parsed.y !== null) {
                    label += new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(context.parsed.y);
                }
                return label;
            }
        }
      },
      annotation: {
        annotations: {
            arrow: annotation
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: typeof window !== 'undefined' && document.documentElement.classList.contains('dark') ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          color: typeof window !== 'undefined' && document.documentElement.classList.contains('dark') ? '#9ca3af' : '#6b7280',
           font: {
            family: 'var(--font-articulat-normal)',
          }
        },
      },
      y: {
        grid: {
          color: typeof window !== 'undefined' && document.documentElement.classList.contains('dark') ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          color: typeof window !== 'undefined' && document.documentElement.classList.contains('dark') ? '#9ca3af' : '#6b7280',
          callback: function(value) {
            return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact', maximumFractionDigits: 1 }).format(value);
          },
           font: {
            family: 'var(--font-articulat-normal)',
          }
        },
      },
    },
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center bg-white dark:bg-black py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 z-0">
            <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-primary/5 dark:bg-primary/10 rounded-full blur-3xl opacity-20"></div>
            <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-green-500/5 dark:bg-green-500/10 rounded-full blur-3xl opacity-20"></div>
        </div>
        <div className="w-full max-w-7xl mx-auto z-10">
            <div className="text-center mb-12">
                <h2 className="font-brand-black text-4xl md:text-5xl text-black dark:text-white tracking-tight mb-4">
                    Unlock <span className="text-primary">Superior</span> Returns
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                    Visualize the powerful impact of Opportunity Zone tax benefits on your investment over a 10-year period.
                </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                <div className="lg:col-span-2 glass-card rounded-3xl p-4 sm:p-6 bg-white/60 dark:bg-black/20 border border-black/10 dark:border-white/10 backdrop-blur-xl h-[60vh] min-h-[400px] sm:min-h-[500px]">
                    <Line data={chartData} options={chartOptions} />
                </div>
                <div className="lg:col-span-1 flex flex-col justify-center p-6 glass-card rounded-3xl bg-white/60 dark:bg-black/20 border border-black/10 dark:border-white/10 backdrop-blur-xl">
                    <h3 className="font-brand-bold text-2xl text-black dark:text-white mb-2">
                        Calculate Your Growth
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm">
                        Enter your capital gain to see a personalized projection.
                    </p>
                    <div className="mb-6">
                        <label htmlFor="capitalGain" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Initial Capital Gain
                        </label>
                        <div className="relative">
                        <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                            $
                        </span>
                        <input
                            type="text"
                            id="capitalGain"
                            value={new Intl.NumberFormat('en-US').format(capitalGain)}
                            onChange={(e) => {
                                const value = e.target.value.replace(/[^0-9]/g, '');
                                if (value) {
                                    setCapitalGain(Number(value));
                                } else {
                                    setCapitalGain(0);
                                }
                            }}
                            className="w-full pl-7 pr-4 py-2.5 rounded-lg bg-white/50 dark:bg-gray-800/50 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark focus:border-primary dark:focus:border-primary-dark transition text-black dark:text-white"
                        />
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="p-4 rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20">
                            <p className="text-sm font-semibold text-green-800 dark:text-green-300">With OZ Investment (10-Year)</p>
                            <p className="text-3xl font-brand-bold text-green-600 dark:text-green-400">
                                {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(finalWithOz)}
                            </p>
                        </div>
                        <div className="p-4 rounded-xl bg-gradient-to-br from-red-600/10 to-red-700/10 dark:from-red-900/20 dark:to-black/20 border border-red-700/20 dark:border-red-600/20">
                            <p className="text-sm font-semibold text-red-800 dark:text-red-400">Standard Investment (10-Year)</p>
                            <p className="text-3xl font-brand-bold text-red-700 dark:text-red-500">
                                {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(finalWithoutOz)}
                            </p>
                        </div>
                        <div className="p-4 rounded-xl bg-gradient-to-br from-red-500/10 to-pink-500/10 border border-red-500/20">
                            <p className="text-sm font-semibold text-red-800 dark:text-red-300">You Lose</p>
                            <p className="text-3xl font-brand-bold text-red-600 dark:text-red-400">
                                -{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(difference)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
  );
};

export default InvestmentComparisonChart; 