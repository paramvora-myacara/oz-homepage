'use client';
import { motion } from 'framer-motion';
import { DollarSign, Building2, Users, Shield, CheckCircle } from 'lucide-react';

const metrics = [
  {
    icon: DollarSign,
    value: '$100M+',
    label: 'Raised by Developers'
  },
  {
    icon: Building2,
    value: '50+',
    label: 'Active Listings'
  },
  {
    icon: Users,
    value: '60K+',
    label: 'Subscriber Network'
  },
  {
    icon: CheckCircle,
    value: '100%',
    label: 'Marketing Support'
  }
];

const trustBadges = [
  {
    icon: Shield,
    title: 'Verified Platform',
    description: 'Secure and trusted marketplace for Opportunity Zone investments'
  },
  {
    icon: CheckCircle,
    title: 'Secure Listings',
    description: 'Your project information is protected and professionally managed'
  }
];

export default function SocialProof() {
  return (
    <section className="relative z-10 py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Metrics Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-12 text-center text-navy dark:text-white">
            Trusted by Developers Nationwide
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {metrics.map((metric, index) => {
              const Icon = metric.icon;
              return (
                <motion.div
                  key={metric.label}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="text-center bg-white dark:bg-gray-800 rounded-2xl p-6 md:p-8 shadow-md border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/20 dark:bg-primary/30 mb-4">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                  <div className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                    {metric.value}
                  </div>
                  <div className="text-sm md:text-base text-gray-600 dark:text-gray-400">
                    {metric.label}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8"
        >
          {trustBadges.map((badge, index) => {
            const Icon = badge.icon;
            return (
              <motion.div
                key={badge.title}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-gradient-to-br from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10 rounded-2xl p-6 md:p-8 border border-primary/20"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/20 dark:bg-primary/30 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      {badge.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                      {badge.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
