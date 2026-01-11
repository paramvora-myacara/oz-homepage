'use client';

import { useState, useEffect, useRef } from 'react';
import { HandHeart, DollarSign, TrendingUp, BarChart3 } from 'lucide-react';
import { trackUserEvent } from '../../lib/analytics/trackUserEvent';

export default function OZInvestmentReasons() {
  const [isMobile, setIsMobile] = useState(false);
  const cardRefs = useRef([]);
  const iconRefs = useRef([]);
  const titleRefs = useRef([]);
  const descriptionRefs = useRef([]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Synchronize heights across cards
  useEffect(() => {
    const syncHeights = () => {
      // Sync icon container heights
      if (iconRefs.current.length > 0) {
        const iconHeights = iconRefs.current.map(ref => ref?.offsetHeight || 0);
        const maxIconHeight = Math.max(...iconHeights);
        iconRefs.current.forEach(ref => {
          if (ref) ref.style.minHeight = `${maxIconHeight}px`;
        });
      }

      // Sync title heights
      if (titleRefs.current.length > 0) {
        const titleHeights = titleRefs.current.map(ref => ref?.offsetHeight || 0);
        const maxTitleHeight = Math.max(...titleHeights);
        titleRefs.current.forEach(ref => {
          if (ref) ref.style.minHeight = `${maxTitleHeight}px`;
        });
      }

      // Sync description heights
      if (descriptionRefs.current.length > 0) {
        const descHeights = descriptionRefs.current.map(ref => ref?.offsetHeight || 0);
        const maxDescHeight = Math.max(...descHeights);
        descriptionRefs.current.forEach(ref => {
          if (ref) ref.style.minHeight = `${maxDescHeight}px`;
        });
      }
    };

    // Run after a short delay to ensure DOM is ready
    const timeoutId = setTimeout(syncHeights, 100);
    window.addEventListener('resize', syncHeights);
    
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', syncHeights);
    };
  }, []);

  const handleCardInteraction = (reasonId) => {
    trackUserEvent("invest_reason_clicked", {
      reason: reasonId
    });
  };

  const investmentReasons = [
    {
      id: 'tax-benefits',
      title: 'Exceptional Tax Benefits',
      icon: DollarSign,
      description: 'Defer and reduce capital gains taxes with significant long-term savings',
      highlights: [
        <>Defer capital gains taxes until <span className="font-semibold">2026</span></>,
        <>Reduce original gain by up to <span className="font-semibold">15%</span></>,
        <>Eliminate taxes on new OZ gains if held <span className="font-semibold">10+ years</span></>,
        <>No annual income limits or investment caps</>
      ],
      gradient: 'from-emerald-50 to-green-100 dark:from-emerald-900/20 dark:to-green-900/20',
      textColor: 'text-emerald-900 dark:text-emerald-300',
      accentColor: 'text-emerald-800 dark:text-emerald-400',
      bulletColor: 'text-emerald-700 dark:text-emerald-500'
    },
    {
      id: 'portfolio-diversification',
      title: 'Portfolio Diversification',
      icon: BarChart3,
      description: 'Access exclusive real estate & business deals with higher returns',
      highlights: [
        <>Invest in emerging markets with growth potential</>,
        <>Access institutional-quality deals</>,
        <>Diversify across geographies and sectors</>,
        <>Benefit from gentrification and appreciation</>
      ],
      gradient: 'from-purple-50 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20',
      textColor: 'text-purple-900 dark:text-purple-300',
      accentColor: 'text-purple-800 dark:text-purple-400',
      bulletColor: 'text-purple-700 dark:text-purple-500'
    },
    {
      id: 'economic-development',
      title: 'Economic Catalyst',
      icon: TrendingUp,
      description: 'Join the largest economic development initiative in U.S. history',
      highlights: [
        <><span className="font-semibold">$110+ billion</span> already invested nationwide</>,
        <><span className="font-semibold">8,765</span> designated zones across all <span className="font-semibold">50 states</span></>,
        <>Bipartisan support ensuring program stability</>,
        <>First-mover advantage in emerging markets</>
      ],
      gradient: 'from-orange-50 to-red-100 dark:from-orange-900/20 dark:to-red-900/20',
      textColor: 'text-orange-900 dark:text-orange-300',
      accentColor: 'text-orange-800 dark:text-orange-400',
      bulletColor: 'text-orange-700 dark:text-orange-500'
    },
    {
      id: 'social-impact',
      title: 'Social Impact',
      icon: HandHeart,
      description: 'Create lasting positive change in America\'s most underserved communities',
      highlights: [
        <>Revitalize distressed communities nationwide</>,
        <>Create jobs in areas that need them most</>,
        <>Support affordable housing development</>,
        <>Build generational wealth for local residents</>
      ],
      gradient: 'from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20',
      textColor: 'text-indigo-900 dark:text-indigo-300',
      accentColor: 'text-indigo-800 dark:text-indigo-400',
      bulletColor: 'text-indigo-700 dark:text-indigo-500'
    }
  ];

  return (
    <div className="min-h-full bg-white dark:bg-black px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
      {/* H1 Heading */}
      <div className="flex-shrink-0 mb-8 sm:mb-12">
        <h1 className="text-3xl md:text-5xl font-bold text-black dark:text-white text-center tracking-tight animate-fadeIn">
          Why OZs?
        </h1>
      </div>

      {/* Investment Reasons Cards - 2x2 Bento Grid */}
      <div className="max-w-5xl mx-auto w-full mb-8 sm:mb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {investmentReasons.map((reason, index) => {
            const IconComponent = reason.icon;
            return (
              <div 
                key={reason.id}
                className={`glass-card rounded-3xl p-6 md:p-8 bg-gradient-to-br ${reason.gradient} border border-black/5 dark:border-white/10 hover:shadow-lg transition-all duration-300 animate-fadeIn flex flex-col h-full`}
                style={{ animationDelay: `${index * 150}ms` }}
                onClick={() => handleCardInteraction(reason.id)}
              >
                {/* Header: Icon + Title */}
                <div className="flex items-center gap-4 mb-4">
                  <div className={`p-3 rounded-2xl bg-white/60 dark:bg-black/20 ${reason.textColor}`}>
                    <IconComponent className="w-8 h-8" />
                  </div>
                  <h3 className={`text-2xl font-bold ${reason.textColor} leading-tight`}>
                    {reason.title}
                  </h3>
                </div>

                {/* Description */}
                <p className={`${reason.accentColor} text-lg leading-relaxed mb-6 font-medium`}>
                    {reason.description}
                </p>

                {/* Feature Tags (Pills) */}
                <div className="flex flex-wrap gap-2 mt-auto">
                  {reason.highlights.map((highlight, idx) => (
                    <span 
                        key={idx} 
                        className={`inline-flex items-center px-3.5 py-1.5 rounded-full text-sm font-semibold bg-white/60 dark:bg-black/20 ${reason.bulletColor} backdrop-blur-sm border border-black/5 dark:border-white/5 transition-transform hover:scale-105 select-none`}
                    >
                        {highlight}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>


    </div>
  );
} 