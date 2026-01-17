'use client';
import { motion } from 'framer-motion';
import { Calendar, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { useAuthNavigation } from '../../../lib/auth/useAuthNavigation';

const TIMELINE_EVENTS = [
  {
    date: "Now – Dec 31, 2026",
    title: "OZ 1.0 Rules Remain Active",
    description: "The original OZ 1.0 rules remain in effect. Investors can still deploy capital under the old rules and zones. The deferral deadline for all OZ 1.0 investments is fixed: December 31, 2026. Any gains must be recognized by that date.",
    status: "current"
  },
  {
    date: "July 1, 2026",
    title: "Redesignation Begins",
    description: "State governors begin nominating new census tracts for OZ 2.0 designation. Treasury will certify the final list in December 2026.",
    status: "upcoming"
  },
  {
    date: "January 1, 2027",
    title: "OZ 2.0 Launch",
    description: "OZ 2.0 officially launches. The new rules, new zones, and new benefits take effect. All capital deployed on or after this date operates under the OZ 2.0 framework.",
    status: "future"
  },
  {
    date: "Jan 1, 2027 – Dec 31, 2028",
    title: "Transitional Period",
    description: "Both OZ 1.0 and OZ 2.0 zones remain valid. Investors can choose which zones to target (though OZ 1.0 zones are phasing out).",
    status: "future"
  },
  {
    date: "December 31, 2028",
    title: "OZ 1.0 Sunset",
    description: "OZ 1.0 zones sunset. Only OZ 2.0 zones remain eligible.",
    status: "future"
  }
];

const REASONS_MATTER = [
  {
    title: "Certainty About Zones",
    description: "As of today, you know exactly which zones are eligible. When July 1 comes, new zones will be nominated, but old zones might disappear. If you've identified a project in a zone that might not survive redesignation, 2026 gives you certainty.",
    icon: CheckCircle
  },
  {
    title: "Locking In 2026 Tax Rates",
    description: "Current federal capital gains tax rates are 23.8% (top rate). For OZ 2.0 investments made in 2027, you won't recognize gains until 2032—when tax rates may be higher. By investing in 2026, you defer gains into 2026 (a lower rate environment) instead of 2032.",
    icon: AlertCircle
  },
  {
    title: "Start the 10-Year Clock",
    description: "The real prize in OZ is the 10-year tax-free exclusion. Invest in 2026, you exit tax-free in 2036. Invest in 2027, you exit tax-free in 2037. That's a one-year head start on your liquidity event.",
    icon: Clock
  }
];

export default function OZTimeline() {
  const { navigateWithAuth } = useAuthNavigation();

  return (
    <section className="py-16 md:py-24 overflow-hidden">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8">

        {/* Header */}
        <div className="text-center mb-16 max-w-4xl mx-auto pt-8">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-navy dark:text-white leading-tight tracking-tight">
            The Rules Are Changing.<br />
            <span className="text-primary">What You Need To Know.</span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
            As Opportunity Zones transition from a temporary program to a permanent feature of the tax code, understanding the timeline is critical for your investment strategy.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">

          {/* Timeline Column */}
          <div className="relative">
            <div className="absolute left-5 md:left-7 top-4 bottom-4 w-0.5 bg-gradient-to-b from-primary via-primary/30 to-transparent -translate-x-1/2" />

            <div className="space-y-12">
              {TIMELINE_EVENTS.map((event, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="relative pl-14 md:pl-20 group"
                >
                  {/* Dot */}
                  <div className={`absolute left-0 top-1.5 w-10 h-10 md:w-14 md:h-14 rounded-full border-2 md:border-4 border-white dark:border-black flex items-center justify-center z-10 ${idx === 0 ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'bg-gray-100 dark:bg-gray-800 text-gray-400'
                    }`}>
                    <div className={`w-3 h-3 md:w-4 md:h-4 rounded-full ${idx === 0 ? 'bg-white' : 'bg-gray-400'}`} />
                  </div>

                  <div className="glass-card p-6 rounded-2xl bg-white/50 dark:bg-white/5 border border-gray-100 dark:border-gray-800 hover:border-primary/30 transition-colors">
                    <span className="inline-block px-3 py-1 rounded-md bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider mb-3">
                      {event.date}
                    </span>
                    <h3 className="text-xl font-bold text-navy dark:text-white mb-3">
                      {event.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                      {event.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* "Why It Matters" Column */}
          <div>
            <div className="bg-gray-50 dark:bg-white/5 rounded-3xl p-8 md:p-10 text-navy dark:text-white relative overflow-hidden shadow-xl border border-gray-100 dark:border-gray-800 h-full flex flex-col">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

              <div className="flex-grow">
                <h3 className="text-3xl font-bold mb-8 relative z-10">Why 2026 Still Matters</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-10 relative z-10 leading-relaxed">
                  You might think: "If OZ 2.0 starts Jan 1, 2027, I should just wait." <br />
                  <span className="text-navy dark:text-white font-semibold">Here are three concrete reasons to deploy capital now:</span>
                </p>

                <div className="space-y-6 relative z-10 flex-grow flex flex-col justify-center">
                  {REASONS_MATTER.map((reason, idx) => {
                    const Icon = reason.icon;
                    return (
                      <div key={idx} className="flex gap-4 p-4 rounded-2xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:shadow-md transition-all">
                        <div className="flex-shrink-0 mt-1">
                          <Icon className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-bold text-lg mb-2">{reason.title}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                            {reason.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mt-10 pt-8 border-t border-gray-200 dark:border-white/10 text-center">
                <button
                  onClick={() => navigateWithAuth('/listings')}
                  className="w-full py-4 bg-primary hover:bg-primary-600 text-white rounded-xl font-bold transition-all shadow-lg shadow-primary/25"
                >
                  Explore 2026 OZ Deals
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
